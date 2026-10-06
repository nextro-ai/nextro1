import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { alpha, useTheme } from "./theme";

/** Film grain (SVG turbulence, greyscale, reseeded every 2 frames), kept at ~4 %. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="1080" height="1920">
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Soft edge vignette in the theme's ink. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.1 }) => {
  const t = useTheme();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(120% 80% at 50% 45%, ${alpha(t.ink, 0)} 55%, ${alpha(t.ink, strength)} 100%)`,
      }}
    />
  );
};
