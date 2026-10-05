import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { C, EASE, FONT, Icon, Logo, Topo } from "../../brand";
import { TOPO_PATHS, TOPO_VIEWBOX } from "../../brand/topoPaths";
import {
  List,
  ListHeader,
  Row,
  TITLE_SIZE,
  TITLE_STRETCH,
  TITLE_TOP,
} from "./List";
import { MapCard, PinShape } from "./MapCard";
import { Highlight, MarkerFilter, Strike } from "./marks";
import { T, TICK_LEAD } from "./timing";
import { PRE, Rise, head } from "./type";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Cobalt opener: 150 px lines, 1.06 leading. */
const OPEN_SIZE = 150;
const OPEN_TOP = 330;
const OPEN_PITCH = OPEN_SIZE * 1.06;
const FOLD = TITLE_SIZE / OPEN_SIZE; // 0.64
const TITLE_PITCH = TITLE_SIZE * 1.06;
/** Advance of "Lo que " at 96 px (Archivo 820 / wdth 112 / −0.035 em), where "hacemos" starts. */
const X_HACEMOS = 359.7;

/**
 * 497–586: the back of the turned page is cobalto — a section opener, like the closing band of
 * lonsolab.com (the bear mark peeks in from the left edge as a cobalto-hondo watermark).
 * 571–587: the headline folds into the list title ("Lo que hacemos / nosotros:") so the dry cut
 * to paper on the groove's return keeps the words exactly where they are.
 */
export const SceneTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const s = head(OPEN_SIZE, C.papel, TITLE_STRETCH);
  const mark = interpolate(frame, [T.turn - 2, T.turn + 30], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const drift = interpolate(frame, [T.turn, T.groove], [0, 1], clamp);
  // Each line has its own path so they never collide: "Lo que" settles first, "hacemos" slides
  // right on its own row and then climbs into line 1, "nosotros:" follows it up.
  const pr = (a: number, b: number, e = EASE.inOut) =>
    interpolate(frame, [a, b], [0, 1], { ...clamp, easing: e });
  const pL = pr(T.fold, T.fold + 10, EASE.salida);
  const pHx = pr(T.fold, T.fold + 10);
  const pHy = pr(T.fold + 4, T.groove);
  const pN = pr(T.fold, T.groove);
  const pNy = pr(T.fold + 4, T.groove);
  const under = interpolate(frame, [T.fold, T.fold + 8], [1, 0], clamp);
  const line = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    px: number,
    py: number,
    ps: number,
  ): React.CSSProperties => ({
    ...s,
    position: "absolute",
    left: x0 + (x1 - x0) * px,
    top: y0 + (y1 - y0) * py,
    scale: String(1 - (1 - FOLD) * ps),
    transformOrigin: "0 0",
  });
  return (
    <AbsoluteFill>
      <MarkerFilter id="mk-under" />
      <Topo
        color={C.papel}
        opacity={0.16}
        drawFrom={T.turn - 6}
        drawDuration={70}
        drift={5}
        scale={1.35}
        strokeWidth={1.5}
      />
      {/* watermark: the bear mark, cobalto hondo; the L-stem sits off the left edge, the head is the hero */}
      <div
        style={{
          position: "absolute",
          left: -300,
          top: 830,
          opacity: 0.3 * mark,
          translate: `${drift * 14}px ${(1 - mark) * 60 - drift * 10}px`,
          scale: String(1 + 0.02 * drift),
          transformOrigin: "30% 60%",
          mixBlendMode: "multiply",
        }}
      >
        <Logo
          kind="mark"
          variant="cobalto"
          height={1300}
          style={{ filter: "brightness(0.62) saturate(1.1)" }}
        />
      </div>
      <div style={line(90, OPEN_TOP, 90, TITLE_TOP, pL, pL, pL)}>Lo que</div>
      <div
        style={line(
          90,
          OPEN_TOP + OPEN_PITCH,
          90 + X_HACEMOS,
          TITLE_TOP,
          pHx,
          pHy,
          pHx,
        )}
      >
        hacemos
      </div>
      <div
        style={line(
          90,
          OPEN_TOP + OPEN_PITCH * 2,
          90,
          TITLE_TOP + TITLE_PITCH,
          0,
          pNy,
          pN,
        )}
      >
        <span style={{ position: "relative", display: "inline-block" }}>
          nosotros:
          <div style={{ position: "absolute", inset: 0, opacity: under }}>
            <Strike
              at={T.arrow}
              dur={11}
              seed="nos-under"
              y={96}
              width={11}
              edge={0}
              color={C.pinHondo}
              filterId="mk-under"
            />
          </div>
        </span>
      </div>
    </AbsoluteFill>
  );
};

const ROWS: Row[] = [
  { lines: ["Ficha completa", "y optimizada"], at: T.ticks[0] - TICK_LEAD },
  { lines: ["Reseñas respondidas", "con tu tono"], at: T.ticks[1] - TICK_LEAD },
  { lines: ["Contenido todas", "las semanas"], at: T.ticks[2] - TICK_LEAD },
  { lines: ["Web pensada", "para el celular"], at: T.ticks[3] - TICK_LEAD },
];

