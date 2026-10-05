import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { C, EASE, FONT, Icon, Phone, Topo, fmtAR } from "../../brand";
import { CARD, LANDS, cardState } from "./stack";
import { B, RISE_LEAD, T } from "./timing";
import { CL, CaseLabel, HandStroke, Line, Stars, Title, beatBop, beatSwing, p01 } from "./ui";

/** Vertical-only blur used as cheap motion blur for fast vertical moves. */
const VBlur: React.FC<{ id: string; amount: number }> = ({ id, amount }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-5%" y="-25%" width="110%" height="150%">
      <feGaussianBlur stdDeviation={`0 ${amount.toFixed(2)}`} />
    </filter>
  </svg>
);

/** A case card: stacks, blurs and flies into the grid according to stack.ts. */
const CardShell: React.FC<{ i: number; bg: string; border?: string; edge?: string; children: React.ReactNode }> = ({
  i,
  bg,
  border,
  edge = "rgba(255,255,255,0.24)",
  children,
}) => {
  const f = useCurrentFrame();
  if (f < LANDS[i] - RISE_LEAD - 1 || f > T.cta + 4) return null;
  const st = cardState(f, i);
  if (st.op <= 0.001) return null;
  const pv = cardState(f - 1, i);
  const mb = Math.min(38, Math.abs(st.y - pv.y) * 0.2);
  const id = `vb-card-${i}`;
  const filters = [mb > 0.8 ? `url(#${id})` : "", st.blur > 0.3 ? `blur(${st.blur.toFixed(2)}px)` : ""].join(" ").trim();
  // grid groove: tiles bop on the beats of the grid bar, as a wave
  const groove = f >= T.grid + 14 ? beatBop(f - i, 45, 48, 1.035, 9) : 1;
  const ox = st.s * (CARD.w / 2);
  return (
    <>
      <VBlur id={id} amount={mb} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: CARD.w,
          height: st.h,
          transformOrigin: "0 0",
          transform: `translate(${st.x}px, ${st.y}px) translate(${ox}px, 0px) rotate(${st.r}deg) translate(${-ox}px, 0px) scale(${st.s * groove})`,
          borderRadius: CARD.r,
          background: bg,
          overflow: "hidden",
          opacity: st.op,
          filter: filters || undefined,
          // crisp top-edge highlight (inset) so the card peeking behind the stack reads as a card edge
          boxShadow: `inset 0 2px 0 0 ${edge}, 0 -18px 50px -18px rgba(19,24,43,0.35), 0 40px 90px -30px rgba(19,24,43,0.55)${border ? `, inset 0 0 0 2px ${border}` : ""}`,
        }}
      >
        {children}
      </div>
    </>
  );
};

/* ---------------------------------------------------------------- CASO.001 · REELS */

