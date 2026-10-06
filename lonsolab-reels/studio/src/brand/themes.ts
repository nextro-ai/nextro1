/**
 * Palette variants for deciding the brand colours (reels and, later, the website).
 * Every reel that supports themes reads ALL its colours from one Theme object — no hard-coded
 * brand hues — so the same edit can be rendered in each palette.
 *
 * Roles (use them by meaning, not by look):
 *  bg / bg2      page background and an alternate quiet surface
 *  surface       cards, phone screens, notification cards (usually white)
 *  ink / ink2    main text / secondary text on bg and surface
 *  line          hairlines, dividers, muted UI strokes
 *  dark / onDark the one "statement" field (the turn of the story, end of a section) and text on it
 *  accent        the ONLY loud colour: CTA button, "tu negocio" highlight, the key word. Never as a
 *                big background together with `dark` in the same frame.
 *  onAccent      text/icons on the accent
 *  accentSoft    tinted highlight behind words, soft badges
 *  topo          colour of the contour-line motif (kept subtle)
 *  map / mapRoad simulated map ground and roads
 *  ok / warn / star  functional UI colours (open now, missing info, review stars)
 */
export type Theme = {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  surface: string;
  ink: string;
  ink2: string;
  line: string;
  dark: string;
  onDark: string;
  onDark2: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  topo: string;
  map: string;
  mapRoad: string;
  ok: string;
  warn: string;
  star: string;
};

export const THEMES: Record<string, Theme> = {
  // A — the website colours, used with discipline: mostly cream + ink, cobalt only as the
  // statement field, orange only for the action.
  web: {
    id: "web",
    name: "A · Web ordenada",
    bg: "#f3f4ef",
    bg2: "#e8eae2",
    surface: "#ffffff",
    ink: "#13182b",
    ink2: "#4a5168",
    line: "#d3d7df",
    dark: "#2340d8",
    onDark: "#ffffff",
    onDark2: "#c9d2ff",
    accent: "#ff5a26",
    onAccent: "#13182b",
    accentSoft: "#ffe1d6",
    topo: "#2340d8",
    map: "#e9ecf3",
    mapRoad: "#ffffff",
    ok: "#1f7a3e",
    warn: "#b42318",
    star: "#f2a516",
  },
  // B — like the logo: black & white, one orange accent.
  mono: {
    id: "mono",
    name: "B · Blanco y negro + naranja",
    bg: "#f4f4f1",
    bg2: "#e9e9e5",
    surface: "#ffffff",
    ink: "#111111",
    ink2: "#5c5c5c",
    line: "#d9d9d4",
    dark: "#111111",
    onDark: "#ffffff",
    onDark2: "#bdbdb8",
    accent: "#ff5a26",
    onAccent: "#111111",
    accentSoft: "#ffe1d6",
    topo: "#111111",
    map: "#ececea",
    mapRoad: "#ffffff",
    ok: "#1f7a3e",
    warn: "#b42318",
    star: "#f2a516",
  },
  // C — forest: deep green, cream and honey (the bear + honey).
  bosque: {
    id: "bosque",
    name: "C · Bosque y miel",
    bg: "#f4f0e6",
    bg2: "#e9e3d4",
    surface: "#fffdf8",
    ink: "#1c2a21",
    ink2: "#56645a",
    line: "#d8d1bf",
    dark: "#1f3b2d",
    onDark: "#fffdf8",
    onDark2: "#b9cbbd",
    accent: "#e9a23b",
    onAccent: "#1c2a21",
    accentSoft: "#f8e3bf",
    topo: "#1f3b2d",
    map: "#e7e6d8",
    mapRoad: "#fffdf8",
    ok: "#2f7d46",
    warn: "#b3401f",
    star: "#e9a23b",
  },
  // D — navy and yellow: classic trust colour + one bright accent.
  marino: {
    id: "marino",
    name: "D · Marino + amarillo",
    bg: "#f3f5f9",
    bg2: "#e6eaf2",
    surface: "#ffffff",
    ink: "#0f1b33",
    ink2: "#55607a",
    line: "#d4dae6",
    dark: "#0f1b33",
    onDark: "#ffffff",
    onDark2: "#b8c3da",
    accent: "#ffc633",
    onAccent: "#0f1b33",
    accentSoft: "#fff0c2",
    topo: "#0f1b33",
    map: "#e8ecf3",
    mapRoad: "#ffffff",
    ok: "#1f7a3e",
    warn: "#b42318",
    star: "#f2a516",
  },
};

export const THEME_IDS = Object.keys(THEMES);
