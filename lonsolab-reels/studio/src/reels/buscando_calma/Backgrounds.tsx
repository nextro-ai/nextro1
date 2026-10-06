import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Topo } from "../../brand";
import { alpha, useTheme } from "./theme";
import { T, io, ip } from "./timing";

/**
 * Fields: bg (problem) → bg2, a half-step quieter, while the story rewinds and waits →
 * `dark` only as the field of the turn (drop → services) → bg again for the close.
 */
export const Backgrounds: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  const quiet = f < T.drop ? ip(f, [T.rewind, T.rewind + 14], [0, 1], io) : 0;
  // the field turns back with the whoosh (f977) so the closing headline (in from f981) lands on a light field
  const darkO = f < T.drop ? 0 : 1 - ip(f, [T.calm - 4, T.calm + 10], [0, 1], io);
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      {quiet > 0 ? <AbsoluteFill style={{ background: t.bg2, opacity: quiet }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(70% 42% at 50% 64%, ${alpha(t.surface, 0.85)} 0%, ${alpha(t.surface, 0)} 70%)` }} />
      <Topo color={t.topo} opacity={0.11} drawFrom={-30} drawDuration={70} drift={4} />
      {darkO > 0 ? (
        <AbsoluteFill style={{ background: t.dark, opacity: darkO }}>
          <AbsoluteFill style={{ background: `radial-gradient(65% 42% at 50% 60%, ${alpha(t.onDark, 0.1)} 0%, ${alpha(t.onDark, 0)} 70%)` }} />
          <Topo color={t.onDark} opacity={0.12} drawFrom={T.drop} drawDuration={50} drift={5} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
