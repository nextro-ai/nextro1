import React from "react";
import { LOBSTER, OLD } from "./palette";

/**
 * The fictional bakery's OLD logo: an oval badge with a stitched border, clip-art wheat with
 * gradients, an over-used script with outline + drop shadow and a ribbon banner. Generic and
 * dated, not ridiculous. viewBox 600 x 440.
 *
 * `part(name)` lets the bloom pull it apart piece by piece (returns an SVG transform + opacity).
 */
export type OldPart = "shadow" | "badge" | "stitch" | "wheatL" | "wheatR" | "text" | "ribbon";

const Stalk: React.FC<{ id: string }> = ({ id }) => {
  // stalk drawn pointing up from (0,0); grains = ellipses with a gradient + outline
  const grains: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const y = -92 - i * 26;
    grains.push({ x: -13, y, r: -28 });
    grains.push({ x: 13, y, r: 28 });
  }
  grains.push({ x: 0, y: -200, r: 0 });
  return (
    <g>
      <path d="M0 0 C 2 -60, -2 -120, 0 -186" stroke={OLD.marron} strokeWidth={5} fill="none" strokeLinecap="round" />
      {grains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.x}
          cy={g.y}
          rx={10}
          ry={19}
          transform={`rotate(${g.r} ${g.x} ${g.y})`}
          fill={`url(#${id}-grain)`}
          stroke={OLD.marron}
          strokeWidth={2.2}
        />
      ))}
      {/* awns */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M${s * 6} -200 L ${s * 26} -252 M${s * 18} -150 L ${s * 46} -196`}
          stroke={OLD.marronClaro}
          strokeWidth={1.6}
          fill="none"
        />
      ))}
    </g>
  );
};

export const OldLogo: React.FC<{
  id: string;
  width: number;
  part?: (name: OldPart) => { transform?: string; opacity?: number };
  style?: React.CSSProperties;
}> = ({ id, width, part, style }) => {
  const p = (n: OldPart) => part?.(n) ?? {};
  return (
    <svg viewBox="0 0 600 440" width={width} height={(width * 440) / 600} style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id={`${id}-badge`} cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor={OLD.beige} />
          <stop offset="55%" stopColor={OLD.mostazaClara} />
          <stop offset="100%" stopColor={OLD.mostaza} />
        </radialGradient>
        <linearGradient id={`${id}-grain`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3dd94" />
          <stop offset="100%" stopColor={OLD.marronClaro} />
        </linearGradient>
        <linearGradient id={`${id}-text`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={OLD.marronClaro} />
          <stop offset="100%" stopColor="#4f321b" />
        </linearGradient>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5c36" />
          <stop offset="100%" stopColor="#5b3a21" />
        </linearGradient>
        <filter id={`${id}-ds`} x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="4" dy="5" stdDeviation="1.2" floodColor="#2a1a0c" floodOpacity="0.45" />
        </filter>
      </defs>

      <g {...p("shadow")}>
        <ellipse cx={308} cy={232} rx={282} ry={196} fill="#2a1a0c" opacity={0.28} />
      </g>
      <g {...p("badge")}>
        <ellipse cx={300} cy={222} rx={280} ry={194} fill={`url(#${id}-badge)`} stroke={OLD.marron} strokeWidth={10} />
      </g>
      <g {...p("stitch")}>
        <ellipse
          cx={300}
          cy={222}
          rx={258}
          ry={173}
          fill="none"
          stroke={OLD.marron}
          strokeWidth={2.5}
          strokeDasharray="9 7"
          opacity={0.75}
        />
      </g>
      <g {...p("wheatL")}>
        <g transform="translate(270 238) rotate(-17)">
          <Stalk id={id} />
        </g>
      </g>
      <g {...p("wheatR")}>
        <g transform="translate(330 238) rotate(17)">
          <Stalk id={id} />
        </g>
      </g>
      <g {...p("text")}>
        <text
          x={300}
          y={262}
          textAnchor="middle"
          fontFamily={LOBSTER}
          fontSize={112}
          fill={`url(#${id}-text)`}
          stroke={OLD.beige}
          strokeWidth={7}
          paintOrder="stroke"
          strokeLinejoin="round"
          filter={`url(#${id}-ds)`}
        >
          La Espiga
        </text>
      </g>
      <g {...p("ribbon")}>
        <g filter={`url(#${id}-ds)`}>
          <path d="M120 300 L 92 322 L 120 344 L 104 366 L 170 352 Z" fill="#4f321b" />
          <path d="M480 300 L 508 322 L 480 344 L 496 366 L 430 352 Z" fill="#4f321b" />
          <path d="M138 296 Q 300 330 462 296 L 462 342 Q 300 376 138 342 Z" fill={`url(#${id}-ribbon)`} />
        </g>
        <text
          x={300}
          y={342}
          textAnchor="middle"
          fontFamily="DejaVu Sans, Verdana, sans-serif"
          fontWeight={700}
          fontSize={25}
          letterSpacing={5}
          fill={OLD.beige}
        >
          PANADERÍA
        </text>
      </g>
    </svg>
  );
};
