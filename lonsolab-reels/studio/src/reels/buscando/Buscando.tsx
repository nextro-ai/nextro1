import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, SafeZone, shake } from "../../brand";
import { Backgrounds } from "./Backgrounds";
import { Closing } from "./End";
import { Glitch, Grain, Vignette, VhsOverlay } from "./Fx";
import { Headline } from "./Headline";
import { NotifRain } from "./Notifs";
import { ServiceCards } from "./Services";
import { Soundtrack } from "./Sound";
import { PhoneStage } from "./Stage";
import { T, ip, beat } from "./timing";

const OTRO_HIT = beat(17); // 232: the orange slam on "otro."
const REBOBINEMOS = 285; // swaps in under the glitch_1 hit

/** RGB split / band displacement amounts for the VHS rewind (each band hit ≤ 5 f). */
const glitchAt = (f: number) => {
  let split = 0;
  let bands = 0;
  if (f >= T.tapeStop && f < T.rewind) split = ip(f, [T.tapeStop, T.rewind - 1], [0, 4]);
  if (f >= T.rewind && f < T.rewindEnd) split = 6 + 2 * Math.sin(f * 1.7);
  if (f >= T.rewindEnd && f < T.drop) split = 3;
  const hits: [number, number, number][] = [
    [T.rewind, 16, 60],
    [REBOBINEMOS, 22, 80],
    [301, 12, 36],
  ];
  for (const [a, s, b] of hits) {
    if (f >= a && f < a + 4) {
      split = Math.max(split, s);
      bands = b * (1 - (f - a) / 4);
    }
  }
  if (f >= T.drop && f < T.drop + 4) split = ip(f, [T.drop, T.drop + 4], [12, 0]);
  return { split, bands };
};

const Headlines: React.FC = () => {
  const f = useCurrentFrame();
  // the punchline stays on through the cut to the ink rewind: flip it to paper there
  const otroInk = f >= T.rewind ? C.papel : C.tinta;
  return (
    <>
      {/* 1 · hook (starts before f0 so the cover frame already has text) */}
      <Headline at={-6} out={T.scroll - 1} size={104} color={C.tinta} top={330} lines={[["Alguien", "busca"], ["lo", "que", { t: "vendés.", c: C.cobalto }]]} />
      {/* 2 */}
      <Headline at={T.scroll} out={209} size={118} color={C.tinta} top={326} lines={[["Así", "te", "ve"], ["tu", { t: "cliente.", c: C.cobalto }]]} />
      {/* 3 · punchline: in half a beat before the tap, tight stagger, held (glitched) into the
          rewind and hard-swapped for "Rebobinemos." under the glitch_1 hit → 74 f on screen */}
      <Headline
        at={211}
        out={REBOBINEMOS - 1}
        cut
        wordStagger={1}
        lineStagger={1}
        size={118}
        color={otroInk}
        top={326}
        lines={[["Y", "le", "compra"], ["a", { t: "otro.", c: C.tinta, mark: C.pin, markAt: OTRO_HIT }]]}
      />
      {/* 4 · rewind */}
      <Headline at={REBOBINEMOS} out={T.drop - 1} exitDur={3} size={122} stretch={100} weight={860} color={C.papel} top={372} lines={[["Rebobinemos."]]} />
      {/* 5 · drop */}
      <Headline
        at={T.drop + 3}
        out={T.notifs - 3}
        size={96}
        color={C.papel}
        top={300}
        lines={[["Con", "Lonso", "Lab,"], ["te", { t: "encuentran.", under: C.pin }]]}
      />
      {/* 6 */}
      <Headline at={T.notifs + 4} out={T.cards[0] - 6} size={150} color={C.papel} top={322} lines={[["Y", "te", { t: "eligen.", under: C.pin }]]} />
      {/* 8 · calm: whole line at once, exit starts f834 */}
      <Headline
        at={T.calm + 1}
        out={T.end - 1}
        exitDur={5}
        exitStagger={0}
        wordStagger={0}
        lineStagger={0}
        size={108}
        color={C.tinta}
        top={352}
        lines={[["Tu", "próximo"], ["cliente", "ya"], ["está", { t: "buscando.", c: C.cobalto }]]}
      />
      {/* 9 · end card */}
      <Headline at={T.end - 1} size={166} color={C.tinta} top={330} align="center" lines={[["Auditoría"], ["gratis"]]} />
      <Headline at={T.end + 5} size={76} stretch={108} weight={760} color={C.cobalto} top={668} align="center" lines={[["en", "24", "h", "hábiles."]]} />
    </>
  );
};

export const Buscando: React.FC = () => {
  const f = useCurrentFrame();
  const g = glitchAt(f);
  const sh = shake(f, OTRO_HIT, 9, 8);
  const flash = f < T.drop ? 0 : ip(f, [T.drop, T.drop + 1, T.drop + 3], [0.4, 0.18, 0]);
  return (
    <AbsoluteFill style={{ background: C.papel }}>
      <Glitch split={g.split} bands={g.bands} seed={f}>
        <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
          <Backgrounds />
          <PhoneStage />
          <NotifRain />
          <ServiceCards />
          <Closing />
          <Headlines />
        </AbsoluteFill>
        <VhsOverlay from={T.rewind} to={T.drop - 1} />
      </Glitch>
      {flash > 0 ? <AbsoluteFill style={{ background: C.papel, opacity: flash }} /> : null}
      <Vignette strength={f >= T.rewind && f < T.drop ? 0.4 : 0.1} />
      <Grain opacity={0.09} />
      <Soundtrack />
      <SafeZone />
    </AbsoluteFill>
  );
};
