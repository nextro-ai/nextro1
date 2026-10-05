import React from "react";
import { interpolate } from "remotion";
import { EASE } from "../../brand";
import { fraunces } from "./fonts";
import { ESPIGA } from "./palette";
import { clamp } from "./timing";

/**
 * NEW La Espiga identity. The symbol is a geometric wheat ear: 7 grains, each a lens built from
 * two circles of r = 58.4 (the construction the reel draws), on a single stem. Box 300 x 420.
 */
export const SYM_W = 300;
export const SYM_H = 420;

const L = 88; // grain length
const WD = 40; // grain width
const R = (Math.pow(L / 2, 2) + Math.pow(WD / 2, 2)) / WD; // 58.4
const OFF = R - WD / 2; // arc-centre offset 38.4
const ANG = 36;
const AXIS = 150;
const TIPS = [150, 214, 278];

type Grain = { cx: number; cy: number; a: number; tip: [number, number] };

export const GRAINS: Grain[] = (() => {
  const g: Grain[] = [];
  const s = Math.sin((ANG * Math.PI) / 180) * (L / 2);
  const c = Math.cos((ANG * Math.PI) / 180) * (L / 2);
  // bottom pair first (build order: bottom → top)
  for (let i = TIPS.length - 1; i >= 0; i--) {
    const y0 = TIPS[i];
    g.push({ cx: AXIS - s, cy: y0 - c, a: -ANG, tip: [AXIS, y0] });
    g.push({ cx: AXIS + s, cy: y0 - c, a: ANG, tip: [AXIS, y0] });
  }
  g.push({ cx: AXIS, cy: 64, a: 0, tip: [AXIS, 108] });
  return g;
})();

const lens = `M0 ${-L / 2} A ${R} ${R} 0 0 1 0 ${L / 2} A ${R} ${R} 0 0 1 0 ${-L / 2} Z`;

