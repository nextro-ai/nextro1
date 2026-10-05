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
 */
export const Logo: React.FC<{
  kind?: "mark" | "full";
  variant?: Variant;
  height: number;
  style?: React.CSSProperties;
}> = ({ kind = "full", variant = "tinta", height, style }) => {
  const ratio = kind === "mark" ? 1019 / 1320 : 5899 / 1312;
  return (
    <Img
      src={staticFile(`brand/logo-${kind}${suffix[variant]}.svg`)}
      style={{ height, width: height * ratio, display: "block", ...style }}
    />
  );
};
