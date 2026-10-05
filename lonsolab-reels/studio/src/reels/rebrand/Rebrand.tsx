import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import "./fonts";
import { Apps } from "./Apps";
import { BloomFlash, BloomUnderFlash, OldLogoBreak, Shards } from "./Bloom";
import { BoardGrid, LogoBuild, Palette, TypeScene } from "./Brand";
import { BloomSparks, FrostEdges, Grain, Motes, Snow } from "./Atmos";
import { CircleText, ColdWorld } from "./Cold";
import { End } from "./End";
import { Cracks, Night } from "./Night";
import { ESPIGA } from "./palette";
import { SHATTER_CENTER } from "./shatter";
import { Soundtrack } from "./Sound";
import { clamp, T } from "./timing";

/** Cold window light: two soft diagonal shafts drifting very slowly (part A depth). */
const ColdLight: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {[
        { x: -120, w: 260, o: 0.32, sp: 9 },
        { x: 260, w: 140, o: 0.22, sp: 6 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x + t * b.sp,
            top: -300,
            width: b.w,
            height: 2600,
            rotate: "-24deg",
            transformOrigin: "50% 0%",
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${b.o}) 50%, rgba(255,255,255,0) 100%)`,
            maskImage: "linear-gradient(180deg, black 0%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 75%)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * Night rises from the bottom of the frame at the splice (front = % of frame height from the
 * bottom, soft edge NIGHT_F %): the profile card goes dark first and the headline band stays on
 * light ice until ≈ f324, so "No se lee…" keeps its contrast through its whole hold.
 */
const NIGHT_F = 36;
const nightFront = (f: number) => interpolate(f, [T.splice - 4, T.splice + 12, T.splice + 26], [-NIGHT_F, 30, 130], clamp);
/** 0 (ice) … 1 (night) at screen height y on frame f. */
export const nightAt = (y: number, f: number) => {
  const q = ((1920 - y) / 1920) * 100;
  const x = Math.max(0, Math.min(1, (nightFront(f) + NIGHT_F - q) / NIGHT_F));
  return x * x * (3 - 2 * x);
};

/** Background: ice (A) → night (B) → warm board (after the bloom). */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const a = nightFront(frame);
  // smoothstep-shaped soft edge (no visible horizon line)
  const st = (k: number, al: number) => `rgba(0,0,0,${al}) ${a + NIGHT_F * k}%`;
  const nightMask = `linear-gradient(0deg, black ${a}%, ${st(0.2, 0.9)}, ${st(0.4, 0.66)}, ${st(0.6, 0.35)}, ${st(0.8, 0.1)}, transparent ${a + NIGHT_F}%)`;
  const warm = frame >= T.bloom ? 1 : 0;
  const glow = interpolate(frame, [T.bloom, T.bloom + 8, T.bloom + 70], [0, 1, 0.35], clamp);
  return (
    <AbsoluteFill>
      {warm < 1 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 60% at 50% 40%, #f1f5f9 0%, #d9e1ea 50%, #a6b6c8 100%)" }} />
          <ColdLight />
          {a > -NIGHT_F ? (
            <AbsoluteFill
              style={{
                WebkitMaskImage: nightMask,
                maskImage: nightMask,
                background: "radial-gradient(ellipse 90% 60% at 50% 45%, #1d2a44 0%, #121a2d 55%, #0a0f1d 100%)",
              }}
            />
          ) : null}
        </>
      ) : (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 62% at 50% 44%, #fcf8f1 0%, ${ESPIGA.crema} 52%, #ecdfc9 100%)` }} />
          <AbsoluteFill
            style={{
              opacity: glow,
              background: `radial-gradient(circle at ${SHATTER_CENTER.x}px ${SHATTER_CENTER.y}px, rgba(255,214,150,0.85) 0%, rgba(240,170,100,0.35) 40%, rgba(240,170,100,0) 75%)`,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

/** Small permanent label (brief): the bakery is fictional. */
const Disclaimer: React.FC = () => {
  const frame = useCurrentFrame();
  // dimmed while only the Lonso Lab bear is on screen (nothing illustrative there)
  const dim = interpolate(frame, [T.splice + 16, T.splice + 26, T.crack - 6, T.crack + 2], [1, 0.55, 0.55, 1], clamp);
  const o = interpolate(frame, [0, 6, T.end - 2, T.end + 6], [0.85, 1, 1, 0], clamp) * dim;
  if (o <= 0) return null;
  // follows the rising night at its own height, then stays dark until the bloom
  const n = frame < T.bloom ? nightAt(330, frame) : 0;
  const typeDark = frame >= T.type - 2 && frame < T.apps - 4;
  const d = typeDark ? 1 : n;
  const lightInk = frame >= T.bloom ? "#4a4136" : "#3a4258";
  return (
    <div
      style={{
        position: "absolute",
        right: 90,
        top: 298,
        padding: "8px 18px",
        borderRadius: 999,
        fontFamily: "Archivo",
        fontWeight: 600,
        fontStretch: "110%",
        fontSize: 26,
        lineHeight: 1.1,
        letterSpacing: "0.01em",
        color: interpolateColors(d, [0, 0.35, 0.6], [lightInk, lightInk, "#eef1f6"]),
        background: interpolateColors(d, [0, 1], ["rgba(255,255,255,0.62)", "rgba(255,255,255,0.10)"]),
        border: `1.5px solid ${interpolateColors(d, [0, 1], ["rgba(19,24,43,0.10)", "rgba(255,255,255,0.22)"])}`,
        opacity: o,
        zIndex: 50,
      }}
    >
      Ejemplo ilustrativo
    </div>
  );
};

export const Rebrand: React.FC = () => {
  const frame = useCurrentFrame();
  const cold = frame < T.bloom;
  // frost on the "lens": grows with the hook's first chord, deepens in the night, gone at the bloom
  const frost = interpolate(
    frame,
    [0, T.hookHit, T.hookHit + 20, T.sign, T.circle, T.splice, T.crack, T.bloom - 1],
    [0.3, 0.36, 0.5, 0.48, 0.42, 0.42, 0.55, 0.78],
    clamp,
  );
  const snowO = interpolate(frame, [T.bloom, T.bloom + 4], [1, 0], clamp);
  const dark = interpolate(frame, [T.splice - 2, T.splice + 16], [0, 1], clamp);
  const boardO = interpolate(frame, [T.bloom, T.bloom + 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#0a0f1d" }}>
      <Backdrop />
      {/* warm world (after the bloom) */}
      {frame >= T.bloom ? (
        <>
          <BoardGrid opacity={boardO * (frame >= T.end + 14 ? 0 : 1)} />
          <Motes opacity={interpolate(frame, [T.bloom + 4, T.bloom + 30], [0, 0.9], clamp)} />
          <LogoBuild />
          <Palette />
          <TypeScene />
          <Apps />
          <BloomUnderFlash />
          <Shards />
          <BloomSparks cx={SHATTER_CENTER.x} cy={SHATTER_CENTER.y} />
        </>
      ) : null}
      {/* cold world */}
      {frame < T.splice + 16 ? <ColdWorld /> : null}
      <CircleText />
      <Night />
      <Cracks />
      <BloomFlash />
      <OldLogoBreak />
      {cold || snowO > 0 ? (
        <>
          <FrostEdges amount={frost} opacity={cold ? 0.9 - 0.35 * dark : 0} />
          <Snow opacity={snowO * (0.95 - 0.15 * dark)} dark={dark} />
        </>
      ) : null}
      <End />
      <Disclaimer />
      <Grain opacity={0.07} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
