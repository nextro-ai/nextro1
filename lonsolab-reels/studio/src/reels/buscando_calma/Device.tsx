import React from "react";
import { FONT } from "../../brand";
import { BLACK, WHITE, alpha, mix, useTheme } from "./theme";

/**
 * Phone geometry. Drawn at 1:1 on the canvas (no camera scale), so a 46 px font inside the
 * screen is 46 px on screen. Placed at x 120..960; the bottom bleeds off the frame.
 */
export const PH = { w: 840, h: 1760, bezel: 18, left: 120, top: 650 } as const;
export const SCREEN = { w: PH.w - PH.bezel * 2, h: PH.h - PH.bezel * 2 } as const; // 804 x 1724
/** canvas position of a screen point (camera at rest) */
export const scr = { x: (sx: number) => PH.left + PH.bezel + sx, y: (sy: number) => PH.top + PH.bezel + sy };

/**
 * Themed smartphone (local variant of the kit <Phone>): body in `ink`, a thin rim light that
 * keeps it separate from a dark field, "Simulación" in the status bar.
 */
export const Device: React.FC<{
  darkScreen?: number; // 0..1: status bar switches to light-on-dark (call screen)
  rim?: number; // 0..1 rim light, for the dark field
  outside?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ darkScreen = 0, rim = 0, outside, children }) => {
  const t = useTheme();
  const radius = PH.w * 0.135;
  const fg = darkScreen > 0.5 ? t.onDark : t.ink;
  const sim = darkScreen > 0.5 ? t.onDark2 : t.ink2;
  return (
    <div
      style={{
        position: "absolute",
        width: PH.w,
        height: PH.h,
        borderRadius: radius,
        background: `linear-gradient(150deg, ${mix(t.ink, WHITE, 0.2)} 0%, ${t.ink} 20%, ${mix(t.ink, BLACK, 0.3)} 62%, ${mix(t.ink, WHITE, 0.14)} 100%)`,
        padding: PH.bezel,
        boxShadow: [
          `inset 0 0 0 2px ${alpha(WHITE, 0.1)}`,
          `0 0 0 ${2 * rim}px ${alpha(t.onDark, 0.28 * rim)}`,
          `0 2px 6px ${alpha(t.ink, 0.18)}`,
          `0 40px 80px -30px ${alpha(t.ink, 0.5)}`,
          `0 90px 160px -60px ${alpha(t.ink, 0.4)}`,
        ].join(", "),
      }}
    >
      {/* side keys */}
      <div style={{ position: "absolute", left: -6, top: 300, width: 8, height: 96, borderRadius: 4, background: mix(t.ink, WHITE, 0.08) }} />
      <div style={{ position: "absolute", left: -6, top: 430, width: 8, height: 160, borderRadius: 4, background: mix(t.ink, WHITE, 0.08) }} />
      <div style={{ position: "absolute", right: -6, top: 390, width: 8, height: 210, borderRadius: 4, background: mix(t.ink, WHITE, 0.08) }} />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius - PH.bezel,
          background: t.surface,
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
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 60px 0 60px",
            fontFamily: FONT,
            zIndex: 40,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 28, color: sim, letterSpacing: "0.01em" }}>Simulación</span>
          <span style={{ display: "flex", gap: 9, alignItems: "center" }}>
            {[10, 15, 20, 25].map((h, i) => (
              <span key={i} style={{ width: 6, height: h, borderRadius: 2, background: fg, alignSelf: "flex-end" }} />
            ))}
            <span style={{ width: 40, height: 21, marginLeft: 8, borderRadius: 6, border: `2.5px solid ${fg}`, position: "relative", opacity: 0.9 }}>
              <span style={{ position: "absolute", inset: 2.5, right: 9, background: fg, borderRadius: 2 }} />
            </span>
          </span>
        </div>
        {/* camera island (neutral hardware black) */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            translate: "-50% 0",
            width: 200,
            height: 56,
            borderRadius: 28,
            background: BLACK,
            zIndex: 41,
          }}
        />
      </div>
      {outside}
    </div>
  );
};
