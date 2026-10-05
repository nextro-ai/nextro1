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
 * Safe zones for 1080x1920 (house rule from docs/creative-research.md §2.2, valid for IG Reels,
 * TikTok and Shorts). Text, logo and CTA live inside x 90..990, y 290..1240; from y 840 down,
 * nothing important to the right of x 880 (action-button rail). Below y 1240 only imagery.
 * Zone A (headlines): y 290..840. Zone B (support text, cards): y 840..1240, x 90..880.
 * Final CTA + logo: y 900..1240, centred, max width 780 (x 150..930).
 */
export const SAFE = {
  top: 290,
  bottom: 680, // 1920 - 1240
  left: 90,
  right: 90,
  railFromY: 840,
  railRight: 200, // 1080 - 880
} as const;

/** The 4:5 grid crop (1080x1350) is centred vertically: y 285..1635. */
export const GRID_45 = { top: 285, bottom: 1635 } as const;

export const FONT = "Archivo";
