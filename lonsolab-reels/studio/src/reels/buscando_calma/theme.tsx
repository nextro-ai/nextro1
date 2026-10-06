import React, { createContext, useContext } from "react";
import { THEMES, type Theme } from "../../brand";

/**
 * Theme plumbing for this reel. EVERY colour in the folder comes from the active Theme
 * (src/brand/themes.ts), picked with inputProps.theme ("web" | "mono" | "bosque" | "marino").
 * Tints, shadows and blends are derived from theme roles with `alpha()` / `mix()`.
 *
 * The only literal colours allowed in the folder live here: the two neutrals below, used for
 * hardware (the phone's camera island), glass glare and drop-shadow depth. They are not brand
 * hues and read the same in every palette.
 */
export const WHITE = "#ffffff"; // neutral: highlights on the ink phone body/rim, white ring of the touch indicator
export const BLACK = "#000000"; // neutral: camera island, shading of the phone body and call screen (mixed into ink)

const ThemeCtx = createContext<Theme>(THEMES.web);

export const resolveTheme = (id: string | undefined): Theme => THEMES[id ?? "web"] ?? THEMES.web;

export const ThemeProvider: React.FC<{ theme: string | undefined; children: React.ReactNode }> = ({ theme, children }) => (
  <ThemeCtx.Provider value={resolveTheme(theme)}>{children}</ThemeCtx.Provider>
);

export const useTheme = () => useContext(ThemeCtx);

const parse = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Theme colour with alpha (for shadows, dims, tints). */
export const alpha = (hex: string, a: number) => {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
};

/** Linear blend of two theme colours (t = 0 → a, t = 1 → b). */
export const mix = (a: string, b: string, t: number) => {
  const A = parse(a);
  const B = parse(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** Soft, theme-tinted elevation shadow (ink with alpha, like the site). */
export const shadow = (t: Theme, k = 1) =>
  `0 2px 6px ${alpha(t.ink, 0.1 * k)}, 0 24px 48px -20px ${alpha(t.ink, 0.42 * k)}`;

/** WCAG relative luminance / contrast ratio of two theme colours. */
const lum = (hex: string) => {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/**
 * Edge for accent shapes on light surfaces. A light accent (yellow in `marino`, honey in
 * `bosque`) is below the 3:1 non-text contrast against `surface`, so those shapes get a thin
 * outline of the accent darkened toward ink. Accents that already pass (orange) get none, so
 * `web` and `mono` look exactly as before.
 */
export const accentEdge = (t: Theme): string | null =>
  contrast(t.accent, t.surface) < 3 ? mix(t.accent, t.ink, 0.35) : null;
