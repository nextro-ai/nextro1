import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, EASE, FONT, Icon } from "../../brand";
import { TOPO_PATHS, TOPO_VIEWBOX } from "../../brand/topoPaths";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** World size (px at zoom 1). The pin sits in the middle. */
const WORLD = 3600;
const TILE_W = 1500;
const TILE_H = (TILE_W * TOPO_VIEWBOX.h) / TOPO_VIEWBOX.w;

/** Near field: site-density contours, readable at zoom 1 (mirrored tiles; fades out on the pull-back). */
const NearTopo: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0.001) return null;
  const tiles: React.ReactNode[] = [];
  for (let r = 1; r <= 2; r++) {
    for (let c = 0; c <= 2; c++) {
      const fx = c % 2 === 1 ? -1 : 1;
      const fy = r % 2 === 1 ? -1 : 1;
      tiles.push(
        <g
          key={`${r}-${c}`}
          transform={`translate(${c * TILE_W + (fx < 0 ? TILE_W : 0)} ${r * TILE_H + (fy < 0 ? TILE_H : 0)}) scale(${(fx * TILE_W) / TOPO_VIEWBOX.w} ${(fy * TILE_H) / TOPO_VIEWBOX.h})`}
        >
          {TOPO_PATHS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              strokeWidth={p.major ? 2.6 : 1.6}
              opacity={p.major ? 0.85 : 0.55}
            />
          ))}
        </g>,
      );
    }
  }
  return (
    <svg
      width={WORLD}
      height={WORLD}
      viewBox={`0 0 ${WORLD} ${WORLD}`}
      style={{ position: "absolute", left: 0, top: 0, opacity }}
      fill="none"
      stroke={C.cobalto}
    >
      <g opacity={0.34}>{tiles}</g>
    </svg>
  );
};

/** Far field: one big contour map, rotated to portrait — reads well once the camera has pulled back. */
const FarTopo: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0.001) return null;
  const w = WORLD * 1.6;
  const h = WORLD;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${TOPO_VIEWBOX.w} ${TOPO_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        left: (WORLD - w) / 2,
        top: (WORLD - h) / 2,
        rotate: "90deg",
        opacity,
      }}
      fill="none"
      stroke={C.cobalto}
    >
      <g opacity={0.34}>
        {TOPO_PATHS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            strokeWidth={p.major ? 1.3 : 0.8}
            opacity={p.major ? 0.9 : 0.6}
          />
        ))}
      </g>
    </svg>
  );
};

/** A few white roads, like the map card on lonsolab.com. */
const ROADS = [
  "M 0 1930 C 900 1890 1500 1960 1800 1955 S 2900 1900 3600 1985",
  "M 1240 0 C 1300 900 1460 1500 1520 1800 S 1640 2900 1600 3600",
  "M 0 2900 C 1100 2500 2300 1500 3600 900",
  "M 2150 0 C 2120 700 2200 1300 2240 1700 S 2300 2600 2420 3600",
  "M 0 1150 C 800 1180 1700 1260 3600 1210",
  "M 600 0 C 700 1200 760 2400 900 3600",
  "M 0 2500 C 1300 2440 2300 2560 3600 2480",
];
const Roads: React.FC = () => (
  <svg
    width={WORLD}
    height={WORLD}
    viewBox={`0 0 ${WORLD} ${WORLD}`}
    style={{ position: "absolute", left: 0, top: 0 }}
    fill="none"
  >
    {ROADS.map((d, i) => (
      <path
        key={`o${i}`}
        d={d}
        stroke="rgba(19,24,43,0.07)"
        strokeWidth={i < 2 ? 40 : 28}
        strokeLinecap="round"
      />
    ))}
    {ROADS.map((d, i) => (
      <path
        key={`r${i}`}
        d={d}
        stroke="#ffffff"
        strokeWidth={i < 2 ? 34 : 22}
        strokeLinecap="round"
      />
    ))}
  </svg>
);

/** Map pin in pin orange (shape from the site's icon, filled). */
export const PinShape: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size * 1.25}
    viewBox="0 0 40 50"
    style={{ display: "block", overflow: "visible" }}
  >
    <ellipse cx={20} cy={48.5} rx={8} ry={2.6} fill="rgba(19,24,43,0.22)" />
    <path
      d="M20 48 C 20 48 4 32.5 4 19 A 16 16 0 0 1 36 19 C 36 32.5 20 48 20 48 Z"
      fill={C.pin}
      stroke={C.pinHondo}
      strokeWidth={1.2}
    />
    <circle cx={20} cy={19} r={6.2} fill={C.papel} />
  </svg>
);

export type MapCardProps = {
  /** page y of the card */
  top: number;
  /** zoom keyframes (frames, values, easings for each segment) */
  zf: number[];
  zv: number[];
  ze: ((t: number) => number)[];
  /** pin drop + stars timing */
  dropAt: number;
  starsAt: number;
  /** orange "here I am" rings (window coords, so they read at any zoom) */
  pings: { at: number; r: number }[];
  /** visitors: small dots walking to the pin ("se vea") */
  visitorsAt?: number;
  /** slide the card out downward */
  exitAt?: number;
  /** window y of the pin tip (default 360) */
  pinY?: number;
  /** 0–1: desaturate + fade the card (a business nobody sees) */
  grey?: number;
  /** extra card opacity (fades with a scene) */
  opacity?: number;
};

/**
 * Figure: "tu negocio" is the orange pin, rated 5 stars, on a quiet topo map (the site's map card).
 * Hook: the camera pulls back until the pin is a speck. Close: it pushes back in and people arrive.
 */
