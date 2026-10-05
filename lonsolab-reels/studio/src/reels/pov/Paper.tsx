import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../../brand";

/**
 * Editorial page: papel background, very subtle ruled lines (linea), 12-column ruler ticks and
 * registration marks in the image-only margins, static paper-fibre grain (~4 %) and a soft vignette.
 * Everything here is decoration: no text.
 */
export const Paper: React.FC<{
  id: string;
  dark?: boolean;
  children?: React.ReactNode;
}> = ({ id, dark = false, children }) => {
  return (
    <AbsoluteFill
      style={{ background: dark ? C.cobalto : C.papel, overflow: "hidden" }}
    >
      <RuledLines color={dark ? "rgba(243,244,239,0.22)" : C.linea} />
      <GridChrome color={dark ? C.papel : C.tinta} />
      {children}
      <PaperGrain id={id} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(19,24,43,0) 60%, rgba(19,24,43,0.07) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Notebook-like baseline rules every 64 px (8 px grid × 8), barely there. */
const RuledLines: React.FC<{ color: string }> = ({ color }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      {Array.from({ length: 30 }, (_, i) => (
        <line
          key={i}
          x1={0}
          x2={1080}
          y1={32 + i * 64}
          y2={32 + i * 64}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.42}
        />
      ))}
      {/* margin rule, like a printed page */}
      <line
        x1={60}
        x2={60}
        y1={0}
        y2={1920}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.5}
      />
    </svg>
  </AbsoluteFill>
);

/** 12-col ruler ticks (margins 90, gutter 20) at the top/bottom bleed and crop/registration marks. */
const GridChrome: React.FC<{ color: string }> = ({ color }) => {
  const col = (900 - 11 * 20) / 12;
  const xs: number[] = [];
  for (let i = 0; i < 12; i++) {
    const x0 = 90 + i * (col + 20);
    xs.push(x0, x0 + col);
  }
  const reg = (cx: number, cy: number) => (
    <g
      key={`${cx}-${cy}`}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      opacity={0.32}
    >
      <circle cx={cx} cy={cy} r={11} />
      <line x1={cx - 20} x2={cx + 20} y1={cy} y2={cy} />
      <line x1={cx} x2={cx} y1={cy - 20} y2={cy + 20} />
    </g>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {xs.map((x, i) => (
          <g key={i} stroke={color} strokeWidth={1.5} opacity={0.22}>
            <line x1={x} x2={x} y1={226} y2={i % 2 === 0 ? 246 : 240} />
            <line x1={x} x2={x} y1={1694} y2={i % 2 === 0 ? 1674 : 1680} />
          </g>
        ))}
        <line
          x1={90}
          x2={990}
          y1={226}
          y2={226}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.22}
        />
        <line
          x1={90}
          x2={990}
          y1={1694}
          y2={1694}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.22}
        />
        {reg(42, 226)}
        {reg(1038, 226)}
        {reg(42, 1694)}
        {reg(1038, 1694)}
      </svg>
    </AbsoluteFill>
  );
};

/** Static paper fibre grain, multiplied (~4 %). */
const PaperGrain: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill
    style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.55 }}
  >
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed={7}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.08  0 0 0 0 0.09  0 0 0 0 0.17  3.2 0 0 0 -1.35"
        />
      </filter>
      <rect
        width={1080}
        height={1920}
        filter={`url(#grain-${id})`}
        opacity={0.14}
      />
    </svg>
  </AbsoluteFill>
);
