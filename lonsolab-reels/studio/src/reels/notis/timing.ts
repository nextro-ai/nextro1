import { interpolate, type EasingFunction } from "remotion";
import { C, EASE, MUSIC, type IconName } from "../../brand";

export const MU = MUSIC.notis;
/** 360 f = 12 s = 6 bars of 120 BPM. The last frame cuts back to frame 0 on a downbeat. */
export const DUR = MU.duration_frames;
/** 15 f per beat. */
export const B = (n: number) => Math.round(n * MU.beat_frames);

export const T = {
  swap: B(5), // 75  "Así suena un negocio que aparece."
  counterIn: B(10), // 150 "+N notificaciones" pill
  last: B(17), // 255 last notification → "+24"
  sweep: B(18), // 270 notifications swept up (whoosh peak)
  // CTA builds fast under the whoosh so the full plate holds ~45 f before it leaves
  ctaLogo: B(18), // 270 logo (on the whoosh peak)
  ctaWord: B(18) + 1, // 271 "Escribinos."
  ctaPill: B(18) + 4, // 274 "Auditoría gratis"
  ctaUrl: B(18) + 6, // 276 lonsolab.com
  ctaOut: B(22) - 5, // 325 CTA leaves (5 f, ease-in) → hook rebuilds on f330
  loopIn: B(22), // 330 hook rebuilds (= composition of frame 0)
  /** downbeats inside the rain: camera kick + highlighter punch */
  hook2: B(22.5), // 338
  hook3: B(23), // 345
} as const;

/** Bar downbeats during the rain (bars 3, 4, 5): camera "kick". */
export const KICKS = [B(8), B(12), B(16)];

/**
 * Loop time: frames 330–359 map to −30…−1 so every element of the opening composition is a
 * continuous function across the 359 → 0 cut (the reel is designed to repeat).
 */
export const lt = (f: number) => (f >= T.loopIn ? f - DUR : f);

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ip = (f: number, a: number, b: number, from = 0, to = 1, easing: EasingFunction = EASE.salida) =>
  interpolate(f, [a, b], [from, to], { ...CL, easing });

/* ---------- layout (canvas px) ---------- */
export const PHONE = { x: 179, y: 196, w: 722, h: 1482, bezel: 21 } as const;
export const PHONE_R = PHONE.w * 0.14;
export const SCREEN = {
  x: PHONE.x + PHONE.bezel,
  y: PHONE.y + PHONE.bezel,
  w: PHONE.w - PHONE.bezel * 2,
  h: PHONE.h - PHONE.bezel * 2,
} as const;
/** Headline block (zone A) and top of the notification stack (zone B). */
export const HEAD_TOP = 496;
export const STACK_TOP = 862; // canvas y of the newest card (before the counter opens its slot)
/** "+N notificaciones" docks in its own slot between the headline and the stack (from f146 the stack moves down). */
export const COUNTER_SLOT = 110;
export const COUNTER_CY = 890; // canvas y of the pill's centre

/* ---------- notifications ---------- */
export type App = "tel" | "resenas" | "mapas" | "mensajes" | "web";
export const APPS: Record<App, { name: string; icon: IconName; color: string }> = {
  tel: { name: "Teléfono", icon: "tel", color: C.verde },
  resenas: { name: "Reseñas", icon: "estrella", color: C.estrella },
  mapas: { name: "Mapas", icon: "pin", color: C.pin },
  mensajes: { name: "Mensajes", icon: "chat", color: C.cobalto },
  web: { name: "Tu web", icon: "web", color: C.tinta },
};

export type SoundName =
  | "ding_C" | "ding_D" | "ding_G" | "ding_A"
  | "msg_C" | "msg_D" | "msg_G" | "msg_A"
  | "pop_1" | "pop_2" | "pop_3" | "pop_4";

export type Notif = {
  at: number; // frame where the card lands (sound frame)
  app: App;
  title?: string;
  stars?: boolean;
  body?: string;
  hero?: boolean;
  sfx: SoundName;
  vol: number;
};

/**
 * Accelerating "rain", locked to the 120 BPM grid: half notes (30 f) under the hook, then quarters
 * (15), quarter triplets (10), 8ths (7,5), 8th triplets (5) and 16ths (3,75). 25 cards in total, so
 * the iOS-style group counter ends on "+24 notificaciones". Sounds are pitched to G/A/C/D so the
 * notifications play a rising figure in key with the bed.
 */
