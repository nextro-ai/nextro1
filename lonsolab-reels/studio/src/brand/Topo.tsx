import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "./tokens";
import { TOPO_PATHS, TOPO_VIEWBOX } from "./topoPaths";

/**
 * The brand's topographic contour-line motif, as a full-bleed background.
 * - `drawFrom`: frame at which lines start tracing in (stroke-dash draw, like the site's
 *   "trazar" animation). Pass `null` to show them fully drawn.
 * - `drift`: slow parallax drift in px per second.
 * - `scale`: zoom of the motif (1 = 1600px-wide map stretched to cover 1080x1920 via slice).
 */
export const Topo: React.FC<{
  color: string;
  opacity?: number;
  drawFrom?: number | null;
  drawDuration?: number;
  drift?: number;
  scale?: number;
  rotate?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({
  color,
  opacity = 0.5,
  drawFrom = null,
  drawDuration = 54,
  drift = 6,
  scale = 1.25,
  rotate = 90,
  strokeWidth = 1.6,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${TOPO_VIEWBOX.w} ${TOPO_VIEWBOX.h}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          // rotate 90deg so the landscape motif fills the portrait frame
          width: 1920 * scale,
          height: 1080 * scale,
          left: 540 - (1920 * scale) / 2,
          top: 960 - (1080 * scale) / 2,
          rotate: `${rotate}deg`,
          translate: `${Math.sin(t * 0.21) * drift}px ${t * drift * -0.6}px`,
          opacity,
        }}
        fill="none"
        stroke={color}
      >
        {TOPO_PATHS.map((p, i) => {
          const progress =
            drawFrom === null
              ? 1
              : interpolate(
                  frame,
                  [drawFrom + (i % 12) * 2, drawFrom + (i % 12) * 2 + drawDuration],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.salida },
                );
          return (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              strokeWidth={p.major ? strokeWidth * 1.6 : strokeWidth}
              opacity={p.major ? 0.9 : 0.55}
            />
          );
        })}
      </svg>
    </div>
  );
};
