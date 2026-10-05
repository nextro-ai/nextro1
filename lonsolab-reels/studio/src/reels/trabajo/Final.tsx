import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { C, EASE, FONT, Icon, Logo, Topo } from "../../brand";
import { TILE, tilePos } from "./stack";
import { T } from "./timing";
import { CL, Line, beatBop, p01 } from "./ui";

/** Top of the closing cobalto card (rises from below and covers the grid). */
const ctaTop = (f: number) => interpolate(f, [T.cta - 8, T.cta + 6], [1920, 0], { ...CL, easing: EASE.salida });

const Headline: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame();
  const at = T.grid + 4;
  const mark = p01(f, at + 8, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 336,
        fontFamily: FONT,
        fontWeight: 800,
        fontStretch: "112%",
        fontSize: 112,
        lineHeight: 1.0,
        letterSpacing: "-0.035em",
        color,
      }}
    >
      <Line at={at}>
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              position: "absolute",
              left: -14,
              right: -16,
              top: "12%",
              bottom: "2%",
              background: C.pin,
              borderRadius: 10,
              transformOrigin: "left center",
              scale: `${mark} 1`,
              rotate: "-1.2deg",
            }}
          />
          <span style={{ position: "relative", color: mark > 0.5 ? C.tinta : color }}>Tu negocio</span>
        </span>
      </Line>
      <Line at={at + 3}>puede ser</Line>
      <Line at={at + 6}>el próximo.</Line>
    </div>
  );
};

/** Headline that changes colour exactly where the cobalto card passes beneath it. */
export const FinalHeadline: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.grid) return null;
  const top = ctaTop(f);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${Math.max(0, 1920 - top)}px 0)` }}>
        <Headline color={C.tinta} />
      </AbsoluteFill>
      {top < 1920 && (
        <AbsoluteFill style={{ clipPath: `inset(${top}px 0 0 0)` }}>
          <Headline color={C.papel} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** Closing card: cobalto, topo in papel, logo watermark. */
export const CtaCard: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.cta - 9) return null;
  const top = ctaTop(f);
  const radius = interpolate(top, [0, 200], [0, 56], CL);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: 1080,
        height: 1920,
        borderRadius: `${radius}px ${radius}px 0 0`,
        background: C.cobalto,
        overflow: "hidden",
        boxShadow: "0 -30px 80px -20px rgba(19,24,43,0.45)",
      }}
    >
      <Topo color={C.papel} opacity={0.22} drawFrom={T.cta - 6} drawDuration={60} drift={6} scale={1.3} />
      {/* watermark sits low and right so its stem starts well below "lonsolab.com" */}
      <div style={{ position: "absolute", left: 610, top: 1340, opacity: 0.2, rotate: "-8deg" }}>
        <Logo kind="mark" variant="tinta" height={900} />
      </div>
    </div>
  );
};

/** Slot 6 ("tu negocio") that morphs into the CTA pill, plus logo and URL. */
export const TileAndCta: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.tile6 - 2) return null;
  const pop = spring({ frame: f - T.tile6, fps: 30, config: { damping: 10, stiffness: 200, mass: 0.7 } });
  const m = p01(f, T.cta - 6, 15);
  const t = tilePos(5);
  const pill = { x: 540 - 330, y: 1028, w: 660, h: 118 };
  const x = interpolate(m, [0, 1], [t.x, pill.x]);
  const y = interpolate(m, [0, 1], [t.y, pill.y]);
  const w = interpolate(m, [0, 1], [TILE.w, pill.w]);
  const h = interpolate(m, [0, 1], [TILE.h, pill.h]);
  const r = interpolate(m, [0, 1], [18, 59]);
  const pulse = f < T.cta - 6 ? beatBop(f, 46, 48, 1.06, 10) : beatBop(f, 49, 52, 1.025, 10);
  const shine = interpolate(f, [T.cta + 20, T.cta + 38], [-0.4, 1.4], CL);
  const iconOut = 1 - p01(f, T.cta - 6, 5);
  const textIn = p01(f, T.cta + 1, 10);
  const logo = spring({ frame: f - (T.cta + 2), fps: 30, config: { damping: 13, stiffness: 160 } });
  const url = p01(f, T.cta + 7, 12);
  const ringW = ((f - T.tile6) % 30) / 30;
  return (
    <AbsoluteFill>
      {/* slot / pill */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: r,
          background: C.pin,
          scale: `${pop * pulse}`,
          boxShadow: "0 2px 6px rgba(19,24,43,0.12), 0 26px 50px -20px rgba(232,70,26,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            bottom: -20,
            width: 120,
            left: `${shine * 100}%`,
            translate: "-50% 0",
            rotate: "18deg",
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
        {iconOut > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: iconOut }}>
            <div
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: "50%",
                border: `4px solid ${C.tinta}`,
                opacity: (1 - ringW) * 0.35,
                scale: `${0.6 + ringW * 0.8}`,
              }}
            />
            <Icon name="pin" size={118} color={C.tinta} strokeWidth={2} />
          </div>
        )}
        {textIn > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: textIn,
              translate: `0 ${(1 - textIn) * 16}px`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "108%", fontSize: 58, color: C.tinta, letterSpacing: "-0.01em" }}>
              Auditoría gratis
            </span>
            <Icon name="flecha" size={52} color={C.tinta} strokeWidth={2.6} />
          </div>
        )}
      </div>
      {/* logo + url */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 888,
          display: "flex",
          justifyContent: "center",
          opacity: f >= T.cta + 2 ? 1 : 0,
          scale: `${logo}`,
          translate: `0 ${(1 - logo) * 30}px`,
        }}
      >
        <Logo kind="full" variant="papel" height={100} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1172,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontStretch: "108%",
          fontSize: 54,
          color: C.papel,
          letterSpacing: "0.01em",
          opacity: url,
          translate: `0 ${(1 - url) * 18}px`,
        }}
      >
        lonsolab.com
      </div>
    </AbsoluteFill>
  );
};