const ReelClip: React.FC<{ from: number; dur: number; at: number }> = ({ from, dur, at }) => {
  const { fps } = useVideoConfig();
  return (
    <Video
      src={staticFile("web/reel-01.mp4")}
      from={from}
      durationInFrames={dur}
      trimBefore={Math.round(at * fps)}
      premountFor={fps}
      muted
      objectFit="cover"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};

const CardReel: React.FC = () => {
  const f = useCurrentFrame();
  const land = T.c1;
  const enter = spring({ frame: f - (land - 4), fps: 30, config: { damping: 13, stiffness: 150, mass: 0.9 } });
  const rot = interpolate(enter, [0, 1], [9, -2.5]) + beatSwing(f, 17, 24, 1.3);
  const bop = beatBop(f, 17, 24, 1.03);
  const ringRot = f * 0.6;
  return (
    <CardShell i={0} bg={C.tinta}>
      {/* motif: rotating dashed rings behind the phone */}
      <svg width={960} height={1540} style={{ position: "absolute", inset: 0, opacity: 0.16 }}>
        <g transform={`translate(480 900) rotate(${ringRot})`} fill="none" stroke={C.cobaltoClaro}>
          <circle r={330} strokeWidth={2} strokeDasharray="4 14" />
          <circle r={420} strokeWidth={2} strokeDasharray="60 22" />
          <circle r={520} strokeWidth={1.5} />
          <path d="M -560 0 H 560 M 0 -560 V 560" strokeWidth={1.5} strokeDasharray="2 10" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 480 - 380,
          top: 520,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(35,64,216,0.55) 0%, rgba(35,64,216,0) 65%)",
        }}
      />
      <CaseLabel n={1} cat="Reels" at={land - 4} color={C.papel} accent={C.pin} dim="#8b93b4" />
      <Title lines={["Una toma,", "una historia."]} at={land - RISE_LEAD} color={C.papel} />
      <div
        style={{
          position: "absolute",
          left: 245,
          top: 430,
          translate: `0 ${(1 - enter) * 260}px`,
          rotate: `${rot}deg`,
          scale: `${bop}`,
          transformOrigin: "50% 60%",
        }}
      >
        <Phone width={470} height={962} bezel={14} frameColor="#2b3253" screenColor="#000" dark>
          <AbsoluteFill>
            <ReelClip from={land - 10} dur={25} at={14.0} />
            <ReelClip from={B(17)} dur={B(18) - B(17)} at={24.5} />
            <ReelClip from={B(18)} dur={T.c3 + 10 - B(18)} at={29.0} />
            <ReelClip from={T.grid - 16} dur={T.cta + 6 - (T.grid - 16)} at={29.6} />
          </AbsoluteFill>
        </Phone>
        {/* play chip */}
        <div
          style={{
            position: "absolute",
            left: -70,
            top: 640,
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: C.pin,
            borderRadius: 999,
            padding: "16px 28px 16px 20px",
            boxShadow: "0 18px 36px -14px rgba(0,0,0,0.6)",
            scale: `${interpolate(f, [land + 6, land + 16], [0, 1], { ...CL, easing: EASE.rebote })}`,
            rotate: "-6deg",
          }}
        >
          <svg width={36} height={36} viewBox="0 0 24 24">
            <path d="M8 5.5v13l11-6.5z" fill={C.tinta} />
          </svg>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "108%", fontSize: 44, color: C.tinta }}>Reel</span>
        </div>
      </div>
    </CardShell>
  );
};

/* ---------------------------------------------------------------- CASO.002 · DISEÑO */

const SLIDE_W = 610;
const SLIDE_H = Math.round(SLIDE_W * 1.25 * 0.82); // 625: shows the top 82 % of each 4:5 carousel
const Slide: React.FC<{ src: string; angle: number; dx: number; z: number; scale?: number }> = ({ src, angle, dx, z, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: 480 - SLIDE_W / 2 + dx,
      top: 418,
      width: SLIDE_W,
      // crops the bottom 18 %: carrusel-01 has a "$" figure and a "FREE AUDIT / LINK IN BIO" line down there
      // (no-prices rule, and no half-cut text on the edge)
      height: SLIDE_H,
      borderRadius: 26,
      overflow: "hidden",
      transformOrigin: "50% 1250px",
      rotate: `${angle}deg`,
      scale: `${scale}`,
      zIndex: z,
      boxShadow: "0 2px 6px rgba(19,24,43,0.10), 0 30px 60px -24px rgba(19,24,43,0.55)",
      background: C.blanco,
    }}
  >
    <Img src={staticFile(src)} style={{ width: SLIDE_W, height: SLIDE_W * 1.25, display: "block" }} />
  </div>
);

