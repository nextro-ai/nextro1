import { MUSIC } from "../../brand";

export const M = MUSIC.manifiesto;

/** Frame of beat n (never accumulate rounding). */
export const bt = (n: number) => Math.round(n * M.beat_frames);

/** Absolute frames of every story beat (see NOTES.md). */
export const T = {
  // Section A (high energy)
  tenes: bt(0), // 0
  elMejor: bt(1), // 14
  producto: bt(2), // 27
  laMejor: bt(4), // 55
  atencion: bt(5), // 68
  pero: bt(8), // 109
  siNo: bt(10), // 137
  aparezes: bt(11), // 150
  enGoogle: bt(12), // 164
  // Section B (the music drops)
  noExistis: M.cues.dip_start.frame, // 218
  ficha: bt(20), // 273
  redes: bt(24), // 328
  web: bt(28), // 382
  // Section C (back loud)
  mapa: M.cues.slam_back.frame, // 437
  enEl: bt(32.25), // 440 (16th after the slam back)
  mapaWord: bt(32.5), // 444 (8th): MAPA lands, the pin starts falling
  pinLand: bt(34), // 464
  stack: bt(36), // 492
  stackRedes: bt(37), // 505
  stackWeb: bt(38), // 519
  logo: bt(40), // 546
  cta: bt(44), // 601
  end: M.duration_frames, // 655
} as const;

/** Glitch windows (inclusive), each ≤ 6 frames. */
export const GLITCHES: { from: number; to: number; seed: number }[] = [
  { from: T.pero - 5, to: T.pero - 1, seed: 3 }, // 104-108 → "PERO…"
  { from: T.noExistis - 6, to: T.noExistis - 1, seed: 11 }, // 212-217 → "NO EXISTÍS."
];

/** Camera shake events (deterministic, decaying). */
export const SHAKES: { at: number; amp: number; dur: number }[] = [
  { at: T.tenes, amp: 12, dur: 5 },
  { at: T.elMejor, amp: 10, dur: 5 },
  { at: T.producto, amp: 16, dur: 6 },
  { at: T.laMejor, amp: 11, dur: 5 },
  { at: T.atencion, amp: 16, dur: 6 },
  { at: T.pero, amp: 18, dur: 6 },
  { at: T.siNo, amp: 10, dur: 5 },
  { at: T.aparezes, amp: 12, dur: 5 },
  { at: T.enGoogle, amp: 15, dur: 6 },
  { at: T.noExistis, amp: 26, dur: 12 },
  { at: T.ficha, amp: 7, dur: 6 },
  { at: T.redes, amp: 7, dur: 6 },
  { at: T.web, amp: 7, dur: 6 },
  { at: T.mapa, amp: 20, dur: 8 },
  { at: bt(34), amp: 12, dur: 6 }, // the pin sticks (464)
  { at: T.stack, amp: 10, dur: 5 },
  { at: T.stackRedes, amp: 10, dur: 5 },
  { at: T.stackWeb, amp: 12, dur: 5 },
  { at: T.logo, amp: 14, dur: 6 },
  { at: T.cta, amp: 8, dur: 5 },
];

/** Short flash frames (max ~1 per second, well under 3/s). */
export const FLASHES: { at: number; color: "papel" | "pin"; peak: number }[] = [
  { at: T.producto, color: "pin", peak: 0.32 },
  { at: T.atencion, color: "papel", peak: 0.22 },
  { at: T.mapa, color: "papel", peak: 0.28 },
  { at: T.logo, color: "papel", peak: 0.18 },
];
