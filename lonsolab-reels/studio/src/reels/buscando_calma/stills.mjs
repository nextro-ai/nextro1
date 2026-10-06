/* global process, console */
// Dev helper: bundle once, render many stills of BuscandoCalma in one or more palettes.
// Usage (from studio/): node src/reels/buscando_calma/stills.mjs --themes=web,marino 300 706 981 ...
//   → out/bc-stills/<theme>-f<NNNN>.jpg
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const themes = (args.find((a) => a.startsWith("--themes="))?.slice(9) ?? "web").split(",");
const frames = args.filter((a) => !a.startsWith("--")).map(Number);
const dir = path.resolve("out/bc-stills");
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/reels/buscando_calma/index.tsx") });
for (const theme of themes) {
  const comp = await selectComposition({ serveUrl, id: "BuscandoCalma", inputProps: { theme } });
  for (const frame of frames) {
    const out = path.join(dir, `${theme}-f${String(frame).padStart(4, "0")}.jpg`);
    await renderStill({ serveUrl, composition: comp, frame, output: out, inputProps: { theme }, imageFormat: "jpeg", jpegQuality: 88 });
    console.log(out);
  }
}
