import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, EASE, FONT, Logo, Topo } from "../../brand";
import { T } from "./timing";
import { CL, HandStroke, Vignette, beatBop, p01 } from "./ui";

/** One word slamming on its beat: compressed (wdth 62) → expanded (wdth 125), scale 1.3 → 1. */
const SlamWord: React.FC<{ text: string; at: number; color: string; size: number; noBlur?: boolean }> = ({ text, at, color, size, noBlur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = f >= Math.max(0, at);
  const sp = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  const stretch = interpolate(f, [at, at + 7], [62, 125], { ...CL, easing: EASE.rebote });
  const blur = noBlur ? 0 : interpolate(f, [at, at + 4], [6, 0], CL);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: interpolate(f, [at, at + 7], [900, 800], CL),
        fontStretch: `${Math.min(125, stretch)}%`,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: "-0.025em",
        color,
        whiteSpace: "nowrap",
        opacity: vis ? 1 : 0,
        scale: `${interpolate(sp, [0, 1], [1.32, 1])}`,
        transformOrigin: "left center",
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {text}
    </div>
  );
};

export const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const hits = [T.w1, T.w2, T.w3, T.w4];
  // camera shake on every word, decays in 6 frames (noise-based, deterministic)
  let sx = 0;
  let sy = 0;
  for (const h of hits) {
    const k = interpolate(f, [h, h + 6], [1, 0], CL);
    if (k > 0 && f >= h) {
      sx += noise2D("hx", h, f * 0.9) * 10 * k;
      sy += noise2D("hy", h, f * 0.9) * 8 * k;
    }
  }
  const push = interpolate(f, [T.w4, T.mira], [1, 1.035], CL);
  const bop = beatBop(f, 4, 8, 1.02, 9);
  const logoIn = p01(f, 4, 16);
  const outro = p01(f, T.mira - 6, 6, EASE.in); // tiny anticipation before the cut
  return (
    <AbsoluteFill style={{ background: C.tinta, overflow: "hidden" }}>
      <Topo color={C.cobalto} opacity={0.42} drawFrom={-28} drawDuration={80} drift={10} scale={1.35} strokeWidth={1.8} />
      <Vignette strength={0.55} color="8,10,20" />
      <AbsoluteFill
        style={{
          translate: `${sx}px ${sy - outro * 30}px`,
          scale: `${push * bop}`,
          transformOrigin: "100px 640px",
        }}
      >
        {/* 144 px, line-height 0.92: "creas." ends above y 840 (zone A) */}
        <div style={{ position: "absolute", left: 100, top: 300 }}>
          <SlamWord text="No te" at={T.w1 - 3} color={C.papel} size={144} noBlur />
          <SlamWord text="pedimos" at={T.w2} color={C.papel} size={144} />
          <SlamWord text="que nos" at={T.w3} color={C.papel} size={144} />
          <div style={{ position: "relative" }}>
            <SlamWord text="creas." at={T.w4} color={C.pin} size={144} />
            {/* hand-drawn underline under "creas." */}
            <HandStroke
              d="M 8 40 C 120 22, 260 30, 380 26 S 560 18, 610 30"
              viewBox="0 0 640 70"
              at={T.underline}
              dur={11}
              color={C.pin}
              width={11}
              style={{ inset: "auto", left: 0, top: 128, width: 576, height: 63 }}
            />
          </div>
        </div>
      </AbsoluteFill>
      {/* foreshadow: case files peeking from the bottom, nudged up by every word */}
      {[
        { c: "#252c49", x: 130, r: -5, y: 1640, at: T.w1 },
        { c: C.cobalto, x: 300, r: 3, y: 1700, at: T.w2 },
        { c: C.papel, x: 470, r: -2, y: 1760, at: T.w3 },
      ].map((k, idx) => {
        let nudge = 0;
        for (const h of hits) nudge += interpolate(f, [h, h + 8], [0, 1], { ...CL, easing: EASE.rebote });
        const rise = interpolate(f, [k.at - 2, k.at + 10], [260, 0], { ...CL, easing: EASE.salida });
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: k.x,
              top: k.y - nudge * 26 + rise,
              width: 760,
              height: 600,
              borderRadius: 48,
              background: k.c,
              rotate: `${k.r + Math.sin((f + idx * 9) / 14) * 0.6}deg`,
              boxShadow: "0 -20px 50px -10px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ position: "absolute", left: 44, top: 34, display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: C.pin }} />
              <div style={{ width: 150 + idx * 40, height: 12, borderRadius: 6, background: idx === 2 ? C.tinta : C.papel, opacity: 0.35 }} />
            </div>
          </div>
        );
      })}
      {/* brand presence from frame 0 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 1120,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: logoIn,
          translate: `${(1 - logoIn) * -30}px 0`,
        }}
      >
        <Logo kind="full" variant="white" height={50} />
        <div style={{ width: 2, height: 46, background: C.cobaltoClaro, opacity: 0.5 }} />
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontStretch: "75%",
            fontSize: 44,
            letterSpacing: "0.2em",
            color: C.cobaltoClaro,
          }}
        >
          TRABAJOS
        </span>
      </div>
    </AbsoluteFill>
  );
};

