import React from "react";
import { AbsoluteFill, Easing, interpolate, random } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, EASE } from "../../brand";
import { TOPO_PATHS } from "../../brand/topoPaths";
import type { Cam } from "./camera";
import { bt, T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ sky */

/** Night sky: ink → blue-black, with a cobalt haze and (at the end) a cobalt "dawn". */
export const Sky: React.FC<{ frame: number }> = ({ frame }) => {
  const dawn = interpolate(frame, [T.rise, T.end + 10], [0, 1], { ...clamp, easing: EASE.inOut });
  const haze = interpolate(frame, [T.ign, T.dark - 4, T.dark, T.lift, T.lift + 20], [1, 0.35, 0, 1.4, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#070a15" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 120% 75% at 50% 48%, #141b36 0%, #0c1124 45%, #060812 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.55 * haze,
          background: "radial-gradient(ellipse 90% 34% at 50% 34%, rgba(35,64,216,0.42) 0%, rgba(35,64,216,0) 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dawn,
          background: `radial-gradient(ellipse 110% 70% at 50% 34%, ${C.cobalto} 0%, ${C.cobaltoHondo} 52%, #0d1640 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- stars */

const STARS = new Array(230).fill(0).map((_, i) => ({
  x: random(`sx${i}`) * 1080,
  y: random(`sy${i}`) * 2000,
  d: 0.12 + random(`sd${i}`) ** 2 * 0.55, // parallax depth
  s: 1 + random(`ss${i}`) * 2.2,
  a: 0.25 + random(`sa${i}`) * 0.6,
}));

/** Far star field. `climb` = how far the camera has risen (px), `speed` streaks the stars. */
export const Stars: React.FC<{ frame: number; climb: number; speed: number; orbit: number; dim: number }> = ({
  frame,
  climb,
  speed,
  orbit,
  dim,
}) => {
  return (
    <AbsoluteFill style={{ opacity: dim }}>
      {STARS.map((s, i) => {
        const tw = 0.65 + 0.35 * noise2D("tw", i, frame * 0.05);
        const x = (((s.x + orbit * 6 * s.d) % 1080) + 1080) % 1080;
        const y = (((s.y + climb * s.d) % 2000) + 2000) % 2000 - 40;
        const len = Math.max(s.s, speed * s.d * 4.2);
        const w = len > s.s * 2 ? Math.min(s.s, 1.6) : s.s;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y - len,
              width: w,
              height: len,
              borderRadius: w,
              background:
                len > s.s * 2
                  ? `linear-gradient(to bottom, rgba(243,244,239,0), rgba(243,244,239,${s.a * tw}))`
                  : `rgba(243,244,239,${s.a * tw})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- warp */

const WARP = new Array(64).fill(0).map((_, i) => {
  // keep most lines away from the centre column where the pin and its wake are
  const side = random(`ws${i}`) < 0.5 ? -1 : 1;
  const off = 120 + random(`wo${i}`) ** 0.8 * 460;
  return {
    x: 540 + side * off,
    y: random(`wy${i}`) * 2400,
    d: 1.6 + random(`wd${i}`) * 2.2, // nearer than the dust: faster
    w: 1.2 + random(`ww${i}`) * 2.2,
    a: 0.12 + random(`wa${i}`) * 0.32,
    warm: random(`wc${i}`) > 0.8,
  };
});

/** Near speed lines while climbing: long, thin, fast. They only exist while the camera actually moves. */
export const Warp: React.FC<{ climb: number; speed: number }> = ({ climb, speed }) => {
  const k = interpolate(speed, [14, 40], [0, 1], clamp);
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: k, mixBlendMode: "screen" }}>
      {WARP.map((p, i) => {
        const len = speed * p.d * 3.4;
        const y = ((((p.y + climb * p.d) % 2400) + 2400) % 2400) - 240;
        const col = p.warm ? "255,170,130" : "201,210,255";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - p.w / 2,
              top: y - len,
              width: p.w,
              height: len,
              borderRadius: p.w,
              background: `linear-gradient(to bottom, rgba(${col},0), rgba(${col},${p.a}) 70%, rgba(${col},${p.a * 0.4}))`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- dust */

const DUST = new Array(46).fill(0).map((_, i) => ({
  x: random(`dx${i}`) * 1080,
  y: random(`dy${i}`) * 2100,
  d: 0.7 + random(`dd${i}`) * 1.3,
  s: 3 + random(`ds${i}`) ** 2 * 16,
  a: 0.08 + random(`da${i}`) * 0.32,
  warm: random(`dw${i}`) > 0.72,
}));

/** Floating dust motes at several depths (near ones bigger, softer, faster). */
export const Dust: React.FC<{ frame: number; climb: number; speed: number; dim: number }> = ({ frame, climb, speed, dim }) => (
  <AbsoluteFill style={{ opacity: dim }}>
    {DUST.map((p, i) => {
      const t = frame / 30;
      const x = p.x + noise2D("dnx", i * 0.7, t * 0.18) * 70 * p.d;
      const y = ((((p.y - t * 14 * p.d + noise2D("dny", i * 0.7, t * 0.18) * 50 + climb * p.d) % 2100) + 2100) % 2100) - 90;
      const len = Math.max(p.s, speed * p.d * 1.3);
      const col = p.warm ? "255,140,90" : "201,210,255";
      const streak = len > p.s * 1.5;
      const w = streak ? Math.min(p.s, 2.5 + p.d) : p.s;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - w / 2,
            top: y - len,
            width: w,
            height: len,
            borderRadius: w,
            background:
              streak
                ? `linear-gradient(to bottom, rgba(${col},0), rgba(${col},${p.a * 0.8}))`
                : `radial-gradient(circle, rgba(${col},${p.a}) 0%, rgba(${col},0) 70%)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/* --------------------------------------------------------------- ground */

const P = 3600; // ground plane size (px, plane space)

/** Contour lines of the brand map, drawn on the plane. */
/**
 * `single`: one seamless tile instead of the tile + its 180° copy. The copy's join (a horizontal line ~128 px below the
 * plane centre) shows as a seam on the top-down countdown radar, so the countdown rig uses one tile, drawn at
 * SINGLE px so the contour density stays close to the two-tile version (2,6 vs 3,0 px per map unit).
 */
const SINGLE = 3000;
const TopoSvg: React.FC<{
  frame: number;
  color: string;
  width: number;
  opacity: number;
  draw: boolean;
  scale?: number;
  single?: boolean;
}> = ({ frame, color, width, opacity, draw, scale = 1, single = false }) => (
  <svg
    viewBox={single ? "300 0 1000 1000" : "100 250 1400 1400"}
    preserveAspectRatio="xMidYMid slice"
    style={{
      position: "absolute",
      left: single ? (P - SINGLE) / 2 : 0,
      top: single ? (P - SINGLE) / 2 : 0,
      width: single ? SINGLE : P,
      height: single ? SINGLE : P,
      opacity,
      scale,
    }}
    fill="none"
    stroke={color}
    strokeLinecap="round"
  >
    {(single ? [0] : [0, 1]).map((copy) => (
      <g key={copy} transform={copy ? "translate(1600 2000) rotate(180)" : undefined}>
        {TOPO_PATHS.map((p, i) => {
          const j = i + copy * 5;
          const pr = draw
            ? interpolate(frame, [-26 + (j % 9) * 3, -26 + (j % 9) * 3 + 64], [0, 1], { ...clamp, easing: EASE.salida })
            : 1;
          return (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - pr}
              strokeWidth={(p.major ? width * 1.5 : width) / (single ? SINGLE / 1000 : P / 1400)}
              opacity={p.major ? 1 : 0.62}
            />
          );
        })}
      </g>
    ))}
  </svg>
);

/** Cumulative radar sweep angle (deg). Faster during the countdown. */
const sweepAngle = (f: number) => {
  const a = Math.min(f, T.t3) * 2.6;
  const b = Math.max(0, Math.min(f, T.ign) - T.t3) * 5;
  const c = Math.max(0, f - T.ign) * 2.2;
  return a + b + c;
};

const PINGS_S1 = [0, bt(2), bt(4), bt(6), bt(8), bt(10)];

export const Ground: React.FC<{ frame: number; cam: Cam; heat: number }> = ({ frame, cam, heat }) => {
  const f = frame;
  const a = sweepAngle(f);
  const countdown = f >= T.t3 && f < T.ign;
  const sweepOn =
    f < T.s3
      ? 1
      : f < T.t3
        ? 0
        : f < T.ign
          ? 1
          : interpolate(f, [T.ign, T.ign + 30], [0.5, 0], clamp);
  const range = f >= T.t3 && f < T.ign ? 46 : 40; // % of plane radius lit by the sweep
  const mask = `conic-gradient(from ${a}deg at 50% 50%, rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 230deg, rgba(0,0,0,0.25) 300deg, rgba(0,0,0,0.85) 352deg, #000 359.5deg, rgba(0,0,0,0) 360deg), radial-gradient(circle at 50% 50%, #000 0%, #000 ${range * 0.5}%, rgba(0,0,0,0) ${range}%)`;

  // Liftoff: contour lines open outward + shock rings.
  const lift = interpolate(f, [T.lift, T.lift + 40], [0, 1], { ...clamp, easing: EASE.salida });
  const topoScale = 1 + lift * 0.9;
  // the receding ground stays readable below the pin until ~640, then fades
  const baseOpacity = interpolate(f, [T.lift + 26, T.lift + 52], [1, 0], clamp);
  // after liftoff the plane's far part dissolves (radial mask) instead of being hidden by the horizon fog
  const farMask = interpolate(f, [T.lift, T.lift + 40], [0, 1], { ...clamp, easing: EASE.salida });

  // Pings (orange rings from the pin).
  const pings: number[] = [];
  for (const p of PINGS_S1) if (f >= p && f < p + 60 && f < T.s3) pings.push(f - p);
  if (f >= T.t3 && f < T.ign) {
    const at = f < T.t2 ? T.t3 : f < T.t1 ? T.t2 : T.t1;
    for (const o of [0, bt(1), bt(2), bt(3)]) if (f >= at + o && f < at + o + 50) pings.push(f - at - o);
  }
  if (f >= T.ign && f < T.dark) {
    for (let k = 0; k < 8; k++) {
      const p = T.ign + Math.round(k * 12 - k * k * 0.6);
      if (f >= p && f < p + 40) pings.push(f - p);
    }
  }

  // Dial: 60 ticks that light up while "Menos una cosa:" ticks away.
  const dialOn = interpolate(f, [T.s2 - 4, T.s2 + 4, T.s3 - 2, T.s3], [0, 1, 1, 0], clamp);
  const dialLit = interpolate(f, [T.s2, T.s3], [0, 60], clamp);

  const glow = interpolate(heat, [0, 1], [0.35, 1]);
  const light = cam.light;

  return (
    <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: `540px ${cam.horizon}px`, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: cam.cx - P / 2,
          top: cam.cy - P / 2,
          width: P,
          height: P,
          transform: `rotateX(${cam.tilt}deg) rotateZ(${cam.orbit}deg) scale(${cam.zoom})`,
          transformOrigin: "50% 50%",
          ...(farMask > 0
            ? { maskImage: `radial-gradient(circle at 50% 50%, #000 0%, #000 ${70 - 46 * farMask}%, rgba(0,0,0,0) ${71 - 30 * farMask}%)` }
            : {}),
        }}
      >
        {/* base contours (dim) */}
        <div style={{ position: "absolute", inset: 0, opacity: (0.34 + 0.4 * light) * baseOpacity }}>
          <TopoSvg frame={f} color="#3550e6" width={2.2} opacity={0.75} draw scale={topoScale} single={countdown} />
        </div>
        {/* contours lit by the sweep, with a soft halo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: sweepOn * light,
            maskImage: mask,
            maskComposite: "intersect",
          }}
        >
          <TopoSvg frame={f} color="#5b78ff" width={13} opacity={0.3} draw single={countdown} />
          <TopoSvg frame={f} color="#c9d2ff" width={3.2} opacity={1} draw single={countdown} />
        </div>
        {/* sweep beam */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: sweepOn * 0.55 * light,
            background: `conic-gradient(from ${a}deg at 50% 50%, rgba(35,64,216,0) 0deg, rgba(35,64,216,0) 290deg, rgba(60,92,255,0.28) 355deg, rgba(150,170,255,0.55) 359.6deg, rgba(35,64,216,0) 360deg)`,
            maskImage: `radial-gradient(circle at 50% 50%, #000 0%, #000 ${range * 0.45}%, rgba(0,0,0,0) ${range}%)`,
          }}
        />
        {/* rings, crosshair, dial, pings */}
        <svg width={P} height={P} viewBox={`${-P / 2} ${-P / 2} ${P} ${P}`} style={{ position: "absolute", inset: 0 }} fill="none">
          <g opacity={(0.25 + 0.55 * light) * baseOpacity}>
            {[300, 600, 900, 1200].map((r, i) => (
              <circle
                key={r}
                r={r}
                stroke="#4a66ff"
                strokeWidth={i % 2 ? 2 : 3}
                strokeDasharray={i % 2 ? "6 18" : undefined}
                opacity={0.55 - i * 0.1}
              />
            ))}
            <path d="M-1350 0H-80M80 0H1350M0 -1350V-80M0 80V1350" stroke="#4a66ff" strokeWidth={2} opacity={0.35} />
          </g>
          <g opacity={dialOn}>
            {new Array(60).fill(0).map((_, i) => {
              const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
              const lit = i < dialLit;
              const r0 = i % 5 === 0 ? 330 : 345;
              return (
                <line
                  key={i}
                  x1={Math.cos(ang) * r0}
                  y1={Math.sin(ang) * r0}
                  x2={Math.cos(ang) * 380}
                  y2={Math.sin(ang) * 380}
                  stroke={lit ? C.pin : "#3a4fd0"}
                  strokeWidth={i % 5 === 0 ? 8 : 4}
                  strokeLinecap="round"
                  opacity={lit ? 1 : 0.5}
                />
              );
            })}
          </g>
          {pings.map((t, i) => {
            const k = t / 54;
            const r = 70 + 980 * Easing.out(Easing.cubic)(Math.min(1, k));
            return <circle key={i} r={r} stroke={C.pin} strokeWidth={6 - 4 * k} opacity={Math.max(0, 0.85 * (1 - k)) * (0.4 + 0.6 * light)} />;
          })}
          {/* liftoff shock rings */}
          {f >= T.lift &&
            [0, 3, 7].map((d, i) => {
              const t = f - T.lift - d;
              if (t < 0 || t > 40) return null;
              const k = t / 40;
              const r = 80 + 2600 * Easing.out(Easing.cubic)(k);
              return (
                <circle
                  key={`s${i}`}
                  r={r}
                  stroke={i === 1 ? C.papel : C.pin}
                  strokeWidth={(i === 1 ? 6 : 14) * (1 - k)}
                  opacity={1 - k}
                />
              );
            })}
        </svg>
        {/* contact spot right under the tip */}
        <div
          style={{
            position: "absolute",
            left: P / 2 - 90,
            top: P / 2 - 90,
            width: 180,
            height: 180,
            borderRadius: "50%",
            opacity: (f >= T.t3 && f < T.ign ? 0 : 1) * interpolate(f, [T.lift, T.lift + 10], [1, 0], clamp) * (f >= T.s3 && f < T.t3 ? 0.25 : 1),
            background: "radial-gradient(circle, rgba(255,226,205,0.95) 0%, rgba(255,120,70,0.6) 25%, rgba(255,90,38,0) 70%)",
          }}
        />
        {/* the pin's light on the ground */}
        <div
          style={{
            position: "absolute",
            left: P / 2 - 700,
            top: P / 2 - 700,
            width: 1400,
            height: 1400,
            borderRadius: "50%",
            opacity: glow * interpolate(f, [T.lift, T.lift + 24], [1, 0], clamp),
            background:
              "radial-gradient(circle, rgba(255,90,38,0.55) 0%, rgba(255,90,38,0.18) 22%, rgba(255,90,38,0.05) 45%, rgba(255,90,38,0) 65%)",
          }}
        />
      </div>
      {/* atmospheric fog toward the horizon */}
      <AbsoluteFill
        style={{
          opacity: (cam.tilt > 10 ? interpolate(cam.tilt, [10, 40], [0, 1], clamp) : 0) * interpolate(f, [T.lift, T.lift + 14], [1, 0], clamp),
          background: `linear-gradient(to bottom, #060812 0%, #070a16 ${Math.max(0, cam.cy - 980) / 19.2}%, rgba(8,11,24,0.55) ${(cam.cy - 640) / 19.2}%, rgba(8,11,24,0) ${(cam.cy - 300) / 19.2}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
