import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C, Topo } from "../../brand";
import { T, ip } from "./timing";

/** Section colours: papel (Hoy) → tinta (rewind) → cobalto (Con Lonso Lab) → papel (close). */
export const Backgrounds: React.FC = () => {
  const f = useCurrentFrame();
  const curtain = ip(f, [T.calm - 9, T.calm + 1], [-1920, 0], Easing.bezier(0.55, 0, 0.35, 1));
  const tapeDark = ip(f, [T.tapeStop, T.rewind], [0, 0.22]);
  return (
    <AbsoluteFill>
      {f < T.rewind ? (
        <AbsoluteFill style={{ background: C.papel }}>
          <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 62%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)" }} />
          <Topo color={C.cobalto} opacity={0.2} drawFrom={-24} drawDuration={70} drift={7} />
          <AbsoluteFill style={{ background: C.tinta, opacity: tapeDark }} />
        </AbsoluteFill>
      ) : f < T.drop ? (
        <AbsoluteFill style={{ background: C.tinta }}>
          <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 60%, rgba(35,64,216,0.35) 0%, rgba(35,64,216,0) 70%)" }} />
          <Topo color="#6f86ff" opacity={0.22} drift={-30} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ background: C.cobalto }}>
          <AbsoluteFill style={{ background: "radial-gradient(65% 42% at 50% 62%, rgba(120,140,255,0.55) 0%, rgba(120,140,255,0) 70%)" }} />
          <Topo color={C.papel} opacity={0.22} drawFrom={T.drop} drawDuration={46} drift={9} />
          {/* (no bear watermark here any more: cropped by the frame it read as a stray pillar;
              the brand now rides on the bear sticker slapped on the phone) */}
        </AbsoluteFill>
      )}
      {f >= T.calm - 10 ? (
        <AbsoluteFill style={{ background: C.papel, translate: `0 ${curtain}px`, boxShadow: "0 30px 60px rgba(10,14,40,0.35)" }}>
          <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 55%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)" }} />
          <Topo color={C.cobalto} opacity={0.18} drawFrom={T.calm} drawDuration={60} drift={5} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
