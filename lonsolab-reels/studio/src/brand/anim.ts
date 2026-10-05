import { Easing, interpolate, spring } from "remotion";
import { EASE } from "./tokens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 progress between two frames with the site's "salida" ease. */
export const prog = (frame: number, from: number, dur: number, easing = EASE.salida) =>
  interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing });

/** Spring 0→1 starting at `from`. */
export const pop = (frame: number, fps: number, from: number, damping = 14, stiffness = 180, mass = 0.8) =>
  spring({ frame: frame - from, fps, config: { damping, stiffness, mass } });

/** A quick scale "punch" (1 → peak → 1) at `at`, useful for beat hits. */
export const punch = (frame: number, at: number, peak = 1.08, dur = 8) =>
  interpolate(frame, [at, at + 2, at + dur], [1, peak, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/** Camera shake offset in px that decays after `at`. */
export const shake = (frame: number, at: number, amp = 18, dur = 10) => {
  // No shake before the hit (interpolate's left clamp would otherwise return full strength).
  if (frame < at) return { x: 0, y: 0 };
  const k = interpolate(frame, [at, at + dur], [1, 0], clamp);
  if (k <= 0) return { x: 0, y: 0 };
  const n = frame - at;
  return { x: Math.sin(n * 2.7) * amp * k, y: Math.cos(n * 3.3) * amp * k * 0.7 };
};

/** Number of characters visible for a typewriter effect. */
export const typed = (frame: number, from: number, text: string, cps = 18, fps = 30) =>
  Math.max(0, Math.min(text.length, Math.floor(((frame - from) / fps) * cps)));

/** Frames for a given BPM. beat(n) = n beats at `bpm` in frames. */
export const beatFrames = (bpm: number, fps = 30) => (n: number) => Math.round((n * 60 * fps) / bpm);

/** Count-up value with ease-out. */
export const countUp = (frame: number, from: number, dur: number, target: number) =>
  interpolate(frame, [from, from + dur], [0, target], { ...clamp, easing: Easing.out(Easing.cubic) });

/** Format a number with Argentine thousands separator (705.326). */
export const fmtAR = (n: number, decimals = 0) =>
  n.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
