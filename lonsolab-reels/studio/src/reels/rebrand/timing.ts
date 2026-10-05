import { MUSIC } from "../../brand";

export const M = MUSIC.rebrand;

/** Frame of beat n on the music grid (never accumulate rounding). */
export const B = (n: number) => Math.round(n * M.beat_frames);

/**
 * Scene map (absolute frames). The brief's cue frames (157, 235, 314 … 471 …) sit ~2 f after the
 * measured beat grid; the bloom transient in the bed actually starts at f468 and peaks at f469,
 * so every cut uses B(n) instead.
 */
export const T = {
  hook: 0,
  hookHit: B(4), // f78 first full piano chord — frost grows on the glass
  sign: B(8), // f156 "El mismo logo desde siempre."
  circle: B(12), // f234 "No se lee en el circulito…"
  splice: B(16), // f312 part B (calm, dark): "Tu negocio creció."
  grow: B(18), // f351 "creció." stretches
  crack: B(20), // f390 "Es hora de despertarla." + frost cracks
  bloom: B(24), // f469 BLOOM
  snap: B(26), // f508 logo locks
  palette: B(28), // f547
  chips: [B(28), B(29), B(30), B(31)], // f547 566 586 605
  type: B(32), // f625
  apps: B(36), // f703
  appBeats: [B(36), B(37), B(38), B(39)], // f703 722 742 761
  grid: B(40), // f781
  end: B(44), // f859
  total: M.duration_frames, // 939
} as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
