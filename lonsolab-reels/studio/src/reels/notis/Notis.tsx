import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT, Phone, SafeZone, Topo } from "../../brand";
import { Counter } from "./Counter";
import { Cta } from "./Cta";
import { HookHeadline, SecondHeadline } from "./Headline";
import { BottomFade, Clock, QuickButtons, Wallpaper } from "./LockScreen";
import { Sound } from "./Sound";
import { Stack } from "./Stack";
import { DUR, KICKS, NOTIFS, PHONE, PHONE_R, T, lt } from "./timing";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Same scale factor the kit's <Phone> uses for its internal elements. */
const ISLAND_K = PHONE.w / 760;

/** Phone "buzz" on every landing: a tiny decaying horizontal shake (deterministic). */
const buzz = (f: number) => {
  const t = lt(f);
  let dx = 0;
  for (const n of NOTIFS) {
    const k = (f >= T.loopIn ? t : f) - n.at;
    if (k < 0 || k >= 6) continue;
    const amp = n.hero ? 4.5 : 3;
    dx += Math.sin(k * 2.9) * amp * (1 - k / 6);
  }
  return dx;
};

/**
 * Sound waves: when a notification lands on a beat, a soft cobalt glow pulses out from behind the phone
 * (no stroke, ≤ 0.22 opacity, 18 f decay), so it reads as vibration rather than as a second outline.
 */
const Ripples: React.FC = () => {
  const f = useCurrentFrame();
  const t = f >= T.loopIn ? lt(f) : f;
  return (
    <>
      {NOTIFS.filter((n, i) => i === 0 || n.at % 15 === 0).map((n, i) => {
        const r = (t - n.at) / 18;
        if (r < 0 || r >= 1) return null;
        const grow = EASE.salida(r) * 70;
        const a = Math.pow(1 - r, 1.6) * 0.22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: PHONE.x,
              top: PHONE.y,
              width: PHONE.w,
              height: PHONE.h,
              borderRadius: PHONE_R,
              boxShadow: `0 0 ${28 + grow * 0.7}px ${grow * 0.45}px rgba(35,64,216,${a.toFixed(3)})`,
            }}
          />
        );
      })}
    </>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 61;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, mixBlendMode: "overlay" }}>
      <svg width={1080} height={1920}>
        <filter id={`notis-grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#notis-grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Small, always-on disclaimer on the left margin (zone B, away from the action rail). */
const SimLabel: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 128,
      top: 1060,
      rotate: "-90deg",
      translate: "-50% -50%",
      fontFamily: FONT,
      fontSize: 38,
      fontWeight: 700,
      fontStretch: "110%",
      letterSpacing: "0.2em",
      color: C.tinta2,
      whiteSpace: "nowrap",
    }}
  >
    SIMULACIÓN
  </div>
);

export const Notis: React.FC = () => {
  const f = useCurrentFrame();
  const w = (2 * Math.PI * f) / DUR;
  const dx = buzz(f);
  // slow push-in while the notifications pile up; back to rest by the CTA (loop-safe: 1 at f0 and f359)
  const zoom =
    interpolate(f, [T.swap, T.last], [1, 1.025], { ...CL, easing: EASE.inOut }) -
    interpolate(f, [T.sweep - 4, T.sweep + 18], [0, 0.025], { ...CL, easing: EASE.inOut }) +
    KICKS.reduce((acc, k) => acc + interpolate(f, [k, k + 2, k + 12], [0, 0.014, 0], CL), 0);

  return (
    <AbsoluteFill style={{ background: C.papel, overflow: "hidden" }}>
      {/* paper + contour lines, slow circular drift (period = reel length) */}
      <div style={{ position: "absolute", inset: -40, translate: `${Math.sin(w) * 16}px ${Math.cos(w) * 22}px` }}>
        <Topo color={C.cobalto} opacity={0.17} drift={0} scale={1.3} strokeWidth={1.5} />
      </div>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(243,244,239,0) 40%, rgba(201,210,255,0.28) 100%)",
        }}
      />
      <SimLabel />

      {/* camera rig: phone + headline layers share the same space */}
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "540px 700px" }}>
        <Ripples />
        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, translate: `${dx}px 0px` }}>
          <Phone width={PHONE.w} height={PHONE.h} bezel={PHONE.bezel} frameColor={C.tinta} screenColor={C.tinta} time="" dark>
            <Wallpaper />
            <Clock />
            <AbsoluteFill style={{ zIndex: 2 }}>
              <Stack />
            </AbsoluteFill>
            <BottomFade />
            <QuickButtons />
            <Counter />
            {/* hardware stays above the screen content: re-draw the kit's Dynamic Island on top of every layer */}
            <div
              style={{
                position: "absolute",
                top: 22 * ISLAND_K,
                left: "50%",
                translate: "-50% 0",
                width: 200 * ISLAND_K,
                height: 56 * ISLAND_K,
                borderRadius: 28 * ISLAND_K,
                background: "#000",
                zIndex: 60,
              }}
            />
            {/* home indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 18,
                left: "50%",
                width: 230,
                height: 9,
                marginLeft: -115,
                borderRadius: 9,
                background: "rgba(243,244,239,0.8)",
                zIndex: 50,
              }}
            />
          </Phone>
        </div>
        <HookHeadline dx={dx} />
        <SecondHeadline dx={dx} />
        <Cta dx={dx} />
      </AbsoluteFill>

      <Grain />
      <Sound />
      <SafeZone />
    </AbsoluteFill>
  );
};
