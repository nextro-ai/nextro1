import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT, Topo } from "../../brand";
import { depthLook, depthOf, CARD } from "./stack";
import { B, T } from "./timing";
import { CL, HandStroke, Line, Vignette, p01 } from "./ui";

const GHOST_SIZE = 250; // "TRABAJO" ≈ 990 px wide at wdth 75 %
const GHOST_X = 50;

/** Stage behind everything from the dip on: papel, topo lines and the ghost word. */
export const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const ghost = p01(f, T.c1 - 4, 24);
  // whole word always in frame: ~1000 px wide, drifting 40 px over the stack
  const drift = interpolate(f, [T.c1, T.grid], [0, -35], CL);
  return (
    <AbsoluteFill style={{ background: C.papel, overflow: "hidden" }}>
      <Topo color={C.cobalto} opacity={0.3} drawFrom={T.mira - 8} drawDuration={64} drift={8} scale={1.3} strokeWidth={1.5} />
      {/* ghost word, 5 % */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 30,
          whiteSpace: "nowrap",
          fontFamily: FONT,
          fontWeight: 900,
          fontStretch: "75%",
          fontSize: GHOST_SIZE,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: C.tinta,
          opacity: 0.05 * ghost,
          translate: `${GHOST_X + drift}px ${(1 - ghost) * 60}px`,
        }}
      >
        TRABAJO
      </div>
      <Vignette strength={0.12} />
    </AbsoluteFill>
  );
};

/** Scene 2: "Mirá el trabajo." with a hand-drawn arrow pointing down, during the music dip. */
export const SceneMira: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.mira - 4 || f > T.c3 + 4) return null;
  const d = depthOf(f, -1);
  const L = depthLook(d);
  // not a card: once covered it fades and softens more than the cards do, so no half-read text peeks above the stack
  const op = Math.max(0, 1 - 0.85 * Math.min(1, d));
  const blur = Math.min(1, d) * 14;
  // slow push-in while the riser builds
  const push = interpolate(f, [T.riserStart, T.c1 - 4], [1, 1.06], { ...CL, easing: EASE.inOut });
  // anticipation: the block compresses right before the drop
  const squash = interpolate(f, [T.c1 - 8, T.c1 - 2, T.c1 + 2], [1, 0.97, 1], CL);
  // arrow bobs down on every beat after it is drawn
  let bob = 0;
  for (let n = 11; n < 16; n++) {
    const at = B(n);
    bob += interpolate(f, [at, at + 3, at + 12], [0, 26, 0], { ...CL, easing: EASE.salida });
  }
  const label = p01(f, T.mira + 4, 14);
  return (
    <AbsoluteFill
      style={{
        opacity: op * (d > 1 ? Math.max(0, 2 - d) : 1),
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        transformOrigin: `540px ${CARD.y}px`,
        scale: `${L.s * push * squash}`,
        translate: `0 ${L.dy}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 318,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: label,
          translate: `${(1 - label) * -24}px 0`,
          fontFamily: FONT,
          fontWeight: 700,
          fontStretch: "75%",
          fontSize: 44,
          letterSpacing: "0.2em",
          color: C.tinta2,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ width: 16, height: 16, borderRadius: 8, background: C.pin }} />
        ARCHIVO <span style={{ opacity: 0.5 }}>//</span> 5 CASOS REALES
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 400,
          fontFamily: FONT,
          fontWeight: 800,
          fontStretch: "112%",
          fontSize: 200,
          lineHeight: 0.98,
          letterSpacing: "-0.035em",
          color: C.tinta,
        }}
      >
        <Line at={T.mira - 3} dur={14}>
          Mirá el
        </Line>
        <Line at={T.mira} dur={14}>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                position: "absolute",
                left: -10,
                right: -8,
                top: "16%",
                bottom: "-2%",
                background: C.pin,
                borderRadius: 14,
                transformOrigin: "left center",
                scale: `${p01(f, B(13) - 2, 10)} 1`,
                rotate: "-1.5deg",
              }}
            />
            <span style={{ position: "relative" }}>trabajo.</span>
          </span>
        </Line>
      </div>
      <div style={{ position: "absolute", inset: 0, translate: `0 ${bob}px` }}>
        <HandStroke
          d="M 300 860 C 360 960, 520 1000, 600 940 C 660 895, 610 830, 555 860 C 490 895, 520 1010, 560 1080 C 585 1125, 590 1160, 586 1215"
          at={T.arrow}
          dur={16}
          color={C.pin}
          width={17}
          head={62}
        />
      </div>
    </AbsoluteFill>
  );
};
