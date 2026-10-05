import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FrozenDisc } from "./Night";
import { OldPart } from "./OldLogo";
import { ICE } from "./palette";
import { SHARDS, SHATTER_CENTER } from "./shatter";
import { clamp, T } from "./timing";

const C0 = SHATTER_CENTER;
const DUR = 30;

/**
 * BLOOM (f469): the frozen night breaks along the crack network and the pieces fly out
 * (inner ones toward the camera, outer ones off-frame), revealing the warm world underneath.
 */
export const Shards: React.FC = () => {
  const frame = useCurrentFrame();
  // n = 1 on the bloom frame itself, so the break is already visible on the music's transient
  const n = frame - T.bloom + 1;
  if (frame < T.bloom || n > DUR + 6) return null;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="sh-night" gradientUnits="userSpaceOnUse" cx={540} cy={820} r={1250}>
          <stop offset="0" stopColor={ICE.noche2} />
          <stop offset="1" stopColor={ICE.noche} />
        </radialGradient>
        <linearGradient id="sh-spec" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity={0.5} />
        </linearGradient>
        <pattern id="sh-frost" patternUnits="userSpaceOnUse" width={1080} height={1920}>
          <image href={staticFile("rebrand/frost_edges.png")} width={1080} height={1920} />
        </pattern>
      </defs>
      {SHARDS.map((s, i) => {
        const delay = s.ring * 0.5;
        const k = interpolate(n, [delay, delay + DUR], [0, 1], clamp);
        const e = Easing.out(Easing.quad)(k);
        const dx = s.c[0] - C0.x;
        const dy = s.c[1] - C0.y;
        const len = Math.hypot(dx, dy) || 1;
        const v = 320 + 620 * s.seed + 110 * s.ring;
        const toCam = s.ring <= 2;
        const sc = toCam ? 1 + e * (1.4 + s.seed) : 1 + e * (s.seed - 0.5) * 0.4;
        const tx = (dx / len) * v * e * (toCam ? 2.4 : 1);
        const ty = (dy / len) * v * e * (toCam ? 2.4 : 1) + 300 * k * k;
        const rot = (s.seed - 0.5) * 140 * e;
        const op = interpolate(k, [0.45, 0.95], [1, 0], clamp);
        const edge = interpolate(n, [1, 10], [1, 0], clamp);
        const pts = s.pts.map((p) => p.join(",")).join(" ");
        return (
          <g
            key={i}
            opacity={op}
            transform={`translate(${tx} ${ty}) translate(${s.c[0]} ${s.c[1]}) rotate(${rot}) scale(${sc}) translate(${-s.c[0]} ${-s.c[1]})`}
          >
            <polygon points={pts} fill="url(#sh-night)" fillOpacity={0.94} />
            <polygon points={pts} fill="url(#sh-frost)" opacity={0.75} />
            <polygon points={pts} fill="url(#sh-spec)" opacity={0.1 + 0.3 * s.seed * e + 0.08} />
            <polygon points={pts} fill="none" stroke="#fff6e6" strokeOpacity={0.55 + 0.45 * edge} strokeWidth={2.4} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

/** Old logo pieces flying apart (driven through OldLogo's `part` hook). */
const PIECES: Record<OldPart, { x: number; y: number; r: number; s: number }> = {
  shadow: { x: 0, y: 40, r: 0, s: 1.4 },
  badge: { x: 0, y: 0, r: 0, s: 1.25 },
  stitch: { x: 0, y: 0, r: 0, s: 1.4 },
  wheatL: { x: -900, y: -760, r: -140, s: 1.5 },
  wheatR: { x: 920, y: -700, r: 150, s: 1.5 },
  text: { x: -260, y: 980, r: 30, s: 1.4 },
  ribbon: { x: 640, y: 1000, r: -50, s: 1.3 },
};

export const OldLogoBreak: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.crack || frame > T.bloom + 24) return null;
  const n = frame - T.bloom + 1;
  const k = interpolate(n, [0, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const part = (name: OldPart) => {
    if (frame < T.bloom) return {};
    const p = PIECES[name];
    const flat = name === "badge" || name === "stitch" || name === "shadow";
    const fade = flat ? interpolate(n, [0, 4], [1, 0], clamp) : interpolate(n, [4, 13], [1, 0], clamp);
    // pivot around the logo centre (300, 220 in the logo's viewBox)
    return {
      transform: `translate(${p.x * k} ${p.y * k}) translate(300 220) rotate(${p.r * k}) scale(${1 + (p.s - 1) * k}) translate(-300 -220)`,
      opacity: fade,
    };
  };
  return (
    <div style={{ position: "absolute", inset: 0, filter: frame >= T.bloom ? `blur(${Math.min(5, n * 0.6)}px)` : undefined }}>
      <FrozenDisc part={part} broken={frame >= T.bloom ? 1 : 0} />
    </div>
  );
};

/**
 * One warm flash at the bloom (single flash, well under 3/s): additive light, not a fog.
 * Peaks ON f469 and decays over ~10 f. Screen-blended over the shards (they stay readable, just lit)
 * and drawn under the old-logo pieces, which stay crisp on top.
 */
const flashLevel = (frame: number) => {
  const n = frame - T.bloom; // 0 on f469
  return interpolate(n, [-1, 0, 10], [0, 1, 0], { ...clamp, easing: Easing.out(Easing.quad) });
};

export const BloomFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = flashLevel(frame);
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        pointerEvents: "none",
        background: `radial-gradient(circle at ${C0.x}px ${C0.y}px, rgba(255,241,201,${0.97 * o}) 0%, rgba(255,232,170,${0.9 * o}) 16%, rgba(250,190,70,${0.65 * o}) 36%, rgba(242,165,22,${0.3 * o}) 62%, rgba(242,165,22,${0.08 * o}) 85%, rgba(242,165,22,0) 100%)`,
      }}
    />
  );
};

/** The same burst seen THROUGH the gaps between the flying shards (hot core on the warm board). */
export const BloomUnderFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = flashLevel(frame);
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(circle at ${C0.x}px ${C0.y}px, rgba(255,247,226,${o}) 0%, rgba(255,232,170,${o}) 22%, rgba(246,190,80,${0.85 * o}) 48%, rgba(242,165,22,${0.35 * o}) 75%, rgba(242,165,22,0) 100%)`,
      }}
    />
  );
};
