import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { C } from "../../brand";
import { FLASHES, GLITCHES, SHAKES } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Sum of all decaying shake events at `frame` (noise-driven, deterministic). */
export const shakeAt = (frame: number) => {
  let x = 0;
  let y = 0;
  for (const s of SHAKES) {
    const n = frame - s.at;
    if (n < 0 || n > s.dur) continue;
    const k = Math.pow(1 - n / s.dur, 1.6);
    // horizontal kept at 0.55: the slams read as vertical impacts and words stay inside x 90–990
    x += noise2D("shx", s.at * 0.37, n * 0.95) * s.amp * k * 0.55;
    y += noise2D("shy", s.at * 0.53, n * 0.95) * s.amp * k * 0.75;
  }
  return { x, y };
};

/** Film grain (~4 %), re-seeded every frame. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <filter id="mf-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={(frame % 97) + 1} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.8" intercept="-0.4" />
            <feFuncG type="linear" slope="1.8" intercept="-0.4" />
            <feFuncB type="linear" slope="1.8" intercept="-0.4" />
          </feComponentTransfer>
        </filter>
        <rect width="1080" height="1920" filter="url(#mf-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Edge darkening for depth. */
export const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 95% 70% at 50% 42%, rgba(8,10,22,0) 55%, rgba(8,10,22,${strength}) 100%)`,
    }}
  />
);

/** 2-frame flash frames on the strongest words. */
export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const f = FLASHES.find((e) => frame >= e.at && frame < e.at + 3);
  if (!f) return null;
  const o = interpolate(frame - f.at, [0, 1, 3], [f.peak, f.peak * 0.45, 0], clamp);
  return <AbsoluteFill style={{ background: f.color === "pin" ? C.pin : C.papel, opacity: o, pointerEvents: "none" }} />;
};

export const glitchAt = (frame: number) => {
  const g = GLITCHES.find((e) => frame >= e.from && frame <= e.to);
  if (!g) return null;
  const i = frame - g.from;
  const env = [0.45, 0.8, 0.35, 1, 0.7, 1][i] ?? 0.8;
  return { k: env, seed: g.seed * 100 + i };
};

/**
 * RGB-split + horizontal slice displacement. Renders `children` several times,
 * so keep audio outside of it.
 */
export const Glitch: React.FC<{ k: number; seed: number; children: React.ReactNode }> = ({ k, seed, children }) => {
  const d = 6 + 16 * k;
  const bands = 9;
  // seeded band edges
  const edges: number[] = [0];
  for (let i = 1; i < bands; i++) edges.push(edges[i - 1] + 1 / bands + (random(`e${seed}-${i}`) - 0.5) * 0.08);
  edges.push(1);
  const id = `mf-rgb-${seed}`;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx={d} dy={0} result="ro" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx={-d} dy={0} result="bo" />
          <feBlend in="ro" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bo" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>
        <AbsoluteFill>{children}</AbsoluteFill>
        {edges.slice(0, -1).map((top, i) => {
          const r = random(`b${seed}-${i}`);
          if (r < 0.45) return null;
          const dx = (random(`x${seed}-${i}`) - 0.5) * 2 * (40 + 110 * k);
          const bottom = edges[i + 1];
          return (
            <AbsoluteFill
              key={i}
              style={{
                clipPath: `inset(${top * 100}% 0 ${(1 - bottom) * 100}% 0)`,
                translate: `${dx}px 0px`,
              }}
            >
              {children}
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      {/* scanlines */}
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)",
          opacity: 0.5 * k,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Music bed (copy of the kit's <Music>) with ducking windows in frames.
 * duck: [from, to, gain] – 2-frame attack, 8-frame release.
 */
export const MusicDuck: React.FC<{
  src: string;
  durationInFrames: number;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  ducks?: [number, number, number][];
}> = ({ src, durationInFrames, volume = 0.9, fadeIn = 2, fadeOut = 20, ducks = [] }) => (
  <Audio
    src={staticFile(src)}
    volume={(f) => {
      const a = Math.min(1, f / Math.max(1, fadeIn));
      const b = Math.min(1, (durationInFrames - f) / Math.max(1, fadeOut));
      let g = 1;
      for (const [from, to, gain] of ducks) {
        if (f < from - 2 || f > to + 8) continue;
        const ramp = interpolate(f, [from - 2, from, to, to + 8], [1, gain, gain, 1], clamp);
        g = Math.min(g, ramp);
      }
      return Math.max(0, Math.min(a, b)) * volume * g;
    }}
  />
);
