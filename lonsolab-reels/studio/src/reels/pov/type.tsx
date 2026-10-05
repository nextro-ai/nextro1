import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Site H1 look: Archivo 820, expanded, tight tracking.
 * Leading 1.06: Archivo's lowercase ascenders/accents (0.724 em) + descenders (0.20 em) = 0.93 em,
 * so 1.06 keeps ~0.13 em between a "q" and an accent on the next line.
 */
export const head = (
  size: number,
  color: string = C.tinta,
  stretch = 112,
): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 820,
  fontStretch: `${stretch}%`,
  fontSize: size,
  lineHeight: 1.06,
  letterSpacing: "-0.035em",
  color,
  whiteSpace: "nowrap",
});

/** List items / support copy. */
export const item = (
  size: number,
  color: string = C.tinta,
): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 620,
  fontStretch: "100%",
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: "-0.012em",
  color,
  whiteSpace: "nowrap",
});

/** Big editorial numbering: Archivo 800 condensed (wdth 75). */
export const numeral = (
  size: number,
  color: string = C.tinta,
): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 800,
  fontStretch: "75%",
  fontSize: size,
  lineHeight: 0.86,
  letterSpacing: "-0.01em",
  fontVariantNumeric: "tabular-nums lining-nums",
  color,
  whiteSpace: "nowrap",
});

/** Frames a reveal starts before the cut it lands on, so the cut frame already shows type (~45 %). */
export const PRE = 1;

/**
 * Mask reveal: the line rises from below a clipping edge (12 f, EASE.salida).
 * The clip is a clip-path that reaches past the line box (accents above, descenders below), so it
 * has no effect on layout: the line pitch is exactly the line-height. The text starts 135 % of a line
 * low, so not even an accent peeks through on the first frame.
 */
export const Rise: React.FC<{
  at: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  inline?: boolean;
}> = ({ at, dur = 12, children, style, inline = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const landed = frame >= at + dur;
  return (
    <div
      style={{
        display: inline ? "inline-block" : "block",
        visibility: frame < at ? "hidden" : undefined,
        // once landed, unclip so marker marks (loops, strikes) can overhang the line
        clipPath: landed ? undefined : "inset(-0.24em -0.3em -0.24em -0.3em)",
        ...style,
      }}
    >
      <div style={{ translate: landed ? undefined : `0 ${(1 - p) * 135}%` }}>
        {children}
      </div>
    </div>
  );
};
