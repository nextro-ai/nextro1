import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C, FONT, Icon, Logo, shake } from "../../brand";
import { Device, PH, SCREEN } from "./Device";
import { VBlurDef } from "./Fx";
import { T, ip, sp, eo, io, ei, rnd } from "./timing";
import {
  CALLEE_TU,
  CallScreen,
  ConTuCard,
  Finger,
  HoyTuCard,
  Keyboard,
  MapView,
  RIVALS,
  ResultItem,
  SEARCH_TEXT,
  SearchBar,
  Skeleton,
  Suggestions,
  TYPE_TIMES,
  UI,
  typedCount,
} from "./ui";

/* -------------------------------------------------------------------------- */
/* Story time. The "Hoy" phone is a pure function of a story frame `sf`, so    */
/* the VHS rewind just runs sf backwards (stepped at 15 fps for a tape feel).   */
/* -------------------------------------------------------------------------- */
export const REWIND_TO = -14;
export const sfOf = (f: number) => {
  if (f < T.tapeStop) return f;
  if (f < T.rewind) return T.tapeStop + (f - T.tapeStop) * 0.3; // tape slowing down
  if (f < T.rewindEnd) {
    const q = T.rewind + Math.floor((f - T.rewind) / 2) * 2;
    return ip(q, [T.rewind, T.rewindEnd - 2], [T.tapeStop + 1.5, REWIND_TO], Easing.bezier(0.45, 0, 0.6, 1));
  }
  return REWIND_TO;
};

/* a short scroll: the map slides under the search bar and "Tu negocio" ends up at the
   bottom of the visible list, with the three competitors (stars, "Abierto ahora") above it */
const SCROLL_MAX = 100;
const scrollOf = (sf: number) => SCROLL_MAX * sp(sf, T.scroll - 2, 26, 120) * (1 - ip(sf, [T.liftBack - 1, T.tap - 4], [0, 1], io));
const liftOf = (sf: number) => sp(sf, T.lift, 15, 160) * (1 - ip(sf, [T.liftBack - 4, T.liftBack + 6], [0, 1], io));
/* the call screen slides up over the list in 4 frames (no crossfade, no doubled text) */
const callOf = (sf: number) => ip(sf, [222, 226], [0, 1], eo);

/* ------------------------------- Camera ---------------------------------- */
type Cam = { x: number; y: number; s: number; rx: number; ry: number; rz: number };
const BASE_S = 0.84;
const BASE_TOP = 600;

const hoyCam = (sf: number): Cam => {
  const lift = liftOf(sf);
  return {
    x: 0,
    y: 0,
    s: BASE_S * ip(sf, [0, 268], [1, 1.07], io) * (1 - 0.025 * lift),
    rx: ip(sf, [0, 268], [7, 2], io),
    ry: ip(sf, [0, 268], [-14, -4], io),
    rz: 0,
  };
};

export const camera = (f: number): Cam => {
  if (f < T.drop) {
    const c = hoyCam(sfOf(f));
    // tap punch
    c.s *= 1 + 0.012 * ip(f, [T.tap, T.tap + 2, T.tap + 8], [0, 1, 0]);
    // tape stop: the picture sags
    c.y += ip(f, [T.tapeStop, T.rewind], [0, 14], ei);
    if (f >= T.rewind && f < T.rewindEnd) {
      c.x += (rnd(f) - 0.5) * 12;
      c.y += 14 + (rnd(f + 99) - 0.5) * 10;
      c.rz += (rnd(f + 7) - 0.5) * 1.2;
    }
    if (f >= T.rewindEnd) {
      // tension hold before the drop: slow push + a growing tremble
      const k = ip(f, [T.rewindEnd, T.drop], [0, 1]);
      c.s *= 1 + 0.03 * k;
      c.x += Math.sin(f * 2.3) * 3 * k;
      c.y += 6 + Math.cos(f * 3.1) * 2 * k;
    }
    return c;
  }
  // "Con Lonso Lab": snaps in from the other side, settles frontal and a bit bigger.
  const k = sp(f, T.drop, 12, 110);
  const sh = shake(f, T.drop, 22, 14);
  const exit = ip(f, [T.cards[0] - 14, T.cards[0] + 6], [0, 1], ei);
  return {
    x: sh.x,
    y: -10 + sh.y + (f > T.notifs ? Math.sin((f - T.notifs) / 16) * 5 : 0) + exit * 1500,
    s: BASE_S * (1.1 - 0.1 * k) * ip(f, [T.drop, T.notifs], [1, 1.03], eo),
    rx: 9 * (1 - k) + exit * 28 + ip(f, [T.drop + 24, T.notifs], [0, 3], io),
    ry: 18 * (1 - k) + ip(f, [T.drop + 24, T.notifs], [0, -6], io),
    rz: -2 * (1 - k) + exit * 8,
  };
};

