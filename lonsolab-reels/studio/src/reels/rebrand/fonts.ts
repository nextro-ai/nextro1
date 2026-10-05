import { continueRender, delayRender, staticFile } from "remotion";
import { FRAUNCES, LOBSTER } from "./palette";

/**
 * Fonts for the fictional bakery (both SIL OFL, downloaded to public/rebrand/fonts):
 * - Fraunces (variable opsz/wght/SOFT/WONK): the NEW La Espiga wordmark + typography scene.
 * - Lobster: the generic, over-used script of the OLD logo.
 * The reel's own copy stays in Archivo (brand kit).
 */
let loaded = false;

const load = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading La Espiga fonts");
  const faces = [
    new FontFace(FRAUNCES, `url(${staticFile("rebrand/fonts/fraunces-latin-var.woff2")}) format("woff2")`, {
      weight: "100 900",
      style: "normal",
    }),
    new FontFace(LOBSTER, `url(${staticFile("rebrand/fonts/lobster-latin.woff2")}) format("woff2")`, {
      weight: "400",
      style: "normal",
    }),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((fs) => {
      fs.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => {
      console.error("La Espiga fonts failed", err);
      continueRender(handle);
    });
};

load();

/** Fraunces style helper: variable axes through font-variation-settings. */
export const fraunces = (
  size: number,
  color: string,
  wght = 600,
  soft = 100,
  opsz = 144,
): React.CSSProperties => ({
  fontFamily: FRAUNCES,
  fontSize: size,
  color,
  fontWeight: wght,
  fontVariationSettings: `"opsz" ${opsz}, "wght" ${wght}, "SOFT" ${soft}, "WONK" 0`,
  lineHeight: 1,
  letterSpacing: "-0.015em",
});
