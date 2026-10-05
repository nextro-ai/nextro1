import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE, display } from "../../brand";
import { ART, ArtBolsa, ArtCartel, ArtLogoTile, ArtPaletteTile, ArtPerfil, ArtWeb } from "./AppArt";
import { ESPIGA } from "./palette";
import { Line, SectionLabel } from "./Text";
import { B, clamp, T } from "./timing";

type Box = { x: number; y: number; w: number; h: number; rot: number; radius: number };

const STACK_S = 0.94;
const STACK_C = { x: 540, y: 806 };
const LAND = [
  { dx: -10, dy: 6, rot: -3.5 },
  { dx: 12, dy: -4, rot: 2.6 },
  { dx: -6, dy: 2, rot: -1.6 },
  { dx: 6, dy: -2, rot: 1.2 },
];

const TILE = { w: 284, h: 300, gap: 24, x0: 90, y0: 728 };
/** Board hold: per-tile parallax (px) — the tiles part very slightly while the camera pushes in. */
const PARALLAX = [
  [-6, -4],
  [0, -6],
  [6, -4],
  [-6, 4],
  [0, 6],
  [6, 4],
];
const BOARD_C = { x: 540, y: TILE.y0 + TILE.h + TILE.gap / 2 };
/** Specular sweeps across the board on the beats of the hold (f820, f840). */
const SHEEN_BEATS = [B(42), B(43)];

const tile = (i: number, hold = 0): Box => ({
  x: TILE.x0 + (i % 3) * (TILE.w + TILE.gap) + PARALLAX[i][0] * hold,
  y: TILE.y0 + Math.floor(i / 3) * (TILE.h + TILE.gap) + PARALLAX[i][1] * hold,
  w: TILE.w,
  h: TILE.h,
  rot: 0,
  radius: 20,
});

/** 0..1 sweep of the light band across tile i (columns staggered 2 f apart). */
const sheenAt = (frame: number, i: number) => {
  for (const b of SHEEN_BEATS) {
    const at = b + (i % 3) * 2 + Math.floor(i / 3);
    if (frame >= at && frame <= at + 16) return interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: EASE.inOut });
  }
  return -1;
};

/** Grid order: logo · cartel · bolsa / perfil · web · paleta. Cards 0-3 = cartel, bolsa, perfil, web. */
const CARD_TILE = [1, 2, 3, 4];
const CARDS: React.FC[] = [ArtCartel, ArtBolsa, ArtPerfil, ArtWeb];

const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
  rot: a.rot + (b.rot - a.rot) * t,
  radius: a.radius + (b.radius - a.radius) * t,
});

