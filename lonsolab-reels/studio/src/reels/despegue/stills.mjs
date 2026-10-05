/* global process, console */
// Dev helper: bundle once and render many stills.
// Usage (from studio/): node src/reels/despegue/stills.mjs 0 60 126 ...   (writes out/despegue-f<N>.png)
// Add --jpg to write smaller JPEGs.
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const jpg = args.includes("--jpg");
const frames = args.filter((a) => !a.startsWith("--")).map(Number);
const entry = path.resolve("src/reels/despegue/index.tsx");
const serveUrl = await bundle({ entryPoint: entry, rspack: true });
const comp = await selectComposition({ serveUrl, id: "Despegue" });
for (const frame of frames) {
  const out = path.resolve(`out/despegue-f${frame}.${jpg ? "jpg" : "png"}`);
  const t0 = Date.now();
  await renderStill({ serveUrl, composition: comp, frame, output: out, ...(jpg ? { imageFormat: "jpeg", jpegQuality: 85 } : { imageFormat: "png" }) });
  console.log(out, `${Date.now() - t0}ms`);
}
