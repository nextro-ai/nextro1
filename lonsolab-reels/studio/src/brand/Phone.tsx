import React from "react";
import { C, FONT } from "./tokens";

/**
 * A clean, brand-neutral smartphone frame. Children render inside the screen
 * (screen size = width-2*bezel x height-2*bezel, rounded). Default 760x1560.
 */
export const Phone: React.FC<{
  width?: number;
  height?: number;
  bezel?: number;
  frameColor?: string;
  screenColor?: string;
  time?: string;
  dark?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  width = 760,
  height = 1560,
  bezel = 22,
  frameColor = C.tinta,
  screenColor = C.blanco,
  time = "9:41",
  dark = false,
  children,
  style,
}) => {
  const radius = width * 0.14;
  const k = width / 760; // internal elements scale with the phone size
  const fg = dark ? C.blanco : C.tinta;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: frameColor,
        padding: bezel,
        boxShadow: "0 4px 12px rgba(19,24,43,0.18), 0 60px 120px -40px rgba(19,24,43,0.55)",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius - bezel,
          background: screenColor,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 92 * k,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${18 * k}px ${64 * k}px 0`,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 30 * k,
            color: fg,
            zIndex: 5,
          }}
        >
          <span>{time}</span>
          <span style={{ display: "flex", gap: 10 * k, alignItems: "center" }}>
            <span style={{ width: 34 * k, height: 18 * k, borderRadius: 5 * k, border: `${2.5 * k}px solid ${fg}`, position: "relative" }}>
              <span style={{ position: "absolute", inset: 2 * k, right: 8 * k, background: fg, borderRadius: 2 * k }} />
            </span>
          </span>
        </div>
        {/* dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 22 * k,
            left: "50%",
            translate: "-50% 0",
            width: 200 * k,
            height: 56 * k,
            borderRadius: 28 * k,
            background: "#000",
            zIndex: 6,
          }}
        />
        {children}
      </div>
    </div>
  );
};
