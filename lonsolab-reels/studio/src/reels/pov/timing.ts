import { MUSIC } from "../../brand";

/** Music bed for this reel: "Cozy Afternoon", 85.9 BPM, frame 0 = downbeat. */
export const M = MUSIC.pov;

/** Frame of beat n (never accumulate rounding). */
export const bt = (n: number) => Math.round(n * M.beat_frames);
/** Frame of bar n (4/4). */
export const bar = (n: number) => bt(n * 4);

/** "Antes" list: one item every 1.5 beats, struck through one beat after it lands. */
const ITEM_BEATS = [8, 9.5, 11, 12.5];
/** "Después" list: one tick per half bar; the tick completes ON the beat. */
const TICK_BEATS = [28, 30, 32, 34];
/** A tick is drawn in TICK_DRAW frames and ends on its beat, so it starts this early. */
export const TICK_LEAD = 5;

/** Beat-synced frames used across the reel (see NOTES.md). */
export const T = {
  // 1 · POV hook
  pov: 0,
  povHalf: bt(2), // 42 — pin "ping"
  nadie: bar(1), // 84 — "…y nadie se entera." + map pulls back
  nadieHi: bar(1) + 14, // 98 — highlighter on "nadie"
  povEcho: bt(6), // 126 — tiny ping, nobody answers
  // 2 · Por qué no te encuentran
  lista: bar(2), // 168
  items: ITEM_BEATS.map(bt), // 168, 199, 231, 262
  strikes: ITEM_BEATS.map((b) => bt(b + 1)), // 189, 220, 251, 283
  // 3 · Breakdown: the music empties at 335; the list stays crisp until bt(18) (item 4 gets 115 f)
  breakdown: M.cues.breakdown.frame, // 335 — header + map leave
  sink: bt(18), // 377 — the crossed-out list drains and sinks
  cada: bt(18), // 377 — "Cada día que no aparecés,"
  alguien: bar(5), // 419
  circulo: bar(5) + 16, // 435 (after "compra a otro." has landed)
  // 4 · Page turn
  turn: bar(6), // 503 (wipe 497→509, whoosh peak here)
  arrow: bt(26), // 545 — underline under "nosotros:"
  fold: bt(27.25), // 571 — the cobalt headline shrinks into the list title (lands on 587)
  // 5 · Lo que hacemos (one tick per half bar)
  groove: M.cues.groove_back.frame, // 587
  ticks: TICK_BEATS.map(bt), // 587, 629, 671, 712 — tick completes here
  // 6 · Vos / Nosotros
  vos: bar(9), // 754
  nosotros: bt(37), // 775
  seVea: bt(37) + 18, // 793
  ping1: bt(38), // 796
  ping2: bt(39), // 817
  ping3: bt(40), // 838
  // 7 · CTA (2,07 s close)
  cta: bt(41), // 859 — pill at full size + pop
  shine: bt(42), // 880
  ctaPing: bt(43), // 901
  end: M.duration_frames, // 921
} as const;

/** Half a beat (an eighth note). */
export const EIGHTH = Math.round(M.beat_frames / 2); // 10
