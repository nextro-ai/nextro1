import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { C, EASE, FONT } from "../../brand";
import { EM } from "./metrics";
import { bt, T } from "./timing";
import { ASC, Slam, ease, popIn, stackBaselines } from "./type";
import { useAbs, X0 } from "./common";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = EM.w900s125;

/**
 * f218–272 · "NO EXISTÍS." — enormous, pin; then the word loses its fill and fades.
 * Both lines slam as ONE block (shared origin at the block centre), so "NO" never covers
 * the Í of line 2 and the block never rises above y 280. Lines are 860 px, centred, so the
 * slow push + letter-spacing spread end inside x 90–990.
 */
const NE_W = 860;
const NE_CAP_TOP = 358;
export const SceneNoExistis: React.FC = () => {
  const f = useAbs(T.noExistis);
  const { fps } = useVideoConfig();
  const s1 = NE_W / E.NO; // 435 px
  const s2 = NE_W / E["EXISTÍS."]; // 157 px
  const [b1, b2] = stackBaselines([{ size: s1 }, { size: s2, accent: true }], NE_CAP_TOP, 36);
  const midY = (NE_CAP_TOP + b2) / 2;
  const push = interpolate(f, [T.noExistis, T.ficha], [1, 1.02], { ...clamp, easing: Easing.out(Easing.quad) });
  // heavy group slam 1.3 → 1
  const g = spring({ frame: f - T.noExistis, fps, config: { damping: 15, stiffness: 160, mass: 1 } });
  const groupS = interpolate(g, [0, 1], [1.3, 1]);
  // existence fading: fill → outline → ghost
  const fillA = interpolate(f, [bt(18) + 2, bt(19) + 2], [1, 0], { ...clamp, easing: EASE.inOut });
  const strokeA = interpolate(f, [bt(19) + 2, T.ficha - 1], [1, 0.35], clamp);
  // spread from the centre, capped: (860 + ~15 px) · 1.02 ≤ 892 px
  const spread = interpolate(f, [bt(18), T.ficha], [-0.02, -0.008], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill style={{ scale: push, transformOrigin: "50% 30%" }}>
      <AbsoluteFill style={{ scale: groupS, transformOrigin: `540px ${midY}px` }}>
        <Slam frame={f} at={T.noExistis} text="NO" size={s1} x={540} width={NE_W} baseline={b1} align="center" color={C.pin} slamFrom={1} outerScale={groupS * push} maxW={880} />
        <Slam
          frame={f}
          at={T.noExistis}
          text="EXISTÍS."
          size={s2}
          x={540}
          width={NE_W + 40}
          fit={NE_W}
          baseline={b2}
          align="center"
          color={C.pin}
          slamFrom={1}
          outerScale={groupS * push}
          maxW={890}
          style={{
            color: `rgba(255,90,38,${fillA})`,
            WebkitTextStroke: `4px rgba(255,90,38,${strokeA})`,
            letterSpacing: `${spread}em`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Row = { at: number; xAt: number; lines: [string, string]; top: number };

const ROWS: Row[] = [
  { at: T.ficha, xAt: bt(21), lines: ["Ficha", "incompleta."], top: 338 },
  { at: T.redes, xAt: bt(25), lines: ["Redes", "quietas."], top: 602 },
  { at: T.web, xAt: bt(29), lines: ["Una web que", "no vende."], top: 866 },
];

const TXT = 100; // px, w800 s100
const BOX = 92;
const TX = X0 + BOX + 38;

const MaskLine: React.FC<{ frame: number; at: number; text: string; baseline: number; opacity: number }> = ({
  frame,
  at,
  text,
  baseline,
  opacity,
}) => {
  if (frame < at) return null;
  // pre-rolled by 4 frames so the line is already half up on the beat frame
  const p = interpolate(frame, [at - 4, at + 10], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <div
      style={{
        position: "absolute",
        left: TX - 10,
        top: baseline - 0.98 * TXT,
        height: 1.26 * TXT,
        width: 700,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 10,
          top: (0.98 - ASC) * TXT,
          fontFamily: FONT,
          fontWeight: 800,
          fontStretch: "100%",
          fontSize: TXT,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          whiteSpace: "pre",
          color: C.papel,
          opacity,
          translate: `0px ${(1 - p) * 1.25 * TXT}px`,
          rotate: `${(1 - p) * 3}deg`,
          transformOrigin: "0% 100%",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const CrossBox: React.FC<{ frame: number; at: number; xAt: number; top: number; dim: number }> = ({ frame, at, xAt, top, dim }) => {
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = popIn(frame, at - 3, fps, 13);
  const a = ease(frame, xAt, 5, Easing.out(Easing.cubic));
  const b = ease(frame, xAt + 3, 5, Easing.out(Easing.cubic));
  const d1 = "M 24 24 L 68 68";
  const d2 = "M 68 24 L 24 68";
  const e1 = evolvePath(a, d1);
  const e2 = evolvePath(b, d2);
  const stamp = interpolate(frame, [xAt, xAt + 3, xAt + 10], [1, 1.14, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: X0,
        top: top + 3,
        width: BOX,
        height: BOX,
        scale: `${s * stamp}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          border: `5px solid rgba(243,244,239,${0.42 * dim})`,
        }}
      />
      <svg width={BOX} height={BOX} viewBox="0 0 92 92" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {a > 0 && (
          <path d={d1} stroke={C.pin} strokeWidth={11} strokeLinecap="round" fill="none" strokeDasharray={e1.strokeDasharray} strokeDashoffset={e1.strokeDashoffset} />
        )}
        {b > 0 && (
          <path d={d2} stroke={C.pin} strokeWidth={11} strokeLinecap="round" fill="none" strokeDasharray={e2.strokeDasharray} strokeDashoffset={e2.strokeDashoffset} />
        )}
      </svg>
    </div>
  );
};

/** f273–436 · the ledger: three failures, each crossed out in pin. */
export const SceneLedger: React.FC = () => {
  const f = useAbs(T.ficha);
  // slow heavy camera drift + whip-out into the solution
  const drift = interpolate(f, [T.ficha, T.mapa], [10, -16], clamp);
  // camera: close on the first failure, pulls back as the list grows
  const c2 = ease(f, T.redes - 2, 14, EASE.inOut);
  const c3 = ease(f, T.web - 2, 14, EASE.inOut);
  const camS = 1.25 + (1.1 - 1.25) * c2 + (1.0 - 1.1) * c3;
  const camY = 52 + (13 - 52) * c2 + (0 - 13) * c3;
  // vertical whip-pan into the solution: ONE camera move shared by the outgoing list and the
  // incoming cobalto panel, so the motion carries across the cut. Starts on f431 with the bass
  // pickup in the bed, but barely moves before f433 (the last row stays readable until f432).
  const pan = interpolate(f, [T.mapa - 6, T.mapa], [0, 1920], { ...clamp, easing: Easing.in(Easing.cubic) });
  const vblur = interpolate(f, [T.mapa - 5, T.mapa - 1], [0, 46], { ...clamp, easing: Easing.in(Easing.quad) });
  const punches = ROWS.reduce((acc, r) => acc * interpolate(f, [r.at, r.at + 2, r.at + 10], [1, 1.018, 1], clamp), 1);
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="mf-vblur" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation={`0 ${vblur}`} />
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          translate: `0px ${drift - pan + camY}px`,
          scale: punches * camS,
          transformOrigin: `${X0}px 0px`,
          filter: vblur > 0.5 ? "url(#mf-vblur)" : undefined,
        }}
      >
        {ROWS.map((r, i) => {
          const next = ROWS[i + 1];
          const dim = next ? interpolate(f, [next.at, next.at + 8], [1, 0.36], clamp) : 1;
          const b1 = r.top + ASC * TXT;
          const bases = [b1, b1 + TXT * 1.02];
          return (
            <React.Fragment key={i}>
              <CrossBox frame={f} at={r.at} xAt={r.xAt} top={r.top} dim={dim} />
              <MaskLine frame={f} at={r.at} text={r.lines[0]} baseline={bases[0]} opacity={dim} />
              <MaskLine frame={f} at={r.at + 3} text={r.lines[1]} baseline={bases[1]} opacity={dim} />
              {/* once it's been judged, the line gets struck through */}
              {next &&
                r.lines.map((ln, j) => {
                  const p = ease(f, next.at + 2 + j * 3, 8, Easing.bezier(0.65, 0, 0.35, 1));
                  if (p <= 0) return null;
                  const w = EM.w800s100[ln as keyof typeof EM.w800s100] * TXT;
                  return (
                    <div
                      key={j}
                      style={{
                        position: "absolute",
                        left: TX - 6,
                        top: bases[j] - 0.3 * TXT - 4,
                        width: w + 12,
                        height: 8,
                        borderRadius: 4,
                        background: C.pin,
                        opacity: 0.9,
                        scale: `${p} 1`,
                        transformOrigin: "0% 50%",
                      }}
                    />
                  );
                })}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      {/* the C1 world (cobalto) arrives from below with the same pan and blur */}
      {pan > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: -100,
            top: 1920 - pan,
            width: 1280,
            height: 2120,
            background: `radial-gradient(ellipse 80% 55% at 50% 30%, rgba(201,210,255,0.22) 0%, rgba(0,0,0,0) 70%), ${C.cobalto}`,
            filter: vblur > 0.5 ? "url(#mf-vblur)" : undefined,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
