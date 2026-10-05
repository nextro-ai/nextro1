// Dev helper: bundle once, render many stills (JPEG) for review.
// Usage (from studio/): node src/reels/rebrand/stills.mjs 0 78 156 ...   (OUT=dir to change the folder)
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
const outDir = process.env.OUT || "out/rebrand-stills";
const entry = path.resolve("src/reels/rebrand/index.tsx");
const serveUrl = await bundle({ entryPoint: entry, rspack: true });
const comp = await selectComposition({ serveUrl, id: "Rebrand" });
for (const frame of frames) {
  const out = path.resolve(`${outDir}/f${String(frame).padStart(3, "0")}.jpg`);
  await renderStill({ serveUrl, composition: comp, frame, output: out, imageFormat: "jpeg", jpegQuality: 88 });
  console.log(out);
}
