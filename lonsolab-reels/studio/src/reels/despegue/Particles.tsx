import React from "react";
import { AbsoluteFill, Easing, interpolate, random } from "remotion";
import { noise2D } from "@remotion/noise";
import { C } from "../../brand";
import { climbAt, IGN_RAMP } from "./camera";
import { pathX, pinAt, PinState } from "./Pin";
import { IGN_TICKS, pbt, T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------ ignition: particles gather into the pin */

// Starts get denser toward the silence (u^0.6), and from IGN_RAMP on the particles are bigger, faster and
// leave longer streaks: ~35 visible early, ~75 in the last second.
const N_CONV = 210;
const CONV = new Array(N_CONV).fill(0).map((_, i) => {
  const u = i / N_CONV;
  const start = T.ign + 2 + Math.round(Math.pow(u, 0.6) * 86);
  const late = interpolate(start, [IGN_RAMP - 6, T.dark - 10], [0, 1], clamp);
  return {
    start,
    late,
    life: Math.round((26 + random(`cl${i}`) * 16) * (1 - 0.38 * late)),
    a0: random(`ca${i}`) * Math.PI * 2,
    r0: (360 + random(`cr${i}`) * 520) * (1 + 0.3 * late),
    spin: (0.9 + random(`cs${i}`) * 0.9) * (random(`cd${i}`) > 0.5 ? 1 : -1),
    size: (3 + random(`cz${i}`) * 7) * (1 + 1.1 * late),
    col: random(`cc${i}`) < 0.6 ? "255,110,60" : random(`cc2${i}`) < 0.6 ? "243,244,239" : "242,165,22",
  };
});

export const Converge: React.FC<{ frame: number; pin: PinState }> = ({ frame, pin }) => {
  if (frame < T.ign || frame >= T.dark) return null;
  const cx = pin.x;
  const cy = pin.y - 118 * pin.scale;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {CONV.map((p, i) => {
        const t = (frame - p.start) / p.life;
        if (t < 0 || t > 1) return null;
        const e = Easing.in(Easing.cubic)(t);
        const r = p.r0 * (1 - e) + 10;
        const th = p.a0 + p.spin * t;
        const x = cx + Math.cos(th) * r;
        const y = cy + Math.sin(th) * r * 0.62;
        const a = interpolate(t, [0, 0.25, 0.85, 1], [0, 0.9, 1, 0], clamp);
        // streak along the motion direction
        const len = p.size * (1 + (6 + 9 * p.late) * e);
        const ang = (Math.atan2(cy - y, cx - x) * 180) / Math.PI;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - len / 2,
              top: y - p.size / 2,
              width: len,
              height: p.size,
              borderRadius: p.size,
              rotate: `${ang}deg`,
              background: `linear-gradient(to right, rgba(${p.col},0), rgba(${p.col},${a}))`,
              boxShadow: `0 0 ${p.size * 2}px rgba(${p.col},${a * 0.6})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ ignition: heat halo + a ring on every clock tick */

/** `back`: the halo behind the pin (grows with the ignition, flares on each tick). `front`: heat rings on the ticks. */
export const IgnitionPulse: React.FC<{ frame: number; pin: PinState; layer: "back" | "front" }> = ({ frame, pin, layer }) => {
  if (frame < T.ign || frame >= T.dark) return null;
  const cx = pin.x;
  const cy = pin.y - 122 * pin.scale;
  const g = interpolate(frame, [T.ign, T.dark - 1], [0, 1], clamp);
  let tickK = 0;
  IGN_TICKS.forEach((at, i) => {
    const t = frame - at;
    if (t >= 0 && t < 10) tickK = Math.max(tickK, (1 - t / 10) * (0.5 + i * 0.06));
  });
  if (layer === "back") {
    const R = 190 + 420 * g * g + 70 * tickK;
    return (
      <div
        style={{
          position: "absolute",
          left: cx - R,
          top: cy - R,
          width: R * 2,
          height: R * 2,
          borderRadius: "50%",
          mixBlendMode: "screen",
          opacity: Math.min(1, 0.16 + 0.5 * g * g + 0.4 * tickK),
          background: "radial-gradient(circle, rgba(255,150,100,0.55) 0%, rgba(255,90,38,0.22) 28%, rgba(255,90,38,0.06) 55%, rgba(255,90,38,0) 70%)",
        }}
      />
    );
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", mixBlendMode: "screen" }}>
      {IGN_TICKS.map((at, i) => {
        const t = frame - at;
        if (t < 0 || t > 16) return null;
        const k = Easing.out(Easing.cubic)(t / 16);
        const r = 70 + (150 + 34 * i) * k;
        return (
          <g key={at} opacity={(0.5 + 0.06 * i) * (1 - k)}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffb08a" strokeWidth={(5 + i * 0.7) * (1 - k) + 1} />
            <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={C.pin} strokeWidth={(3 + i * 0.4) * (1 - k) + 0.5} opacity={0.7} />
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------ liftoff: exhaust trail of sparks */

type Spark = { e: number; k: number; life: number; vx: number; vy: number; size: number; col: string };

const SPARKS: Spark[] = (() => {
  const out: Spark[] = [];
  for (let e = T.lift; e <= T.end + 6; e++) {
    const burst = e < T.lift + 6;
    const n = burst ? 14 : e < T.rise ? 3 : 1;
    for (let k = 0; k < n; k++) {
      const id = `${e}-${k}`;
      const ang = burst ? random(`ba${id}`) * Math.PI * 2 : Math.PI / 2 + (random(`ta${id}`) - 0.5) * 0.9;
      const sp = burst ? 6 + random(`bs${id}`) * 22 : 1 + random(`ts${id}`) * 4;
      const r = random(`tc${id}`);
      out.push({
        e,
        k,
        life: (burst ? 18 : 22) + Math.round(random(`tl${id}`) * 22),
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp * (burst ? 0.55 : 1),
        size: (burst ? 5 : 4) + random(`tz${id}`) * (burst ? 11 : 9),
        col: r < 0.55 ? "255,106,52" : r < 0.82 ? "255,214,170" : "243,244,239",
      });
    }
  }
  return out;
})();

export const Trail: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < T.lift) return null;
  const climbNow = climbAt(frame);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {SPARKS.map((p, i) => {
        const age = frame - p.e;
        if (age < 0 || age > p.life) return null;
        const src = pinAt(p.e);
        const t = age / p.life;
        const drag = 1 - Math.pow(1 - Math.min(1, age / 14), 2) * 0.5;
        const x = src.x + p.vx * age * drag + noise2D("tx", i * 0.13, age * 0.12) * 8;
        const y = src.y - 6 + (climbNow - climbAt(p.e)) + p.vy * age * drag;
        const a = Math.pow(1 - t, 1.4);
        const s = p.size * (1 - 0.6 * t);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - s,
              top: y - s,
              width: s * 2,
              height: s * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${p.col},${a}) 0%, rgba(${p.col},${a * 0.5}) 35%, rgba(${p.col},0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ the path: a plume + contour lines drawn by the climb */

/**
 * The wake from the pin's tip down to the launch pad (or the bottom of the frame): a soft tapered plume with a
 * white-hot core that thins out downward, plus 7 contour-like lines in pin / papel / cobalt.
 * `reach`: extra length below the frame (the 684 pull-back shows more of it).
 */
export const ContourTrail: React.FC<{ frame: number; pin: PinState; reach?: number }> = ({ frame, pin, reach = 0 }) => {
  if (frame < T.lift) return null;
  const tipY = pin.y;
  // altitude of the tip above the pad (px): the pin's own travel up the screen + the camera's climb
  const hNow = climbAt(frame) + (1160 - tipY);
  const fadeEnd = interpolate(frame, [T.rise, T.end + 12], [1, 0], clamp);
  const grow = interpolate(frame, [T.lift, T.lift + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const bottom = 2000 + reach;
  const len = Math.max(40, Math.min(bottom - tipY, hNow + 40));
  // centre line
  const centre: [number, number][] = [];
  for (let d = 4; d <= len; d += 14) {
    const h = hNow - d;
    centre.push([pin.x + (pathX(h) - pathX(hNow)) * Math.min(1, d / 140), tipY + d]);
  }
  if (centre.length < 2) return null;
  const lines = [-3, -2, -1, 0, 1, 2, 3];
  const colorOf = (k: number) => (k === 0 ? "#ffe3d3" : Math.abs(k) === 1 ? C.pin : Math.abs(k) === 2 ? "#ff8a5c" : "#8da0ff");
  const fadeLen = Math.min(1300, len);
  // tapered outline: narrow at the nozzle, wider and fainter downward
  const half = (d: number, w0: number, slope: number, max: number) => Math.min(max, w0 + d * slope) * grow;
  const shape = (w0: number, slope: number, max: number) => {
    const L = centre.map(([x, y]) => `${(x - half(y - tipY, w0, slope, max)).toFixed(1)},${y.toFixed(1)}`);
    const R = centre.map(([x, y]) => `${(x + half(y - tipY, w0, slope, max)).toFixed(1)},${y.toFixed(1)}`).reverse();
    return [...L, ...R].join(" ");
  };
  // white-hot core: wide at the nozzle, tapering to a thread
  const core = (() => {
    const w = (d: number) => Math.max(1.2, 11 - d * 0.012) * grow;
    const L = centre.map(([x, y]) => `${(x - w(y - tipY)).toFixed(1)},${y.toFixed(1)}`);
    const R = centre.map(([x, y]) => `${(x + w(y - tipY)).toFixed(1)},${y.toFixed(1)}`).reverse();
    return [...L, ...R].join(" ");
  })();
  return (
    <AbsoluteFill style={{ opacity: fadeEnd }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="trailFade" gradientUnits="userSpaceOnUse" x1="0" y1={tipY} x2="0" y2={tipY + fadeLen}>
            <stop offset="0" stopColor="#fff" stopOpacity={1} />
            <stop offset="0.45" stopColor="#fff" stopOpacity={0.7} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="plumeFill" gradientUnits="userSpaceOnUse" x1="0" y1={tipY} x2="0" y2={tipY + fadeLen}>
            <stop offset="0" stopColor="#ffe9dc" stopOpacity={0.9} />
            <stop offset="0.12" stopColor="#ff8a5c" stopOpacity={0.7} />
            <stop offset="0.45" stopColor="#ff5a26" stopOpacity={0.28} />
            <stop offset="1" stopColor="#2340d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="coreFill" gradientUnits="userSpaceOnUse" x1="0" y1={tipY} x2="0" y2={tipY + fadeLen * 0.8}>
            <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="0.3" stopColor="#ffe3d3" stopOpacity={0.85} />
            <stop offset="1" stopColor="#ffb08a" stopOpacity={0} />
          </linearGradient>
          <filter id="plumeBlur" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="coreGlow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="trailMask" maskUnits="userSpaceOnUse" x="-400" y="-200" width="1880" height={2400 + reach}>
            <rect x={-400} y={tipY - 10} width={1880} height={bottom + 400} fill="url(#trailFade)" />
          </mask>
        </defs>
        {/* soft plume */}
        <polygon points={shape(26, 0.2, 260)} fill="url(#plumeFill)" filter="url(#plumeBlur)" />
        <polygon points={shape(10, 0.07, 90)} fill="url(#plumeFill)" opacity={0.9} />
        {/* contour lines */}
        <g mask="url(#trailMask)">
          {lines.map((k) => {
            const pts: string[] = [];
            centre.forEach(([xb, y]) => {
              const d = y - tipY;
              const h = hNow - d;
              const spread = k * (5 + d * 0.06 + Math.pow(d / 900, 2) * 45) * grow;
              const wob = noise2D("wob", k * 0.29, h / 380) * Math.min(1, d / 260) * (8 + Math.abs(k) * 5);
              pts.push(`${(xb + spread + wob).toFixed(1)},${y.toFixed(1)}`);
            });
            const a = Math.abs(k);
            return (
              <polyline
                key={k}
                points={pts.join(" ")}
                fill="none"
                stroke={colorOf(k)}
                strokeWidth={k === 0 ? 5 : a === 1 ? 4.5 : a === 2 ? 3.4 : 2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={k === 0 ? 0.8 : 0.95 - a * 0.14}
              />
            );
          })}
        </g>
        {/* white-hot core */}
        <polygon points={core} fill="url(#coreFill)" filter="url(#coreGlow)" />
      </svg>
      {/* exhaust glow right under the tip */}
      <div
        style={{
          position: "absolute",
          left: pin.x - 110,
          top: tipY - 50,
          width: 220,
          height: 560,
          borderRadius: "50%",
          opacity: (0.75 + 0.25 * noise2D("fl", 1, frame * 0.6)) * fadeEnd,
          background:
            "radial-gradient(ellipse 50% 50% at 50% 20%, rgba(255,240,228,1) 0%, rgba(255,150,90,0.7) 22%, rgba(255,90,38,0.22) 52%, rgba(255,90,38,0) 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ climb: rings the pin flies through on the post-impact beats */

/** Beats after the liftoff that get a ring (684 has the pull-back, 730 the contour band + boom ring). */
const RING_BEATS = [2, 3, 4, 6, 7, 9, 10].map((n) => pbt(n));
const RING_DUR = 13;

/** A flat ring (seen slightly from above) rushing down past the pin. `half` splits it around the pin for depth. */
export const PassRings: React.FC<{ frame: number; pin: PinState; half: "back" | "front" }> = ({ frame, pin, half }) => {
  if (frame < T.lift || frame >= T.rise) return null;
  const items = RING_BEATS.map((at, i) => {
    const t = frame - at;
    if (t < 0 || t > RING_DUR) return null;
    const k = Easing.in(Easing.quad)(t / RING_DUR);
    const y = 470 + k * 1650; // passes the pin (~980) around t ≈ 8
    const rx = 330 + 40 * (i % 3) + k * 120; // a touch closer (bigger) as it passes
    const ry = rx * 0.2;
    const fadeIn = interpolate(y, [520, 760], [0, 1], clamp); // never over the headline
    const fadeOut = interpolate(y, [1500, 1950], [1, 0], clamp);
    return { y, rx, ry, a: fadeIn * fadeOut, i };
  }).filter(Boolean) as { y: number; rx: number; ry: number; a: number; i: number }[];
  if (!items.length) return null;
  const cx = pin.x;
  const arc = (y: number, rx: number, ry: number) =>
    half === "back" ? `M ${cx - rx} ${y} A ${rx} ${ry} 0 0 1 ${cx + rx} ${y}` : `M ${cx - rx} ${y} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {items.map(({ y, rx, ry, a, i }) => (
        <g key={i} opacity={a * (half === "back" ? 0.6 : 1)}>
          {/* motion smear: two fainter copies above */}
          <path d={arc(y - 70, rx, ry)} fill="none" stroke="#8da0ff" strokeWidth={3} opacity={0.18} />
          <path d={arc(y - 34, rx, ry)} fill="none" stroke="#8da0ff" strokeWidth={4} opacity={0.32} />
          <path d={arc(y, rx, ry)} fill="none" stroke={C.cobaltoClaro} strokeWidth={5} opacity={0.85} strokeDasharray={i % 2 ? "10 14" : undefined} />
          <path d={arc(y + 6, rx * 0.86, ry * 0.86)} fill="none" stroke={C.pin} strokeWidth={3} opacity={0.6} />
        </g>
      ))}
    </svg>
  );
};
