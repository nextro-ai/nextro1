import React from "react";
import { Easing, interpolate } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, EASE, Icon } from "../../brand";
import type { IconName } from "../../brand";
import { camAt, climbAt, IGN_RAMP } from "./camera";
import { END_PIN_Y, pbt, T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Pin graphic height at scale 1 (px). The tip is the anchor point. */
export const PIN_H = 210;
const PIN_W = 160;

/** The pin's x path while climbing, as a function of altitude (px). */
export const pathX = (h: number) => 540 + 46 * Math.sin(h / 820) + 18 * Math.sin(h / 310 + 1.3);

export type PinState = {
  x: number;
  y: number; // tip
  scale: number;
  sx: number;
  sy: number;
  rot: number;
  heat: number; // 0..1 glow / ignition
  shadow: number; // 0..1 "in the dark"
  opacity: number;
};

/**
 * Screen y of the pin's tip after liftoff (t = frames since 605). The pin really travels first: ~450 px up the
 * screen in 12 f while the camera is still, then the camera catches up and it settles at y ≈ 1060 by ~651.
 */
export const liftY = (t: number) => {
  const rise = 520 * (1 - Math.exp(-Math.max(0, t) / 5.5));
  const c = Math.min(1, Math.max(0, (t - 8) / 38));
  const catchUp = 420 * c * c * (3 - 2 * c);
  return 1160 - rise + catchUp;
};

/** Where the pin is and how it looks, per frame. */
export const pinAt = (f: number): PinState => {
  const cam = camAt(f);
  const base: PinState = {
    x: cam.cx,
    y: cam.cy,
    scale: cam.zoom * 0.92,
    sx: 1,
    sy: 1,
    rot: 0,
    heat: 0.25,
    shadow: 0,
    opacity: 1,
  };
  if (f < T.s3) {
    // gentle beat pulse handled by caller (punch); breathing glow
    return { ...base, heat: 0.3 + 0.1 * Math.sin(f / 6) };
  }
  if (f < T.t3) {
    // the pin drops into shadow on the cut frame itself (216), together with the lights
    return { ...base, shadow: 1, heat: 0 };
  }
  if (f < T.ign) {
    return { ...base, opacity: 0 };
  }
  if (f < T.lift) {
    const g = interpolate(f, [T.ign, T.dark], [0, 1], clamp);
    const hh = interpolate(f, [IGN_RAMP, T.dark], [0, 1], clamp);
    const vib = 1.2 + 9 * g * g * g + 9 * hh * hh;
    const vx = noise2D("pvx", 3, f * 1.7) * vib;
    const vy = noise2D("pvy", 7, f * 1.7) * vib * 0.5;
    const squat = interpolate(f, [T.dark - 10, T.dark + 5], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return {
      ...base,
      x: base.x + vx,
      y: base.y + vy,
      sx: 1 + 0.08 * squat,
      sy: 1 - 0.1 * squat,
      heat: interpolate(f, [T.ign, T.dark - 2, T.dark], [0.3, 0.95, 1], clamp),
    };
  }
  // ---- liftoff & climb (camera follows) ----
  const h = climbAt(f);
  const t = f - T.lift;
  const stretch = interpolate(t, [0, 2, 22], [0, 1, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const slope = (pathX(h + 40) - pathX(h - 40)) / 80;
  let x = interpolate(t, [0, 30], [540, pathX(h)], { ...clamp, easing: EASE.inOut });
  let y = liftY(t);
  let scale = interpolate(t, [0, 42], [1.32 * 0.92, 1.12], { ...clamp, easing: EASE.inOut });
  let heat = interpolate(t, [0, 30], [1, 0.75], clamp);
  // the camera stops following: the pin rises to its place in the sky (end card)
  const r = interpolate(f, [T.rise, T.end + 8], [0, 1], { ...clamp, easing: EASE.inOut });
  x = x + (540 - x) * r;
  y = y + (END_PIN_Y - y) * r;
  scale = scale + (0.86 - scale) * r;
  heat = heat + (0.55 - heat) * r;
  const bob = f > T.end ? Math.sin((f - T.end) / 11) * 5 * interpolate(f, [T.end, T.end + 20], [0, 1], clamp) : 0;
  return {
    x,
    y: y + bob,
    scale,
    sx: 1 - 0.22 * stretch,
    sy: 1 + 0.5 * stretch,
    rot: Math.atan(slope) * (180 / Math.PI) * 0.8 * (1 - r),
    heat,
    shadow: 0,
    opacity: 1,
  };
};

/** The hero map pin (brand "tu negocio" orange), with glow and an optional heat core. */
export const PinGraphic: React.FC<{ s: PinState; punch?: number }> = ({ s, punch = 1 }) => {
  const k = s.scale * punch;
  const glowR = 18 + 70 * s.heat;
  const glowA = (0.25 + 0.6 * s.heat) * (1 - s.shadow);
  return (
    <div
      style={{
        position: "absolute",
        left: s.x - PIN_W / 2,
        top: s.y - PIN_H,
        width: PIN_W,
        height: PIN_H,
        transformOrigin: "50% 100%",
        transform: `rotate(${s.rot}deg) scale(${k * s.sx}, ${k * s.sy})`,
        opacity: s.opacity,
      }}
    >
      {/* aura */}
      <div
        style={{
          position: "absolute",
          left: PIN_W / 2 - 260,
          top: 80 - 260,
          width: 520,
          height: 520,
          borderRadius: "50%",
          opacity: glowA,
          background:
            "radial-gradient(circle, rgba(255,120,70,0.75) 0%, rgba(255,90,38,0.32) 20%, rgba(255,90,38,0.08) 45%, rgba(255,90,38,0) 68%)",
        }}
      />
      <svg
        viewBox="0 0 160 210"
        width={PIN_W}
        height={PIN_H}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: `drop-shadow(0 0 ${glowR * 0.35}px rgba(255,90,38,${glowA})) drop-shadow(0 0 ${glowR}px rgba(255,90,38,${glowA * 0.7}))`,
        }}
      >
        <defs>
          <linearGradient id="pinBody" x1="0.15" y1="0.05" x2="0.85" y2="0.9">
            <stop offset="0" stopColor="#ff8d60" />
            <stop offset="0.55" stopColor={C.pin} />
            <stop offset="1" stopColor={C.pinHondo} />
          </linearGradient>
          <linearGradient id="pinDark" x1="0.15" y1="0.05" x2="0.85" y2="0.9">
            <stop offset="0" stopColor="#2a3150" />
            <stop offset="1" stopColor="#141a2e" />
          </linearGradient>
          <radialGradient id="pinHot" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#fff1e6" stopOpacity={1} />
            <stop offset="0.45" stopColor="#ffb08c" stopOpacity={0.6} />
            <stop offset="1" stopColor="#ff5a26" stopOpacity={0} />
          </radialGradient>
        </defs>
        <path d="M80 206 C 62 176 12 134 12 80 A 68 68 0 0 1 148 80 C 148 134 98 176 80 206 Z" fill="url(#pinBody)" />
        <path
          d="M80 206 C 62 176 12 134 12 80 A 68 68 0 0 1 148 80 C 148 134 98 176 80 206 Z"
          fill="url(#pinDark)"
          opacity={s.shadow * 0.93}
        />
        <path
          d="M80 206 C 62 176 12 134 12 80 A 68 68 0 0 1 148 80 C 148 134 98 176 80 206 Z"
          fill="url(#pinHot)"
          opacity={Math.max(0, (s.heat - 0.55) / 0.45) * 0.9}
        />
        {/* rim light (reads in the dark) */}
        <path
          d="M30 52 A 68 68 0 0 1 128 36"
          stroke={s.shadow > 0.5 ? "#6f86ff" : "#ffd0bb"}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          opacity={s.shadow > 0.5 ? 0.55 * s.shadow : 0.55}
        />
        <circle cx={80} cy={80} r={25} fill={s.shadow > 0.5 ? "#0c1022" : C.papel} opacity={1 - 0.6 * s.shadow} />
      </svg>
    </div>
  );
};

/** Three service icons orbiting the climbing pin. */
const ORBIT: { icon: IconName; at: number }[] = [
  { icon: "pin", at: 640 },
  { icon: "camara", at: 646 },
  { icon: "web", at: 652 },
];

export const orbitGeom = (f: number, s: PinState) => {
  const punchR = interpolate(f, [pbt(5), pbt(5) + 3, pbt(5) + 16], [1, 1.12, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [T.rise - 6, T.rise + 10], [0, 1], { ...clamp, easing: EASE.in });
  const born = interpolate(f, [ORBIT_START, ORBIT_START + 18], [0, 1], { ...clamp, easing: EASE.salida });
  return { cx: s.x, cy: s.y - 70 * s.scale, R: (60 + 240 * born) * punchR * (1 + out * 1.8), k: 0.27, opacity: born * (1 - out) };
};

const ORBIT_START = 640;

/** Thin orbit ellipse; the back half is drawn behind the pin, the front half over it. */
export const OrbitRing: React.FC<{ f: number; s: PinState; half: "back" | "front" }> = ({ f, s, half }) => {
  if (f < ORBIT_START) return null;
  const g = orbitGeom(f, s);
  if (g.opacity <= 0) return null;
  const ry = g.R * g.k;
  const d =
    half === "back"
      ? `M ${g.cx - g.R} ${g.cy} A ${g.R} ${ry} 0 0 1 ${g.cx + g.R} ${g.cy}`
      : `M ${g.cx - g.R} ${g.cy} A ${g.R} ${ry} 0 0 0 ${g.cx + g.R} ${g.cy}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={d} fill="none" stroke="#8da0ff" strokeWidth={half === "front" ? 3 : 2} opacity={g.opacity * (half === "front" ? 0.55 : 0.3)} strokeDasharray={half === "back" ? "4 10" : undefined} />
    </svg>
  );
};

export const orbiters = (f: number, s: PinState) => {
  const g = orbitGeom(f, s);
  const cy = g.cy;
  const out = interpolate(f, [T.rise - 6, T.rise + 10], [0, 1], { ...clamp, easing: EASE.in });
  return ORBIT.map((o, i) => {
    const t = f - o.at;
    const born = interpolate(t, [0, 16], [0, 1], { ...clamp, easing: EASE.rebote });
    const theta = (f - 640) * ((Math.PI * 2) / 110) + (i * Math.PI * 2) / 3;
    const R = g.R * (0.7 + 0.3 * born);
    const x = s.x + Math.cos(theta) * R;
    const y = cy + Math.sin(theta) * R * g.k;
    const depth = Math.sin(theta); // >0 = in front
    return {
      icon: o.icon,
      x,
      y,
      front: depth > 0,
      scale: (0.82 + 0.18 * (depth + 1) / 2) * Math.min(1, born * 1.2),
      opacity: Math.min(1, born * 2) * (1 - out) * (0.7 + 0.3 * (depth + 1) / 2),
      visible: t >= 0 && out < 1,
    };
  });
};

export const Orbiter: React.FC<{ o: ReturnType<typeof orbiters>[number] }> = ({ o }) => {
  if (!o.visible) return null;
  const D = 132;
  return (
    <div
      style={{
        position: "absolute",
        left: o.x - D / 2,
        top: o.y - D / 2,
        width: D,
        height: D,
        borderRadius: "50%",
        scale: o.scale,
        opacity: o.opacity,
        background: "radial-gradient(circle at 35% 30%, #232c55 0%, #131a35 70%)",
        border: `3px solid ${C.cobalto}`,
        boxShadow: "0 0 0 1px rgba(201,210,255,0.25), 0 0 34px rgba(35,64,216,0.65), 0 16px 30px rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={o.icon} size={66} color={C.papel} strokeWidth={2} />
    </div>
  );
};
