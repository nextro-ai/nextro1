import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { shake } from "../../brand";
import { Device, PH, SCREEN } from "./Device";
import { alpha, mix, shadow, useTheme } from "./theme";
import { T, enter, ei, eo, io, ip } from "./timing";
import {
  AlertIcon,
  CallScreen,
  ConTuCard,
  Finger,
  HoyTuItem,
  Keyboard,
  MapView,
  MissingInfo,
  NoPhotoIcon,
  RIVALS,
  ResultItem,
  SEARCH_TEXT,
  SearchBar,
  UI,
  font,
  typedAt,
  typedCount,
} from "./ui";

const RW = T.rewind;

/* -------------------------------------------------------------------------- */
/* "Hoy" state, one function per element. The rewind (f382–426) runs a few of  */
/* them backwards in order (call → results → keyboard): a clean reverse, no     */
/* scrubbing through every earlier state, no glitch.                            */
/* -------------------------------------------------------------------------- */
export const REWIND = {
  call: [RW + 2, RW + 16],
  results: (i: number) => [RW + 16 + (2 - i) * 5, RW + 28 + (2 - i) * 5],
  keyboard: [RW + 30, RW + 44],
} as const;

const kbOut = (f: number) =>
  ip(f, [T.submit + 2, T.submit + 16], [0, 1], io) * (1 - ip(f, REWIND.keyboard, [0, 1], io));
const resK = (f: number, i: number) =>
  enter(f, T.results[i], 14) * (1 - ip(f, REWIND.results(i), [0, 1], io));
export const liftOf = (f: number) =>
  ip(f, [T.spot + 4, T.spot + 20], [0, 1], eo) * (1 - ip(f, [T.h3 + 4, T.h3 + 18], [0, 1], io));
export const callOf = (f: number) =>
  ip(f, [T.tap + 2, T.callIn + 2], [0, 1], eo) * (1 - ip(f, REWIND.call, [0, 1], io));

/* ------------------------------- Camera ---------------------------------- */
type Cam = { x: number; y: number; s: number; rx: number; o: number };
export const camera = (f: number): Cam => {
  // a slight fixed tilt that straightens slowly; no constant 3D rotation
  const rx = ip(f, [0, 150], [5, 0], io);
  if (f < T.drop) {
    const s =
      1 +
      0.02 * ip(f, [0, RW], [0, 1], io) -
      0.02 * ip(f, [RW, RW + 44], [0, 1], io) +
      0.025 * ip(f, [T.rewindEnd, T.drop], [0, 1], io);
    return { x: 0, y: 0, s, rx, o: 1 };
  }
  // the drop: the one short hit of the reel (≤ 8 f, low amplitude), then a slow push
  const sh = shake(f, T.drop, 6, 7);
  const punch = ip(f, [T.drop, T.drop + 8], [0.03, 0], eo);
  // the phone leaves inside the headline's exit (f699–707) so "Y te eligen." opens on a clean field
  const exit = ip(f, [T.eligen - 10, T.eligen - 2], [0, 1], ei);
  return {
    x: sh.x,
    y: sh.y + 50 * exit,
    s: (1 + punch + 0.02 * ip(f, [T.drop + 8, T.eligen], [0, 1], io)) * (1 - 0.05 * exit),
    rx: 0,
    o: 1 - exit,
  };
};

/* ------------------------------ Hoy screen -------------------------------- */
const keyOf = (ch: string) => (ch === "í" ? "i" : ch === "é" ? "e" : ch);