const Framed: React.FC<{
  box: Box;
  shadow: number;
  dim?: number;
  children: React.ReactNode;
  z?: number;
  /** 0 = cover-crop (centred) … 1 = whole art fitted with a 8 px top margin (UI mockups) */
  fit?: number;
  bg?: string;
  sheen?: number;
}> = ({ box, shadow, dim = 0, children, z, fit = 0, bg, sheen = -1 }) => {
  const cover = Math.max(box.w / ART.w, box.h / ART.h);
  const contain = Math.min(box.w / ART.w, (box.h - 12) / ART.h);
  const s = cover + (contain - cover) * fit;
  const top = ((box.h - ART.h * s) / 2) * (1 - fit) + 8 * fit;
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        rotate: `${box.rot}deg`,
        borderRadius: box.radius,
        overflow: "hidden",
        boxShadow: `0 ${4 * shadow}px ${10 * shadow}px rgba(31,27,22,${0.1 * shadow}), 0 ${50 * shadow}px ${90 * shadow}px -${40 * shadow}px rgba(31,27,22,${0.55 * shadow})`,
        zIndex: z,
        background: bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (box.w - ART.w * s) / 2,
          top,
          width: ART.w,
          height: ART.h,
          scale: `${s}`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(31,27,22,${dim})` }} /> : null}
      {sheen >= 0 ? (
        <div
          style={{
            position: "absolute",
            top: -40,
            bottom: -40,
            width: box.w * 0.7,
            left: interpolate(sheen, [0, 1], [-box.w * 0.8, box.w * 1.1]),
            rotate: "16deg",
            background: "linear-gradient(90deg, rgba(255,250,240,0) 0%, rgba(255,250,240,0.42) 50%, rgba(255,250,240,0) 100%)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}
    </div>
  );
};

export const Apps: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.apps - 12 || frame >= T.end + 16) return null;
  // cards clear the headline band by ≈ f788 so the board copy reads on a clean background
  const toGrid = (i: number) => interpolate(frame, [T.grid - 6 + i * 2, T.grid + 8 + i * 2], [0, 1], { ...clamp, easing: EASE.inOut });
  // the board never freezes: slow continuous push-in + tiles parting by a few px
  const hold = interpolate(frame, [T.grid + 10, T.end + 14], [0, 1], clamp);
  const push = interpolate(frame, [T.grid + 6, T.end + 14], [1, 1.035], { ...clamp, easing: EASE.inOut });
  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <SectionLabel n="04" text="Aplicaciones" at={T.apps - 2} outAt={T.grid - 6} color={ESPIGA.carbon} accent={ESPIGA.hornoHondo} />
      <AbsoluteFill style={{ scale: `${push}`, transformOrigin: `${BOARD_C.x}px ${BOARD_C.y}px` }}>
      {/* extra tiles that complete the brand board */}
      {[0, 5].map((ti, k) => {
        const p = interpolate(frame, [T.grid + 8 + k * 4, T.grid + 22 + k * 4], [0, 1], { ...clamp, easing: EASE.rebote });
        if (p <= 0) return null;
        const b = tile(ti, hold);
        return (
          <div key={ti} style={{ opacity: Math.min(1, p * 1.5), scale: `${0.85 + 0.15 * p}` }}>
            <Framed box={b} shadow={0.6} sheen={sheenAt(frame, ti)}>
              {ti === 0 ? <ArtLogoTile /> : <ArtPaletteTile />}
            </Framed>
          </div>
        );
      })}
      {CARDS.map((Art, i) => {
        const beat = T.appBeats[i];
        const inP = interpolate(frame, [beat - 9, beat + 3], [0, 1], { ...clamp, easing: EASE.salida });
        if (inP <= 0) return null;
        // depth: how many cards landed on top of this one
        let depth = 0;
        for (let j = i + 1; j < 4; j++) depth += interpolate(frame, [T.appBeats[j] - 4, T.appBeats[j] + 4], [0, 1], { ...clamp, easing: EASE.salida });
        const ds = 1 - depth * 0.035;
        const w = ART.w * STACK_S * ds;
        const h = ART.h * STACK_S * ds;
        const land = LAND[i];
        const stack: Box = {
          x: STACK_C.x + land.dx - w / 2 + (1 - inP) * 1000,
          y: STACK_C.y + land.dy - h / 2 - depth * 22 + (1 - inP) * 60,
          w,
          h,
          rot: land.rot + (1 - inP) * 16,
          radius: 34,
        };
        const g = toGrid(i);
        const box = g > 0 ? lerpBox(stack, tile(CARD_TILE[i], hold), g) : stack;
        const perfil = Art === ArtPerfil;
        return (
          <React.Fragment key={i}>
            <Framed
              box={box}
              shadow={1 - 0.4 * g}
              dim={depth * 0.06 * (1 - g)}
              z={10 + i}
              fit={perfil ? g : 0}
              bg={perfil ? "#fffcf7" : undefined}
              sheen={g >= 1 ? sheenAt(frame, CARD_TILE[i]) : -1}
            >
              <Art />
            </Framed>
          </React.Fragment>
        );
      })}
      </AbsoluteFill>
      <GridText />
    </AbsoluteFill>
  );
};

/**
 * "Despertamos / tu marca." + "Rebranding · Identidad · Aplicaciones" (6 words → ≥ 73 f): all three
 * lines are in by ≈ f788 and stay until the end iris (opening from the board centre) reaches them ≈ f863.
 */
const GridText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.grid - 6) return null;
  const out = T.end + 5;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 384, width: 900 }}>
        <Line at={T.grid - 4} dur={10} mode="mask" outAt={out} outDur={10}>
          <div style={{ ...display(110, ESPIGA.carbon), fontStretch: "112%" }}>Despertamos</div>
        </Line>
        <Line at={T.grid - 2} dur={10} mode="mask" outAt={out} outDur={10}>
          <div style={{ ...display(110, ESPIGA.hornoHondo), fontStretch: "112%", marginTop: 4 }}>tu marca.</div>
        </Line>
      </div>
      <div style={{ position: "absolute", left: 90, top: 622, width: 900 }}>
        <Line at={T.grid - 1} dur={10} mode="mask" outAt={out} outDur={10}>
          <div style={{ fontFamily: "Archivo", fontWeight: 600, fontStretch: "90%", fontSize: 56, lineHeight: 1.1, color: "#4d463d", whiteSpace: "nowrap" }}>
            Rebranding <span style={{ color: ESPIGA.horno }}>·</span> Identidad <span style={{ color: ESPIGA.horno }}>·</span> Aplicaciones
          </div>
        </Line>
      </div>
    </>
  );
};
