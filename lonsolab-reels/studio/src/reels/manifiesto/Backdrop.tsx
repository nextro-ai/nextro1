import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Topo } from "../../brand";
import { T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Look = { bg: string; glow: string; topo: string; topoOpacity: number };

const lookAt = (f: number): Look => {
  if (f < T.pero) return { bg: C.tinta, glow: "rgba(35,64,216,0.16)", topo: C.papel, topoOpacity: 0.08 };
  if (f < T.siNo) return { bg: C.pin, glow: "rgba(255,190,150,0.35)", topo: C.tinta, topoOpacity: 0.12 };
  if (f < T.noExistis) return { bg: C.tinta, glow: "rgba(35,64,216,0.16)", topo: C.papel, topoOpacity: 0.08 };
  if (f < T.mapa) return { bg: "#0f1324", glow: "rgba(255,90,38,0.07)", topo: C.papel, topoOpacity: 0.055 };
  if (f < T.stack) return { bg: C.cobalto, glow: "rgba(201,210,255,0.22)", topo: C.papel, topoOpacity: 0.2 };
  if (f < T.logo) return { bg: C.papel, glow: "rgba(201,210,255,0.5)", topo: C.cobalto, topoOpacity: 0.16 };
  return { bg: C.tinta, glow: "rgba(35,64,216,0.24)", topo: C.papel, topoOpacity: 0.08 };
};

/**
 * Continuous background world: colour per section, soft glow and the brand's
 * topographic lines drifting across cuts (absolute frame, so no jumps).
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const L = lookAt(frame);
  // section B slowly sinks: glow breathes down
  const bDark = frame >= T.noExistis && frame < T.mapa ? interpolate(frame, [T.noExistis, T.noExistis + 40], [1, 0.6], clamp) : 1;
  const isMapa = frame >= T.mapa && frame < T.stack;
  const isLogo = frame >= T.logo && frame < T.cta + 12;
  return (
    <AbsoluteFill>
      {/* oversized so camera shake never reveals an edge */}
      <div style={{ position: "absolute", left: -100, top: -100, width: 1280, height: 2120, background: L.bg }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 36%, ${L.glow} 0%, rgba(0,0,0,0) 70%)`,
          opacity: bDark,
        }}
      />
      {isMapa ? (
        // the map "draws itself" when the solution arrives
        <Topo color={L.topo} opacity={L.topoOpacity} drawFrom={T.mapa} drawDuration={40} drift={10} strokeWidth={1.8} />
      ) : isLogo ? (
        <Topo color={L.topo} opacity={0.12} drawFrom={T.logo} drawDuration={46} drift={10} strokeWidth={1.8} />
      ) : (
        <Topo color={L.topo} opacity={L.topoOpacity} drift={10} strokeWidth={1.8} />
      )}
    </AbsoluteFill>
  );
};
