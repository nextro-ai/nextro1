import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { EASE } from "../../brand";
import { ESPIGA } from "./palette";
import { clamp, T } from "./timing";

/** Deterministic snowfall. Depth = size: near flakes are bigger, faster and out of focus. */
const FLAKES = new Array(84).fill(0).map((_, i) => {
  const z = random(`z${i}`); // 0 far … 1 near
  return {
    x: random(`x${i}`) * 1080,
    y: random(`y${i}`) * 2200,
    z,
    size: 3 + z * z * 16,
    vy: 26 + z * 70 + random(`v${i}`) * 14,
    sway: 8 + random(`s${i}`) * 26,
    freq: 0.15 + random(`f${i}`) * 0.35,
    ph: random(`p${i}`) * Math.PI * 2,
    crystal: z > 0.55 && random(`c${i}`) > 0.55,
  };
});

const Crystal: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="-10 -10 20 20" width={size} height={size} style={{ display: "block" }}>
    <g stroke={color} strokeWidth={1.1} strokeLinecap="round" fill="none">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -9 L0 9 M0 -6 L-2.4 -8 M0 -6 L2.4 -8 M0 6 L-2.4 8 M0 6 L2.4 8" />
        </g>
      ))}
    </g>
  </svg>
);

export const Snow: React.FC<{ opacity: number; dark: number }> = ({ opacity, dark }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.001) return null;
  const t = frame / 30;
  // a gust on the hook's first full chord (f78): flakes rush ~1 s ahead and drift sideways
  const gust = interpolate(frame, [T.hookHit - 2, T.hookHit + 34], [0, 1], { ...clamp, easing: EASE.salida });
  const gustBump = interpolate(frame, [T.hookHit - 2, T.hookHit + 10, T.hookHit + 40], [0, 1, 0], clamp);
  const tw = t + gust * 1.1;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {FLAKES.map((f, i) => {
        const y = ((f.y + f.vy * tw) % 2200) - 140;
        const x = f.x + Math.sin(t * f.freq * 2 * Math.PI + f.ph) * f.sway + gust * 70 * (0.4 + f.z) + gustBump * 20;
        const blur = f.z > 0.7 ? (f.z - 0.7) * 14 : 0;
        // on the light ice background flakes need a soft cool edge to read
        const shadow = dark > 0.5 ? "none" : `0 0 ${2 + f.size * 0.3}px rgba(70,92,122,${0.55 * (1 - dark)})`;
        const a = 0.45 + f.z * 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: f.size,
              height: f.size,
              opacity: a,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              rotate: `${t * 20 * (f.ph - 3)}deg`,
            }}
          >
            {f.crystal ? (
              <div style={{ filter: dark > 0.5 ? undefined : `drop-shadow(${shadow.replace("0 0", "0 0")})` }}>
                <Crystal size={f.size * 1.6} color="#ffffff" />
              </div>
            ) : (
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fbfdff", boxShadow: shadow }} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Warm motes (flour / light dust) rising after the bloom, plus an outward burst at the bloom. */
const MOTES = new Array(46).fill(0).map((_, i) => {
  const z = random(`mz${i}`);
  return {
    x: random(`mx${i}`) * 1080,
    y: random(`my${i}`) * 2100,
    z,
    size: 4 + z * z * 22,
    vy: 10 + z * 34,
    sway: 10 + random(`ms${i}`) * 30,
    freq: 0.1 + random(`mf${i}`) * 0.25,
    ph: random(`mp${i}`) * Math.PI * 2,
  };
});

export const Motes: React.FC<{ opacity: number; color?: string }> = ({ opacity, color = "#f4cf7a" }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.001) return null;
  const t = (frame - T.bloom) / 30;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", mixBlendMode: "multiply" }}>
      {MOTES.map((m, i) => {
        const y = ((((m.y - m.vy * t) % 2100) + 2100) % 2100) - 100;
        const x = m.x + Math.sin(t * m.freq * 2 * Math.PI + m.ph) * m.sway;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, ${color}00 70%)`,
              opacity: 0.35 + m.z * 0.45,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Sparks thrown out radially at the bloom (decelerating, fading). */
const SPARKS = new Array(54).fill(0).map((_, i) => ({
  a: random(`sa${i}`) * Math.PI * 2,
  v: 500 + random(`sv${i}`) * 1300,
  size: 3 + random(`ss${i}`) * 9,
  life: 18 + random(`sl${i}`) * 26,
}));

export const BloomSparks: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();
  const n = frame - T.bloom;
  if (n < 0 || n > 50) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {SPARKS.map((s, i) => {
        const k = Math.min(1, n / s.life);
        if (k >= 1) return null;
        const d = s.v * (1 - Math.pow(1 - k, 3)) * 0.55;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(s.a) * d - s.size / 2,
              top: cy + Math.sin(s.a) * d - s.size / 2,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: i % 3 === 0 ? ESPIGA.horno : "#ffd88a",
              opacity: (1 - k) * 0.9,
              boxShadow: `0 0 ${s.size * 2}px #ffb45a`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Frost ferns creeping in from the frame edges. `amount` 0 (clear) … 1 (deep frost). */
export const FrostEdges: React.FC<{ amount: number; opacity?: number; tint?: string }> = ({ amount, opacity = 1, tint }) => {
  if (amount <= 0.001 || opacity <= 0.001) return null;
  // the clear centre shrinks as the frost grows
  const inner = interpolate(amount, [0, 1], [118, 30], clamp);
  const mask = `radial-gradient(ellipse 62% 56% at 50% 50%, transparent ${inner}%, black ${inner + 34}%)`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, WebkitMaskImage: mask, maskImage: mask }}>
      <Img src={staticFile("rebrand/frost_edges.png")} style={{ width: 1080, height: 1920, filter: tint }} />
    </AbsoluteFill>
  );
};

/** Film grain: a tile shifted to a new random offset every 2 frames (deterministic). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 2);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: `url(${staticFile("rebrand/grain.png")})`,
        backgroundSize: "512px 512px",
        backgroundPosition: `${Math.floor(random(`gx${k}`) * 512)}px ${Math.floor(random(`gy${k}`) * 512)}px`,
        mixBlendMode: "overlay",
        opacity,
      }}
    />
  );
};