/* ------------------------------ Hoy screen -------------------------------- */
const keyOf = (ch: string) => (ch === "í" ? "i" : ch === "é" ? "e" : ch);

const HoyScreen: React.FC<{ sf: number; f: number }> = ({ sf, f }) => {
  const n = typedCount(sf);
  const D = scrollOf(sf);
  const v = Math.abs(D - scrollOf(sf - 1));
  const lift = liftOf(sf);
  const call = callOf(sf);
  const lastT = n > 0 ? TYPE_TIMES[n - 1] : -99;
  const activeKey = sf < T.submit && sf - lastT < 3 && n > 0 ? keyOf(SEARCH_TEXT[n - 1]) : null;
  const cursor = sf < 0 ? Math.floor(f / 8) % 2 === 0 : sf < T.submit;
  const blurId = `vb-${f}`;
  const blur = Math.min(16, v * 0.32);
  const itemIn = (a: number) => ({
    opacity: ip(sf, [a, a + 6], [0, 1]),
    translate: `0 ${ip(sf, [a, a + 10], [26, 0], eo)}px`,
  });
  return (
    <AbsoluteFill style={{ background: C.blanco }}>
      {blur > 0.6 ? <VBlurDef id={blurId} amount={blur} /> : null}
      {/* scrolling content: map + results */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCREEN.w,
          height: SCREEN.h,
          translate: `0 ${-D}px`,
          filter: blur > 0.6 ? `url(#${blurId})` : undefined,
        }}
      >
        <MapView top={UI.mapTop} height={UI.mapH} sf={sf} pinsAt={T.pins} />
        <Skeleton sf={sf} top={UI.listTop} opacity={ip(sf, [48, 54], [0, 1]) * (1 - ip(sf, [84, 90], [0, 1]))} />
        {RIVALS.map((r, i) => (
          <ResultItem
            key={r.name}
            r={r}
            top={UI.listTop + i * UI.itemH}
            pressed={i === 0 ? ip(sf, [T.tap, T.tap + 1, T.tap + 12], [0, 1, 0]) : 0}
            style={itemIn(86 + i * 5)}
          />
        ))}
        <div style={{ position: "absolute", left: 36, right: 36, top: UI.listTop + 3 * UI.itemH - 2, height: 2, background: "#eceef3" }} />
        {lift > 0.02 ? (
          <div
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: UI.listTop + 3 * UI.itemH + 10,
              height: UI.hoyTuH - 20,
              borderRadius: 24,
              border: "3px dashed #d3d7df",
              background: "#f4f5f8",
            }}
          />
        ) : (
          <HoyTuCard style={{ top: UI.listTop + 3 * UI.itemH, ...itemIn(101) }} />
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: SCREEN.w,
            top: UI.listTop + 3 * UI.itemH + UI.hoyTuH + 40,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 29,
            color: "#9aa0b0",
            ...itemIn(104),
          }}
        >
          No hay más resultados
        </div>
        <div
          style={{
            position: "absolute",
            left: SCREEN.w / 2 - 190,
            width: 380,
            top: UI.listTop + 3 * UI.itemH + UI.hoyTuH + 100,
            height: 76,
            borderRadius: 38,
            border: "2px solid #e1e4eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: FONT,
            fontSize: 29,
            fontWeight: 600,
            color: C.cobalto,
            ...itemIn(106),
          }}
        >
          <Icon name="buscar" size={30} color={C.cobalto} strokeWidth={2.2} />
          Ampliar la búsqueda
        </div>
      </div>
      {/* sticky top: white strip behind the search bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 210,
          background: C.blanco,
          boxShadow: D > 4 ? "0 8px 18px -10px rgba(19,24,43,0.25)" : "none",
          zIndex: 11,
        }}
      />
      <SearchBar
        text={SEARCH_TEXT.slice(0, n)}
        cursor={cursor}
        pressed={ip(sf, [T.submit - 2, T.submit, T.submit + 4], [0, 1, 0])}
      />
      <Suggestions typed={SEARCH_TEXT.slice(0, n)} opacity={1 - ip(sf, [T.submit, T.submit + 5], [0, 1])} />
      <Keyboard y={ip(sf, [T.submit, T.submit + 12], [0, 540], io)} activeKey={activeKey} />
      {/* focus dim while the card is lifted: the competitors stay visible behind it */}
      <AbsoluteFill style={{ background: C.tinta, opacity: 0.24 * lift, zIndex: 15 }} />
      {/* swipe finger */}
      <Finger
        x={470}
        y={ip(sf, [101, 113], [1180, 560], io)}
        opacity={ip(sf, [99, 102, 111, 116], [0, 1, 1, 0])}
        press={ip(sf, [100, 102], [0, 1])}
        ripple={0}
      />
      {/* tap finger on "Ferretería Central" */}
      <Finger
        x={ip(sf, [205, 215], [560, 250], io)}
        y={ip(sf, [205, 215], [1050, UI.listTop + UI.itemH / 2], io)}
        opacity={ip(sf, [204, 208, 221, 225], [0, 1, 1, 0])}
        press={ip(sf, [T.tap - 2, T.tap, T.tap + 4], [0, 1, 0])}
        ripple={ip(sf, [T.tap, T.tap + 7], [0, 1])}
      />
      {call > 0 ? <CallScreen t={sf - T.callIn} slide={call} /> : null}
    </AbsoluteFill>
  );
};

