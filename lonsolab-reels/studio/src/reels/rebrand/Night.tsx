import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EASE, Logo, display } from "../../brand";
import { OldLogo, OldPart } from "./OldLogo";
import { ESPIGA, ICE } from "./palette";
import { CRACKS, SHATTER_CENTER } from "./shatter";
import { Line } from "./Text";
import { clamp, T } from "./timing";

const C0 = SHATTER_CENTER;
export const DISC2_R = 230;

/** Crack front radius (px from the old logo) — slow start, racing to the edges at the bloom. */
export const crackFront = (f: number) =>
  interpolate(f, [T.crack + 8, T.crack + 34, T.bloom - 12, T.bloom - 2], [0, 150, 620, 1500], {
    ...clamp,
    easing: EASE.in,
  });

/** Scenes 4–5 (f312–469): dark, quiet, the Lonso Lab bear appears; then the frost cracks. */
export const Night: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.splice - 10 || frame >= T.bloom + 14) return null;
  if (frame >= T.bloom) return <WakeText />;
  // gone by f392, before the frozen old-logo disc arrives (agency mark never mixes with the client's logo)
  const bear = interpolate(frame, [T.splice + 8, T.splice + 50, T.crack - 16, T.crack + 2], [0, 0.13, 0.13, 0], clamp);
  const glow = interpolate(frame, [T.crack, T.bloom - 1], [0, 1], { ...clamp, easing: EASE.in });
  return (
    <AbsoluteFill>
      {/* Lonso Lab bear, barely there, rising out of the dark */}
      <div
        style={{
          position: "absolute",
          left: 540 - (700 * 1019) / 1320 / 2,
          top: 820,
          opacity: bear,
          translate: `0 ${interpolate(frame, [T.splice, T.crack + 2], [70, -6])}px`,
          filter: "drop-shadow(0 0 40px rgba(201,210,255,0.35))",
        }}
      >
        <Logo kind="mark" variant="papel" height={700} />
      </div>
      {/* warm light building up behind the ice */}
      <div
        style={{
          position: "absolute",
          left: C0.x - 900,
          top: C0.y - 900,
          width: 1800,
          height: 1800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,186,110,${0.62 * glow}) 0%, rgba(232,120,70,${0.28 * glow}) 28%, rgba(200,85,61,0) 62%)`,
          scale: `${0.35 + glow * 0.75}`,
        }}
      />
      <GrowText />
      <WakeText />
    </AbsoluteFill>
  );
};

const GrowText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > T.crack + 4) return null;
  const stretch = interpolate(frame, [T.grow, T.grow + 16], [62, 125], { ...clamp, easing: EASE.rebote });
  const wght = interpolate(frame, [T.grow, T.grow + 16], [900, 800], clamp);
  return (
    <div style={{ position: "absolute", left: 90, top: 400, width: 940 }}>
      <Line at={T.splice + 18} dur={26} outAt={T.crack - 8} outDur={12}>
        <div style={{ ...display(110, ICE.hielo), fontStretch: "112%" }}>Tu negocio</div>
      </Line>
      <Line at={T.splice + 23} dur={26} outAt={T.crack - 6} outDur={12}>
        <div
          style={{
            ...display(210, "#f3f6fa"),
            fontStretch: `${stretch}%`,
            fontWeight: wght,
            marginTop: 10,
            textShadow: "0 0 60px rgba(160,190,230,0.25)",
          }}
        >
          creció.
        </div>
      </Line>
    </div>
  );
};

const WakeText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.crack - 2) return null;
  const heat = interpolate(frame, [T.crack + 20, T.bloom], [0, 1], clamp);
  // blown away by the bloom
  const blast = interpolate(frame, [T.bloom - 1, T.bloom + 9], [0, 1], { ...clamp, easing: EASE.salida });
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 384,
        width: 940,
        opacity: 1 - blast,
        scale: `${1 + blast * 0.22}`,
        transformOrigin: "450px 600px",
        filter: blast > 0 ? `blur(${blast * 14}px)` : undefined,
      }}
    >
      <Line at={T.crack + 4} dur={26}>
        <div style={{ ...display(110, ICE.hielo), fontStretch: "112%" }}>Es hora de</div>
      </Line>
      <Line at={T.crack + 12} dur={28}>
        <div
          style={{
            ...display(145, ESPIGA.trigo),
            fontStretch: "100%",
            marginTop: 10,
            textShadow: `0 0 ${20 + heat * 40}px rgba(255,170,90,${0.25 + heat * 0.35})`,
          }}
        >
          despertarla.
        </div>
      </Line>
    </div>
  );
};

/** The frozen old logo in a glass disc at the fracture centre (f390–469). */
export const FrozenDisc: React.FC<{ part?: (n: OldPart) => { transform?: string; opacity?: number }; broken?: number }> = ({
  part,
  broken = 0,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [T.crack, T.crack + 26], [0, 1], { ...clamp, easing: EASE.salida });
  const tremble = interpolate(frame, [T.bloom - 30, T.bloom - 1], [0, 3.2], { ...clamp, easing: EASE.in });
  const tx = Math.sin(frame * 2.9) * tremble;
  const ty = Math.cos(frame * 3.7) * tremble * 0.6;
  const glassO = 1 - broken;
  return (
    <div
      style={{
        position: "absolute",
        left: C0.x - DISC2_R,
        top: C0.y - DISC2_R,
        width: DISC2_R * 2,
        height: DISC2_R * 2,
        opacity: inP,
        scale: `${0.92 + 0.08 * inP}`,
        translate: `${tx}px ${ty}px`,
      }}
    >
      {glassO > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            opacity: glassO,
            background: "radial-gradient(circle at 50% 45%, rgba(190,210,232,0.20), rgba(150,175,205,0.30) 80%)",
            boxShadow: "0 40px 90px -30px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.4)",
          }}
        >
          <Img
            src={staticFile("rebrand/frost_disc.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.75,
              WebkitMaskImage: "radial-gradient(circle, transparent 18%, black 70%)",
              maskImage: "radial-gradient(circle, transparent 18%, black 70%)",
            }}
          />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: DISC2_R - 190,
          top: DISC2_R - (380 * 440) / 600 / 2,
          filter: broken > 0 ? undefined : "saturate(0.45) brightness(0.8) blur(0.6px)",
        }}
      >
        <OldLogo id="frozen" width={380} part={part} />
      </div>
      {glassO > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            opacity: glassO,
            background: "linear-gradient(140deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 35%)",
            boxShadow: "inset 0 0 50px rgba(220,235,255,0.35)",
          }}
        />
      ) : null}
    </div>
  );
};

/** Glowing cracks racing out from the old logo; the same edges become the shards at the bloom. */
export const Cracks: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.crack + 6 || frame >= T.bloom) return null;
  const R = crackFront(frame);
  const heat = interpolate(frame, [T.crack, T.bloom], [0.4, 1], clamp);
  const items = CRACKS.map((c) => {
    const p = c.radial ? interpolate(R, [c.r0, c.r1], [0, 1], clamp) : interpolate(R, [c.r0 + 40, c.r0 + 140], [0, 1], clamp);
    return { d: c.d, p };
  }).filter((c) => c.p > 0);
  const layer = (stroke: string, width: number, opacity = 1) =>
    items.map((c, i) => (
      <path
        key={i}
        d={c.d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - c.p}
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={width}
      />
    ));
  // feathered clear zone behind "Es hora de / despertarla." — the cracks only cross the words on f467–468
  const clear = interpolate(frame, [T.bloom - 4, T.bloom - 2], [1, 0], clamp);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="crk-feather" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={30} />
        </filter>
        <mask id="crk-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <rect width={1080} height={1920} fill="#fff" />
          <rect x={56} y={370} width={900} height={290} rx={70} fill="#000" opacity={clear} filter="url(#crk-feather)" />
        </mask>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" mask="url(#crk-mask)">
        <g>{layer("rgba(0,0,0,0.5)", 5)}</g>
        <g style={{ filter: "blur(5px)" }}>{layer("#ffad5c", 10, 0.6 * heat)}</g>
        <g>{layer("#fff1d6", 1.8)}</g>
      </g>
    </svg>
  );
};
