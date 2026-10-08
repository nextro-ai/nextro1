// Renderiza una animación HTML a MP4.
// La página tiene que exponer window.render(t) (dibuja el cuadro del segundo t) y window.DURATION (segundos).
// Uso: node render.mjs <entrada.html> <salida.mp4> [--fps 30] [--ancho 1080] [--alto 1920] [--audio pista.mp3]
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);

function cargarPlaywright() {
  const candidatos = [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    '/opt/node-tools/node_modules/playwright',
    ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean).map((p) => path.join(p, 'playwright')),
  ].filter(Boolean);
  for (const c of candidatos) {
    try { return require(c); } catch { /* probar el siguiente */ }
  }
  console.error('No encontré Playwright. Instalalo con: npm i -g playwright (no hace falta bajar navegadores en la nube).');
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 ? args[i + 1] : porDefecto;
};
const [input, output] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!input || !output) {
  console.error('Uso: node render.mjs <entrada.html> <salida.mp4> [--fps 30] [--ancho 1080] [--alto 1920] [--audio pista.mp3]');
  process.exit(1);
}
const fps = Number(opt('fps', 30));
const width = Number(opt('ancho', 1080));
const height = Number(opt('alto', 1920));
const audio = opt('audio', null);

const { chromium } = cargarPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(input)).href);
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.DURATION);
if (!duration || typeof duration !== 'number') {
  console.error('La página no define window.DURATION (segundos).');
  process.exit(1);
}
const frames = Math.round(duration * fps);

const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
if (audio) ffArgs.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
ffArgs.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output);
const ffmpeg = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });

for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.render(t), i / fps);
  const buf = await page.screenshot({ type: 'png' });
  if (!ffmpeg.stdin.write(buf)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
  if (i % (fps * 2) === 0) process.stdout.write(`\r${Math.round((i / frames) * 100)}%`);
}
ffmpeg.stdin.end();
await new Promise((resolve, reject) => ffmpeg.on('close', (code) => (code === 0 ? resolve() : reject(new Error('ffmpeg salió con ' + code)))));
await browser.close();
console.log(`\rOK: ${output} (${frames} cuadros, ${fps} fps, ${duration} s, ${width}x${height})`);