/**
 * The "Tu negocio" card lifting out of the screen toward the camera (phone coords): it rises
 * from its slot at the bottom of the list to hover over the map, above the three competitors,
 * big enough that its red flags read ≥ 44 px.
 */
const LIFT = { y: -792, z: 90, s: 1.18 } as const;
const LiftedCard: React.FC<{ sf: number; cam: Cam }> = ({ sf, cam }) => {
  const lift = liftOf(sf);
  if (lift <= 0.02) return null;
  const D = scrollOf(sf);
  const top = PH.bezel + UI.listTop + 3 * UI.itemH - D;
  return (
    <div
      style={{
        position: "absolute",
        left: PH.bezel,
        top,
        width: SCREEN.w,
        height: UI.hoyTuH,
        transformOrigin: "50% 50%",
        transform: `translateZ(${LIFT.z * lift}px) translateY(${LIFT.y * lift}px) rotateY(${-cam.ry * lift}deg) rotateX(${-cam.rx * lift}deg) rotateZ(${-1.2 * lift}deg) scale(${1 + (LIFT.s - 1) * lift})`,
        filter: `drop-shadow(0 ${30 * lift}px ${40 * lift}px rgba(19,24,43,${0.38 * lift}))`,
      }}
    >
      <HoyTuCard
        boxed={lift}
        big={lift}
        style={{ top: 0, left: 0, background: "#f8f9fb", outline: `${3 * lift}px solid rgba(180,35,24,${0.5 * lift})` }}
      />
    </div>
  );
};

/* ------------------------------ Con screen -------------------------------- */
/* climb from 4th to 1st on the beat after the drop (with the orange pin), once the shake settled */
const CLIMB = { from: T.conPin - T.drop, dur: 12 } as const;
const climbOf = (cf: number) => ip(cf, [CLIMB.from, CLIMB.from + CLIMB.dur], [0, 1], Easing.bezier(0.5, 0, 0.2, 1.12));
const conCallOf = (f: number) => ip(f, [T.conCall - 2, T.conCall + 2], [0, 1], eo);

