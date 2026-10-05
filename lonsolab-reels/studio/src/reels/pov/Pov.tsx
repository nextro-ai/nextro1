import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../../brand";
import { Paper } from "./Paper";
import { SceneAfter } from "./ScenePages";
import { SceneBefore, SceneBreak } from "./SceneBefore";
import { SceneHook } from "./SceneHook";
import { Soundtrack } from "./Sound";
import { T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Render children only inside [from, to) — scenes keep absolute frame numbers. */
const Span: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};

/** Page turn: 12 f lateral wipe centred on the downbeat of bar 6 (f503). */
const TURN_A = T.turn - 6;
const TURN_B = T.turn + 6;

const PageA: React.FC = () => (
  <Paper id="a">
    <Span from={0} to={T.lista}>
      <SceneHook />
    </Span>
    <Span from={T.lista} to={TURN_B}>
      <SceneBefore />
    </Span>
    <Span from={T.breakdown} to={TURN_B}>
      <SceneBreak />
    </Span>
  </Paper>
);

const PageB: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper id="b" dark={frame < T.groove}>
      <SceneAfter />
    </Paper>
  );
};

export const Pov: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [TURN_A, TURN_B], [0, 1], {
    ...clamp,
    easing: EASE.inOut,
  });
  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      {frame < TURN_B ? (
        <AbsoluteFill style={{ translate: `${-t * 300}px 0` }}>
          <PageA />
          <AbsoluteFill style={{ background: C.tinta, opacity: t * 0.35 }} />
        </AbsoluteFill>
      ) : null}
      {frame >= TURN_A ? (
        <AbsoluteFill
          style={{
            translate: `${(1 - t) * 1120}px 0`,
            boxShadow:
              t < 1
                ? "-30px 0 60px rgba(19,24,43,0.35), -2px 0 0 rgba(19,24,43,0.18)"
                : undefined,
          }}
        >
          <PageB />
        </AbsoluteFill>
      ) : null}
      <Soundtrack />
    </AbsoluteFill>
  );
};
