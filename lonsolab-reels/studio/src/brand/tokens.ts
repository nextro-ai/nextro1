import { Easing } from "remotion";

/** Brand tokens extracted from lonsolab.com (assets/css/site.css). */
export const C = {
  papel: "#f3f4ef", // cream page background
  papel2: "#e8eae2",
  blanco: "#ffffff",
  tinta: "#13182b", // ink / navy (text, dark sections)
  tinta2: "#4a5168", // secondary text
  linea: "#d3d7df", // hairlines
  cobalto: "#2340d8", // electric blue
  cobaltoHondo: "#182c9e",
  cobaltoClaro: "#c9d2ff",
  pin: "#ff5a26", // orange CTA / map pin
  pinHondo: "#e8461a",
  verde: "#1f7a3e", // "Te ahorrás" / success green used on the site
  verdeClaro: "#e7f3ea",
  estrella: "#f2a516", // review stars
} as const;

/** Site motion curves: --salida and --rebote. */
export const EASE = {
  salida: Easing.bezier(0.16, 1, 0.3, 1),
  rebote: Easing.bezier(0.34, 1.4, 0.5, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
} as const;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

/**
 * Instagram / TikTok safe zones for 1080x1920.
 * Keep text, logos and CTAs inside SAFE. Decorative motion may bleed outside.
 */
export const SAFE = {
  top: 250, // status bar + "Reels" header / account row
  bottom: 420, // caption, username, audio row, nav bar
  left: 64,
  right: 150, // like/comment/share column
} as const;

/** The 4:5 grid crop (1080x1350) is centred vertically: y 285..1635. */
export const GRID_45 = { top: 285, bottom: 1635 } as const;

export const FONT = "Archivo";