const ConScreen: React.FC<{ cf: number; f: number }> = ({ cf, f }) => {
  const p = climbOf(cf);
  const v = Math.abs(p - climbOf(cf - 1));
  const yourPin = T.conPin - T.drop;
  const glow = ip(cf, [yourPin + 8, yourPin + 14, yourPin + 40], [0, 1, 0]);
  const slot = UI.conTuH + 16;
  const tapC = T.conTap - T.drop;
  const lift = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  const blurT = Math.min(14, v * 3 * UI.itemH * 0.12);
  const blurR = Math.min(10, v * slot * 0.12);
  const call = conCallOf(f);
  return (
    <AbsoluteFill style={{ background: C.blanco }}>
      {blurT > 0.6 ? <VBlurDef id={`cbt-${cf}`} amount={blurT} /> : null}
      {blurR > 0.6 ? <VBlurDef id={`cbr-${cf}`} amount={blurR} /> : null}
      <MapView top={UI.mapTop} height={UI.conMapH} sf={cf + 200} pinsAt={[0, 0, 0]} yourPinAt={yourPin + 200} />
      <div style={{ position: "absolute", inset: 0, filter: blurR > 0.6 ? `url(#cbr-${cf})` : undefined }}>
        {RIVALS.map((r, i) => (
          <ResultItem key={r.name} r={r} top={UI.conListTop + 8 + i * UI.itemH + p * slot} />
        ))}
      </div>
      <ConTuCard
        glow={glow}
        callPress={ip(cf, [tapC - 1, tapC + 1, tapC + 5], [0, 1, 0])}
        style={{
          top: UI.conListTop + 8 + 3 * UI.itemH * (1 - p),
          scale: `${1 + 0.05 * lift}`,
          filter: blurT > 0.6 ? `url(#cbt-${cf})` : undefined,
          boxShadow: `0 ${30 * lift}px 50px rgba(19,24,43,${0.32 * lift}), 0 0 0 ${glow * 12}px rgba(255,90,38,${0.22 * glow})`,
          zIndex: 5,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 206, background: C.blanco, zIndex: 11 }} />
      <SearchBar text={SEARCH_TEXT} cursor={false} />
      <Finger
        light
        x={ip(cf, [tapC - 12, tapC - 2], [640, 552], io)}
        y={ip(cf, [tapC - 12, tapC - 2], [980, UI.conListTop + 8 + 64], io)}
        opacity={ip(cf, [tapC - 13, tapC - 9, tapC + 8, tapC + 12], [0, 1, 1, 0])}
        press={ip(cf, [tapC - 2, tapC, tapC + 4], [0, 1, 0])}
        ripple={ip(cf, [tapC, tapC + 11], [0, 1])}
      />
      {call > 0 ? <CallScreen t={f - T.conCall} slide={call} who={CALLEE_TU} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------- Sticker ---------------------------------- */
/* Logo-only seal slapped on the phone's right edge on the drop (no second "Con Lonso Lab"). */
const ConSticker: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.drop) return null;
  // already on screen (big, mid-slam) on the impact frame, settled ~6 f later
  const k = sp(f, T.drop - 2, 11, 220, 0.7);
  const D = 196;
  return (
    <div
      style={{
        position: "absolute",
        left: PH.w - D * 0.62,
        top: 64,
        width: D,
        height: D,
        borderRadius: "50%",
        background: C.papel,
        border: `7px solid ${C.pin}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 5px 0 rgba(19,24,43,0.2), 0 26px 40px -16px rgba(10,14,40,0.6)",
        transform: `translateZ(40px) rotate(${8 + 16 * (1 - k)}deg) scale(${2.1 - 1.1 * k})`,
        transformOrigin: "50% 50%",
        opacity: Math.min(1, 0.5 + k * 3),
      }}
    >
      <Logo kind="mark" variant="cobalto" height={118} style={{ marginLeft: 8 }} />
    </div>
  );
};

/* -------------------------------- Stage ----------------------------------- */
export const PhoneStage: React.FC = () => {
  const f = useCurrentFrame();
  if (f > T.cards[0] + 8) return null;
  const cam = camera(f);
  const hoy = f < T.drop;
  const sf = sfOf(f);
  const dark = hoy ? callOf(sf) > 0.5 : conCallOf(f) > 0.5;
  const tape = ip(f, [T.tapeStop, T.rewind], [0, 1]);
  const glare = !hoy ? ip(f, [T.drop + 2, T.drop + 22], [0, 1]) : -1;
  return (
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "540px 860px" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - PH.w / 2,
          top: BASE_TOP,
          width: PH.w,
          height: PH.h,
          transformOrigin: `${PH.w / 2}px 0px`,
          transform: `translate3d(${cam.x}px, ${cam.y}px, 0) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) rotateZ(${cam.rz}deg) scale(${cam.s})`,
          transformStyle: "preserve-3d",
          filter:
            hoy && f >= T.tapeStop
              ? `saturate(${1 - 0.6 * tape}) brightness(${1 - 0.08 * tape})`
              : f >= T.notifs + 10
                ? `blur(${ip(f, [T.notifs + 10, T.notifs + 40], [0, 5], eo)}px) brightness(${ip(f, [T.notifs + 10, T.notifs + 40], [1, 0.82])})`
                : undefined,
        }}
      >
        <Device
          dark={dark}
          glare={glare}
          statusLeft={
            <span style={{ fontWeight: 600, fontSize: 31, color: dark ? "#b9bfd3" : C.tinta2, letterSpacing: "0.01em" }}>
              Simulación
            </span>
          }
          outside={
            <>
              {hoy ? <LiftedCard sf={sf} cam={cam} /> : null}
              <ConSticker f={f} />
            </>
          }
        >
          {hoy ? <HoyScreen sf={sf} f={f} /> : <ConScreen cf={f - T.drop} f={f} />}
        </Device>
      </div>
    </AbsoluteFill>
  );
};
