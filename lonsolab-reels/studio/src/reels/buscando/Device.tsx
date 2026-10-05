import React from "react";
import { C, FONT } from "../../brand";

/** Phone geometry in its own coordinate space (scaled by the camera). */
export const PH = { w: 760, h: 1560, bezel: 22 } as const;
export const SCREEN = { w: PH.w - PH.bezel * 2, h: PH.h - PH.bezel * 2 } as const; // 716 x 1516

/**
 * Local copy of the kit <Phone> with extra craft: metallic edge, side keys, glass glare,
 * a slot for elements that live outside the screen clip (lifted cards) and a custom
 * status-bar left slot (used for the "Simulación" tag).
 */
export const Device: React.FC<{
  dark?: boolean;
  screenColor?: string;
  statusLeft?: React.ReactNode;
  glare?: number; // 0..1 sweep position of the specular highlight, <0 hides
  outside?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ dark = false, screenColor = C.blanco, statusLeft, glare = -1, outside, children, style }) => {
  const radius = PH.w * 0.14;
  const fg = dark ? C.blanco : C.tinta;
  return (
    <div
      style={{
        position: "absolute",
        width: PH.w,
        height: PH.h,
        borderRadius: radius,
        background: "linear-gradient(150deg, #3a4262 0%, #161b30 22%, #0e1222 60%, #2b3352 100%)",
        padding: PH.bezel,
        boxShadow:
          "inset 0 0 0 2px rgba(255,255,255,0.10), inset 0 0 0 7px #0b0e1a, 0 2px 6px rgba(19,24,43,0.20), 0 40px 80px -30px rgba(19,24,43,0.55), 0 90px 160px -60px rgba(19,24,43,0.45)",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* side keys */}
      <div style={{ position: "absolute", left: -6, top: 300, width: 8, height: 90, borderRadius: 4, background: "#1c2238" }} />
      <div style={{ position: "absolute", left: -6, top: 420, width: 8, height: 150, borderRadius: 4, background: "#1c2238" }} />
      <div style={{ position: "absolute", right: -6, top: 380, width: 8, height: 200, borderRadius: 4, background: "#1c2238" }} />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius - PH.bezel,
          background: screenColor,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
        {/* status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 58px 0 58px",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 28,
            color: fg,
            zIndex: 20,
          }}
        >
          <span>{statusLeft}</span>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {[10, 15, 20, 25].map((h, i) => (
              <span key={i} style={{ width: 6, height: h, borderRadius: 2, background: fg, alignSelf: "flex-end" }} />
            ))}
            <span style={{ width: 38, height: 20, marginLeft: 8, borderRadius: 6, border: `2.5px solid ${fg}`, position: "relative", opacity: 0.9 }}>
              <span style={{ position: "absolute", inset: 2.5, right: 9, background: fg, borderRadius: 2 }} />
            </span>
          </span>
        </div>
        {/* dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: "50%",
            translate: "-50% 0",
            width: 196,
            height: 56,
            borderRadius: 28,
            background: "#05060a",
            zIndex: 21,
          }}
        />
        {/* glass glare */}
        {glare >= 0 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 30,
              pointerEvents: "none",
              background: `linear-gradient(115deg, rgba(255,255,255,0) ${glare * 160 - 40}%, rgba(255,255,255,0.22) ${glare * 160 - 25}%, rgba(255,255,255,0) ${glare * 160 - 10}%)`,
            }}
          />
        ) : null}
      </div>
      {outside}
    </div>
  );
};
