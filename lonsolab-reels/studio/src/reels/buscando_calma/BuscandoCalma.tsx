import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeZone } from "../../brand";
import { Backgrounds } from "./Backgrounds";
import { Closing } from "./End";
import { Grain, Vignette } from "./Fx";
import { Headline } from "./Headline";
import { Notifs } from "./Notifs";
import { Services } from "./Services";
import { Soundtrack } from "./Sound";
import { PhoneStage } from "./Stage";
import { ThemeProvider, useTheme } from "./theme";
import { T, eo, ei, ip } from "./timing";

export type BuscandoCalmaProps = { theme: string; safe?: boolean };

/** One idea per plate; every plate ≥ 75 f (see NOTES.md for the measured holds). */
const Headlines: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  return (
    <>
      <Headline at={-30} out={T.spot - 1} size={112} color={t.ink} top={322} lines={[["Alguien", "busca"], ["lo", "que", "vendés."]]} />
      <Headline at={T.spot} out={T.h3 - 1} size={100} color={t.ink} top={322} lines={[["Así", "te", "encuentra"], ["hoy:"]]} />
      <Headline
        at={T.h3}
        out={T.rewind - 1}
        size={116}
        color={t.ink}
        top={322}
        lines={[["Y", "le", "compra"], ["a", { t: "otro.", mark: { bg: t.accent, fg: t.onAccent, at: T.callIn } }]]}
      />
      <Headline at={T.rewind + 3} out={T.ahora - 1} size={110} color={t.ink} top={452} lines={[["Rebobinemos."]]} />
      {/* set up in the quiet bar, still on screen when the field turns on the drop */}
      <Headline
        at={T.ahora}
        out={T.primero - 1}
        size={106}
        color={f >= T.drop ? t.onDark : t.ink}
        top={322}
        lines={[["Ahora,"], ["con", "Lonso", "Lab:"]]}
      />
      <Headline at={T.primero} out={T.eligen - 1} size={112} color={t.onDark} top={322} lines={[["Te", "encuentran"], [{ t: "primero.", under: t.accent }]]} />
      <Headline at={T.eligen} out={T.svc - 1} size={124} color={t.onDark} top={350} lines={[["Y", "te", "eligen."]]} />
      {/* the closing message comes in as one block (10 f), settled f991–1089 = 98 f (needs 90) */}
      <Headline
        at={T.calm}
        out={T.end + 8}
        block={10}
        size={106}
        color={t.ink}
        top={330}
        lines={[["Tu", "próximo"], ["cliente", "ya"], ["está", "buscando."]]}
      />
    </>
  );
};

/** ◀◀ above "Rebobinemos.": slides in leftwards (the rewind direction) and stays, no blinking. */
const RewindGlyph: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  if (f < T.rewind || f >= T.ahora) return null;
  const k = ip(f, [T.rewind, T.rewind + 14], [0, 1], eo);
  const out = ip(f, [T.ahora - 10, T.ahora - 1], [0, 1], ei);
  return (
    <svg
      width="150"
      height="82"
      viewBox="0 0 62 34"
      style={{ position: "absolute", left: 96, top: 334, opacity: Math.min(1, k * 1.5) * (1 - out), translate: `${(1 - k) * 46}px ${-24 * out}px` }}
    >
      <path d="M30 2 L2 17 L30 32 Z M60 2 L32 17 L60 32 Z" fill={t.ink} strokeLinejoin="round" stroke={t.ink} strokeWidth={2} />
    </svg>
  );
};

const Scene: React.FC<{ safe?: boolean }> = ({ safe }) => {
  const t = useTheme();
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Backgrounds />
      <PhoneStage />
      <RewindGlyph />
      <Notifs />
      <Services />
      <Closing />
      <Headlines />
      <Vignette strength={0.1} />
      <Grain opacity={0.04} />
      <Soundtrack />
      <SafeZone show={!!safe} force={!!safe} />
    </AbsoluteFill>
  );
};

export const BuscandoCalma: React.FC<BuscandoCalmaProps> = ({ theme, safe }) => (
  <ThemeProvider theme={theme}>
    <Scene safe={safe} />
  </ThemeProvider>
);
