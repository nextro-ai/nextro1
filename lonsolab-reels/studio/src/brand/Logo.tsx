import React from "react";
import { Img, staticFile } from "remotion";

type Variant = "tinta" | "white" | "papel" | "cobalto";

const suffix: Record<Variant, string> = {
  tinta: "",
  white: "-white",
  papel: "-papel",
  cobalto: "-cobalto",
};

/**
 * Official Lonso Lab logo (SVG from lonsolab.com).
 * - kind "mark": the bear-in-L symbol only (aspect ~0.77 : 1, w:h = 1019:1320)
 * - kind "full": horizontal lockup symbol + "LONSO LAB" (aspect 5899:1312 ≈ 4.5 : 1)
 * - `color`: paint the logo in any colour (uses the SVG as a CSS mask), for palette variants.
 *   When omitted, the pre-coloured `variant` file is used.
 */
export const Logo: React.FC<{
  kind?: "mark" | "full";
  variant?: Variant;
  color?: string;
  height: number;
  style?: React.CSSProperties;
}> = ({ kind = "full", variant = "tinta", color, height, style }) => {
  const ratio = kind === "mark" ? 1019 / 1320 : 5899 / 1312;
  const width = height * ratio;
  if (color) {
    const url = `url(${staticFile(`brand/logo-${kind}.svg`)})`;
    return (
      <div
        style={{
          height,
          width,
          background: color,
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          display: "block",
          ...style,
        }}
      />
    );
  }
  return (
    <Img
      src={staticFile(`brand/logo-${kind}${suffix[variant]}.svg`)}
      style={{ height, width, display: "block", ...style }}
    />
  );
};
