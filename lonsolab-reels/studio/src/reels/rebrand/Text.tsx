import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../brand";
import { clamp } from "./timing";

const MASK_EASE = Easing.bezier(0.7, 0, 0.2, 1);

/**
 * One headline line.
 * - "soft": cold & slow — rises 40 px out of a 10 px blur over `dur` frames (part A/B).
 * - "mask": crisp — slides up from under a clipping line (post-bloom).
 * Exit: soft fade + lift (or mask down) starting at `outAt`.
 */
export const Line: React.FC<{
  at: number;
  dur?: number;
  mode?: "soft" | "mask";
  outAt?: number;
  outDur?: number;
  /** soft mode: max blur (px) and rise (px) of the entrance */
  blur?: number;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, dur = 24, mode = "soft", outAt, outDur = 12, blur = 10, rise = 40, style, children }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: mode === "mask" ? MASK_EASE : EASE.salida });
  const outP = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + outDur], [0, 1], { ...clamp, easing: EASE.in });
  if (mode === "mask") {
    return (
      <div style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", paddingTop: "0.06em", marginTop: "-0.06em" }}>
        <div
          style={{
            translate: `0 ${(1 - inP) * 112 - outP * 112}%`,
            ...style,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        opacity: inP * (1 - outP),
        translate: `0 ${(1 - inP) * rise - outP * 30}px`,
        filter: inP < 0.999 || outP > 0.001 ? `blur(${(1 - inP) * blur + outP * 8}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Section label used after the bloom: "01 — Logo" (brand-guidelines header). */
export const SectionLabel: React.FC<{
  n: string;
  text: string;
  at: number;
  outAt?: number;
  color: string;
  accent: string;
}> = ({ n, text, at, outAt, color, accent }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE.salida });
  const o = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 292,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: p * (1 - o),
        fontFamily: "Archivo",
        fontSize: 54,
        lineHeight: 1,
      }}
    >
      <span style={{ fontWeight: 800, fontStretch: "125%", color: accent, fontVariantNumeric: "tabular-nums" }}>{n}</span>
      <span style={{ width: 56 * p, height: 3, background: accent, borderRadius: 2 }} />
      <span style={{ fontWeight: 700, fontStretch: "110%", color, translate: `${(1 - p) * 24}px 0` }}>{text}</span>
    </div>
  );
};
