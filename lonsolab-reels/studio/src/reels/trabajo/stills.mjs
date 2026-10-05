/* global process, console */
// Dev helper: bundle once and render many stills of the Trabajo reel.
// Usage (from studio/): node src/reels/trabajo/stills.mjs 0 44 118 ...  → out/trabajo-stills/f<N>.jpg
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).filter((a) => !a.startsWith("--")).map(Number);
const dir = path.resolve("out/trabajo-stills");
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/reels/trabajo/index.tsx"), rspack: true });
const comp = await selectComposition({ serveUrl, id: "Trabajo" });
for (const frame of frames) {
  const out = path.join(dir, `f${String(frame).padStart(3, "0")}.jpg`);
  const t0 = Date.now();
  await renderStill({ serveUrl, composition: comp, frame, output: out, imageFormat: "jpeg", jpegQuality: 88 });
  console.log(out, `${Date.now() - t0}ms`);
}