const HoyScreen: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const n = typedCount(f);
  const kb = kbOut(f);
  const lift = liftOf(f);
  const call = callOf(f);
  const lastT = n > 0 ? typedAt(n - 1) : -99;
  const typing = f >= T.typeStart && f < typedAt(SEARCH_TEXT.length - 1) + 3;
  const activeKey = typing && f - lastT < 3 && n > 0 ? keyOf(SEARCH_TEXT[n - 1]) : null;
  const waiting = f < T.submit || (f > REWIND.keyboard[1] && f < T.search2);
  const cursor = waiting && (typing || Math.floor(f / 12) % 2 === 0);
  const item = (i: number): React.CSSProperties => ({ opacity: resK(f, i), translate: `0 ${(1 - resK(f, i)) * 28}px` });
  const mw = SCREEN.w - UI.side * 2;
  const tapX = 300;
  const tapY = UI.listTop + UI.itemH / 2;
  return (
    <AbsoluteFill style={{ background: t.surface }}>
      <MapView
        top={UI.hoyMapTop}
        height={UI.hoyMapH}
        pins={[
          { x: mw * 0.22, y: UI.hoyMapH * 0.48, kind: "rival", label: "1", k: resK(f, 0) },
          { x: mw * 0.6, y: UI.hoyMapH * 0.32, kind: "rival", label: "2", k: resK(f, 1) },
          { x: mw * 0.8, y: UI.hoyMapH * 0.74, kind: "ghost", k: resK(f, 2) },
        ]}
      />
      {RIVALS.map((r, i) => (
        <ResultItem
          key={r.name}
          r={r}
          top={UI.listTop + i * UI.itemH}
          pressed={i === 0 ? ip(f, [T.tap, T.tap + 1, T.tap + 14], [0, 1, 0]) : 0}
          style={item(i)}
        />
      ))}
      {lift > 0.02 ? (
        // the slot stays empty while the card is lifted out
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: UI.listTop + 2 * UI.itemH + 10,
            height: UI.hoyTuH - 20,
            borderRadius: 24,
            border: `3px dashed ${t.line}`,
            background: mix(t.surface, t.bg2, 0.5),
          }}
        />
      ) : (
        <HoyTuItem style={{ top: UI.listTop + 2 * UI.itemH, ...item(2) }} />
      )}
      {/* white strip behind the search bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: UI.listTop - 6, background: t.surface, zIndex: 11 }} />
      <SearchBar text={SEARCH_TEXT.slice(0, n)} cursor={cursor} pressed={ip(f, [T.search2 - 1, T.search2 + 1, T.search2 + 6], [0, 1, 0])} />
      <Keyboard
        y={kb * 600}
        activeKey={activeKey}
        searchPress={ip(f, [T.submit - 2, T.submit, T.submit + 4], [0, 1, 0]) + ip(f, [T.search2 - 2, T.search2, T.search2 + 4], [0, 1, 0])}
      />
      {/* spotlight: everything but "Tu negocio" steps back */}
      <AbsoluteFill style={{ background: alpha(t.ink, 0.5 * lift), zIndex: 20 }} />
      <Finger
        x={ip(f, [T.tap - 12, T.tap - 3], [520, tapX], io)}
        y={ip(f, [T.tap - 12, T.tap - 3], [560, tapY], io)}
        opacity={ip(f, [T.tap - 13, T.tap - 8, T.tap + 6, T.tap + 11], [0, 1, 1, 0])}
        press={ip(f, [T.tap - 2, T.tap, T.tap + 5], [0, 1, 0])}
        ripple={ip(f, [T.tap, T.tap + 10], [0, 1])}
      />
      {call > 0.001 ? <CallScreen t0={f - T.callIn} slide={call} name={RIVALS[0].name} initials={RIVALS[0].initials} /> : null}
    </AbsoluteFill>
  );
};

/**
 * "Tu negocio" lifts out of the list toward the viewer (phone-local coords) and opens up to
 * show its three red flags at 46 px, while the rest of the phone dims.
 */
const SLOT = { x: PH.bezel, y: PH.bezel + UI.listTop + 2 * UI.itemH, w: SCREEN.w, h: UI.hoyTuH };
const FOCUS = { x: -10, y: 226, w: 860, h: 336 }; // canvas x 110..970, y 876..1212 (text ends x < 720)
const FLAGS = ["Sin fotos", "Horario no disponible", "Reseñas sin responder"] as const;