const CardDiseno: React.FC = () => {
  const f = useCurrentFrame();
  const land = T.c2;
  const fanL = interpolate(f, [B(21), B(21) + 12], [0, 1], { ...CL, easing: EASE.rebote });
  const fanR = interpolate(f, [B(22), B(22) + 12], [0, 1], { ...CL, easing: EASE.rebote });
  const bop = beatBop(f, 20, 27, 1.03);
  const lift = spring({ frame: f - (land - 3), fps: 30, config: { damping: 14, stiffness: 140 } });
  return (
    <CardShell i={1} bg={C.papel} border="rgba(19,24,43,0.06)">
      {/* motif: dotted grid */}
      <svg width={960} height={1540} style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
        <defs>
          <pattern id="dots-c2" width={34} height={34} patternUnits="userSpaceOnUse">
            <circle cx={3} cy={3} r={3} fill={C.tinta2} />
          </pattern>
        </defs>
        <rect x={0} y={380} width={960} height={1160} fill="url(#dots-c2)" style={{ maskImage: "none" }} />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${C.papel} 26%, rgba(243,244,239,0) 46%, rgba(243,244,239,0) 80%, ${C.papel} 100%)`,
        }}
      />
      <CaseLabel n={2} cat="Diseño" at={land - 4} color={C.tinta} accent={C.cobalto} dim={C.tinta2} />
      <Title lines={["Marca que", "se reconoce."]} at={land - RISE_LEAD} color={C.tinta} />
      <div style={{ position: "absolute", inset: 0, translate: `0 ${(1 - lift) * 300}px`, scale: `${bop}`, transformOrigin: "50% 75%" }}>
        <Slide src="web/carrusel-02.jpg" angle={-13 * fanL} dx={36 * fanL} z={1} />
        <Slide src="web/carrusel-03.jpg" angle={13 * fanR} dx={-36 * fanR} z={2} />
        <Slide src="web/carrusel-01.jpg" angle={0} dx={0} z={3} scale={1.02} />
      </div>
    </CardShell>
  );
};

/* ---------------------------------------------------------------- CASO.003 · RESULTADOS */

const SHOT = { x: 322, y: 628, w: 478, rot: 2 } as const; // right edge ≈ global x 862, circled value ≈ x 836
const SHOT_H = Math.round((SHOT.w * 1261) / 1080);

const CardResultados: React.FC = () => {
  const f = useCurrentFrame();
  const land = T.c3;
  const raw = interpolate(f, [T.countFrom, T.countEnd], [0, 705326], { ...CL, easing: Easing.out(Easing.cubic) });
  const n = Math.round(raw);
  const punch = interpolate(f, [T.countEnd, T.countEnd + 2, T.countEnd + 10], [1, 1.08, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const sub = p01(f, land + 2, 14);
  const shot = spring({ frame: f - (land + 2), fps: 30, config: { damping: 15, stiffness: 120 } });
  const stat = T.c3stat;
  const shotBop = beatBop(f, 25, 32, 1.025);
  return (
    <CardShell i={2} bg={C.cobalto}>
      <Topo color={C.papel} opacity={0.14} drawFrom={land - 10} drawDuration={60} drift={4} scale={1.1} />
      {/* depth at the bottom of the card (imagery zone): deeper blue + the screenshot's glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(24,44,158,0) 58%, ${C.cobaltoHondo} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SHOT.x + SHOT.w / 2 - 420,
          top: SHOT.y + SHOT_H / 2 - 380,
          width: 840,
          height: 840,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,210,255,0.22) 0%, rgba(201,210,255,0) 62%)",
          opacity: shot,
        }}
      />
      <CaseLabel n={3} cat="Resultados" at={land - 4} color={C.papel} accent={C.pin} dim={C.cobaltoClaro} />
      {/* counter */}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 136,
          fontFamily: FONT,
          fontWeight: 800,
          fontStretch: "100%",
          fontSize: 206,
          lineHeight: 1,
          letterSpacing: "-0.035em",
          fontVariantNumeric: "tabular-nums",
          color: C.papel,
          scale: `${punch}`,
          transformOrigin: "left center",
        }}
      >
        <Line at={land - 4} dur={10}>
          {fmtAR(n)}
        </Line>
      </div>
      <div style={{ position: "absolute", left: 60, top: 370, opacity: sub, translate: `0 ${(1 - sub) * 20}px` }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontStretch: "108%", fontSize: 62, color: C.papel, lineHeight: 1.1 }}>
          visualizaciones en 30 días
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 620,
            fontStretch: "88%",
            fontSize: 56,
            color: C.cobaltoClaro,
            marginTop: 12,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          Con campañas que administramos.
        </div>
      </div>
      {/* the real Instagram insights screenshot, as proof */}
      <div
        style={{
          position: "absolute",
          left: SHOT.x,
          top: SHOT.y,
          width: SHOT.w,
          height: SHOT_H,
          borderRadius: 30,
          overflow: "hidden",
          rotate: `${interpolate(shot, [0, 1], [10, SHOT.rot])}deg`,
          translate: `${(1 - shot) * 160}px ${(1 - shot) * 220}px`,
          scale: `${shotBop}`,
          boxShadow: "0 30px 70px -20px rgba(8,12,40,0.7)",
          border: "3px solid rgba(243,244,239,0.18)",
        }}
      >
        <Img src={staticFile("web/metricas-ig-01.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {/* circle the "No seguidores 93,7 %" row */}
        <HandStroke
          d="M 300 463 C 405 459, 436 471, 433 485 C 430 500, 300 506, 160 504 C 40 502, 6 495, 9 482 C 12 467, 120 460, 335 462"
          viewBox="0 0 440 514"
          at={T.c3circle - 12}
          dur={12}
          color={C.pin}
          width={6}
        />
      </div>
      {/* "real screenshot" tag */}
      <div
        style={{
          position: "absolute",
          left: SHOT.x + 10,
          top: SHOT.y - 40,
          padding: "12px 20px 12px 16px",
          borderRadius: 999,
          background: C.papel,
          display: "flex",
          alignItems: "center",
          gap: 10,
          rotate: "-4deg",
          scale: `${spring({ frame: f - (land + 10), fps: 30, config: { damping: 11, stiffness: 200, mass: 0.6 } })}`,
          boxShadow: "0 12px 26px -12px rgba(8,12,40,0.7)",
          fontFamily: FONT,
          fontWeight: 700,
          fontStretch: "75%",
          fontSize: 44,
          lineHeight: 1,
          letterSpacing: "0.1em",
          color: C.tinta,
          whiteSpace: "nowrap",
        }}
      >
        <Icon name="check" size={36} color={C.verde} strokeWidth={3} />
        CAPTURA REAL
      </div>
      {/* statement: in right on the chime (f400), whole by f405 */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 668,
          width: 270,
          fontFamily: FONT,
          color: C.papel,
        }}
      >
        <Line at={stat - 1} dur={7}>
          <div style={{ fontWeight: 800, fontStretch: "96%", fontSize: 86, lineHeight: 1, letterSpacing: "-0.035em", whiteSpace: "nowrap" }}>
            93,7{" "}%
          </div>
        </Line>
        <div style={{ height: 16 }} />
        <Line at={stat} dur={7}>
          <div style={{ fontWeight: 700, fontStretch: "100%", fontSize: 58, lineHeight: 1.08, whiteSpace: "nowrap" }}>no seguía</div>
        </Line>
        <Line at={stat + 1} dur={7}>
          <div style={{ fontWeight: 700, fontStretch: "100%", fontSize: 58, lineHeight: 1.08, whiteSpace: "nowrap" }}>la cuenta.</div>
        </Line>
        <div
          style={{
            marginTop: 22,
            height: 10,
            width: 240,
            borderRadius: 5,
            background: C.pin,
            transformOrigin: "left center",
            scale: `${p01(f, stat + 3, 9)} 1`,
          }}
        />
      </div>
      {/* claim → proof: a hand-drawn arrow from the statement down to the circled row of the screenshot */}
      <HandStroke
        d="M 120 962 C 104 1060, 150 1140, 250 1150 C 280 1152, 298 1151, 314 1148"
        viewBox="0 0 960 1540"
        at={stat + 4}
        dur={10}
        color={C.pin}
        width={9}
        head={30}
      />
    </CardShell>
  );
};

/* ---------------------------------------------------------------- CASO.004 · WEB */

/**
 * Strip of the real 900 px capture (skips the restaurant menu with prices, and the empty band between the reviews and
 * the footer). Total 3109 source px.
 */
const TF_SEGMENTS: [number, number][] = [
  [0, 1150], // hero + ratings strip + "En el corazón de Villa Carlos Paz"
  [1700, 2240], // rooms
  [3530, 4010], // the hotel from outside
  [4790, 5470], // reviews ("4,7 sobre 5, con 5.807 opiniones") + review cards
  [5880, 6139], // footer
];
const TF_LEN = TF_SEGMENTS.reduce((acc, [a, b]) => acc + b - a, 0);

/**
 * The 900 px capture is the site's tablet/desktop layout, so it is shown in a tablet frame (no phone status bar).
 * Clean, brand-neutral: bezel, front camera dot, rounded screen.
 */
const Tablet: React.FC<{ width: number; height: number; bezel: number; children: React.ReactNode }> = ({ width, height, bezel, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 46,
      background: "#2b3253",
      padding: bezel,
      position: "relative",
      boxShadow: "inset 0 0 0 2px rgba(201,210,255,0.16), 0 4px 12px rgba(0,0,0,0.25), 0 60px 120px -40px rgba(0,0,0,0.7)",
    }}
  >
    <div style={{ position: "absolute", left: "50%", top: bezel / 2 - 4, width: 8, height: 8, borderRadius: 4, translate: "-50% 0", background: "#11152a" }} />
    <div style={{ width: "100%", height: "100%", borderRadius: 30, background: "#0e0d0b", overflow: "hidden", position: "relative" }}>
      {children}
    </div>
  </div>
);

const SiteStrip: React.FC<{ width: number; scroll: number }> = ({ width, scroll }) => {
  const k = width / 900;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, translate: `0 ${-scroll}px` }}>
      {TF_SEGMENTS.map(([a, b], idx) => (
        <div key={idx} style={{ position: "relative", width, height: (b - a) * k, overflow: "hidden" }}>
          <Img
            src={staticFile("web/terrafirma-completa.webp")}
            style={{ position: "absolute", left: 0, top: -a * k, width, height: 6139 * k, display: "block" }}
          />
        </div>
      ))}
    </div>
  );
};

const CardWeb: React.FC = () => {
  const f = useCurrentFrame();
  const land = T.c4;
  const TW = 600;
  const TH = 800;
  const bezel = 18;
  const screenW = TW - 2 * bezel;
  const screenH = TH - 2 * bezel;
  const k = screenW / 900;
  // scroll ends at the bottom of the page: reviews ("4,7 sobre 5…" ≈ 1/3 down the screen) + footer fill the screen
  const target = TF_LEN * k - screenH;
  const sc = interpolate(f, [land + 1, T.c4rating - 3], [0, target], { ...CL, easing: Easing.bezier(0.45, 0, 0.12, 1) });
  const scPrev = interpolate(f - 1, [land + 1, T.c4rating - 3], [0, target], { ...CL, easing: Easing.bezier(0.45, 0, 0.12, 1) });
  const vel = Math.abs(sc - scPrev);
  const slide = p01(f, T.c4rating - 12, 16);
  const enter = spring({ frame: f - (land - 4), fps: 30, config: { damping: 14, stiffness: 140 } });
  const rot = interpolate(enter, [0, 1], [-7, 0]) + interpolate(slide, [0, 1], [0, 3]) + beatSwing(f, 33, 40, 0.7);
  const bop = beatBop(f, 32, 41, 1.025);
  const rate = spring({ frame: f - T.c4rating, fps: 30, config: { damping: 10, stiffness: 170, mass: 0.7 } });
  const sub = p01(f, land + 3, 14);
  return (
    <CardShell i={3} bg={C.tinta}>
      {/* motif: blueprint square */}
      <svg width={960} height={1540} style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
        <g transform={`translate(560 960) rotate(${-f * 0.35})`} fill="none" stroke={C.cobaltoClaro}>
          <rect x={-330} y={-330} width={660} height={660} strokeWidth={2} />
          <rect x={-250} y={-250} width={500} height={500} strokeWidth={1.5} strokeDasharray="10 12" />
          <path d="M -420 0 H 420 M 0 -420 V 420" strokeWidth={1.5} />
          <circle r={140} strokeWidth={1.5} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: interpolate(slide, [0, 1], [480, 680]) - 420,
          top: 520,
          width: 840,
          height: 840,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(35,64,216,0.5) 0%, rgba(35,64,216,0) 64%)",
        }}
      />
      <CaseLabel n={4} cat="Web" at={land - 4} color={C.papel} accent={C.pin} dim="#8b93b4" />
      <Title lines={["Terra Firma"]} at={land - RISE_LEAD} color={C.papel} size={124} />
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 292,
          fontFamily: FONT,
          fontWeight: 600,
          fontStretch: "104%",
          fontSize: 52,
          color: C.cobaltoClaro,
          opacity: sub,
          translate: `0 ${(1 - sub) * 16}px`,
        }}
      >
        Hotel boutique · Villa Carlos Paz
      </div>
      <div
        style={{
          position: "absolute",
          left: interpolate(slide, [0, 1], [(960 - TW) / 2, 345]),
          top: 410,
          translate: `0 ${(1 - enter) * 300}px`,
          rotate: `${rot}deg`,
          scale: `${bop}`,
          transformOrigin: "50% 40%",
        }}
      >
        <Tablet width={TW} height={TH} bezel={bezel}>
          <div style={{ position: "absolute", inset: 0, filter: vel > 1.5 ? `blur(${Math.min(4, vel * 0.1)}px)` : undefined }}>
            <SiteStrip width={screenW} scroll={sc} />
          </div>
        </Tablet>
      </div>
      {/* rating card */}
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 650,
          width: 560,
          padding: "30px 34px 30px",
          borderRadius: 30,
          background: C.blanco,
          boxShadow: "0 2px 6px rgba(19,24,43,0.12), 0 40px 70px -26px rgba(0,0,0,0.65)",
          scale: `${rate}`,
          rotate: `${interpolate(rate, [0, 1], [-14, -3])}deg`,
          transformOrigin: "20% 80%",
          opacity: f >= T.c4rating ? 1 : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "108%", fontSize: 128, lineHeight: 0.9, color: C.tinta, letterSpacing: "-0.03em" }}>
            4,7
          </span>
          <Stars rating={4.7} size={48} at={T.c4rating + 3} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: C.tinta, marginTop: 14 }}>
          con 5.807 opiniones
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 44, lineHeight: 1.2, color: C.tinta2, marginTop: 4 }}>en Google</div>
      </div>
    </CardShell>
  );
};

/* ---------------------------------------------------------------- CASO.005 · GOOGLE MAPS */

export const MapPanel: React.FC<{ pinAt: number; chipAt: number }> = ({ pinAt, chipAt }) => {
  const f = useCurrentFrame();
  const drop = spring({ frame: f - (pinAt - 6), fps: 30, config: { damping: 9, stiffness: 190, mass: 0.7 } });
  const pinY = interpolate(drop, [0, 1], [-320, 0]);
  const landed = f >= pinAt;
  const wave = (f - pinAt) / 26;
  const chip = spring({ frame: f - chipAt, fps: 30, config: { damping: 12, stiffness: 190, mass: 0.7 } });
  const px = 420;
  const py = 520;
  const tag = p01(f, T.c5 + 4, 12);
  return (
    // map spans global y 740–1700 (imagery below y 1240); chip and tag stay above y 1240
    <div style={{ position: "absolute", left: 60, top: 420, width: 840, height: 960, borderRadius: 36, overflow: "hidden", background: "#e3e8f2" }}>
      <Topo color={C.cobalto} opacity={0.42} drawFrom={T.c5 - 12} drawDuration={50} drift={3} scale={0.95} rotate={90} strokeWidth={2.2} />
      <svg width={840} height={960} style={{ position: "absolute", inset: 0 }}>
        <path d="M 540 -20 L 320 980" stroke={C.blanco} strokeWidth={30} strokeLinecap="round" />
        <path d="M -20 520 L 860 370" stroke={C.blanco} strokeWidth={26} strokeLinecap="round" />
        <path d="M 600 980 C 630 790, 760 720, 880 690" stroke={C.blanco} strokeWidth={16} fill="none" />
        <path d="M -20 820 C 120 800, 220 860, 300 900" stroke={C.blanco} strokeWidth={12} fill="none" />
      </svg>
      {/* honesty tag: the geography is an illustration (the rating and the listing are real) */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(243,244,239,0.88)",
          border: "1.5px solid rgba(19,24,43,0.12)",
          fontFamily: FONT,
          fontWeight: 600,
          fontStretch: "75%",
          fontSize: 44,
          lineHeight: 1,
          letterSpacing: "0.08em",
          color: C.tinta2,
          whiteSpace: "nowrap",
          opacity: tag,
        }}
      >
        MAPA ILUSTRATIVO
      </div>
      {/* pin pulse */}
      {landed &&
        [0, 1].map((r) => {
          const w = ((wave + r * 0.5) % 1 + 1) % 1;
          return (
            <div
              key={r}
              style={{
                position: "absolute",
                left: px - 110,
                top: py + 10 - 40,
                width: 220,
                height: 80,
                borderRadius: "50%",
                border: `4px solid ${C.pin}`,
                opacity: (1 - w) * 0.6,
                scale: `${0.3 + w * 1.2}`,
              }}
            />
          );
        })}
      {/* shadow */}
      <div
        style={{
          position: "absolute",
          left: px - 40,
          top: py - 4,
          width: 80,
          height: 26,
          borderRadius: "50%",
          background: "rgba(19,24,43,0.28)",
          scale: `${interpolate(drop, [0, 1], [0.3, 1])}`,
          filter: "blur(3px)",
        }}
      />
      {/* pin (teardrop) */}
      <div
        style={{
          position: "absolute",
          left: px - 54,
          top: py - 128 + pinY,
          width: 108,
          height: 108,
          borderRadius: "50% 50% 50% 0",
          rotate: "-45deg",
          background: C.pin,
          boxShadow: "0 10px 24px -8px rgba(232,70,26,0.7)",
          opacity: drop > 0.01 ? 1 : 0,
        }}
      >
        <div style={{ position: "absolute", left: 38, top: 38, width: 32, height: 32, borderRadius: 16, background: C.tinta }} />
      </div>
      {/* chip */}
      <div
        style={{
          position: "absolute",
          left: px,
          top: py - 290,
          translate: "-50% 0",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "22px 28px",
          borderRadius: 20,
          background: C.blanco,
          boxShadow: "0 2px 6px rgba(19,24,43,0.08), 0 22px 40px -18px rgba(19,24,43,0.45)",
          scale: `${chip}`,
          transformOrigin: "50% 100%",
          opacity: f >= chipAt ? 1 : 0,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "100%", fontSize: 54, color: C.tinta }}>MPJ Fitness</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: "#9a5600" }}>5,0</span>
        <Icon name="estrella" size={48} color={C.estrella} fill={C.estrella} strokeWidth={1.2} />
      </div>
    </div>
  );
};

const CardMaps: React.FC = () => {
  const f = useCurrentFrame();
  const land = T.c5;
  const bop = beatBop(f, 41, 44, 1.02);
  return (
    <CardShell i={4} bg={C.papel} border="rgba(19,24,43,0.06)">
      <CaseLabel n={5} cat="Google Maps" at={land - 4} color={C.tinta} accent={C.pin} dim={C.tinta2} />
      <Title lines={["Ficha que", "gestionamos."]} at={land - RISE_LEAD} color={C.tinta} />
      <div style={{ position: "absolute", inset: 0, scale: `${bop}`, transformOrigin: "50% 60%" }}>
        <MapPanel pinAt={T.pin} chipAt={T.chip} />
      </div>
    </CardShell>
  );
};

export const Cards: React.FC = () => (
  <AbsoluteFill>
    <CardReel />
    <CardDiseno />
    <CardResultados />
    <CardWeb />
    <CardMaps />
  </AbsoluteFill>
);
