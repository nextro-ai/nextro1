import { interpolate, spring } from "remotion";
import { EASE, MUSIC } from "../../brand";

/** Music bed: "Rise and Grind", 132.1 BPM, frame 0 = downbeat, bar = 54.5 f. */
export const M = MUSIC.buscando_calma;
export const DUR = M.duration_frames; // 1199

/** Beat / bar → frame from the float grid (no accumulated rounding). */
export const beat = (n: number) => Math.round(n * M.beat_frames);
export const bar = (n: number) => Math.round(n * M.bar_frames);

/**
 * Story frames. Scene changes sit on bars; small events (taps, pops) on beats.
 * Headline plates (each ≥ 75 f, see NOTES.md):
 *   H1   2–163  Alguien busca lo que vendés.
 *   H2 164–272  Así te encuentra hoy:
 *   H3 273–381  Y le compra a otro.
 *   H4 382–490  Rebobinemos.
 *   H5 491–599  Ahora, con Lonso Lab:   (crosses the drop at 545)
 *   H6 600–708  Te encuentran primero.
 *   H7 709–871  Y te eligen.
 *   —  872–980  services list (the list is the text)
 *   H8 981–1098 Tu próximo cliente ya está buscando.  (one block, settled 991–1089)
 *   end 1099–1199
 */
export const T = {
  typeStart: 8, // 1 character every 3 f → "ferretería cerca de mí" done at f71
  submit: beat(6), // 82
  results: [bar(2), beat(9), beat(10)] as const, // 109 123 136
  spot: bar(3), // 164: "Así te encuentra hoy:" + spotlight on Tu negocio
  // the three red flags land one per beat (not 4 f apart): 177 191 204
  flags: [beat(13), beat(14), beat(15)] as const,
  h3: bar(5), // 273: "Y le compra a otro."
  tap: beat(22), // 300: finger taps Ferretería Central
  callIn: beat(23), // 313: call screen has landed
  rewind: bar(7), // 382: "Rebobinemos." + clean rewind (◀◀) for ~1 bar
  rewindEnd: bar(8), // 436
  ahora: bar(9), // 491 (cue tension_bar): "Ahora, con Lonso Lab:"
  search2: beat(39), // 531: the same search is sent again
  drop: bar(10), // 545 (cue drop): dark field, Tu negocio first
  conRows: [beat(41), beat(42)] as const, // 559 572: competitors land below you
  conPin: beat(43), // 586
  primero: bar(11), // 600: "Te encuentran primero." + spotlight on the full profile
  eligen: bar(13), // 709: "Y te eligen."
  // every 3 beats (not one per bar): the third card then gets 74 f before the services cut
  notifs: [bar(13), beat(55), beat(58)] as const, // 709 749 790
  svc: bar(16), // 872: services list
  // one row per beat: the list is complete by ~f909 and then holds still as a whole until f973
  svcRows: [bar(16), beat(65), beat(66)] as const, // 872 886 899
  calm: bar(18), // 981 (cue energy_down_endcard): back to bg, "Tu próximo cliente ya está buscando." as one block
  // "ferretería" holds until the headline has settled, then two trades, then "lo que vendés" on bar 19
  rubros: [bar(18), beat(74), beat(75), bar(19)] as const, // 981 1008 1022 1036
  end: bar(20), // 1090: the headline leaves at end+8 (1098); the pill turns into the CTA at end+14 (1104)
  endSub: beat(82), // 1117
  endWa: beat(83), // 1131
  endUrl: Math.round(83.25 * M.beat_frames), // 1134: the two contact lines arrive as one group
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

/** Calm spring progress starting at `from` (0 before), no overshoot by default. */
export const sp = (f: number, from: number, damping = 22, stiffness = 120, mass = 1) =>
  f < from ? 0 : spring({ frame: f - from, fps: 30, config: { damping, stiffness, mass } });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Standard 12 f "salida" entrance (0 → 1). */
export const enter = (f: number, at: number, dur = 12) => ip(f, [at, at + dur], [0, 1], eo);
