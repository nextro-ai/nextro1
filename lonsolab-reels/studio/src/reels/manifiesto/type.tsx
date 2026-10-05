import React from "react";
import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { WDTH_RATIO } from "./metrics";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Archivo vertical metrics (em). With line-height 1 the baseline sits ASC below the box top. */
export const CAP = 0.686;
export const ASC = 0.834;
export const ACCENT = 0.182; // extra height of an accented capital above the cap line

/**
 * Baselines for a stack of lines given the top of the first line's caps.
 * `accent` lines need extra room above the caps (É, Ó, Í).
 */
export const stackBaselines = (
  lines: { size: number; accent?: boolean }[],
  capTop: number,
  gap: number,
) => {
  const out: number[] = [];
  let y = capTop;
  lines.forEach((l, i) => {
    if (i > 0) y += gap + (l.accent ? ACCENT * l.size : 0);
    y += CAP * l.size;
    out.push(y);
  });
  return out;
};

export type SlamProps = {
  /** absolute frame now */
  frame: number;
  /** absolute frame where the word lands (beat) */
  at: number;
  text: React.ReactNode;
  size: number;
  /** left edge of the line (or its centre if align="center") */
  x: number;
  /** width of the line box when align="center" (with align="left" the box is `fit` wide) */
  width: number;
  baseline: number;
  align?: "left" | "center";
  color?: string;
  outline?: boolean;
  outlineColor?: string;
  strokeWidth?: number;
  /** solid colour painted under the stroke so overlapping contours stay hidden */
  outlineFill?: string;
  weight?: number;
  stretch?: number;
  startStretch?: number;
  letterSpacing?: string;
  slamFrom?: number;
  heavy?: boolean;
  /** frames for the width punch */
  punchDur?: number;
  /** natural width of the text at rest (px). Defaults to `width`. Used for the centred origin and the clamp. */
  fit?: number;
  /** the word never gets wider than this on screen (px), whatever the slam/overshoot. Default fit + 12. */
  maxW?: number;
  /** scale applied by a parent (group slam), so the clamp can account for it */
  outerScale?: number;
  /** entry blur (3 → 0 px over 2 f). Off by default for outlines: a thin blurred stroke reads as an empty frame. */
  entryBlur?: boolean;
  style?: React.CSSProperties;
};

const wdthRatio = (st: number) =>
  interpolate(
    st,
    WDTH_RATIO.map((p) => p[0]),
    WDTH_RATIO.map((p) => p[1]),
    clamp,
  );

/**
 * The Lonso Lab "stretch punch": the word lands compressed (wdth 62, wght 900),
 * widens to its final width in ~6 frames with a small elastic overshoot, while it
 * slams from 1.35x to 1x on a snappy spring.
 *
 * The slam scales from the centre of the word (not its left edge), and the horizontal
 * scale is clamped so the word is never wider than `maxW` on screen: the slam reads
 * as height + stretch, never as a word running past the safe zone.
 */
export const Slam: React.FC<SlamProps> = ({
  frame,
  at,
  text,
  size,
  x,
  width,
  baseline,
  align = "left",
  color = C.papel,
  outline = false,
  outlineColor = C.papel,
  strokeWidth = 3,
  outlineFill,
  weight = 900,
  stretch = 125,
  startStretch = 62,
  letterSpacing = "-0.02em",
  slamFrom = 1.35,
  heavy = false,
  punchDur = 6,
  fit,
  maxW,
  outerScale = 1,
  entryBlur,
  style,
}) => {
  const { fps } = useVideoConfig();
  const t = frame - at;
  if (t < 0) return null;
  const s = spring({
    frame: t,
    fps,
    config: heavy ? { damping: 15, stiffness: 160, mass: 1 } : { damping: 11, stiffness: 220, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [slamFrom, 1]);
  // width punch with elastic overshoot (axis clamps at 125, the overshoot goes to scaleX)
  const lin = interpolate(t, [0, punchDur], [0, 1], clamp);
  const r = EASE.rebote(lin); // overshoots ~1.1 mid-way, settles at 1
  const st = startStretch + (stretch - startStretch) * Math.min(1, r);
  const sx = 1 + Math.max(0, r - 1) * 0.6;
  const fitW = fit ?? width;
  const limit = maxW ?? fitW + 12;
  // on-screen width = natural width · (wdth ratio now vs final) · horizontal scale · parent scale
  const wf = wdthRatio(st) / wdthRatio(stretch);
  const hx = Math.min(scale * sx, limit / (fitW * wf * outerScale));
  const blur = (entryBlur ?? !outline) ? interpolate(t, [0, 2], [3, 0], clamp) : 0;
  // The text is always centred inside a box of its final width, so while it is still condensed
  // (wdth 62 → 125) it widens symmetrically around its final centre, never off the left edge.
  const boxW = align === "center" ? width : fitW;
  const left = align === "center" ? x - width / 2 : x;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: baseline - ASC * size,
        width: boxW,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: "pre",
        fontWeight: weight,
        fontStretch: `${st}%`,
        letterSpacing,
        color: outline ? (outlineFill ?? "transparent") : color,
        WebkitTextStroke: outline ? `${outlineFill ? strokeWidth * 2 : strokeWidth}px ${outlineColor}` : undefined,
        paintOrder: outline ? "stroke fill" : undefined,
        scale: `${hx} ${scale}`,
        // origin = centre of the caps: the slam grows as much up as down, so a new line never
        // swells into the line above it on its impact frame
        transformOrigin: `50% ${(ASC - CAP / 2) * 100}%`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Gap between the dots of <Dots> (em). Archivo's wdth-125 period is a square block, so it needs air. */
export const DOT_GAP = 0.07;

/**
 * Three dots that can pop/pulse individually (replaces "…"). No negative tracking:
 * each dot keeps its own advance plus DOT_GAP, so they never merge into a bar.
 * Width = EM[...]["…"] (see metrics.ts).
 */
export const Dots: React.FC<{
  opacities: number[];
  scales?: number[];
  color: string;
}> = ({ opacities, scales = [1, 1, 1], color }) => (
  <span style={{ display: "inline-block", letterSpacing: 0 }}>
    {opacities.map((o, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          opacity: o,
          color,
          scale: `${scales[i]}`,
          transformOrigin: "50% 85%",
          marginRight: i < opacities.length - 1 ? `${DOT_GAP}em` : 0,
        }}
      >
        .
      </span>
    ))}
  </span>
);

/** Pop for a dot: well damped and capped at 1.1 so it never swells into its neighbour. */
export const dotPop = (frame: number, at: number, fps: number) => Math.min(1.1, popIn(frame, at, fps, 16));

/** Pop-in helper for small elements. */
export const popIn = (frame: number, at: number, fps: number, damping = 12) =>
  frame < at ? 0 : spring({ frame: frame - at, fps, config: { damping, stiffness: 240, mass: 0.6 } });

export const ease = (frame: number, from: number, dur: number, easing = EASE.salida) =>
  interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing });

export const easeInOut = (frame: number, from: number, dur: number) =>
  interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