export const NewSymbol: React.FC<{
  size: number; // rendered height
  color?: string;
  stemColor?: string;
  /** per-grain reveal 0..1 (index in build order) */
  grain?: (i: number) => number;
  stem?: number; // 0..1 stem draw
  /** construction lines draw progress 0..1 and opacity */
  build?: number;
  buildOpacity?: number;
  /** light sweep position 0..1 (undefined = none) */
  sweep?: number;
  id: string;
  style?: React.CSSProperties;
}> = ({
  size,
  color = ESPIGA.horno,
  stemColor,
  grain = () => 1,
  stem = 1,
  build = 0,
  buildOpacity = 0,
  sweep,
  id,
  style,
}) => {
  const w = (size * SYM_W) / SYM_H;
  const construction = buildOpacity > 0.001;
  const dash = (p: number, delay = 0) => {
    const v = interpolate(build, [delay, Math.min(1, delay + 0.55)], [0, 1], clamp);
    return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - v * (p || 1) };
  };
  const sweepX = sweep === undefined ? -999 : interpolate(sweep, [0, 1], [-260, 560]);
  return (
    <svg viewBox={`0 0 ${SYM_W} ${SYM_H}`} width={w} height={size} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-sw`} gradientUnits="userSpaceOnUse" x1={sweepX - 70} y1={0} x2={sweepX + 70} y2={120}>
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.62} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {construction ? (
        <g opacity={buildOpacity} fill="none" strokeLinecap="round">
          {/* enclosing circle + axis + tip guides */}
          <circle cx={AXIS} cy={214} r={212} stroke={ESPIGA.carbon} strokeOpacity={0.28} strokeWidth={1.4} {...dash(1, 0)} />
          <path d={`M${AXIS} -40 L ${AXIS} 460`} stroke={ESPIGA.carbon} strokeOpacity={0.3} strokeWidth={1.4} {...dash(1, 0.05)} />
          {TIPS.map((y, i) => (
            <path
              key={`h${i}`}
              d={`M-60 ${y} L 360 ${y}`}
              stroke={ESPIGA.carbon}
              strokeOpacity={0.2}
              strokeWidth={1.2}
              {...dash(1, 0.1 + i * 0.05)}
            />
          ))}
          {TIPS.map((y, i) => {
            const dx = Math.tan((ANG * Math.PI) / 180) * 170;
            return (
              <path
                key={`d${i}`}
                d={`M${AXIS - dx} ${y - 170} L ${AXIS} ${y} L ${AXIS + dx} ${y - 170}`}
                stroke={ESPIGA.horno}
                strokeOpacity={0.45}
                strokeWidth={1.2}
                {...dash(1, 0.18 + i * 0.05)}
              />
            );
          })}
          {/* the two circles that build every grain */}
          {GRAINS.map((g, i) => (
            <g key={`c${i}`} transform={`translate(${g.cx} ${g.cy}) rotate(${g.a})`}>
              <circle cx={-OFF} cy={0} r={R} stroke={ESPIGA.horno} strokeOpacity={0.55} strokeWidth={1.3} {...dash(1, 0.22 + i * 0.045)} />
              <circle cx={OFF} cy={0} r={R} stroke={ESPIGA.horno} strokeOpacity={0.55} strokeWidth={1.3} {...dash(1, 0.25 + i * 0.045)} />
            </g>
          ))}
          {/* vector nodes on every tip */}
          {GRAINS.map((g, i) => {
            const t = interpolate(build, [0.5 + i * 0.04, 0.62 + i * 0.04], [0, 1], { ...clamp, easing: EASE.rebote });
            const rad = (g.a * Math.PI) / 180;
            const top: [number, number] = [g.cx + Math.sin(rad) * (L / 2), g.cy - Math.cos(rad) * (L / 2)];
            return (
              <g key={`n${i}`} opacity={t}>
                <rect x={top[0] - 5} y={top[1] - 5} width={10} height={10} fill={ESPIGA.crema} stroke={ESPIGA.carbon} strokeWidth={1.4} />
                <circle cx={g.tip[0]} cy={g.tip[1]} r={4.5} fill={ESPIGA.crema} stroke={ESPIGA.carbon} strokeWidth={1.4} />
              </g>
            );
          })}
        </g>
      ) : null}
      {/* stem */}
      <path
        d={`M${AXIS} 112 L ${AXIS} 396`}
        stroke={stemColor ?? color}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - stem}
      />
      {GRAINS.map((g, i) => {
        const v = grain(i);
        if (v <= 0) return null;
        return (
          <g key={`g${i}`} transform={`translate(${g.cx} ${g.cy}) rotate(${g.a}) scale(${0.35 + 0.65 * v})`} opacity={Math.min(1, v * 1.6)}>
            <path d={lens} fill={color} />
          </g>
        );
      })}
      {sweep !== undefined ? (
        <>
          <clipPath id={`${id}-clip`}>
            {GRAINS.map((g, i) => (
              <path key={i} d={lens} transform={`translate(${g.cx} ${g.cy}) rotate(${g.a})`} />
            ))}
            <rect x={AXIS - 4.5} y={112} width={9} height={284} />
          </clipPath>
          <rect x={-60} y={-60} width={420} height={540} fill={`url(#${id}-sw)`} clipPath={`url(#${id}-clip)`} />
        </>
      ) : null}
    </svg>
  );
};

/** Wordmark "La Espiga" + descriptor, HTML so Fraunces' variable axes render crisply. */
export const Wordmark: React.FC<{
  size: number;
  color?: string;
  accent?: string;
  descriptor?: boolean;
  descriptorOpacity?: number;
  descriptorSpacing?: number;
  sweep?: number;
  style?: React.CSSProperties;
}> = ({
  size,
  color = ESPIGA.carbon,
  accent = ESPIGA.horno,
  descriptor = true,
  descriptorOpacity = 1,
  descriptorSpacing = 0.34,
  sweep,
  style,
}) => {
  const base: React.CSSProperties = { ...fraunces(size, color, 560, 100, 144), whiteSpace: "nowrap" };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      <div style={{ position: "relative" }}>
        <div style={base}>La Espiga</div>
        {sweep !== undefined ? (
          <div
            style={{
              ...base,
              position: "absolute",
              inset: 0,
              color: "transparent",
              backgroundImage: `linear-gradient(105deg, transparent ${sweep * 160 - 40}%, rgba(255,255,255,0.75) ${sweep * 160 - 25}%, transparent ${sweep * 160 - 10}%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            La Espiga
          </div>
        ) : null}
      </div>
      {descriptor ? (
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontStretch: "125%",
            fontSize: Math.max(18, size * 0.2),
            letterSpacing: `${descriptorSpacing}em`,
            marginRight: `-${descriptorSpacing}em`,
            color: accent,
            marginTop: size * 0.2,
            opacity: descriptorOpacity,
          }}
        >
          PANADERÍA
        </div>
      ) : null}
    </div>
  );
};
