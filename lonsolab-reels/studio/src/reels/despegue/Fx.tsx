import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { EASE } from "../../brand";
import { T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Cinema letterbox bars (y 0–220 and 1700–1920): slide in at the top of the reel, open up for the end card. */
export const Letterbox: React.FC<{ frame: number }> = ({ frame }) => {
  const inP = interpolate(frame, [0, 12], [0.45, 1], { ...clamp, easing: EASE.salida });
  const outP = interpolate(frame, [T.end - 2, T.end + 16], [1, 0], { ...clamp, easing: EASE.inOut });
  const h = 220 * inP * outP;
  const bar: React.CSSProperties = { position: "absolute", left: 0, right: 0, height: h, background: "#020309" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...bar, top: 0, boxShadow: "0 0 0 1px rgba(255,255,255,0.03)" }} />
      <div style={{ ...bar, bottom: 0 }} />
    </AbsoluteFill>
  );
};

/** Film grain (~4 %), re-seeded every frame (deterministic). */
export const Grain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.075 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920">
      <filter id="dsp-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={(frame % 61) + 1} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.9" intercept="-0.45" />
          <feFuncG type="linear" slope="1.9" intercept="-0.45" />
          <feFuncB type="linear" slope="1.9" intercept="-0.45" />
        </feComponentTransfer>
      </filter>
      <rect width="1080" height="1920" filter="url(#dsp-grain)" />
    </svg>
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 85% 62% at 50% 46%, rgba(3,4,10,0) 52%, rgba(3,4,10,${strength}) 100%)`,
    }}
  />
);

/** Ignition: the screen goes dark around the pin; 599–604 almost black. */
export const Darkness: React.FC<{ frame: number }> = ({ frame }) => {
  const o = interpolate(frame, [T.ign, T.ign + 40, T.dark - 6, T.dark, T.lift - 1, T.lift], [0.15, 0.4, 0.7, 0.93, 0.93, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: "#020308", opacity: o, pointerEvents: "none" }} />;
};

/** The single liftoff flash (one luminance peak, ≤ 3 flashes/s). */
export const Flash: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - T.lift;
  if (t < 0 || t > 9) return null;
  const o = interpolate(t, [0, 1, 4, 9], [0.88, 0.62, 0.22, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: o,
        background: "radial-gradient(circle at 50% 56%, #fffaf4 0%, #ffe6d6 38%, #ffb08a 100%)",
      }}
    />
  );
};

/** Anamorphic lens streak (horizontal, blue-white) — the trailer look on the brightest moments. */
export const Flare: React.FC<{ x: number; y: number; k: number; width?: number; warm?: boolean }> = ({ x, y, k, width = 1500, warm = false }) => {
  if (k <= 0.01) return null;
  const c = warm ? "255,200,170" : "170,190,255";
  const w = width * (0.55 + 0.45 * k);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 40, width: w, height: 80, pointerEvents: "none", mixBlendMode: "screen", opacity: k }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 40 - 14,
          height: 28,
          background: `linear-gradient(to right, rgba(${c},0) 0%, rgba(${c},0.18) 30%, rgba(${c},0.35) 50%, rgba(${c},0.18) 70%, rgba(${c},0) 100%)`,
          borderRadius: 14,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: 40 - 2,
          height: 4,
          background: `linear-gradient(to right, rgba(${c},0) 0%, rgba(${c},0.9) 45%, rgba(255,255,255,1) 50%, rgba(${c},0.9) 55%, rgba(${c},0) 100%)`,
        }}
      />
    </div>
  );
};
