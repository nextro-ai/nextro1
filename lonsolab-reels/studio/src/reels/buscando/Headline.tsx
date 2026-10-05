import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { ip, eo, ei } from "./timing";

export type Word = {
  t: string;
  c?: string; // word colour
  mark?: string; // highlight box colour behind the word (slams in)
  under?: string; // underline colour (draws in)
  markAt?: number; // absolute frame where the highlight slams in (defaults to right after the reveal)
};

const MASK = Easing.bezier(0.22, 0.9, 0.24, 1);

/**
 * Kinetic headline: per-word mask reveal (words rise from behind a clip line, 2 f stagger,
 * 3 f between lines) combined with the brand's "estirar" move (font-stretch 72% → final,
 * blur 6 → 0). Exit: words lift out of the mask before `out`.
 */
export const Headline: React.FC<{
  lines: (Word | string)[][];
  at: number;
  out?: number;
  size: number;
  color: string;
  top: number;
  left?: number;
  width?: number;
  align?: "left" | "center";
  stretch?: number;
  weight?: number;
  lineGap?: number;
  exitDur?: number;
  reverseExit?: boolean;
  /** frames between words / lines in the reveal (default 2 / 3) */
  wordStagger?: number;
  lineStagger?: number;
  /** frames between words in the exit (default 1) */
  exitStagger?: number;
  /** hard cut at `out` instead of the lift-out exit (used to swap lines under a glitch hit) */
  cut?: boolean;
}> = ({
  lines,
  at,
  out,
  size,
  color,
  top,
  left = 90,
  width = 900,
  align = "left",
  stretch = 112,
  weight = 820,
  lineGap = 0,
  exitDur = 8,
  reverseExit = false,
  wordStagger = 2,
  lineStagger = 3,
  exitStagger = 1,
  cut = false,
}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  if (out !== undefined && f > out) return null;
  const total = lines.reduce((a, l) => a + l.length, 0);
  let k = 0;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        textAlign: align,
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 0.96,
        letterSpacing: "-0.035em",
        color,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap", marginTop: li === 0 ? 0 : lineGap }}>
          {line.map((raw, wi) => {
            const w: Word = typeof raw === "string" ? { t: raw } : raw;
            const idx = k++;
            const d = at + li * lineStagger + wi * wordStagger;
            const pin = ip(f, [d, d + 12], [0, 1], MASK);
            const st = ip(f, [d, d + 16], [72, stretch], eo);
            const blur = ip(f, [d, d + 8], [6, 0]);
            let pout = 0;
            if (out !== undefined && !cut) {
              const order = reverseExit ? total - 1 - idx : idx;
              const s = out - exitDur - (total - 1) * exitStagger + order * exitStagger;
              pout = ip(f, [s, s + exitDur], [0, 1], ei);
            }
            const ty = (1 - pin) * 125 - pout * 128;
            const mAt = w.markAt ?? d + 5;
            const markP = w.mark ? ip(f, [mAt, mAt + 5], [0, 1], eo) : 0;
            const markPunch = w.mark ? 1 + 0.08 * ip(f, [mAt, mAt + 2, mAt + 9], [0, 1, 0]) : 1;
            const underP = w.under ? ip(f, [d + 8, d + 20], [0, 1], eo) : 0;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    padding: "0.10em 0.12em 0.18em",
                    margin: "-0.10em -0.12em -0.18em",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      position: "relative",
                      translate: `0 ${ty}%`,
                      fontStretch: `${st}%`,
                      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                      color: w.c ?? color,
                      scale: `${markPunch}`,
                    }}
                  >
                    {w.mark ? (
                      <span
                        style={{
                          position: "absolute",
                          left: "-0.08em",
                          right: "-0.08em",
                          top: "0.06em",
                          bottom: "-0.06em",
                          background: w.mark,
                          borderRadius: "0.08em",
                          transformOrigin: "left center",
                          scale: `${markP} 1`,
                          zIndex: -1,
                        }}
                      />
                    ) : null}
                    {w.t}
                    {w.under ? (
                      <span
                        style={{
                          position: "absolute",
                          left: "0.02em",
                          right: "0.04em",
                          bottom: "-0.07em",
                          height: "0.075em",
                          borderRadius: "0.04em",
                          background: w.under,
                          transformOrigin: "left center",
                          scale: `${underP} 1`,
                          rotate: "-0.6deg",
                        }}
                      />
                    ) : null}
                  </span>
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Tiny helper so other modules can share the default text colour without importing tokens. */
export const INK = C.tinta;
