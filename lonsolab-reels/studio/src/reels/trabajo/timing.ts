import { MUSIC } from "../../brand";

/**
 * Music bed: "Latin Funk Groove", 121.8 BPM. Same tempo, length and cue frames as MUSIC.trabajo, but this reel plays
 * a reel-local re-cut that starts one beat later (see cut_music_b.py): the kit's cut put the real bar lines one beat
 * after the reel's grid. With the re-cut, frame 0 is a real downbeat, the bass drops out at f118 and the drop lands on f236.
 */
export const M = MUSIC.trabajo;
export const BED_FILE = "trabajo/trabajo-b.wav";

/** Frame of beat n (rounded per beat, never accumulated). */
export const B = (n: number) => Math.round(n * M.beat_frames);
/** Frame of bar n (4 beats). */
export const BAR = (n: number) => Math.round(n * M.bar_frames);

export const T = {
  // 1 · Hook on tinta, one word per beat
  w1: B(0), // 0   "No te"
  w2: B(1), // 15  "pedimos"
  w3: B(2), // 30  "que nos"
  w4: B(3), // 44  "creas."
  underline: B(5), // 74
  // 2 · Dip: cut to papel, "Mirá el trabajo."
  mira: M.cues.dip.frame, // 118
  arrow: B(10), // 148
  riserStart: M.cues.drop.frame - 60, // riser_2s (60 f long) ends right on the drop
  // 3 · Card stack (landing frames, on the beat)
  c1: M.cues.drop.frame, // 236 CASO.001 REELS
  c2: BAR(5), // 296 CASO.002 DISEÑO
  c3: BAR(6), // 355 CASO.003 RESULTADOS
  countFrom: BAR(6) + 3,
  countEnd: B(27), // 399
  c3stat: B(27) + 1, // 400, right after the chime that ends the count
  c3circle: BAR(7), // 414, the circle on the screenshot closes on the downbeat
  c4: BAR(8), // 473 CASO.004 WEB
  c4rating: B(34), // 502 (leaves 0.5 s + 0.32 s × 6 words before card 5 covers it)
  c5: BAR(10), // 591 CASO.005 GOOGLE MAPS
  pin: 600,
  chip: B(41), // 606
  // 4 · Grid + close
  grid: BAR(11), // 650
  tile6: B(45), // 665
  cta: BAR(12), // 709
  end: M.duration_frames, // 768
} as const;

/** Rise of a card: starts 6 f before its landing beat, 13 f long (EASE.salida). */
export const RISE_LEAD = 6;
export const RISE_DUR = 13;
