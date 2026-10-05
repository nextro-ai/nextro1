import { continueRender, delayRender, staticFile } from "remotion";
import { FONT } from "./tokens";

/**
 * Loads the brand typeface: Archivo variable (wght 100-900, wdth 62-125%).
 * Headings on lonsolab.com use heavy weights with an expanded width
 * (font-stretch 108-125%); use `fontStretch: "125%"` for the display look.
 */
let loaded = false;

export const ensureFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading Archivo variable font");
  const face = new FontFace(
    FONT,
    `url(${staticFile("fonts/archivo-latin-var.woff2")}) format("woff2")`,
    { weight: "100 900", stretch: "62% 125%", style: "normal" },
  );
  face
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(handle);
    })
    .catch((err) => {
      console.error("Font failed to load", err);
      continueRender(handle);
    });
};

ensureFonts();

/** Ready-made text styles matching the site. */
export const display = (size: number, color?: string): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 800,
  fontStretch: "125%",
  fontSize: size,
  lineHeight: 0.96,
  letterSpacing: "-0.02em",
  color,
});

export const body = (size: number, color?: string): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 400,
  fontStretch: "100%",
  fontSize: size,
  lineHeight: 1.35,
  color,
});

export const label = (size: number, color?: string): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 700,
  fontStretch: "110%",
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: "0.01em",
  color,
});
