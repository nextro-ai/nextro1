import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { C, EASE, FONT, Icon, Topo, punch } from "../../brand";
import { EM } from "./metrics";
import { bt, T } from "./timing";
import { CAP, Slam, ease, popIn, stackBaselines } from "./type";
import { Ghost, useAbs, WIDTH, X0 } from "./common";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/* Map pin (site shape: border-radius 50% 50% 50% 0, rotated −45°)     */
/* ------------------------------------------------------------------ */
export const MapPin: React.FC<{ size: number; color?: string; dot?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.pin,
  dot = C.papel,
  style,
}) => (
  // box: width = size, height = 1.207·size, tip at bottom centre
  <div style={{ position: "relative", width: size, height: size * 1.207, ...style }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        background: color,
        borderRadius: "50% 50% 50% 0",
        rotate: "-45deg",
        boxShadow: "inset -6px -10px 0 rgba(0,0,0,0.10)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: size * 0.31,
        top: size * 0.31,
        width: size * 0.38,
        height: size * 0.38,
        borderRadius: "50%",
        background: dot,
      }}
    />
  </div>
);

/** f437–491 · "TE PONEMOS / EN EL / MAPA" + the pin drops in as the full stop. */
export const SceneMapa: React.FC = () => {
  const f = useAbs(T.mapa);
  const { fps } = useVideoConfig();
  const s1 = WIDTH / EM.w900s112["TE PONEMOS"];
  const s2 = s1;
  const pinK = 0.56;
  const s3 = WIDTH / (EM.w900s125.MAPA + pinK + 0.05);
  const [b1, b2, b3] = stackBaselines([{ size: s1 }, { size: s2 }, { size: s3 }], 476, 26);
  // TE PONEMOS (437) · EN EL (440, 16th) · MAPA (444, 8th): the phrase is complete from f444
  const tEnEl = T.enEl;
  const tMapa = T.mapaWord;
  const land = T.pinLand; // 464
  const wEnEl = s2 * EM.w900s112["EN EL"];
  const wMapa = s3 * EM.w900s125.MAPA;
  const pinSize = s3 * pinK;
  const tipX = X0 + s3 * (EM.w900s125.MAPA + 0.05) + pinSize / 2;
  // fall
  const fallY = interpolate(f, [tMapa, land], [-1000, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const sp = f >= land ? spring({ frame: f - land, fps, config: { damping: 8, stiffness: 260, mass: 0.6 } }) : 0;
  const squashY = f < land ? interpolate(f, [tMapa, land], [1.0, 1.12], clamp) : 0.74 + 0.26 * sp;
  const squashX = f < land ? interpolate(f, [tMapa, land], [1.0, 0.92], clamp) : 1.18 - 0.18 * sp;
  const nudge = interpolate(f, [land, land + 2, land + 10], [0, 12, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const fallBlur = f < land ? interpolate(f, [tMapa, land - 1], [0, 18], clamp) : 0;
  const shadowK = interpolate(f, [tMapa, land], [0.25, 1], clamp);
  return (
    <AbsoluteFill>
      <Ghost frame={f} from={tMapa} text="MAPA" color={C.papel} opacity={0.11} />
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="mf-pinblur" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation={`0 ${fallBlur}`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ translate: `0px ${nudge}px` }}>
        <Slam frame={f} at={T.mapa} text="TE PONEMOS" size={s1} x={X0} width={WIDTH} baseline={b1} stretch={112} />
        <Slam frame={f} at={tEnEl} text="EN EL" size={s2} x={X0} width={wEnEl + 6} fit={wEnEl} baseline={b2} stretch={112} outline strokeWidth={5} />
        <Slam frame={f} at={tMapa} text="MAPA" size={s3} x={X0} width={wMapa + 6} fit={wMapa} baseline={b3} slamFrom={1.3} />
      </AbsoluteFill>
      {/* ripples on the "map" */}
      {[0, 8].map((d) => {
        const t = f - land - d;
        if (t < 0 || t > 22) return null;
        const p = interpolate(t, [0, 22], [0, 1], { ...clamp, easing: EASE.salida });
        const w = 40 + 380 * p;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: tipX - w / 2,
              top: b3 + nudge - (w * 0.3) / 2,
              width: w,
              height: w * 0.3,
              borderRadius: "50%",
              border: `${5 - 3 * p}px solid ${C.papel}`,
              opacity: 0.7 * (1 - p),
            }}
          />
        );
      })}
      {/* contact shadow */}
      {f >= tMapa && (
        <div
          style={{
            position: "absolute",
            left: tipX - (pinSize * 0.9 * shadowK) / 2,
            top: b3 + nudge - pinSize * 0.1,
            width: pinSize * 0.9 * shadowK,
            height: pinSize * 0.2,
            borderRadius: "50%",
            background: "rgba(10,14,48,0.45)",
            filter: "blur(5px)",
            opacity: shadowK,
          }}
        />
      )}
      {f >= tMapa && (
        <div
          style={{
            position: "absolute",
            left: tipX - pinSize / 2,
            top: b3 + nudge - pinSize * 1.207 + fallY,
            scale: `${squashX} ${squashY}`,
            transformOrigin: "50% 100%",
            filter: fallBlur > 0.5 ? "url(#mf-pinblur)" : undefined,
          }}
        >
          <MapPin size={pinSize} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/**
 * f492–545 · GOOGLE MAPS / REDES / WEB — the ledger, fixed: checks instead of crosses.
 * Same justified system as the rest of the reel (Archivo 900 / wdth 125): every row fills the
 * text column (x 214–980), so the list builds up in size towards WEB and fills zone A.
 */
const ST_BADGE_COL = 84;
const ST_X = X0 + ST_BADGE_COL + 30; // 214
const ST_W = 980 - ST_X; // 766
const STACK = [
  { at: T.stack, text: "GOOGLE MAPS" },
  { at: T.stackRedes, text: "REDES" },
  { at: T.stackWeb, text: "WEB" },
] as const;

export const SceneStack: React.FC = () => {
  const f = useAbs(T.stack);
  const { fps } = useVideoConfig();
  const E = EM.w900s125;
  const sizes = STACK.map((r) => ST_W / E[r.text]); // 79.5 / 175 / 259 px
  const bases = stackBaselines(sizes.map((size) => ({ size })), 392, 44); // WEB ends at y 832 (< 840)
  const capMid = (i: number) => bases[i] - (CAP * sizes[i]) / 2;
  const cx = X0 + ST_BADGE_COL / 2;
  const lineA = ease(f, T.stack + 3, 10, EASE.inOut);
  const lineB = ease(f, T.stackRedes + 3, 10, EASE.inOut);
  const y0 = capMid(0);
  const y1 = capMid(1);
  const y2 = capMid(2);
  const lineEnd = y0 + (y1 - y0) * lineA + (y2 - y1) * lineB;
  return (
    <AbsoluteFill>
      <Ghost frame={f} from={T.stackWeb} text="WEB" color={C.cobalto} opacity={0.09} />
      <AbsoluteFill style={{ scale: punch(f, bt(39), 1.02, 9), transformOrigin: "50% 40%" }}>
        {/* dotted path joining the steps (site motif) */}
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <line x1={cx} y1={y0} x2={cx} y2={lineEnd} stroke={C.cobalto} strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
        </svg>
        {STACK.map((r, i) => {
          if (f < r.at) return null;
          const badge = Math.round(Math.min(ST_BADGE_COL, Math.max(64, CAP * sizes[i] * 1.1)));
          const s = popIn(f, r.at, fps, 11);
          const chk = ease(f, r.at + 3, 7, Easing.out(Easing.cubic));
          const d = "M5 12.5l4.5 4.5L19 7.5";
          const ev = evolvePath(chk, d);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: cx - badge / 2,
                  top: capMid(i) - badge / 2,
                  width: badge,
                  height: badge,
                  borderRadius: "50%",
                  background: C.cobalto,
                  scale: `${s}`,
                  boxShadow: "0 2px 6px rgba(19,24,43,0.08), 0 18px 36px -18px rgba(19,24,43,0.4)",
                }}
              >
                <svg viewBox="0 0 24 24" width={badge} height={badge} style={{ position: "absolute", inset: 0, padding: badge / 6, boxSizing: "border-box" }}>
                  <path d={d} fill="none" stroke={C.papel} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
                </svg>
              </div>
              <Slam frame={f} at={r.at} text={r.text} size={sizes[i]} x={ST_X} width={ST_W} baseline={bases[i]} color={C.tinta} />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Logo with a stretch-punch on the wordmark and a light sweep          */
/* ------------------------------------------------------------------ */
const LOGO_W = 5899;
const LOGO_H = 1312;
const SPLIT = 1160; // x where the bear mark ends and the wordmark begins

const LogoPunch: React.FC<{ frame: number; at: number; height: number; sweep: number | null }> = ({ frame, at, height, sweep }) => {
  const { fps } = useVideoConfig();
  const k = height / LOGO_H;
  const w = LOGO_W * k;
  const t = frame - at;
  const markS = t < 0 ? 0 : interpolate(spring({ frame: t, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } }), [0, 1], [1.35, 1]);
  const wp = interpolate(frame, [at + 2, at + 10], [0, 1], clamp);
  const wordSX = frame < at + 2 ? 0 : 0.22 + 0.78 * EASE.rebote(wp);
  const src = staticFile("brand/logo-full-papel.svg");
  return (
    <div style={{ position: "relative", width: w, height }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SPLIT * k, height, overflow: "hidden", scale: `${markS}`, transformOrigin: "50% 60%" }}>
        <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: w, height }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: SPLIT * k,
          top: 0,
          width: (LOGO_W - SPLIT) * k,
          height,
          overflow: "hidden",
          scale: `${wordSX} 1`,
          transformOrigin: "0% 50%",
          opacity: wordSX > 0 ? 1 : 0,
        }}
      >
        <Img src={src} style={{ position: "absolute", left: -SPLIT * k, top: 0, width: w, height }} />
      </div>
      {sweep !== null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter:
              "drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 22px rgba(201,210,255,1)) drop-shadow(0 0 54px rgba(120,140,255,0.95))",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: "100% 100%",
              maskImage: `url(${src})`,
              maskSize: "100% 100%",
              // 30 % band (±15 %) with a flat white core, so it reads across mark AND wordmark
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 15}%, rgba(255,255,255,1) ${sweep - 4}%, rgba(255,255,255,1) ${sweep + 4}%, rgba(255,255,255,0) ${sweep + 15}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const LOGO_BIG = 186; // 836 px wide (870 with the push): the widest that stays inside x 90–990
const LOGO_SMALL = 84;
const LOGO_Y_BIG = 680; // centre
const LOGO_Y_SMALL = 1150;
const GLIDE0 = T.cta - 6; // 595: the logo starts to shrink/glide before the CTA beat

/** f546–600 logo; f601–655 CTA (the logo glides down into the end card). */
export const SceneLogoCta: React.FC = () => {
  const f = useAbs(T.logo);
  const { fps } = useVideoConfig();
  const mv = interpolate(f, [GLIDE0, T.cta + 10], [0, 1], { ...clamp, easing: EASE.inOut });
  const push = interpolate(f, [T.logo, GLIDE0], [1, 1.04], clamp) * punch(f, bt(42), 1.025, 10);
  const hBig = LOGO_BIG * push;
  const h = hBig + (LOGO_SMALL - hBig) * mv;
  const cy = LOGO_Y_BIG + (LOGO_Y_SMALL - LOGO_Y_BIG) * mv;
  const w = (LOGO_W / LOGO_H) * h;
  // bear-mark centre (the circle reveal and the pulse rings come from it)
  const markX = 540 - w / 2 + (SPLIT * (h / LOGO_H)) / 2;
  const SW0 = T.logo + 10;
  const SW1 = T.logo + 36;
  const sweepT = interpolate(f, [SW0, SW1], [-20, 120], { ...clamp, easing: EASE.inOut });
  const sweep = f >= SW0 && f <= SW1 ? sweepT : null;
  // screen-space position of the sweep (same 105° band, mapped onto the logo box) for the beam behind
  const beamX = 540 - w / 2 + (w * sweepT) / 100;
  const beamA = sweep === null ? 0 : interpolate(f, [SW0, SW0 + 5, SW1 - 5, SW1], [0, 1, 1, 0], clamp);
  // cobalto reveal: from behind the bear mark, opens over f595–607 so the headline lands on open cobalto
  // (starts as a disc that already frames the whole mark, never as a dot inside the bear's face)
  const r = interpolate(f, [GLIDE0 - 1, T.cta + 6], [h * 0.72, 1750], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  // headline
  const sA = 150;
  const wA = sA * EM.w800s125["Auditoría"];
  const wG = sA * EM.w800s125.gratis;
  const bA = 512;
  const bG = bA + 168;
  const tGratis = T.cta + 7;
  const ul = ease(f, T.cta + 11, 9, EASE.salida);
  // button
  const tBtn = bt(45); // 614
  const tTap = bt(46); // 628
  const bs = popIn(f, tBtn, fps, 10);
  const tapDown = interpolate(f, [tTap, tTap + 2, tTap + 7], [1, 0.95, 1], clamp);
  const ripple = interpolate(f, [tTap, tTap + 12], [0, 1], { ...clamp, easing: EASE.salida });
  const btnTxt = 60;
  const btnW = btnTxt * EM.w700s110["lonsolab.com"] + 54 + 22 + 2 * 58;
  const btnH = 118;
  const btnTop = 946;
  return (
    <AbsoluteFill>
      {/* light beam behind the logo, travelling with the sweep */}
      {beamA > 0 && (
        <AbsoluteFill
          style={{
            opacity: beamA,
            background: `linear-gradient(105deg, rgba(201,210,255,0) ${beamX - 170}px, rgba(201,210,255,0.26) ${beamX - 30}px, rgba(255,255,255,0.42) ${beamX}px, rgba(201,210,255,0.26) ${beamX + 30}px, rgba(201,210,255,0) ${beamX + 170}px)`,
            WebkitMaskImage: `radial-gradient(ellipse 620px 260px at 540px ${cy}px, #000 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)`,
            maskImage: `radial-gradient(ellipse 620px 260px at 540px ${cy}px, #000 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)`,
          }}
        />
      )}
      {/* topo pulse: two contour rings leave the bear mark on the downbeat */}
      {[0, 6].map((d) => {
        const t = f - bt(42) - d;
        if (t < 0 || t > 30) return null;
        const p = interpolate(t, [0, 30], [0, 1], { ...clamp, easing: EASE.salida });
        const rad = h * 0.55 + 760 * p;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: markX - rad,
              top: cy - rad * 0.86,
              width: rad * 2,
              height: rad * 1.72,
              borderRadius: "48% 52% 50% 50% / 55% 50% 50% 45%",
              border: `${3 - 1.6 * p}px solid ${C.papel}`,
              opacity: 0.55 * (1 - p),
            }}
          />
        );
      })}
      {f >= GLIDE0 - 1 && (
        <AbsoluteFill style={{ clipPath: `circle(${r}px at ${markX}px ${cy}px)` }}>
          <div style={{ position: "absolute", left: -100, top: -100, width: 1280, height: 2120, background: C.cobalto }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 55% at 50% 36%, rgba(201,210,255,0.22) 0%, rgba(0,0,0,0) 70%)" }} />
          <Topo color={C.papel} opacity={0.2} drift={10} strokeWidth={1.8} />
          {/* bear watermark (site closing section): the COMPLETE mark in papel at 8 %, in the decorative zone */}
          <Img
            src={staticFile("brand/logo-mark-papel.svg")}
            style={{ position: "absolute", left: 556, top: 1296, height: 600, width: 600 * (1019 / 1320), opacity: 0.08 }}
          />
        </AbsoluteFill>
      )}
      {f >= T.cta && (
        <>
          <Slam frame={f} at={T.cta} text="Auditoría" size={sA} x={540} width={wA + 20} baseline={bA} align="center" weight={800} />
          <Slam frame={f} at={tGratis} text="gratis" size={sA} x={540} width={wG + 20} baseline={bG} align="center" weight={800} />
          <div
            style={{
              position: "absolute",
              left: 540 - wG / 2,
              top: bG + 0.24 * sA,
              width: wG,
              height: 16,
              borderRadius: 8,
              background: C.pin,
              scale: `${ul} 1`,
              transformOrigin: "0% 50%",
            }}
          />
          {f >= tBtn && (
            <div
              style={{
                position: "absolute",
                left: 540 - btnW / 2,
                top: btnTop,
                width: btnW,
                height: btnH,
                borderRadius: 999,
                background: C.pin,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                scale: `${interpolate(bs, [0, 1], [0.6, 1]) * tapDown}`,
                opacity: Math.min(1, bs * 2),
                boxShadow: "0 2px 6px rgba(19,24,43,0.12), 0 26px 44px -18px rgba(13,18,40,0.6)",
                overflow: "hidden",
              }}
            >
              <span style={{ fontFamily: FONT, fontWeight: 700, fontStretch: "110%", fontSize: btnTxt, lineHeight: 1, color: C.tinta, whiteSpace: "pre" }}>
                lonsolab.com
              </span>
              <Icon name="flecha" size={54} color={C.tinta} strokeWidth={2.4} />
              {f >= tTap && (
                <div
                  style={{
                    position: "absolute",
                    left: btnW * 0.72 - 150,
                    top: btnH / 2 - 150,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: C.papel,
                    opacity: 0.4 * (1 - ripple),
                    scale: `${0.1 + 1.4 * ripple}`,
                  }}
                />
              )}
            </div>
          )}
        </>
      )}
      <div style={{ position: "absolute", left: 540 - w / 2, top: cy - h / 2, width: w, height: h }}>
        <LogoPunch frame={f} at={T.logo} height={h} sweep={sweep} />
      </div>
    </AbsoluteFill>
  );
};