/** The map card's window while it waits in the image band under the "después" list. */
const BAND_TOP = 1262;
const BAND_PIN_Y = 230;
const BAND_ZOOM: [number, number] = [0.27, 0.4];

/**
 * 587–774: the beat comes back — same grid as the "antes" list, now ticked. Each tick completes on
 * its beat. Under the list the map pin pings on every tick and the camera creeps in (you start to
 * show up). From 754 the header gives way to "Vos seguís con tu negocio." while the finished list
 * stays one more beat (reading time).
 */
export const SceneDo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MapCard
        top={BAND_TOP}
        pinY={BAND_PIN_Y}
        zf={[T.groove, T.nosotros]}
        zv={BAND_ZOOM}
        ze={[(t) => t]}
        dropAt={-100}
        starsAt={-100}
        pings={T.ticks.map((at) => ({ at, r: 120 }))}
      />
      {frame < T.vos ? (
        <ListHeader
          lines={["Lo que hacemos", "nosotros:"]}
          counterAts={ROWS.map((r) => r.at)}
          at={T.groove}
          lineFrom={T.groove - 8}
          accent={C.cobalto}
          secondColor={C.cobalto}
          appear="cut"
        />
      ) : null}
      <List rows={ROWS} mode="tick" seed="despues" ruleAt={T.groove - 4} />
    </AbsoluteFill>
  );
};

/** Close: block top and the CTA timing. */
const CLOSE_TOP = 300;
const SHRINK: [number, number] = [T.cta - 6, T.cta + 6];

/** 754–921: "Vos seguís con tu negocio. / Nosotros nos ocupamos de que se vea." → shrinks for the CTA. */
export const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const a = head(96, C.tinta, 108);
  const b = head(96, C.cobalto, 108);
  const k = interpolate(frame, SHRINK, [0, 1], {
    ...clamp,
    easing: EASE.inOut,
  });
  // the card rises out of the image band and the camera pushes back in to the pin
  const rise = interpolate(frame, [T.nosotros, T.nosotros + 14], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  return (
    <AbsoluteFill>
      {/* bookend of the hook: from a speck back to the pin, and now people find it */}
      {frame >= T.nosotros ? (
        <MapCard
          top={BAND_TOP + (956 - BAND_TOP) * rise}
          pinY={BAND_PIN_Y + (360 - BAND_PIN_Y) * rise}
          zf={[T.nosotros, T.nosotros + 4, T.nosotros + 33, T.cta]}
          zv={[BAND_ZOOM[1], BAND_ZOOM[1] + 0.02, 1.0, 1.04]}
          ze={[(t) => t, EASE.inOut, (t) => t]}
          dropAt={-100}
          starsAt={-100}
          pings={[
            { at: T.ping1, r: 170 },
            { at: T.ping2, r: 170 },
            { at: T.ping3, r: 170 },
          ]}
          visitorsAt={T.nosotros + 18}
          exitAt={T.cta - 13}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: CLOSE_TOP + 4 * k,
          scale: String(1 - 0.24 * k),
          transformOrigin: "0 0",
        }}
      >
        <Rise at={T.vos - PRE} style={a}>
          Vos seguís con
        </Rise>
        <Rise at={T.vos - PRE + 3} style={a}>
          tu negocio.
        </Rise>
        <div style={{ height: 26 }} />
        <Rise at={T.nosotros} style={b}>
          Nosotros nos
        </Rise>
        <Rise at={T.nosotros + 3} style={b}>
          ocupamos de
        </Rise>
        <Rise at={T.nosotros + 6} style={b}>
          que{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <Highlight at={T.seVea} seed="sevea" />
            <span style={{ position: "relative" }}>se vea</span>
          </span>
          .
        </Rise>
      </div>
      {frame >= T.cta - 6 ? <Cta /> : null}
    </AbsoluteFill>
  );
};

/** Contour field drawn in all at once (the kit's Topo staggers lines, which reads as a stray stroke). */
const TopoTogether: React.FC<{
  color: string;
  opacity: number;
  drawFrom: number;
  drawDuration: number;
  scale: number;
  strokeWidth: number;
}> = ({ color, opacity, drawFrom, drawDuration, scale, strokeWidth }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const p = interpolate(frame, [drawFrom, drawFrom + drawDuration], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${TOPO_VIEWBOX.w} ${TOPO_VIEWBOX.h}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          width: 1920 * scale,
          height: 1080 * scale,
          left: 540 - (1920 * scale) / 2,
          top: 960 - (1080 * scale) / 2,
          rotate: "90deg",
          translate: `${Math.sin(t * 0.21) * 4}px ${t * 4 * -0.6}px`,
          opacity,
        }}
        fill="none"
        stroke={color}
      >
        {TOPO_PATHS.map((path, i) => (
          <path
            key={i}
            d={path.d}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            strokeWidth={path.major ? strokeWidth * 1.6 : strokeWidth}
            opacity={path.major ? 0.9 : 0.55}
          />
        ))}
      </svg>
    </div>
  );
};