const LiftedCard: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const lift = liftOf(f);
  if (lift <= 0.02) return null;
  const L = (a: number, b: number) => a + (b - a) * lift;
  const bg = mix(t.surface, t.bg2, 0.75 * (1 - lift));
  // one flag per beat (177/191/204), each on screen ≥ 69 f before they leave at f273
  const rowsIn = (i: number) => ip(f, [T.flags[i], T.flags[i] + 10], [0, 1], eo) * ip(f, [T.h3, T.h3 + 6], [1, 0]);
  const smallOut = ip(f, [T.spot + 6, T.spot + 12], [1, 0]) + ip(f, [T.h3 + 12, T.h3 + 18], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: L(SLOT.x, FOCUS.x),
        top: L(SLOT.y, FOCUS.y),
        width: L(SLOT.w, FOCUS.w),
        height: L(SLOT.h, FOCUS.h),
        borderRadius: 30 * lift,
        background: bg,
        border: `3px solid ${alpha(t.warn, 0.45 * lift)}`,
        boxShadow: shadow(t, 1.3 * lift),
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <div style={{ position: "absolute", left: 40, top: L(24, 26), ...font(L(50, 56), 760, t.ink2) }}>Tu negocio</div>
      <MissingInfo top={96} opacity={Math.min(1, smallOut)} />
      {FLAGS.map((txt, i) => (
        <div
          key={txt}
          style={{
            position: "absolute",
            left: 40,
            top: 106 + i * 72,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: rowsIn(i),
            translate: `${(1 - rowsIn(i)) * 18}px 0`,
            ...font(46, 650, t.warn),
          }}
        >
          {i === 0 ? <NoPhotoIcon size={48} color={t.warn} gap={t.surface} /> : <AlertIcon size={46} color={t.warn} fg={t.surface} />}
          {txt}
        </div>
      ))}
    </div>
  );
};

/* ------------------------------ Con screen -------------------------------- */
const ConScreen: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const tnO = 1;
  const tnS = ip(f, [T.drop, T.drop + 10], [0.94, 1], eo);
  const row = (i: number) => enter(f, T.conRows[i], 14);
  const you = enter(f, T.conPin, 12);
  const spot = ip(f, [T.primero, T.primero + 12], [0, 0.45], eo);
  const glow = ip(f, [T.primero, T.primero + 6, T.primero + 40], [0, 1, 0]);
  const mw = SCREEN.w - UI.side * 2;
  return (
    <AbsoluteFill style={{ background: t.surface }}>
      <MapView
        top={UI.conMapTop}
        height={UI.conMapH}
        ring={f > T.conPin + 10 ? (((f - T.conPin - 10) % 45) / 45) : -1}
        pins={[
          { x: mw * 0.22, y: UI.conMapH * 0.45, kind: "rival", label: "2", k: row(0) },
          { x: mw * 0.72, y: UI.conMapH * 0.3, kind: "rival", label: "3", k: row(1) },
          { x: mw * 0.48, y: UI.conMapH * 0.68, kind: "you", k: you },
        ]}
      />
      {RIVALS.map((r, i) => (
        <ResultItem
          key={r.name}
          r={r}
          top={UI.listTop + UI.conTuH + 24 + i * UI.itemH}
          style={{ opacity: row(i), translate: `0 ${(1 - row(i)) * 28}px` }}
        />
      ))}
      <SearchBar text={SEARCH_TEXT} cursor={false} />
      {/* spotlight on the complete profile */}
      <AbsoluteFill style={{ background: alpha(t.ink, spot), zIndex: 15 }} />
      <ConTuCard glow={glow} style={{ top: UI.listTop, opacity: tnO, scale: `${tnS}`, zIndex: 18 }} />
    </AbsoluteFill>
  );
};

/* -------------------------------- Stage ----------------------------------- */
export const PhoneStage: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= T.eligen - 1) return null;
  const cam = camera(f);
  const hoy = f < T.drop;
  const dark = hoy ? callOf(f) : 0;
  return (
    <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: "540px 900px" }}>
      <div
        style={{
          position: "absolute",
          left: PH.left,
          top: PH.top,
          width: PH.w,
          height: PH.h,
          transformOrigin: `${PH.w / 2}px 0px`,
          transform: `translate(${cam.x}px, ${cam.y}px) rotateX(${cam.rx}deg) scale(${cam.s})`,
          opacity: cam.o,
        }}
      >
        <Device darkScreen={dark} rim={hoy ? 0 : 1} outside={hoy ? <LiftedCard f={f} /> : null}>
          {hoy ? <HoyScreen f={f} /> : <ConScreen f={f} />}
        </Device>
      </div>
    </AbsoluteFill>
  );
};
