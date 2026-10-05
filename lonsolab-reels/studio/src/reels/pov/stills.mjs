// Dev helper: bundle once and render many stills (JPEG) for review.
// Usage (from studio/): node src/reels/pov/stills.mjs 0 42 84 ...   (OUT=dir to change the folder)
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
const dir = process.env.OUT ?? "out/pov-stills";
const entry = path.resolve("src/reels/pov/index.tsx");
const serveUrl = await bundle({ entryPoint: entry, rspack: true });
const comp = await selectComposition({ serveUrl, id: "Pov" });
for (const frame of frames) {
  const out = path.resolve(`${dir}/pov-f${frame}.jpg`);
  await renderStill({ serveUrl, composition: comp, frame, output: out, imageFormat: "jpeg", jpegQuality: 88 });
  console.log(out);
}