/** End card (x ≤ 880): rule, logo, pin CTA pill, contact; the pin + ping close the map story below. */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [T.cta + 2, T.cta + 16], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const logo = interpolate(frame, [T.cta + 2, T.cta + 14], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  // the pill reaches full size ON the beat (97 % at T.cta), where the pop sits
  const pill = interpolate(frame, [T.cta - 5, T.cta + 1], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const shine = interpolate(frame, [T.shine, T.shine + 20], [-0.25, 1.25], {
    ...clamp,
    easing: EASE.inOut,
  });
  const TOP = 740;
  return (
    <>
      {/* brand contours under the end card (image zone), all lines drawn together */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, transparent 62%, #000 70%, #000 100%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, transparent 62%, #000 70%, #000 100%)",
        }}
      >
        <TopoTogether
          color={C.cobalto}
          opacity={0.42}
          drawFrom={T.cta - 2}
          drawDuration={30}
          scale={0.95}
          strokeWidth={1.6}
        />
      </div>
      <CtaPin x={700} y={1470} />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: TOP,
          width: 900 * rule,
          height: 2.5,
          background: C.tinta,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: TOP + 34,
          opacity: logo,
          translate: `0 ${(1 - logo) * 20}px`,
        }}
      >
        <Logo kind="full" variant="tinta" height={98} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: TOP + 176,
          opacity: Math.min(1, pill * 1.6),
          scale: String(0.9 + 0.1 * pill),
          transformOrigin: "0% 50%",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "30px 46px 32px 38px",
            borderRadius: 999,
            background: C.pin,
            boxShadow:
              "0 2px 4px rgba(19,24,43,0.10), 0 30px 50px -24px rgba(232,70,26,0.8)",
            fontFamily: FONT,
            fontWeight: 700,
            fontStretch: "104%",
            fontSize: 54,
            lineHeight: 1,
            letterSpacing: "-0.012em",
            color: C.tinta,
            whiteSpace: "nowrap",
          }}
        >
          <Icon name="chat" size={52} color={C.tinta} strokeWidth={2.2} />
          Pedí tu auditoría gratis
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 180,
              left: `${shine * 100}%`,
              translate: "-50% 0",
              background:
                "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: TOP + 330 }}>
        <Rise
          at={T.cta + 6}
          style={{
            fontFamily: FONT,
            fontWeight: 760,
            fontStretch: "106%",
            fontSize: 54,
            lineHeight: 1.12,
            letterSpacing: "-0.015em",
            color: C.tinta,
            whiteSpace: "nowrap",
          }}
        >
          lonsolab.com
        </Rise>
        <Rise
          at={T.cta + 9}
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontStretch: "100%",
            fontSize: 50,
            lineHeight: 1.16,
            color: C.tinta2,
            whiteSpace: "nowrap",
          }}
        >
          WhatsApp +54 3541 33-7818
        </Rise>
      </div>
    </>
  );
};

/** The pin from the map, now on the brand contours, with the people who found it and a ping. */
const CtaPin: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [T.cta + 4, T.cta + 14], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const ring = interpolate(frame, [T.ctaPing, T.ctaPing + 26], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const SIZE = 66;
  const people = [
    { a: -2.5, d: 92, c: C.tinta },
    { a: -0.45, d: 104, c: C.cobalto },
    { a: 0.5, d: 88, c: C.tinta },
    { a: 2.7, d: 100, c: C.cobalto },
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {people.map((pp, i) => {
        const st = T.cta + 8 + Math.round(random(`cta-p${i}`) * 10);
        const p = interpolate(frame, [st, st + 24], [0, 1], {
          ...clamp,
          easing: EASE.salida,
        });
        const d = pp.d + (1 - p) * 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.cos(pp.a) * d - 12,
              top: Math.sin(pp.a) * d * 0.55 - 12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: pp.c,
              border: `4px solid ${C.blanco}`,
              boxShadow: "0 3px 8px rgba(19,24,43,0.22)",
              opacity: p,
            }}
          />
        );
      })}
      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: "absolute",
            left: -150 * ring,
            top: -SIZE * 0.78 - 150 * ring,
            width: 300 * ring,
            height: 300 * ring,
            borderRadius: "50%",
            border: `${5 * (1 - ring) + 1.5}px solid ${C.pin}`,
            opacity: 0.75 * (1 - ring),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: -SIZE / 2,
          top: -SIZE * 1.25 + (1 - drop) * -30,
          opacity: drop,
        }}
      >
        <PinShape size={SIZE} />
      </div>
    </div>
  );
};

/** Page B timeline: section opener → ticked list → close + CTA (dry cuts on downbeats). */
export const SceneAfter: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {frame < T.groove ? <SceneTurn /> : null}
      {frame >= T.groove && frame < T.nosotros ? <SceneDo /> : null}
      {frame >= T.vos ? <SceneClose /> : null}
    </AbsoluteFill>
  );
};
