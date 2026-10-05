import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { rnd } from "./timing";

/** Film grain (SVG turbulence, reseeded every 2 frames). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="1080" height="1920">
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.12 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(120% 80% at 50% 45%, rgba(19,24,43,0) 55%, rgba(19,24,43,${strength}) 100%)`,
    }}
  />
);

/**
 * VHS / glitch wrapper. `split` = RGB channel offset in px, `bands` = horizontal band
 * displacement in px (0 disables). Implemented as one SVG filter so it costs nothing when off.
 */
export const Glitch: React.FC<{ split: number; bands: number; seed: number; children: React.ReactNode }> = ({
  split,
  bands,
  seed,
  children,
}) => {
  if (split < 0.5 && bands < 0.5) return <AbsoluteFill>{children}</AbsoluteFill>;
  const id = `glitch-${seed}`;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-5%" y="0" width="110%" height="100%" colorInterpolationFilters="sRGB">
          {bands > 0.5 ? (
            <>
              <feTurbulence type="fractalNoise" baseFrequency={`0.0001 ${0.012 + rnd(seed) * 0.02}`} numOctaves={1} seed={seed} result="noise" />
              <feComponentTransfer in="noise" result="steps">
                <feFuncR type="discrete" tableValues="0.5 0.5 0.2 0.5 0.85 0.5 0.5 0.35 0.5 0.7" />
                <feFuncG type="discrete" tableValues="0.5" />
              </feComponentTransfer>
              <feDisplacementMap in="SourceGraphic" in2="steps" scale={bands} xChannelSelector="R" yChannelSelector="G" result="disp0" />
              {/* rows pushed off the edge leave holes: back-fill them with the undisplaced picture */}
              <feMerge result="disp">
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="disp0" />
              </feMerge>
            </>
          ) : (
            <feOffset in="SourceGraphic" dx="0" dy="0" result="disp" />
          )}
          <feColorMatrix in="disp" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx={split} dy="0" result="r1" />
          {/* edge clamp: where the shifted channel leaves the frame edge empty, keep the unshifted
              channel so the split never paints coloured bars along the left/right edges */}
          <feMerge result="r2">
            <feMergeNode in="r" />
            <feMergeNode in="r1" />
          </feMerge>
          <feColorMatrix in="disp" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="disp" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx={-split} dy="0" result="b1" />
          <feMerge result="b2">
            <feMergeNode in="b" />
            <feMergeNode in="b1" />
          </feMerge>
          <feBlend in="r2" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="b2" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scanlines + rolling tracking band + rewind OSD for the VHS moment. */
export const VhsOverlay: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const t = f - from;
  const bandY = ((t * 61) % 2300) - 200;
  const blink = Math.floor(t / 8) % 2 === 0;
  const secs = Math.max(0, 9 - Math.floor(t / 5));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
          opacity: 0.55,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bandY,
          height: 70,
          background: "linear-gradient(180deg, rgba(243,244,239,0) 0%, rgba(243,244,239,0.16) 45%, rgba(243,244,239,0.05) 60%, rgba(243,244,239,0) 100%)",
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 196,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: FONT,
          fontWeight: 700,
          fontStretch: "110%",
          fontSize: 40,
          letterSpacing: "0.06em",
          color: C.papel,
          opacity: 0.9,
          textShadow: "3px 0 rgba(255,60,60,0.55), -3px 0 rgba(60,200,255,0.55)",
        }}
      >
        <svg width="62" height="34" viewBox="0 0 62 34" style={{ opacity: blink ? 1 : 0.35 }}>
          <path d="M30 2 L2 17 L30 32 Z M60 2 L32 17 L60 32 Z" fill={C.papel} />
        </svg>
        <span style={{ opacity: 0.8, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>00:0{secs}</span>
      </div>
    </AbsoluteFill>
  );
};

/** Vertical motion-blur filter definition (directional, SVG). */
export const VBlurDef: React.FC<{ id: string; amount: number }> = ({ id, amount }) => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id={id} x="0" y="-10%" width="100%" height="120%">
      <feGaussianBlur stdDeviation={`0 ${amount}`} />
    </filter>
  </svg>
);
