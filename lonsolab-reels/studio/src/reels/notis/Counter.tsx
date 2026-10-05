import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { sweepY } from "./Stack";
import { COUNTER_CY, NOTIFS, SCREEN, T, ip } from "./timing";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * iOS-style group counter: "+N notificaciones" = cards that arrived besides the newest one.
 * It has its own slot between the headline and the stack (the stack moves down to make room), so it
 * never covers a card. Fades out before the sweep carries it past the Dynamic Island.
 */
export const Counter: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.counterIn - 2 || f > T.sweep + 10) return null;
  let arrived = 0;
  let lastAt = -99;
  for (const n of NOTIFS) {
    if (n.at <= f) {
      arrived++;
      lastAt = n.at;
    }
  }
  const count = Math.max(1, arrived - 1);
  const isFinal = f >= T.last;
  const enter = ip(f, T.counterIn - 2, T.counterIn + 8, 0, 1, EASE.rebote);
  const tick = interpolate(f - lastAt, [0, 2, 6], [1, isFinal && f - lastAt < 8 ? 1.16 : 1.07, 1], CL);
  const cy = COUNTER_CY - SCREEN.y; // screen-space centre (canvas y 890, between headline and stack)
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: cy - 44,
        display: "flex",
        justifyContent: "center",
        zIndex: 40,
        translate: `0px ${sweepY(f) + (1 - enter) * 24}px`,
        opacity: ip(f, T.counterIn - 2, T.counterIn + 3, 0, 1) * interpolate(f, [T.sweep - 6, T.sweep - 1], [1, 0], CL),
      }}
    >
      <div
        style={{
          height: 88,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 40px 0 30px",
          borderRadius: 999,
          background: isFinal ? C.pin : "rgba(14,18,36,0.9)",
          border: isFinal ? `2px solid ${C.pin}` : "2px solid rgba(201,210,255,0.28)",
          boxShadow: "0 18px 40px -14px rgba(0,0,0,0.6)",
          scale: String(interpolate(enter, [0, 1], [0.7, 1]) * tick),
          fontFamily: FONT,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: isFinal ? C.tinta : C.pin,
            boxShadow: `0 0 0 ${interpolate(f - lastAt, [0, 10], [10, 0], CL)}px rgba(255,90,38,0.25)`,
          }}
        />
        <span
          style={{
            fontSize: 50,
            fontWeight: 800,
            fontStretch: "112%",
            color: isFinal ? C.tinta : C.pin,
            fontVariantNumeric: "tabular-nums",
            minWidth: count >= 10 ? 96 : 66,
            textAlign: "right",
          }}
        >
          +{count}
        </span>
        <span style={{ fontSize: 46, fontWeight: isFinal ? 700 : 600, fontStretch: "100%", color: isFinal ? C.tinta : C.papel }}>
          {count === 1 ? "notificación" : "notificaciones"}
        </span>
      </div>
    </div>
  );
};
