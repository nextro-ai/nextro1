import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../../brand";
import { MarkerFilter, Strike, Tick } from "./marks";
import { TICK_LEAD } from "./timing";
import { Rise, head, item, numeral } from "./type";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Shared editorial grid for both lists (antes / después):
 *   y 300  kicker row: big condensed counter "01/04" + hairline
 *   y 384  two-line title (96 px, leading 1.06 → 102 px per line)
 *   y 590  2 px ink rule, 22 px of air, then 4 numbered rows down to ≤ y 1226
 */
export const KICKER_TOP = 300;
export const TITLE_TOP = 384;
export const TITLE_SIZE = 96;
export const TITLE_STRETCH = 112;
export const LIST_TOP = 592;
const FIRST_GAP = 22;
const SIZE = 60;
/** 64 px = 1.07 em: Archivo 620's ascender + descender is 0.91 em, so lines keep ~10 px of air. */
const LINE_H = 64;
/** Row padding (top = bottom). Single-line rows get a little more so they don't feel tighter. */
const PAD = (lines: number) => (lines > 1 ? 12 : 16);
const TEXT_X = 112;

export type Row = { lines: string[]; at: number; strikeAt?: number };

const layout = (rows: Row[]) => {
  let y = FIRST_GAP;
  return rows.map((r) => {
    const pad = PAD(r.lines.length);
    const h = r.lines.length * LINE_H + pad * 2;
    const out = { y, h, pad };
    y += h;
    return out;
  });
};

/** Header: counter kicker + title (lines[1] may be coloured). */
export const ListHeader: React.FC<{
  lines: [string, string];
  counterAts: readonly number[];
  at: number;
  accent: string;
  secondColor?: string;
  appear?: "rise" | "cut";
  lineFrom?: number;
}> = ({
  lines,
  counterAts,
  at,
  accent,
  secondColor = C.tinta,
  appear = "rise",
  lineFrom = at,
}) => {
  const s = head(TITLE_SIZE, C.tinta, TITLE_STRETCH);
  return (
    <>
      <Counter
        ats={counterAts}
        color={accent}
        style={{ left: 90, top: KICKER_TOP }}
        lineFrom={lineFrom}
      />
      <div style={{ position: "absolute", left: 90, top: TITLE_TOP }}>
        {appear === "rise" ? (
          <>
            <Rise at={at} style={s}>
              {lines[0]}
            </Rise>
            <Rise at={at + 3} style={{ ...s, color: secondColor }}>
              {lines[1]}
            </Rise>
          </>
        ) : (
          <>
            <div style={s}>{lines[0]}</div>
            <div style={{ ...s, color: secondColor }}>{lines[1]}</div>
          </>
        )}
      </div>
    </>
  );
};

/**
 * Numbered list (01–04).
 * mode "strike": each item is crossed out at its `strikeAt` (one beat after it lands).
 * mode "tick": no numbers; a hand-drawn tick starts with the row and completes on the beat
 * (row.at + TICK_LEAD), where the click SFX sits.
 */
export const List: React.FC<{
  rows: Row[];
  mode: "strike" | "tick";
  seed: string;
  ruleAt: number;
}> = ({ rows, mode, seed, ruleAt }) => {
  const frame = useCurrentFrame();
  const pos = layout(rows);
  const rule = interpolate(frame, [ruleAt, ruleAt + 14], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  return (
    <div style={{ position: "absolute", left: 90, top: LIST_TOP, width: 900 }}>
      <MarkerFilter id={`mk-${seed}`} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -2,
          width: 900 * rule,
          height: 2.5,
          background: C.tinta,
        }}
      />
      {rows.map((r, i) => {
        const { y, h, pad } = pos[i];
        if (frame < r.at) return null;
        const sep = interpolate(frame, [r.at + 2, r.at + 16], [0, 1], {
          ...clamp,
          easing: EASE.salida,
        });
        const strikeAt = r.strikeAt ?? r.at + 21;
        const struck =
          mode === "strike"
            ? interpolate(frame, [strikeAt + 2, strikeAt + 12], [0, 1], clamp)
            : 0;
        const numIn = interpolate(frame, [r.at, r.at + 10], [0, 1], {
          ...clamp,
          easing: EASE.salida,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width: 900,
              height: h,
            }}
          >
            {mode === "strike" ? (
              <div
                style={{
                  ...numeral(66, C.tinta2),
                  position: "absolute",
                  left: 0,
                  top: pad + 2,
                  opacity: 0.92 * numIn,
                  translate: `0 ${(1 - numIn) * 20}px`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            ) : (
              <Tick
                at={r.at}
                dur={TICK_LEAD + 1}
                seed={`${seed}-t${i}`}
                size={84}
                width={10}
                style={{ left: 6, top: pad - 8 }}
                filterId={`mk-${seed}`}
              />
            )}
            <div style={{ position: "absolute", left: TEXT_X, top: pad }}>
              {r.lines.map((l, k) => (
                <Rise
                  key={k}
                  at={r.at + k * 3}
                  style={{
                    ...item(SIZE, C.tinta),
                    lineHeight: `${LINE_H}px`,
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "inline-block",
                      // struck items settle on tinta2 at full opacity (≥ 7:1 on papel)
                      color: struck > 0 ? mixInk(struck) : C.tinta,
                    }}
                  >
                    {l}
                    {mode === "strike" ? (
                      <Strike
                        at={strikeAt + k * 4}
                        seed={`${seed}-s${i}-${k}`}
                        y={56}
                        width={6}
                        filterId={`mk-${seed}`}
                      />
                    ) : null}
                  </span>
                </Rise>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: h - 1,
                width: 900 * sep,
                height: 2,
                background: C.linea,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** tinta → tinta2 as an item gets crossed out (stays ≥ 7:1 on papel). */
const mixInk = (t: number) => {
  const a = [0x13, 0x18, 0x2b];
  const b = [0x4a, 0x51, 0x68];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** Kicker counter "01/04" (Archivo 800, wdth 75) that rolls to the current item, plus a hairline. */
export const Counter: React.FC<{
  ats: readonly number[];
  color: string;
  lineFrom: number;
  style?: React.CSSProperties;
}> = ({ ats, color, lineFrom, style }) => {
  const frame = useCurrentFrame();
  let idx = -1;
  ats.forEach((a, i) => {
    if (frame >= a) idx = i;
  });
  if (idx < 0) return null;
  const at = ats[idx];
  const p = interpolate(frame, [at, at + 10], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const line = interpolate(frame, [lineFrom + 4, lineFrom + 22], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  const cur = String(idx + 1).padStart(2, "0");
  const prev = idx > 0 ? String(idx).padStart(2, "0") : null;
  const size = 84;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        width: 900,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: size * 0.9,
          padding: "0 4px",
          margin: "0 -4px",
        }}
      >
        {prev ? (
          <div
            style={{
              ...numeral(size, color),
              position: "absolute",
              top: 2,
              translate: `0 ${-p * 110}%`,
            }}
          >
            {prev}
          </div>
        ) : null}
        <div
          style={{
            ...numeral(size, color),
            paddingTop: 2,
            translate: `0 ${(1 - p) * 110}%`,
          }}
        >
          {cur}
        </div>
      </div>
      <div style={{ ...numeral(size, C.tinta2), opacity: 0.55, marginLeft: 4 }}>
        /04
      </div>
      <div
        style={{
          flex: 1,
          height: 2,
          marginLeft: 24,
          background: C.tinta,
          opacity: 0.85,
          scale: `${line} 1`,
          transformOrigin: "0 50%",
        }}
      />
    </div>
  );
};
