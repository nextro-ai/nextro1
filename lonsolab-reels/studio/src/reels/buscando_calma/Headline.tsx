import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { FONT } from "../../brand";
import { mix } from "./theme";
import { ip, eo, ei } from "./timing";

export type Word = {
  t: string;
  /** highlight box behind the word (accent) with its own text colour (onAccent) */
  mark?: { bg: string; fg: string; at?: number };
  /** thin underline that draws in */
  under?: string;
  c?: string;
};

const MASK = Easing.bezier(0.22, 0.9, 0.24, 1);

/**
 * Calm headline: words rise out of a mask line with a gentle 3 f stagger and settle from a
 * slightly condensed width to the brand's expanded width (the site's "estirar", toned down:
 * no blur, no punch). It leaves as one block (fade + small lift) so the eye is never asked
 * to read two lines at once.
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
  wordStagger?: number;
  lineStagger?: number;
  exitDur?: number;
  /** if set: the whole plate arrives as one block (fade + small lift over `block` frames, no per-word stagger) */
  block?: number;
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
  wordStagger = 3,
  lineStagger = 4,
  exitDur = 9,
  block,
}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  if (out !== undefined && f > out) return null;
  const pout = out === undefined ? 0 : ip(f, [out - exitDur, out], [0, 1], ei);
  const pin = block ? ip(f, [at, at + block], [0, 1], eo) : 1;
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
        lineHeight: 1.0,
        letterSpacing: "-0.03em",
        color,
        opacity: pin * (1 - pout),
        translate: `0 ${(1 - pin) * 24 - 24 * pout}px`,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {line.map((raw, wi) => {
            const w: Word = typeof raw === "string" ? { t: raw } : raw;
            const d = at + li * lineStagger + wi * wordStagger;
            const rise = block ? 1 : ip(f, [d, d + 16], [0, 1], MASK);
            const st = block ? stretch : ip(f, [d, d + 20], [96, stretch], eo);
            const mAt = w.mark?.at ?? d + 8;
            const markP = w.mark ? ip(f, [mAt, mAt + 10], [0, 1], eo) : 0;
            const markText = w.mark ? ip(f, [mAt + 2, mAt + 8], [0, 1]) : 0;
            const underP = w.under ? ip(f, [d + 10, d + 26], [0, 1], eo) : 0;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    padding: "0.08em 0.14em 0.2em",
                    margin: "-0.08em -0.14em -0.2em",
                    marginLeft: w.mark && wi > 0 ? "-0.04em" : "-0.14em",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      position: "relative",
                      translate: `0 ${(1 - rise) * 118}%`,
                      fontStretch: `${st}%`,
                      color: w.c ?? color,
                    }}
                  >
                    {w.mark ? (
                      <span
                        style={{
                          position: "absolute",
                          left: "-0.05em",
                          right: "-0.1em",
                          top: "0.04em",
                          bottom: "-0.08em",
                          background: w.mark.bg,
                          borderRadius: "0.1em",
                          transformOrigin: "left center",
                          scale: `${markP} 1`,
                          zIndex: 0,
                        }}
                      />
                    ) : null}
                    {w.mark ? (
                      // one span whose colour moves from the line colour to onAccent as the box lands
                      <span style={{ position: "relative", zIndex: 1, color: mix(w.c ?? color, w.mark.fg, markText) }}>{w.t}</span>
                    ) : (
                      w.t
                    )}
                    {w.under ? (
                      <span
                        style={{
                          position: "absolute",
                          left: "0.02em",
                          right: "0.04em",
                          bottom: "-0.06em",
                          height: "0.07em",
                          borderRadius: "0.04em",
                          background: w.under,
                          transformOrigin: "left center",
                          scale: `${underP} 1`,
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
