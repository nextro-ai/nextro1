import { interpolate } from "remotion";
import { EASE } from "../../brand";
import { RISE_DUR, RISE_LEAD, T } from "./timing";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Card geometry (global px). Cards are 960 wide, top at y 320, bottom edge visible near the frame bottom. */
export const CARD = { x: 60, y: 320, w: 960, h: 1540, r: 56 } as const;

/** Landing frames of the five case cards. */
export const LANDS = [T.c1, T.c2, T.c3, T.c4, T.c5] as const;

/** 0→1 rise of the card that lands at `land`. */
export const rise = (f: number, land: number) =>
  interpolate(f, [land - RISE_LEAD, land - RISE_LEAD + RISE_DUR], [0, 1], { ...CL, easing: EASE.salida });

/**
 * 0→1 "covered" amount of the layer under the card that lands at `land`. It only starts when the incoming card's top
 * edge reaches the title row of the card below (rise ≈ 0.75, about 3 f before the beat), so the outgoing card stays
 * sharp and readable until it is physically covered.
 */
export const cover = (f: number, land: number) =>
  interpolate(rise(f, land), [0.75, 1], [0, 1], CL);

/** How many cards are stacked on top of card i (continuous). i = -1 → the "Mirá el trabajo" layer. */
export const depthOf = (f: number, i: number) => {
  let d = 0;
  for (let j = i + 1; j < LANDS.length; j++) d += cover(f, LANDS[j]);
  return d;
};

/**
 * Look of a layer that has `d` cards on top of it (Nextro "Archivo"): scale .9 per level, and it peeks 80 px above the
 * card in front with a light 7 px blur at 0.6 opacity, so its rounded corners and label row still read as a card.
 */
export const depthLook = (d: number) => {
  const s = Math.pow(0.9, d);
  const op = d <= 1 ? 1 - 0.4 * d : d <= 2 ? 0.6 - 0.35 * (d - 1) : Math.max(0, 0.25 - 0.25 * (d - 2));
  const blur = Math.min(1, d) * 7 + Math.max(0, Math.min(1, d - 1)) * 5;
  const dy = -80 * d;
  return { s, op, blur, dy };
};

/** Grid (scene 4): 3 columns × 2 rows, x 100..879 (aligned with the headline), y 730..1415. Slot 5 is "tu negocio". */
export const TILE = { w: 243, h: 330, gap: 25, x0: 100, y0: 730 } as const;
export const tilePos = (slot: number) => ({
  x: TILE.x0 + (slot % 3) * (TILE.w + TILE.gap),
  y: TILE.y0 + Math.floor(slot / 3) * (TILE.h + TILE.gap),
});
export const TILE_S = TILE.w / CARD.w;

/** 0→1 flight of card i into its grid slot. The front card leaves first. */
export const gridP = (f: number, i: number) =>
  interpolate(f, [T.grid - 5 + (4 - i) * 2, T.grid - 5 + (4 - i) * 2 + 20], [0, 1], { ...CL, easing: EASE.salida });

export type CardState = { x: number; y: number; s: number; r: number; op: number; blur: number; h: number };

export const cardState = (f: number, i: number): CardState => {
  const a = rise(f, LANDS[i]);
  const d = depthOf(f, i);
  const L = depthLook(d);
  const xS = CARD.x + ((1 - L.s) * CARD.w) / 2;
  const yS = CARD.y + L.dy + (1 - a) * 1720;
  const rS = (1 - a) * (i % 2 === 0 ? 6 : -6);
  const g = gridP(f, i);
  if (g <= 0) return { x: xS, y: yS, s: L.s, r: rS, op: L.op, blur: L.blur, h: CARD.h };
  const t = tilePos(i);
  const lerp = (p: number, q: number) => p + (q - p) * g;
  return {
    x: lerp(xS, t.x),
    y: lerp(yS, t.y),
    s: lerp(L.s, TILE_S),
    r: lerp(rS, 0) + Math.sin(g * Math.PI) * (i % 2 === 0 ? -5 : 5),
    op: lerp(L.op, 1),
    blur: lerp(L.blur, 0),
    h: lerp(CARD.h, TILE.h / TILE_S),
  };
};
