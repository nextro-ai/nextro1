import { Easing, interpolate, spring } from "remotion";
import { EASE, MUSIC } from "../../brand";

/** Music bed for this reel: "Rise and Grind", 132.1 BPM, frame 0 = downbeat. */
export const M = MUSIC.buscando;
export const DUR = M.duration_frames; // 926

/** Beat / bar → frame, computed from the float grid (no accumulated rounding). */
export const beat = (n: number) => Math.round(n * M.beat_frames);
export const bar = (n: number) => Math.round(n * M.bar_frames);

/** Story beats (absolute frames). All land on the music grid / cues. */
export const T = {
  pins: [bar(1), beat(5), beat(6)] as const, // 55 68 82
  submit: 52,
  scroll: bar(2), // 109
  lift: beat(11), // 150
  liftBack: beat(15), // 204
  tap: bar(4), // 218
  callIn: 226,
  tapeStop: 268,
  rewind: bar(5), // 273 (cue tension_bar)
  rewindEnd: 316,
  rebobinemos: 280,
  drop: bar(6), // 327 (cue drop)
  conPin: beat(25), // 341
  conTap: beat(30), // 409: a customer taps YOUR call button
  conCall: beat(31), // 422: "Llamando a Tu negocio…" (mirror of the competitor call)
  notifs: bar(8), // 436
  heroCall: bar(10), // 545
  cards: [bar(11), bar(12), beat(51)] as const, // 600 654 695 (card 03 a beat early so it reads ≥ 54 f)
  calm: bar(14), // 763 (cue energy_down_endcard)
  end: 840,
  pinLand: 846,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Clamped interpolate with optional easing. */
export const ip = (
  f: number,
  input: readonly number[],
  output: readonly number[],
  easing: (t: number) => number = (t) => t,
) => interpolate(f, input as number[], output as number[], { ...clamp, easing });

export const eo = EASE.salida;
export const io = EASE.inOut;
export const ei = EASE.in;
export const back = Easing.out(Easing.back(1.6));

/** Spring progress starting at `from` (0 before). */
export const sp = (f: number, from: number, damping = 16, stiffness = 170, mass = 1) =>
  f < from ? 0 : spring({ frame: f - from, fps: 30, config: { damping, stiffness, mass } });

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