export const MapCard: React.FC<MapCardProps> = ({
  top,
  zf,
  zv,
  ze,
  dropAt,
  starsAt,
  pings,
  visitorsAt,
  exitAt,
  pinY = 360,
  grey = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const W = 900;
  const H = 860;
  const pinX = W / 2 - 12; // window coords of the pin tip

  const zoom = interpolate(frame, zf, zv, { ...clamp, easing: ze });
  const near = interpolate(zoom, [0.55, 0.85], [0, 1], clamp);
  const far = interpolate(zoom, [0.45, 0.8], [1, 0], clamp);
  const drop = interpolate(frame, [dropAt, dropAt + 10], [-30, 0], {
    ...clamp,
    easing: EASE.salida,
  });
  const chipIn = interpolate(frame, [dropAt, dropAt + 8], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const exit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + 10], [0, 1], {
          ...clamp,
          easing: EASE.in,
        });

  const ring = (at: number, max: number) => {
    const cy = pinY - 58 * zoom; // centre of the pin head, whatever the zoom
    const p = interpolate(frame, [at, at + 26], [0, 1], {
      ...clamp,
      easing: EASE.salida,
    });
    if (p <= 0 || p >= 1) return null;
    return (
      <div
        key={at}
        style={{
          position: "absolute",
          left: pinX - max * p,
          top: cy - max * p,
          width: max * p * 2,
          height: max * p * 2,
          borderRadius: "50%",
          border: `${5 * (1 - p) + 1.5}px solid ${C.pin}`,
          opacity: 0.75 * (1 - p),
        }}
      />
    );
  };

  if (exit >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top,
        width: W,
        height: H,
        borderRadius: 36,
        background: C.blanco,
        padding: 14,
        boxShadow:
          "0 2px 6px rgba(19,24,43,0.06), 0 40px 80px -36px rgba(19,24,43,0.35)",
        translate: `0 ${exit * 700}px`,
        opacity: (1 - exit) * opacity * (1 - 0.45 * grey),
        filter: grey > 0 ? `grayscale(${grey})` : undefined,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 24,
          overflow: "hidden",
          background: "#e9ecf3",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: pinX - WORLD / 2,
            top: pinY - WORLD / 2,
            width: WORLD,
            height: WORLD,
            transformOrigin: "50% 50%",
            scale: String(zoom),
          }}
        >
          <FarTopo opacity={far} />
          <NearTopo opacity={near} />
          <Roads />
          {visitorsAt !== undefined ? <Visitors from={visitorsAt} /> : null}
          {/* pin + label live in the world so they shrink with the camera */}
          <div
            style={{ position: "absolute", left: WORLD / 2, top: WORLD / 2 }}
          >
            <div
              style={{
                position: "absolute",
                left: -46,
                top: -112,
                translate: `0 ${drop}px`,
              }}
            >
              <PinShape size={92} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                translate: `0 ${(1 - chipIn) * 14}px`,
              }}
            >
              <Chip frame={frame} starsAt={starsAt} />
            </div>
          </div>
        </div>
        {pings.map((p) => ring(p.at, p.r))}
        {/* truth label: this is an illustration, not a real listing */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 18,
            padding: "6px 16px 8px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.88)",
            boxShadow: "0 1px 3px rgba(19,24,43,0.12)",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.01em",
            color: C.tinta2,
          }}
        >
          Ejemplo ilustrativo
        </div>
      </div>
    </div>
  );
};

/** People (ink dots) walking in toward the pin from around the map. Deterministic. */
const Visitors: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const n = 9;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + random(`v-a${i}`) * 0.5;
        const dist = 520 + random(`v-d${i}`) * 260;
        const start = from + Math.round(random(`v-s${i}`) * 18);
        const p = interpolate(frame, [start, start + 34], [0, 1], {
          ...clamp,
          easing: EASE.salida,
        });
        if (p <= 0) return null;
        const d = dist * (1 - p) + 70;
        const x = WORLD / 2 + Math.cos(a) * d;
        const y = WORLD / 2 - 40 + Math.sin(a) * d * 0.8;
        const fade = interpolate(p, [0, 0.2], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 17,
              top: y - 17,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: i % 3 === 0 ? C.cobalto : C.tinta,
              border: `5px solid ${C.blanco}`,
              boxShadow: "0 4px 10px rgba(19,24,43,0.25)",
              opacity: fade,
            }}
          />
        );
      })}
    </>
  );
};

const Chip: React.FC<{ frame: number; starsAt: number }> = ({
  frame,
  starsAt,
}) => (
  <div
    style={{
      position: "absolute",
      left: -232,
      top: -266,
      width: 464,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: "16px 28px 18px",
      background: C.blanco,
      borderRadius: 26,
      boxShadow:
        "0 2px 4px rgba(19,24,43,0.08), 0 22px 40px -18px rgba(19,24,43,0.4)",
      fontFamily: FONT,
    }}
  >
    <div
      style={{
        fontWeight: 760,
        fontStretch: "108%",
        fontSize: 50,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        color: C.tinta,
      }}
    >
      Tu negocio
    </div>
    <div style={{ display: "flex", gap: 6 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const s = interpolate(
          frame,
          [starsAt + i * 3, starsAt + 10 + i * 3],
          [0, 1],
          { ...clamp, easing: EASE.salida },
        );
        return (
          <div key={i} style={{ scale: String(0.4 + 0.6 * s), opacity: s }}>
            <Icon
              name="estrella"
              size={42}
              color={C.estrella}
              fill={C.estrella}
              strokeWidth={1.2}
            />
          </div>
        );
      })}
    </div>
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: -12,
        width: 26,
        height: 26,
        background: C.blanco,
        rotate: "45deg",
        translate: "-50% 0",
        borderRadius: 4,
      }}
    />
  </div>
);
