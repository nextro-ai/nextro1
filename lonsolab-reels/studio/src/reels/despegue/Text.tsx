import React from "react";
import { Easing, interpolate } from "remotion";
import { FONT } from "../../brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Expo-out-ish curve for mask reveals. */
const REVEAL = Easing.bezier(0.2, 0.9, 0.25, 1);

export type WordSpec = {
  t: string;
  at: number;
  /** "mask" = rises from under a clip line; "stretch" = brand "estirar" (wdth 62 → target, blur → 0); "slam" = scale-in hit */
  fx?: "mask" | "stretch" | "slam";
  color?: string;
  glow?: string;
  /** transform-origin for the slam (default centre). Use "0% 50%" on a word that follows another one so the overshoot never hits it. */
  origin?: string;
  /** start scale of the slam (default 1.4). Wide words use less so the hit frame stays inside x 90–990. */
  slam?: number;
};

export type LineSpec = {
  words: WordSpec[];
  size: number;
  weight?: number;
  stretch?: number; // target wdth %
  tracking?: number; // em
  color: string;
  gap?: number; // px between words
};

export const typeStyle = (size: number, weight: number, stretch: number, color: string, tracking = -0.025): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: weight,
  fontStretch: `${stretch}%`,
  letterSpacing: `${tracking}em`,
  lineHeight: 1,
  color,
  whiteSpace: "nowrap",
});

/**
 * A centred stack of lines whose words animate in individually and leave together.
 * `out` = frame where the exit starts (words slide up behind the clip line, 1 f stagger).
 */
export const Stack: React.FC<{
  frame: number;
  lines: LineSpec[];
  top: number;
  out: number;
  outDur?: number;
  lineGap?: number;
  /** extra emphasis multiplier per frame (beat punches) */
  punch?: number;
  style?: React.CSSProperties;
}> = ({ frame, lines, top, out, outDur = 8, lineGap = 0, punch = 1, style }) => {
  let wordIndex = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
        scale: punch,
        ...style,
      }}
    >
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", gap: ln.gap ?? ln.size * 0.26 }}>
          {ln.words.map((w, wi) => {
            const idx = wordIndex++;
            return <Word key={wi} frame={frame} w={w} ln={ln} out={out + idx} outDur={outDur} />;
          })}
        </div>
      ))}
    </div>
  );
};

const Word: React.FC<{ frame: number; w: WordSpec; ln: LineSpec; out: number; outDur: number }> = ({ frame, w, ln, out, outDur }) => {
  const fx = w.fx ?? "mask";
  const color = w.color ?? ln.color;
  const target = ln.stretch ?? 112;
  const base = typeStyle(ln.size, ln.weight ?? 800, target, color, ln.tracking);
  const pIn = interpolate(frame, [w.at, w.at + (fx === "stretch" ? 16 : 11)], [0, 1], { ...clamp, easing: REVEAL });
  const pOut = interpolate(frame, [out, out + outDur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (frame < w.at) {
    return <span style={{ ...base, visibility: "hidden" }}>{w.t}</span>;
  }
  const glow = w.glow ? { textShadow: `0 0 ${ln.size * 0.28}px ${w.glow}, 0 0 ${ln.size * 0.08}px ${w.glow}` } : {};
  // Hit words ("stretch", "slam") are fully opaque on their own frame: the most energetic frame is the hit itself
  // (narrowest / biggest / blurriest), then they settle. Nothing arrives a frame after the sound.
  if (fx === "stretch") {
    const wd = interpolate(pIn, [0, 1], [62, target]);
    return (
      <span
        style={{
          ...base,
          ...glow,
          display: "inline-block",
          fontStretch: `${wd}%`,
          filter: `blur(${(1 - pIn) * 7 + pOut * 10}px)`,
          translate: `0 ${(1 - pIn) * 0.18 * ln.size - pOut * 0.25 * ln.size}px`,
          opacity: 1 - pOut,
        }}
      >
        {w.t}
      </span>
    );
  }
  if (fx === "slam") {
    const s = interpolate(pIn, [0, 1], [w.slam ?? 1.4, 1]);
    return (
      <span
        style={{
          ...base,
          ...glow,
          display: "inline-block",
          scale: s * (1 + pOut * 0.15),
          transformOrigin: w.origin ?? "50% 50%",
          filter: `blur(${(1 - pIn) * 10 + pOut * 12}px)`,
          opacity: 1 - pOut,
        }}
      >
        {w.t}
      </span>
    );
  }
  // mask reveal
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        padding: "0.1em 0.04em 0.16em",
        margin: "-0.1em -0.04em -0.16em",
      }}
    >
      <span
        style={{
          ...base,
          ...glow,
          display: "inline-block",
          translate: `0 ${(1 - pIn) * 118 - pOut * 118}%`,
        }}
      >
        {w.t}
      </span>
    </span>
  );
};
