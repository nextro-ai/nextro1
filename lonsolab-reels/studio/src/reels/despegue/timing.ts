import { MUSIC } from "../../brand";

const M = MUSIC.despegue;

/** Beat n of the 100 BPM bed (18 f per beat). Never accumulate rounding. */
export const bt = (n: number) => Math.round(n * M.beat_frames);

/**
 * After the liftoff impact the track switches to a faster pulse (~117.5 BPM measured with librosa:
 * beats at 607, 622, 638, 653, 668, 684, 699, 714, 730, 745, 760 ...).
 */
export const POST_BEAT = 15.32;
export const pbt = (n: number) => Math.round(607.1 + n * POST_BEAT);

export const DUR = M.duration_frames; // 864

/** Story frames (absolute). Every scene boundary sits on a beat or on a music cue. */
export const T = {
  s1: 0, // "Tu negocio tiene todo para despegar."
  s1Text: 4,
  s1Out: bt(7) - 14, // 112
  s2: bt(7), // 126 "Menos una cosa:"
  s2w2: bt(8), // 144
  s2w3: bt(9), // 162
  s3: bt(12), // 216 "Que te vean."
  t3: M.cues.loud_bar.frame, // 288 = bt(16)
  t2: bt(20), // 360
  t1: bt(24), // 432
  ign: bt(28), // 504 ignition
  ignText: 508,
  ignTextOut: 590,
  dark: 599, // 6 frames of near-black + silence
  lift: M.cues.impact.frame, // 605
  txt2: 630, // "Despegá con Lonso Lab."
  txt2Out: 778,
  rise: 778, // camera stops following, pin rises to its place in the sky
  end: M.cues.calm_endcard.frame, // 792
} as const;

/** Where the pin beacon's tip settles on the end card (above the logo). */
export const END_PIN_Y = 528;

/** Countdown items (T-3, T-2, T-1). */
export const COUNT = [
  { n: 3, at: T.t3, icon: "pin", service: "Google Maps", line: "Que te encuentren" },
  { n: 2, at: T.t2, icon: "camara", service: "Redes", line: "Que te elijan" },
  { n: 1, at: T.t1, icon: "web", service: "Web", line: "Que te escriban" },
] as const;

/** Decaying camera shakes. */
export const SHAKES: { at: number; amp: number; dur: number }[] = [
  { at: T.s3, amp: 12, dur: 9 },
  { at: T.t3, amp: 22, dur: 12 },
  { at: T.t2, amp: 24, dur: 12 },
  { at: T.t1, amp: 26, dur: 12 },
  { at: T.lift, amp: 44, dur: 34 },
  { at: pbt(5), amp: 9, dur: 9 }, // strong onset in the music at 684
  { at: pbt(8), amp: 7, dur: 8 }, // through the contour band (730)
];

/** Ignition clock: beats, then 8th notes, then faster, stopping before the 6-frame silence (599–604). */
export const IGN_TICKS = [bt(28), bt(29), bt(30), bt(31), bt(31.5), bt(32), bt(32.5), 591, 595];
