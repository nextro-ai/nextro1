import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { MapCard } from "./MapCard";
import { Highlight } from "./marks";
import { T } from "./timing";
import { Rise, head } from "./type";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PLATE: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 700,
  fontStretch: "100%",
  fontSize: 84,
  lineHeight: 1.14,
  letterSpacing: "-0.012em",
  whiteSpace: "nowrap",
};
const BOX: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 28px 12px",
  borderRadius: 20,
};

/**
 * Native-caption POV plate (white on an ink box, rounded corners). The text is readable from f0:
 * an ink copy sits on the paper and the box wipes in behind it in 6 f, flipping it to white.
 */
const PovPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = ["POV: tu negocio", "es buenísimo…"];
  // sits in the optical centre of the empty page, then makes room for the punchline
  const lift = interpolate(frame, [T.nadie - 2, T.nadie + 10], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  return (
    <div
      style={{ position: "absolute", left: 90, top: 304 + 150 * (1 - lift) }}
    >
      {lines.map((l, i) => {
        const p = interpolate(frame, [i, i + 6], [0, 1], {
          ...clamp,
          easing: EASE.salida,
        });
        return (
          <div
            key={l}
            style={{
              position: "relative",
              height: 84 * 1.14 + 18,
              marginBottom: 2,
            }}
          >
            {/* ink copy: legible before the box arrives */}
            <div
              style={{
                ...PLATE,
                ...BOX,
                position: "absolute",
                left: 0,
                top: 0,
                color: C.tinta,
              }}
            >
              {l}
            </div>
            <div
              style={{
                ...PLATE,
                ...BOX,
                position: "absolute",
                left: 0,
                top: 0,
                color: C.blanco,
                background: C.tinta,
                boxShadow: "0 18px 36px -22px rgba(19,24,43,0.55)",
                clipPath: `inset(-40px ${(1 - p) * 100}% -40px 0 round 20px)`,
                visibility: p > 0 ? "visible" : "hidden",
              }}
            >
              {l}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** "…y nadie se entera." — big editorial type with a pin highlighter on "nadie". */
const Punchline: React.FC = () => {
  const s = head(126, C.tinta, 104);
  return (
    <div style={{ position: "absolute", left: 90, top: 580 }}>
      <Rise at={T.nadie} style={s}>
        <span>…y </span>
        <span style={{ position: "relative", display: "inline-block" }}>
          <Highlight at={T.nadieHi} seed="nadie" />
          <span style={{ position: "relative" }}>nadie</span>
        </span>
      </Rise>
      <Rise at={T.nadie + 3} style={s}>
        se entera.
      </Rise>
    </div>
  );
};

export const SceneHook: React.FC = () => (
  <AbsoluteFill>
    <MapCard
      top={884}
      zf={[0, T.nadie, T.nadie + 30, T.lista]}
      zv={[1.06, 1.0, 0.3, 0.27]}
      ze={[EASE.inOut, EASE.salida, (t) => t]}
      dropAt={0}
      starsAt={6}
      pings={[
        { at: T.povHalf, r: 150 },
        { at: T.povEcho, r: 110 },
      ]}
    />
    <PovPlate />
    <Punchline />
  </AbsoluteFill>
);
