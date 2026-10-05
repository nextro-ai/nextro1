import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { EASE, punch } from "../../brand";
import { fraunces } from "./fonts";
import { NewSymbol, SYM_H, SYM_W, Wordmark } from "./NewLogo";
import { ESPIGA } from "./palette";
import { Line, SectionLabel } from "./Text";
import { clamp, T } from "./timing";

/** Faint construction grid on the warm board, traced in right after the bloom. */
export const BoardGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.001) return null;
  const step = 45;
  const lines: React.ReactNode[] = [];
  for (let i = 1; i < 24; i++) {
    const x = i * step;
    const p = interpolate(frame, [T.bloom + 2 + (i % 8), T.bloom + 26 + (i % 8)], [0, 1], { ...clamp, easing: EASE.salida });
    lines.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={1920 * p} />);
  }
  for (let j = 1; j < 43; j++) {
    const y = j * step;
    const p = interpolate(frame, [T.bloom + 4 + (j % 10), T.bloom + 28 + (j % 10)], [0, 1], { ...clamp, easing: EASE.salida });
    lines.push(<line key={`h${j}`} x1={0} y1={y} x2={1080 * p} y2={y} />);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
      <g stroke={ESPIGA.carbon} strokeOpacity={0.06} strokeWidth={1}>
        {lines}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ 01 Logo (f469–547) */

const SYM = { h: 380, top: 430 };
/** Trigo chip (first palette card): where its little symbol sits — the logo's symbol lands there. */
const CHIP_SYM = { h: 120, right: 28, bottom: 26 };
/** Frames of the shared-element hand-off (logo symbol → Trigo chip), ending on chip 1's beat. */
const MORPH = { from: T.palette - 12, to: T.palette + 1 };

export const LogoBuild: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.bloom || frame > MORPH.to) return null;
  const build = interpolate(frame, [T.bloom + 3, T.snap - 2], [0, 1], { ...clamp, easing: EASE.salida });
  const buildOpacity = interpolate(frame, [T.bloom, T.bloom + 4, T.snap, T.snap + 12], [0, 1, 1, 0], clamp);
  const grain = (i: number) =>
    interpolate(frame, [T.bloom + 18 + i * 2.6, T.bloom + 30 + i * 2.6], [0, 1], { ...clamp, easing: EASE.rebote });
  const stem = interpolate(frame, [T.bloom + 12, T.bloom + 32], [0, 1], { ...clamp, easing: EASE.salida });
  const sweep = interpolate(frame, [T.snap + 16, T.snap + 34], [0, 1], { ...clamp, easing: EASE.inOut });
  const snapPunch = punch(frame, T.snap, 1.035, 10);
  // wordmark, descriptor and label slide up and out while the symbol flies into the Trigo chip
  const exit = interpolate(frame, [T.palette - 10, T.palette + 1], [0, 1], { ...clamp, easing: EASE.in });
  const m = interpolate(frame, [MORPH.from, MORPH.to], [0, 1], { ...clamp, easing: EASE.inOut });
  const symW = (h: number) => (h * SYM_W) / SYM_H;
  const from = { x: 540 - symW(SYM.h) / 2, y: SYM.top, h: SYM.h };
  const to = {
    x: CARD.x[0] + CARD.w - CHIP_SYM.right - symW(CHIP_SYM.h),
    y: CARD.y[0] + CARD.block - CHIP_SYM.bottom - CHIP_SYM.h,
    h: CHIP_SYM.h,
  };
  const symH = from.h + (to.h - from.h) * m;
  const symX = from.x + (to.x - from.x) * m;
  const symY = from.y + (to.y - from.y) * m;
  const descr = interpolate(frame, [T.snap + 8, T.snap + 24], [0, 1], { ...clamp, easing: EASE.salida });
  // type guides for the wordmark (cap height / x-height / baseline) drawn during construction
  const guides = interpolate(frame, [T.bloom + 20, T.bloom + 34], [0, 1], { ...clamp, easing: EASE.salida }) * buildOpacity;
  const WM = { size: 170, top: 852 };
  const base = WM.top + WM.size * 0.98; // approx. baseline in the 1.0 line box (asc .978)
  return (
    <AbsoluteFill>
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        translate: `0 ${-exit * 220}px`,
        scale: `${snapPunch}`,
        transformOrigin: "540px 770px",
      }}
    >
      <SectionLabel n="01" text="Logo" at={T.bloom + 10} color={ESPIGA.carbon} accent={ESPIGA.hornoHondo} />
      {guides > 0.001 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: guides }}>
          {[base - WM.size * 0.7, base - WM.size * 0.482, base].map((y, i) => (
            <line
              key={i}
              x1={540 - 380 * guides}
              x2={540 + 380 * guides}
              y1={y}
              y2={y}
              stroke={i === 2 ? ESPIGA.horno : ESPIGA.carbon}
              strokeOpacity={i === 2 ? 0.6 : 0.3}
              strokeWidth={1.4}
              strokeDasharray={i === 2 ? undefined : "6 6"}
            />
          ))}
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: WM.top, display: "flex", justifyContent: "center" }}>
        <Line at={T.snap - 2} dur={16} mode="mask">
          <Wordmark size={WM.size} descriptor={false} />
        </Line>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: WM.top + WM.size * 1.24,
          textAlign: "center",
          fontFamily: "Archivo",
          fontWeight: 600,
          fontStretch: "125%",
          fontSize: 44,
          color: ESPIGA.hornoHondo,
          letterSpacing: `${0.34 + (1 - descr) * 0.4}em`,
          marginRight: "-0.34em",
          opacity: descr,
        }}
      >
        PANADERÍA
      </div>
    </AbsoluteFill>
      {/* the symbol: built, swept, then handed to the Trigo chip (shared element) */}
      <div
        style={{
          position: "absolute",
          left: symX,
          top: symY,
          scale: m > 0 ? 1 : `${snapPunch}`,
          opacity: 1 - 0.05 * m,
          // during the hand-off it flies ABOVE the palette layer, into the Trigo chip
          zIndex: m > 0 ? 5 : undefined,
          transformOrigin: `${540 - symX}px ${770 - symY}px`,
        }}
      >
        <NewSymbol
          id="build"
          size={symH}
          color={interpolateColors(m, [0, 0.4, 1], [ESPIGA.horno, ESPIGA.horno, ESPIGA.carbon])}
          grain={grain}
          stem={stem}
          build={build}
          buildOpacity={buildOpacity}
          sweep={frame >= T.snap + 16 && frame < T.snap + 34 ? sweep : undefined}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 02 Paleta (f547–625) */

