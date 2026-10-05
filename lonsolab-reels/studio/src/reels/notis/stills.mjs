/* global process, console */
// Dev helper: bundle once, render many stills of the Notis reel.
// Usage (from studio/): node src/reels/notis/stills.mjs 0 30 75 ...  → out/notis-stills/f<N>.jpg
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).filter((a) => !a.startsWith("--")).map(Number);
const dir = path.resolve("out/notis-stills");
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/reels/notis/index.tsx") });
const comp = await selectComposition({ serveUrl, id: "Notis" });
for (const frame of frames) {
  const out = path.join(dir, `f${String(frame).padStart(3, "0")}.jpg`);
  const t0 = Date.now();
  await renderStill({ serveUrl, composition: comp, frame, output: out, imageFormat: "jpeg", jpegQuality: 90 });
  console.log(out, `${Date.now() - t0}ms`);
}
