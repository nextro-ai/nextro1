import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Absolute frame inside a <Sequence from={start}>. */
export const useAbs = (start: number) => useCurrentFrame() + start;

/** Content box: x 100–980 (inside the 90–990 safe zone). */
export const X0 = 100;
export const WIDTH = 880;

/** Giant outlined word drifting in the decorative zone (below y 1240). */
export const Ghost: React.FC<{
  frame: number;
  from: number;
  text: string;
  color: string;
  opacity?: number;
  size?: number;
  y?: number;
  speed?: number;
}> = ({ frame, from, text, color, opacity = 0.12, size = 430, y = 1330, speed = 2.6 }) => {
  const t = frame - from;
  if (t < 0) return null;
  const o = interpolate(t, [0, 6], [0, opacity], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 60 - t * speed,
          top: y,
          fontFamily: FONT,
          fontWeight: 900,
          fontStretch: "125%",
          fontSize: size,
          lineHeight: 1,
          whiteSpace: "pre",
          letterSpacing: "-0.03em",
          color: "transparent",
          WebkitTextStroke: `2.5px ${color}`,
          opacity: o,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