export const SWATCHES = [
  { name: "Trigo", hex: "#E9C46A", c: ESPIGA.trigo, mark: ESPIGA.carbon },
  { name: "Horno", hex: "#C8553D", c: ESPIGA.horno, mark: ESPIGA.crema },
  { name: "Crema", hex: "#F6EFE4", c: ESPIGA.crema, mark: ESPIGA.horno },
  { name: "Carbón", hex: "#1F1B16", c: ESPIGA.carbon, mark: ESPIGA.trigo },
];

export const CARD = { w: 430, h: 400, x: [90, 560], y: [420, 850], block: 262 };

export const Palette: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.palette - 2 || frame >= T.type + 8) return null;
  // the Carbón chip's colour block grows into the typography scene
  const grow = interpolate(frame, [T.type - 8, T.type + 6], [0, 1], { ...clamp, easing: EASE.inOut });
  return (
    <AbsoluteFill>
      <SectionLabel n="02" text="Paleta" at={T.palette} outAt={T.type - 10} color={ESPIGA.carbon} accent={ESPIGA.hornoHondo} />
      {SWATCHES.map((s, i) => {
        const at = T.chips[i];
        // chip 1 (Trigo) does not fly in: it opens as a circle around the logo symbol landing in it
        const first = i === 0;
        const p = first ? 1 : interpolate(frame, [at - 4, at + 12], [0, 1], { ...clamp, easing: EASE.rebote });
        const o = first ? 1 : interpolate(frame, [at - 4, at + 2], [0, 1], clamp);
        const reveal = first ? interpolate(frame, [at - 4, at + 9], [0, 1], { ...clamp, easing: EASE.salida }) : 1;
        if (first && reveal <= 0) return null;
        const symC = { x: CARD.w - CHIP_SYM.right - (CHIP_SYM.h * SYM_W) / SYM_H / 2, y: CARD.block - CHIP_SYM.bottom - CHIP_SYM.h / 2 };
        const x = CARD.x[i % 2];
        const y = CARD.y[Math.floor(i / 2)];
        const others = i === 3 ? 0 : grow;
        return (
          <div
            key={s.name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 26,
              overflow: "hidden",
              background: "#fffcf6",
              boxShadow: "0 2px 6px rgba(31,27,22,0.08), 0 30px 60px -30px rgba(31,27,22,0.45)",
              opacity: o * (1 - others),
              clipPath: reveal < 1 ? `circle(${reveal * 470}px at ${symC.x}px ${symC.y}px)` : undefined,
              translate: `0 ${(1 - p) * 90}px`,
              rotate: `${(1 - p) * (i % 2 ? 4 : -4)}deg`,
              scale: `${(0.9 + 0.1 * p) * (1 - others * 0.06)}`,
            }}
          >
            <div
              style={{
                height: CARD.block,
                background: s.c,
                position: "relative",
                boxShadow: s.name === "Crema" ? "inset 0 0 0 2px rgba(31,27,22,0.08)" : undefined,
              }}
            >
              <div style={{ position: "absolute", right: CHIP_SYM.right, bottom: CHIP_SYM.bottom, opacity: first && frame <= MORPH.to ? 0 : 0.95 }}>
                <NewSymbol id={`sw${i}`} size={CHIP_SYM.h} color={s.mark} />
              </div>
            </div>
            <div style={{ padding: "22px 30px 0" }}>
              <div style={{ fontFamily: "Archivo", fontWeight: 800, fontStretch: "112%", fontSize: 52, color: ESPIGA.carbon, lineHeight: 1 }}>{s.name}</div>
              <div
                style={{
                  fontFamily: "Archivo",
                  fontWeight: 500,
                  fontSize: 44,
                  color: "#5a5248",
                  marginTop: 10,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.02em",
                }}
              >
                {s.hex}
              </div>
            </div>
          </div>
        );
      })}
      {/* growing carbón block (FLIP of the 4th chip's colour block to full frame) */}
      {grow > 0 ? (
        <div
          style={{
            position: "absolute",
            left: interpolate(grow, [0, 1], [CARD.x[1], 0]),
            top: interpolate(grow, [0, 1], [CARD.y[1], 0]),
            width: interpolate(grow, [0, 1], [CARD.w, 1080]),
            height: interpolate(grow, [0, 1], [CARD.block, 1920]),
            borderRadius: interpolate(grow, [0, 1], [26, 0]),
            background: ESPIGA.carbon,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 03 Tipografía (f625–703) */

const UPPER = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnñopqrstuvwxyz";

export const TypeScene: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.type - 2 || frame >= T.apps + 12) return null;
  // carbón panel lifts away to reveal the applications board
  const lift = interpolate(frame, [T.apps - 11, T.apps + 1], [0, 1], { ...clamp, easing: EASE.inOut });
  const aIn = interpolate(frame, [T.type, T.type + 16], [0, 1], { ...clamp, easing: EASE.salida });
  const wght = interpolate(frame, [T.type + 4, T.type + 30, T.type + 56], [200, 760, 560], { ...clamp, easing: EASE.inOut });
  const soft = interpolate(frame, [T.type + 4, T.type + 56], [0, 100], clamp);
  const typed = (s: string, from: number) => Math.max(0, Math.min(s.length, Math.floor((frame - from) * 1.6)));
  const u = typed(UPPER, T.type + 18);
  const l = typed(LOWER, T.type + 26);
  return (
    <AbsoluteFill style={{ translate: `0 ${-lift * 1920}px` }}>
      {/* own background only once the Carbón chip has grown to full frame (f631) */}
      {frame >= T.type + 6 ? <AbsoluteFill style={{ background: ESPIGA.carbon }} /> : null}
      <SectionLabel n="03" text="Tipografía" at={T.type + 2} color={ESPIGA.crema} accent={ESPIGA.trigo} />
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 360,
          ...fraunces(520, ESPIGA.crema, wght, soft),
          lineHeight: 1,
          opacity: aIn,
          translate: `0 ${(1 - aIn) * 60}px`,
          letterSpacing: "-0.03em",
        }}
      >
        A<span style={{ color: ESPIGA.trigo }}>a</span>
      </div>
      {/* weight readout bar (variable font) */}
      <div style={{ position: "absolute", left: 90, top: 905, width: 900, height: 3, background: "rgba(246,239,228,0.18)", opacity: aIn }}>
        <div style={{ width: `${((wght - 100) / 800) * 100}%`, height: 3, background: ESPIGA.trigo }} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 940, display: "flex", gap: 90 }}>
        <Line at={T.type + 10} dur={14} mode="mask">
          <div>
            <div style={{ ...fraunces(66, ESPIGA.trigo, 600, 100) }}>Fraunces</div>
            <div style={{ fontFamily: "Archivo", fontWeight: 500, fontSize: 44, color: "rgba(246,239,228,0.78)", marginTop: 12 }}>Titulares</div>
          </div>
        </Line>
        <Line at={T.type + 14} dur={14} mode="mask">
          <div>
            <div style={{ fontFamily: "Archivo", fontWeight: 700, fontStretch: "110%", fontSize: 66, lineHeight: 1, color: ESPIGA.crema }}>Archivo</div>
            <div style={{ fontFamily: "Archivo", fontWeight: 500, fontSize: 44, color: "rgba(246,239,228,0.78)", marginTop: 12 }}>Textos</div>
          </div>
        </Line>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1110, ...fraunces(44, "rgba(246,239,228,0.86)", 420, 100), lineHeight: 1.3, whiteSpace: "nowrap" }}>
        <div>{UPPER.slice(0, u)}</div>
        <div>{LOWER.slice(0, l)}</div>
      </div>
    </AbsoluteFill>
  );
};
