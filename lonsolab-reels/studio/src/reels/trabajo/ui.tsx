import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { evolvePath, getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import { C, EASE, FONT } from "../../brand";
import { B } from "./timing";

export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 between two frames. */
export const p01 = (f: number, a: number, dur: number, easing: (t: number) => number = EASE.salida) =>
  interpolate(f, [a, a + dur], [0, 1], { ...CL, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Groove "bop": scale 1 → peak → 1 on every beat between beat indexes [from, to).
 * Fast 2-frame attack, ease-out release. Downbeats (every 4th) hit a little harder.
 */
export const beatBop = (f: number, from: number, to: number, peak = 1.03, dur = 9) => {
  let s = 1;
  for (let n = from; n < to; n++) {
    const at = B(n);
    if (f < at || f > at + dur) continue;
    const pk = n % 4 === 0 ? peak + (peak - 1) * 0.5 : peak;
    s = interpolate(f, [at, at + 2, at + dur], [1, pk, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  }
  return s;
};

/** Alternating swing (degrees) that springs on every beat: L, R, L, R… */
export const beatSwing = (f: number, from: number, to: number, amp = 1.2) => {
  let r = 0;
  for (let n = from; n < to; n++) {
    const at = B(n);
    if (f < at) break;
    const target = n % 2 === 0 ? -amp : amp;
    const prev = n % 2 === 0 ? amp : -amp;
    const k = interpolate(f, [at, at + 10], [0, 1], { ...CL, easing: EASE.rebote });
    r = n === from ? target * k : lerp(prev, target, k);
  }
  return r;
};

/** Mask reveal: the line slides up from behind an invisible edge. */
export const Line: React.FC<{
  at: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  out?: number; // optional frame to slide out upward
}> = ({ at, dur = 13, children, style, out }) => {
  const f = useCurrentFrame();
  const p = p01(f, at, dur);
  const o = out === undefined ? 0 : p01(f, out, 10, EASE.in);
  return (
    <div style={{ overflow: "hidden", padding: "0.14em 0.06em 0.1em", margin: "-0.14em -0.06em -0.1em" }}>
      <div style={{ translate: `0 ${(1 - p) * 112 - o * 112}%`, rotate: `${(1 - p) * 3}deg`, transformOrigin: "left top", ...style }}>
        {children}
      </div>
    </div>
  );
};

/** File-style case label: "CASO.001 // REELS" (Archivo 700 condensed, tracking 0.2em). */
export const CaseLabel: React.FC<{
  n: number;
  cat: string;
  at: number;
  color: string;
  accent: string;
  dim: string;
}> = ({ n, cat, at, color, accent, dim }) => {
  const f = useCurrentFrame();
  const p = p01(f, at, 12);
  const line = p01(f, at + 2, 16);
  const style: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontStretch: "75%",
    fontSize: 44,
    lineHeight: 1,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 54 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, clipPath: `inset(-10px ${(1 - p) * 100}% -10px 0)` }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: accent }} />
          <span style={{ ...style, color }}>
            CASO.{String(n).padStart(3, "0")}
            <span style={{ color: dim }}> // </span>
            {cat}
          </span>
        </div>
        <div style={{ display: "flex", gap: 9, opacity: p }}>
          {[1, 2, 3, 4, 5].map((k) => (
            <div
              key={k}
              style={{
                width: k === n ? 30 : 12,
                height: 12,
                borderRadius: 6,
                background: k === n ? accent : dim,
                opacity: k === n ? 1 : k < n ? 0.75 : 0.35,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 26,
          height: 2,
          background: dim,
          opacity: 0.55,
          transformOrigin: "left center",
          scale: `${line} 1`,
        }}
      />
    </div>
  );
};

/**
 * Card title: short mask reveal (9 f, lines 2 f apart) that runs while the card rises, so the title is complete
 * the moment the card lands on its beat (pass at = land - RISE_LEAD).
 */
export const Title: React.FC<{
  lines: React.ReactNode[];
  at: number;
  color: string;
  size?: number;
  stretch?: number;
  top?: number;
}> = ({ lines, at, color, size = 100, stretch = 112, top = 150 }) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top,
      fontFamily: FONT,
      fontWeight: 800,
      fontStretch: `${stretch}%`,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: "-0.03em",
      color,
    }}
  >
    {lines.map((l, i) => (
      <Line key={i} at={at + i * 2} dur={9}>
        {l}
      </Line>
    ))}
  </div>
);

/** Hand-drawn stroke that draws itself, with optional arrow head at the end. */
export const HandStroke: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color: string;
  width: number;
  head?: number; // arrow head length in px
  style?: React.CSSProperties;
  viewBox?: string;
}> = ({ d, at, dur = 14, color, width, head = 0, style, viewBox = "0 0 1080 1920" }) => {
  const f = useCurrentFrame();
  const p = p01(f, at, dur, Easing.bezier(0.45, 0, 0.2, 1));
  const ev = evolvePath(p, d);
  let headPath = "";
  const hp = p01(f, at + dur - 3, 6, EASE.rebote);
  const L = head > 0 && hp > 0 ? getLength(d) : 0;
  const tip = L > 0 ? getPointAtLength(d, L) : null;
  const tg = L > 0 ? getTangentAtLength(d, L) : null;
  if (tip && tg) {
    const ang = Math.atan2(tg.y, tg.x);
    const h = head * hp;
    const a1 = ang + Math.PI * 0.8;
    const a2 = ang - Math.PI * 0.8;
    headPath = `M ${tip.x + Math.cos(a1) * h} ${tip.y + Math.sin(a1) * h} L ${tip.x} ${tip.y} L ${tip.x + Math.cos(a2) * h} ${tip.y + Math.sin(a2) * h}`;
  }
  return (
    <svg viewBox={viewBox} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", ...style }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={ev.strokeDasharray}
        strokeDashoffset={ev.strokeDashoffset}
      />
      {headPath && (
        <path d={headPath} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
};

/** Film grain overlay (deterministic: seed changes every 2 frames). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 97;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width={1080} height={1920}>
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Soft vignette to add depth to flat backgrounds. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.35, color = "19,24,43" }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 85% 70% at 50% 45%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

/** 5 stars, the last one partially filled (rating out of 5). */
export const Stars: React.FC<{ rating: number; size: number; at: number; color?: string; empty?: string }> = ({
  rating,
  size,
  at,
  color = C.estrella,
  empty = "rgba(19,24,43,0.15)",
}) => {
  const f = useCurrentFrame();
  const d = "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z";
  return (
    <div style={{ display: "flex", gap: size * 0.12 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const s = interpolate(f, [at + i * 2, at + i * 2 + 8], [0, 1], { ...CL, easing: EASE.rebote });
        return (
          <svg key={i} viewBox="2.5 2.5 19 18" width={size} height={size} style={{ scale: `${s}` }}>
            <defs>
              <clipPath id={`st-${i}-${size}`}>
                <rect x="0" y="0" width={2.5 + 19 * fill} height="24" />
              </clipPath>
            </defs>
            <path d={d} fill={empty} />
            <path d={d} fill={color} clipPath={`url(#st-${i}-${size})`} />
          </svg>
        );
      })}
    </div>
  );
};
