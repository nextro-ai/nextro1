import React from "react";
import { AbsoluteFill, random } from "remotion";
import { OldLogo } from "./OldLogo";

/**
 * The old shop sign on a cold, painted-plank wall: faded panel, worn wooden frame, rusty screws,
 * a snow cap on top and icicles hanging underneath. A full 1080x1920 "world"; the logo centre sits
 * at (540, 1010) so the hook's glass disc and the profile avatar can zoom into the same point.
 */
export const LOGO_C = { x: 540, y: 1010 };
export const SIGN = { x: 110, y: 742, w: 860, h: 536 };
const EXT = 1380;

const ICICLES = new Array(19).fill(0).map((_, i) => ({
  x: SIGN.x + 26 + i * 44 + (random(`ix${i}`) - 0.5) * 18,
  len: 24 + Math.pow(random(`il${i}`), 1.6) * 120,
  w: 10 + random(`iw${i}`) * 14,
}));

const Icicles: React.FC = () => (
  <svg width={1080} height={200} style={{ position: "absolute", left: 0, top: SIGN.y + SIGN.h - 6 }} viewBox="0 0 1080 200">
    <defs>
      <linearGradient id="ice-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6fbff" stopOpacity={0.95} />
        <stop offset="0.7" stopColor="#cfe0f0" stopOpacity={0.85} />
        <stop offset="1" stopColor="#a9c2da" stopOpacity={0.6} />
      </linearGradient>
    </defs>
    {ICICLES.map((c, i) => (
      <g key={i}>
        <path
          d={`M${c.x - c.w / 2} 0 Q ${c.x - c.w * 0.18} ${c.len * 0.55} ${c.x} ${c.len} Q ${c.x + c.w * 0.22} ${c.len * 0.5} ${c.x + c.w / 2} 0 Z`}
          fill="url(#ice-g)"
          stroke="#ffffff"
          strokeOpacity={0.7}
          strokeWidth={1}
        />
        <path d={`M${c.x - c.w * 0.12} 3 L ${c.x - 1} ${c.len * 0.7}`} stroke="#fff" strokeWidth={1.6} strokeOpacity={0.85} />
      </g>
    ))}
    {/* melt-water ridge along the bottom edge */}
    <rect x={SIGN.x - 4} y={0} width={SIGN.w + 8} height={8} rx={4} fill="#e9f2fb" opacity={0.9} />
  </svg>
);

const SnowCap: React.FC = () => {
  let d = `M${SIGN.x - 14} ${SIGN.y + 10}`;
  for (let i = 0; i <= 20; i++) {
    const x = SIGN.x - 14 + (i * (SIGN.w + 28)) / 20;
    const y = SIGN.y - 14 - random(`sc${i}`) * 16;
    d += ` Q ${x - 10} ${y - 8} ${x} ${y}`;
  }
  d += ` L ${SIGN.x + SIGN.w + 14} ${SIGN.y + 14} Z`;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <path d={d} fill="#f7fbff" stroke="#c4d3e2" strokeWidth={1.5} />
      <path d={d} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.8} transform="translate(0 2)" />
    </svg>
  );
};

const Screw: React.FC<{ x: number; y: number; i: number }> = ({ x, y, i }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x - 3,
        top: y + 6,
        width: 6 + (i % 2) * 3,
        height: 50 + i * 12,
        background: "linear-gradient(180deg, rgba(122,70,34,0.55), rgba(122,70,34,0))",
        borderRadius: 4,
        filter: "blur(1.2px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: x - 9,
        top: y - 9,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #c9c3b8, #6f665b 70%)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
      }}
    />
  </>
);

export const SignWorld: React.FC<{ logoWidth?: number }> = ({ logoWidth = 470 }) => {
  const lh = (logoWidth * 440) / 600;
  return (
    <AbsoluteFill>
      {/* painted planks, cold light. The wall bleeds EXT px past the frame on every side (same
          gradient geometry in px, plank phase kept: EXT = 15 x 92) so the camera can pull back
          through a circle without ever showing the world's rectangular edge. */}
      <div
        style={{
          position: "absolute",
          inset: -EXT,
          background: `radial-gradient(ellipse 864px 1056px at ${540 + EXT}px ${998 + EXT}px, #c9d3dd 0%, #aab7c5 70%, #95a4b4 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -EXT,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(40,55,75,0.0) 0px, rgba(40,55,75,0.0) 86px, rgba(40,55,75,0.16) 88px, rgba(255,255,255,0.18) 90px, rgba(40,55,75,0.0) 92px)",
        }}
      />
      {/* sign shadow */}
      <div
        style={{
          position: "absolute",
          left: SIGN.x + 10,
          top: SIGN.y + 26,
          width: SIGN.w,
          height: SIGN.h,
          borderRadius: 20,
          background: "rgba(30,40,58,0.45)",
          filter: "blur(22px)",
        }}
      />
      {/* frame */}
      <div
        style={{
          position: "absolute",
          left: SIGN.x,
          top: SIGN.y,
          width: SIGN.w,
          height: SIGN.h,
          borderRadius: 18,
          background: "linear-gradient(160deg, #6a5545, #4c3c30)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -3px 0 rgba(0,0,0,0.3)",
        }}
      />
      {/* faded panel */}
      <div
        style={{
          position: "absolute",
          left: SIGN.x + 20,
          top: SIGN.y + 20,
          width: SIGN.w - 40,
          height: SIGN.h - 40,
          borderRadius: 8,
          background: "linear-gradient(175deg, #ece4cc 0%, #dcd2b4 100%)",
          overflow: "hidden",
        }}
      >
        {/* sun-bleach + water stains + scratches */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 22% 18%, rgba(255,255,255,0.45), transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 30% 22% at 82% 84%, rgba(120,95,60,0.22), transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 18% 30% at 8% 70%, rgba(120,95,60,0.18), transparent 70%)" }} />
        <svg width={SIGN.w - 40} height={SIGN.h - 40} style={{ position: "absolute", inset: 0 }}>
          {new Array(14).fill(0).map((_, i) => {
            const x = random(`scx${i}`) * (SIGN.w - 40);
            const y = random(`scy${i}`) * (SIGN.h - 40);
            const l = 30 + random(`scl${i}`) * 110;
            const a = -0.3 + random(`sca${i}`) * 0.6;
            return (
              <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.2} />
            );
          })}
        </svg>
      </div>
      {/* the old logo, faded by years of sun */}
      <div
        style={{
          position: "absolute",
          left: 540 - logoWidth / 2,
          top: LOGO_C.y - lh / 2,
          filter: "saturate(0.72) contrast(0.92) brightness(1.02)",
          opacity: 0.94,
        }}
      >
        <OldLogo id="sign" width={logoWidth} />
      </div>
      <Screw x={SIGN.x + 42} y={SIGN.y + 42} i={0} />
      <Screw x={SIGN.x + SIGN.w - 42} y={SIGN.y + 42} i={1} />
      <Screw x={SIGN.x + 42} y={SIGN.y + SIGN.h - 42} i={2} />
      <Screw x={SIGN.x + SIGN.w - 42} y={SIGN.y + SIGN.h - 42} i={3} />
      <SnowCap />
      <Icicles />
      {/* cold blue grade over everything */}
      <div style={{ position: "absolute", inset: -EXT, background: "rgba(150,178,210,0.18)", mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};
