import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { C, EASE } from "../../brand";

/**
 * Hand-drawn marker marks in pin (strike-throughs, highlighter, circles, ticks, arrows).
 * Every wobble comes from a fixed seed so renders are deterministic.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const drawP = (frame: number, at: number, dur: number) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: EASE.salida });

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
const smooth = (pts: [number, number][]) => {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

const j = (seed: string, amp: number) => (random(seed) * 2 - 1) * amp;

/** Marker texture: a hair of edge roughness so strokes don't look vector-perfect. */
export const MarkerFilter: React.FC<{ id: string }> = ({ id }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-10%" y="-40%" width="120%" height="180%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.06"
        numOctaves="2"
        seed={3}
        result="n"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="n"
        scale="3.2"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

/**
 * Strike-through across one text line. Place inside a `position: relative` inline-block wrapper
 * around the line. Revealed left→right (8–10 f).
 */
export const Strike: React.FC<{
  at: number;
  dur?: number;
  seed: string;
  y?: number; // % of the line box
  color?: string;
  width?: number;
  filterId?: string;
  /** if set: the stroke (caps included) stays inside the line box, inset by this many px */
  edge?: number;
}> = ({
  at,
  dur = 9,
  seed,
  y = 54,
  color = C.pin,
  width = 8,
  filterId,
  edge,
}) => {
  const frame = useCurrentFrame();
  const p = drawP(frame, at, dur);
  if (p <= 0) return null;
  const n = 9;
  const tilt = j(`${seed}-tilt`, 4);
  const x0 = edge === undefined ? -8 : 0;
  const span = edge === undefined ? 1016 : 1000;
  const pts: [number, number][] = Array.from({ length: n }, (_, i) => [
    x0 + (i / (n - 1)) * span,
    20 + tilt * (i / (n - 1) - 0.5) * 2 + j(`${seed}-${i}`, 3.2),
  ]);
  const side = edge === undefined ? -10 : edge + width / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: side,
        right: side,
        top: `calc(${y}% - 20px)`,
        height: 40,
        clipPath: `inset(-12px ${(1 - p) * 100}% -12px -12px)`,
        pointerEvents: "none",
        filter: filterId ? `url(#${filterId})` : undefined,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d={smooth(pts)}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

/** Highlighter block behind a word (pin at 35 %), grows in scaleX from the left. */
export const Highlight: React.FC<{
  at: number;
  dur?: number;
  seed: string;
  color?: string;
  top?: string;
  bottom?: string;
}> = ({
  at,
  dur = 8,
  seed,
  color = "rgba(255,90,38,0.38)",
  top = "34%",
  bottom = "4%",
}) => {
  const frame = useCurrentFrame();
  const p = drawP(frame, at, dur);
  if (p <= 0) return null;
  const e = (k: string, a: number) => (a + j(`${seed}-${k}`, 2.2)).toFixed(1);
  const poly = `polygon(0% ${e("a", 10)}%, 18% ${e("b", 4)}%, 42% ${e("c", 9)}%, 66% ${e("d", 3)}%, 88% ${e("e", 8)}%, 100% ${e("f", 5)}%, 99% ${e("g", 93)}%, 76% ${e("h", 97)}%, 51% ${e("i", 90)}%, 27% ${e("k", 96)}%, 1% ${e("l", 91)}%)`;
  return (
    <div
      style={{
        position: "absolute",
        left: "-0.1em",
        right: "-0.1em",
        top,
        bottom,
        background: color,
        clipPath: poly,
        scale: `${p} 1`,
        transformOrigin: "0% 50%",
        mixBlendMode: "multiply",
        rotate: `${j(`${seed}-rot`, 0.8)}deg`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Hand-drawn loop around a word: fixed px box centred on the word. */
export const Loop: React.FC<{
  at: number;
  dur?: number;
  seed: string;
  w: number;
  h: number;
  dx?: number;
  dy?: number;
  color?: string;
  width?: number;
  filterId?: string;
}> = ({
  at,
  dur = 13,
  seed,
  w,
  h,
  dx = 0,
  dy = 0,
  color = C.pin,
  width = 8,
  filterId,
}) => {
  const frame = useCurrentFrame();
  const p = drawP(frame, at, dur);
  if (p <= 0) return null;
  const pad = 20;
  const cx = w / 2 + pad;
  const cy = h / 2 + pad;
  const n = 26;
  const start = Math.PI * 1.08;
  const turns = 1.14;
  const pts: [number, number][] = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const a = start - t * turns * Math.PI * 2;
    const grow = 1 + (t - 0.5) * 0.09; // the pen drifts outward on the overlap
    const rx = (w / 2) * grow + j(`${seed}-rx${i}`, w * 0.018);
    const ry = (h / 2) * grow + j(`${seed}-ry${i}`, h * 0.03);
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry - t * h * 0.05];
  });
  return (
    <svg
      width={w + pad * 2}
      height={h + pad * 2}
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`}
      style={{
        position: "absolute",
        left: `calc(50% - ${w / 2 + pad}px + ${dx}px)`,
        top: `calc(50% - ${h / 2 + pad}px + ${dy}px)`,
        overflow: "visible",
        pointerEvents: "none",
        rotate: `${-3 + j(`${seed}-r`, 1.5)}deg`,
      }}
    >
      <path
        d={smooth(pts)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        filter={filterId ? `url(#${filterId})` : undefined}
      />
    </svg>
  );
};

/**
 * Hand-drawn check mark (short stroke down, long stroke up). Default: drawn in 6 f with a quad
 * ease-out, so it is 97 % drawn one frame before the end (put the "click" on at + dur - 1).
 */
export const Tick: React.FC<{
  at: number;
  dur?: number;
  seed: string;
  size: number;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
  filterId?: string;
}> = ({
  at,
  dur = 6,
  seed,
  size,
  color = C.pin,
  width = 9,
  style,
  filterId,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  if (p <= 0) return null;
  const pts: [number, number][] = [
    [6 + j(`${seed}-a`, 3), 52 + j(`${seed}-b`, 4)],
    [22 + j(`${seed}-c`, 3), 66 + j(`${seed}-d`, 3)],
    [36 + j(`${seed}-e`, 3), 86 + j(`${seed}-f`, 3)],
    [52 + j(`${seed}-g`, 3), 58 + j(`${seed}-h`, 4)],
    [74 + j(`${seed}-i`, 3), 30 + j(`${seed}-k`, 4)],
    [98 + j(`${seed}-l`, 2), 6 + j(`${seed}-m`, 3)],
  ];
  // sharp corner at the bottom of the tick: two smooth halves
  const d = `${smooth(pts.slice(0, 3))} ${smooth(pts.slice(2)).replace(/^M [^C]+/, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        overflow: "visible",
        pointerEvents: "none",
        ...style,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width * (100 / size)}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        filter={filterId ? `url(#${filterId})` : undefined}
      />
    </svg>
  );
};

/** Curved hand-drawn arrow from (x1,y1) to (x2,y2) with a bend; head drawn after the shaft. */
export const Arrow: React.FC<{
  at: number;
  dur?: number;
  seed: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend?: number;
  color?: string;
  width?: number;
  head?: number;
  filterId?: string;
}> = ({
  at,
  dur = 12,
  seed,
  x1,
  y1,
  x2,
  y2,
  bend = 0.25,
  color = C.pin,
  width = 7,
  head = 34,
  filterId,
}) => {
  const frame = useCurrentFrame();
  const p = drawP(frame, at, dur);
  const ph = drawP(frame, at + dur - 3, 6);
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const n = 7;
  const pts: [number, number][] = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const b = Math.sin(t * Math.PI) * bend * len;
    return [
      x1 + dx * t + nx * b + (i > 0 && i < n - 1 ? j(`${seed}-x${i}`, 3) : 0),
      y1 + dy * t + ny * b + (i > 0 && i < n - 1 ? j(`${seed}-y${i}`, 3) : 0),
    ];
  });
  // head direction = last segment
  const [ax, ay] = pts[n - 2];
  const ang = Math.atan2(y2 - ay, x2 - ax);
  const h1: [number, number] = [
    x2 - Math.cos(ang - 0.5) * head,
    y2 - Math.sin(ang - 0.5) * head,
  ];
  const h2: [number, number] = [
    x2 - Math.cos(ang + 0.55) * head * 0.92,
    y2 - Math.sin(ang + 0.55) * head * 0.92,
  ];
  void mx;
  void my;
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={filterId ? `url(#${filterId})` : undefined}
      >
        <path
          d={smooth(pts)}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
        />
        {ph > 0 ? (
          <path
            d={`M ${h1[0]} ${h1[1]} L ${x2} ${y2} L ${h2[0]} ${h2[1]}`}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - ph}
          />
        ) : null}
      </g>
    </svg>
  );
};
