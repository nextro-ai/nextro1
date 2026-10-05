#!/usr/bin/env node
// Renders motion/index.html frame by frame with headless Chromium and encodes an MP4.
//
//   node motion/render.mjs                    # full video → motion/out/nextro-motion.mp4
//   node motion/render.mjs --stills 1.5,9,22  # single PNG frames → motion/build/stills/
//   node motion/render.mjs --from 8 --to 12   # partial render (preview)
//   node motion/render.mjs --reuse-frames     # keep build/frames, redo audio + encode only
//
// Requires: ffmpeg, python3 (numpy + scipy) and Playwright with Chromium.
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, rmSync, writeFileSync, createReadStream, statSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpus } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const BUILD = join(HERE, 'build');
const OUT = join(HERE, 'out');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, []),
);

function loadPlaywright() {
  const req = createRequire(import.meta.url);
  for (const base of [HERE, '/opt/node22/lib/node_modules', '/opt/node-tools/node_modules', '/usr/lib/node_modules']) {
    try { return req(req.resolve('playwright', { paths: [base] })); } catch { /* try next */ }
  }
  throw new Error('Playwright not found: npm i -g playwright');
}

function run(cmd, argv, opts = {}) {
  const r = spawnSync(cmd, argv, { stdio: 'inherit', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} exited with ${r.status}`);
}

// 1 · video frames for the projects scene: 84 native 24 fps frames from 3.5 s, shown one per output frame.
//     The crop removes the source's letterbox bars and the watermark in the corner.
function extractVideoFrames() {
  const dir = join(BUILD, 'giant');
  if (existsSync(join(dir, 'f084.jpg')) && !existsSync(join(dir, 'f085.jpg'))) return;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  run('ffmpeg', ['-v', 'error', '-y', '-ss', '3.5', '-i', join(ROOT, 'public', 'Gigante_de_Flores_Observa_Modelo (1).mp4'),
    '-vf', 'crop=1108:624:86:48,scale=1000:562:flags=lanczos', '-q:v', '2', '-frames:v', '84', join(dir, 'f%03d.jpg')]);
}

// 2 · static server rooted at the repo (the page loads ../public and ../node_modules)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json' };
function serve() {
  return new Promise((res) => {
    const server = createServer((req, rsp) => {
      const p = resolve(ROOT, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(ROOT + sep) || !existsSync(p) || statSync(p).isDirectory()) { rsp.writeHead(404); rsp.end(); return; }
      rsp.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
      createReadStream(p).pipe(rsp);
    });
    server.listen(0, '127.0.0.1', () => res(server));
  });
}

async function main() {
  extractVideoFrames();
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/motion/index.html?render`;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb'] });

  const openPage = async () => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.error('[page]', e.message));
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => window.__ready);
    return page;
  };

  try {
    const probe = await openPage();
    const meta = await probe.evaluate(() => window.__meta);
    const cues = await probe.evaluate(() => window.__cues);

    if (args.stills) {
      const dir = join(BUILD, 'stills');
      mkdirSync(dir, { recursive: true });
      for (const t of String(args.stills).split(',').map(Number)) {
        await probe.evaluate((x) => window.__seek(x), t);
        const file = join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`);
        await probe.screenshot({ path: file });
        console.log(file);
      }
      return;
    }

    const fps = Number(args.fps || meta.fps);
    const from = Number(args.from || 0);
    const to = Math.min(Number(args.to || meta.duration), meta.duration);
    const total = Math.round((to - from) * fps);
    const framesDir = join(BUILD, 'frames');
    const reuse = args['reuse-frames'] && existsSync(join(framesDir, `f${String(total - 1).padStart(5, '0')}.jpg`));
    if (!reuse) {
      rmSync(framesDir, { recursive: true, force: true });
      mkdirSync(framesDir, { recursive: true });
    }

    // contiguous chunks per worker so every page only ever seeks forward
    if (!reuse) {
      const workers = Math.max(1, Math.min(Number(args.workers || Math.max(1, cpus().length - 1)), 6));
      const pages = [probe, ...(await Promise.all(Array.from({ length: workers - 1 }, openPage)))];
      const per = Math.ceil(total / workers);
      let done = 0;
      const started = Date.now();
      await Promise.all(pages.map(async (page, w) => {
        for (let i = w * per; i < Math.min(total, (w + 1) * per); i++) {
          await page.evaluate((x) => window.__seek(x), from + i / fps);
          await page.screenshot({ path: join(framesDir, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
          if (++done % 60 === 0) console.log(`  ${done}/${total} frames · ${((Date.now() - started) / 1000).toFixed(0)}s`);
        }
      }));
    }

    // 3 · soundtrack generated from the cue sheet
    writeFileSync(join(BUILD, 'cues.json'), JSON.stringify({ duration: meta.duration, bpm: 120, cues }, null, 2));
    const wav = join(BUILD, 'audio.wav');
    run('python3', [join(HERE, 'audio.py'), join(BUILD, 'cues.json'), wav]);

    // 4 · encode (H.264 high profile + AAC, phone/Instagram/TikTok friendly)
    mkdirSync(OUT, { recursive: true });
    const full = from === 0 && to === meta.duration;
    const encode = (file, rate, audioRate) => {
      run('ffmpeg', ['-v', 'error', '-y',
        '-framerate', String(fps), '-i', join(framesDir, 'f%05d.jpg'),
        '-ss', String(from), '-t', String(to - from), '-i', wav,
        // screenshots are full-range BT.601 JPEGs → convert to the BT.709 TV range the file is tagged with
        '-vf', 'scale=in_color_matrix=bt601:in_range=full:out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', rate.crf, '-maxrate', rate.max, '-bufsize', rate.buf,
        '-profile:v', 'high', '-level', '4.2', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
        '-c:a', 'aac', '-b:a', audioRate, '-ar', '48000',
        '-movflags', '+faststart', '-shortest', file]);
      console.log(`✓ ${file}`);
    };
    // master for Instagram / TikTok uploads
    encode(resolve(args.out || join(OUT, full ? 'nextro-motion.mp4' : `preview-${from}-${to}.mp4`)), { crf: '18', max: '12M', buf: '24M' }, '192k');
    // light copy (< 25 MB) for WhatsApp, email and phones
    if (full && !args.out) encode(join(OUT, 'nextro-motion-movil.mp4'), { crf: '21', max: '5.5M', buf: '11M' }, '160k');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