const beats = [
  0, 2, 4, // half notes (hook)
  6, 7, 8, 9, // quarters
  10, 10 + 2 / 3, 11 + 1 / 3, // quarter triplets
  12, 12.5, 13, 13.5, // 8ths
  14, 14 + 1 / 3, 14 + 2 / 3, 15, 15 + 1 / 3, 15 + 2 / 3, // 8th triplets
  16, 16.25, 16.5, 16.75, 17, // 16ths
];

type Content = Omit<Notif, "at" | "sfx" | "vol">;
const CONTENT: Content[] = [
  { app: "tel", title: "Llamada entrante", body: "Un cliente te encontró en Google", hero: true },
  { app: "resenas", title: "Nueva reseña", stars: true, body: "“Excelente atención”" },
  { app: "mapas", body: "Pidieron cómo llegar\na tu local" },
  { app: "mensajes", body: "¿Tienen turno hoy?" },
  { app: "tel", title: "Llamada entrante" },
  { app: "web", title: "Nueva consulta" },
  { app: "resenas", stars: true, body: "“Volvería sin dudas”" },
  { app: "mensajes", body: "¿Hacen envíos?" },
  { app: "mapas", body: "Guardaron tu local" },
  { app: "mensajes", body: "¿Abren el sábado?" },
  { app: "resenas", title: "Nueva reseña", stars: true, body: "“Recomendadísimo”" },
  { app: "tel", title: "Llamada entrante" },
  { app: "web", title: "Nueva consulta" },
  { app: "mensajes", body: "¿Tienen stock?" },
  { app: "mapas", body: "Pidieron cómo llegar\na tu local" },
  { app: "mensajes", body: "¿Hasta qué hora abren?" },
  { app: "resenas", stars: true, body: "“Excelente atención”" },
  { app: "tel", title: "Llamada entrante" },
  { app: "mensajes", body: "¿Dónde quedan?" },
  { app: "web", title: "Reservaron un turno" },
  { app: "resenas", stars: true, body: "“Muy buena atención”" },
  { app: "mapas", body: "Guardaron tu local" },
  { app: "mensajes", body: "¿Tienen turno mañana?" },
  { app: "tel", title: "Llamada entrante" },
  { app: "resenas", title: "Nueva reseña", stars: true, body: "“Volvería sin dudas”" },
];

// Rising figure: instrument alternates pop / ding / msg (brief), notes climb G → A → C → D.
const SOUNDS: SoundName[] = [
  "pop_1", // f0 hook (+ ding_G layered in Sound.tsx)
  "msg_C", "ding_G", // f30, f60
  "msg_D", "pop_2", "ding_A", "msg_G", // quarters
  "ding_C", "msg_A", "pop_3", // triplets
  "ding_D", "msg_G", "pop_2", "msg_A", // 8ths
  "ding_G", "pop_3", "msg_C", "ding_A", "pop_4", "msg_D", // 8th triplets
  "msg_G", "pop_3", "msg_A", "pop_4", "ding_G", // 16ths → last one lands on beat 17
];

export const NOTIFS: Notif[] = beats.map((b, i) => {
  const gap = i === 0 ? 30 : (b - beats[i - 1]) * MU.beat_frames;
  // brief: low volume (0.35–0.5); a touch lower as the density rises so the rain never piles up
  const vol = i === 0 || gap >= 15 ? 0.5 : gap >= 10 ? 0.46 : gap >= 7 ? 0.43 : gap >= 5 ? 0.4 : 0.36;
  return { at: B(b), ...CONTENT[i], sfx: SOUNDS[i], vol };
});

/* ---------- card geometry ---------- */
export const CARD = {
  w: 644,
  padX: 26,
  padY: 24,
  icon: 82,
  gap: 16,
  rowHead: 50,
  rowTitle: 56,
  rowStars: 46,
  rowBody: 54,
};
export const twoLineBody = (n: Notif) => Boolean(n.body && (n.hero || n.body.includes("\n")));
export const cardHeight = (n: Notif) => {
  let h = CARD.padY * 2 + CARD.rowHead;
  if (n.title) h += CARD.rowTitle;
  if (n.stars && !n.title) h += CARD.rowStars;
  if (n.body) h += CARD.rowBody * (twoLineBody(n) ? 2 : 1);
  return h;
};
