import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT, Topo } from "../../brand";
import { DUR, SCREEN, T } from "./timing";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Wallpaper: cobalt → ink gradient with the brand's contour lines (loop-safe drift). */
export const Wallpaper: React.FC = () => {
  const f = useCurrentFrame();
  const w = (2 * Math.PI * f) / DUR;
  // energy builds with the rain and resets after the sweep (0 at both ends of the loop)
  const glow = interpolate(f, [90, 255, T.sweep, T.sweep + 30], [0, 1, 1, 0], { ...CL, easing: EASE.inOut });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(172deg, ${C.cobalto} 0%, ${C.cobaltoHondo} 34%, #121a4f 62%, ${C.tinta} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 50% 0%, rgba(120,140,255,0.45), rgba(35,64,216,0) 70%)`,
        }}
      />
      <div style={{ position: "absolute", inset: -60, translate: `${Math.sin(w) * 14}px ${Math.cos(w) * 18}px` }}>
        <Topo color={C.cobaltoClaro} opacity={0.2} drift={0} scale={1.05} rotate={90} strokeWidth={1.7} />
      </div>
      {/* the screen "warms up" as notifications pile in */}
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(ellipse 85% 38% at 50% 58%, rgba(92,120,255,0.55), rgba(35,64,216,0) 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Soft shade at the very bottom of the wallpaper (under the stack: the cards fade with their own alpha mask). */
export const BottomFade: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(10,13,28,0) 72%, rgba(10,13,28,0.4) 100%)`,
      zIndex: 1,
    }}
  />
);

/** Date + clock. Dims while the CTA is on screen. */
export const Clock: React.FC = () => {
  const f = useCurrentFrame();
  // steps back while the CTA is on screen so it doesn't compete with the logo
  const dim = interpolate(f, [T.sweep - 4, T.sweep + 6, T.ctaOut, T.ctaOut + 8], [1, 0.14, 0.14, 1], CL);
  const top = 300 - SCREEN.y;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: dim,
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontStretch: "105%",
          fontSize: 40,
          letterSpacing: "0.005em",
          color: "rgba(243,244,239,0.82)",
          lineHeight: 1,
        }}
      >
        lunes 5 de octubre
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontStretch: "118%",
          fontSize: 128,
          letterSpacing: "-0.03em",
          color: "rgba(243,244,239,0.94)",
          lineHeight: 1,
          marginTop: 6,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 6px 30px rgba(8,12,40,0.35)",
        }}
      >
        9:41
      </div>
    </div>
  );
};

/** Generic lock-screen shortcuts (torch + camera), below the safe area: imagery only. */
export const QuickButtons: React.FC = () => {
  const f = useCurrentFrame();
  // gone before the f60 card pushes the stack down to them; back after the sweep
  const vis = interpolate(f, [44, 54, T.sweep + 4, T.sweep + 14], [1, 0, 0, 1], CL);
  if (vis <= 0) return null;
  const btn = (side: "left" | "right", icon: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        [side]: 56,
        bottom: 118,
        width: 96,
        height: 96,
        borderRadius: "50%",
        background: "rgba(243,244,239,0.14)",
        border: "1.5px solid rgba(243,244,239,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // under the stack (zIndex 2), like on a real lock screen
        opacity: vis,
      }}
    >
      {icon}
    </div>
  );
  return (
    <>
      {btn(
        "left",
        <svg viewBox="0 0 24 24" width={42} height={42} fill="none" stroke={C.papel} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8v3l-2 3v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9L8 6z" />
          <path d="M12 12v2" />
        </svg>,
      )}
      {btn(
        "right",
        <svg viewBox="0 0 24 24" width={42} height={42} fill="none" stroke={C.papel} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>,
      )}
    </>
  );
};
