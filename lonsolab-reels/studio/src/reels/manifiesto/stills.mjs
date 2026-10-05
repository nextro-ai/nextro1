// Dev helper: bundle once and render many stills.
// Usage (from studio/): node src/reels/manifiesto/stills.mjs 0 14 27 109 ...
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
const entry = path.resolve("src/reels/manifiesto/index.tsx");
const serveUrl = await bundle({ entryPoint: entry, rspack: true });
const comp = await selectComposition({ serveUrl, id: "Manifiesto" });
for (const frame of frames) {
  const out = path.resolve(`out/manifiesto-f${frame}.png`);
  await renderStill({ serveUrl, composition: comp, frame, output: out, imageFormat: "png" });
  console.log(out);
}
