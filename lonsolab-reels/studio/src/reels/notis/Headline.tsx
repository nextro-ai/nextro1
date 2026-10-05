import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { HEAD_TOP, KICKS, PHONE, PHONE_R, T, ip, lt } from "./timing";

type Word = { text: string; hl?: boolean };
type Line = Word[];

export type LineAnim = {
  /** vertical offset as a fraction of the line height (mask reveal) */
  ty: number;
  /** which edge of the line box clips the text: "bottom" while entering, "top" while leaving */
  clip: "none" | "bottom" | "top";
  stretch: number;
  weight: number;
  scale: number;
  opacity: number;
  /** highlighter progress 0..1 */
  hl: number;
};

const roundedRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
  `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

/**
 * Renders the same layer twice: papel where it sits over the phone, tinta where it spills onto
 * the paper background. The colour switches exactly at the phone's outline, so the headline reads
 * as a layer floating in front of the device.
 */
export const DualTone: React.FC<{ dx: number; children: (onPhone: boolean) => React.ReactNode }> = ({ dx, children }) => {
  const phone = roundedRect(PHONE.x + dx, PHONE.y, PHONE.w, PHONE.h, PHONE_R);
  return (
    <>
      <AbsoluteFill style={{ clipPath: `path(evenodd, "M0 0H1080V1920H0Z ${phone}")` }}>{children(false)}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `path("${phone}")` }}>{children(true)}</AbsoluteFill>
    </>
  );
};

export const HeadlineLayer: React.FC<{
  lines: Line[];
  size: number;
  top: number;
  onPhone: boolean;
  anim: (i: number) => LineAnim;
  lineGap?: number;
}> = ({ lines, size, top, onPhone, anim, lineGap = 0.98 }) => {
  const lh = size * lineGap;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top }}>
      {lines.map((line, i) => {
        const a = anim(i);
        if (a.opacity <= 0.001) return <div key={i} style={{ height: lh }} />;
        const clipPath =
          a.clip === "bottom"
            ? `inset(-40% -10% -${size * 0.07}px -10%)`
            : a.clip === "top"
              ? `inset(-${size * 0.02}px -10% -40% -10%)`
              : undefined;
        return (
          <div key={i} style={{ height: lh, position: "relative", clipPath }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                textAlign: "center",
                whiteSpace: "nowrap",
                fontFamily: FONT,
                fontSize: size,
                fontWeight: a.weight,
                fontStretch: `${a.stretch}%`,
                letterSpacing: "-0.028em",
                lineHeight: `${size}px`,
                color: onPhone ? C.papel : C.tinta,
                textShadow: onPhone ? "0 6px 26px rgba(4,8,32,0.5)" : "none",
                translate: `0px ${a.ty * lh}px`,
                scale: String(a.scale),
                opacity: a.opacity,
              }}
            >
              {line.map((w, k) =>
                w.hl ? (
                  <span key={k} style={{ position: "relative", display: "inline-block" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "-0.07em",
                        right: "-0.09em",
                        top: "0.1em",
                        bottom: "-0.04em",
                        background: C.pin,
                        borderRadius: "0.07em",
                        transformOrigin: "0% 50%",
                        scale: `${a.hl} 1`,
                        rotate: "-1.4deg",
                        boxShadow: onPhone ? "0 10px 30px -10px rgba(255,90,38,0.6)" : "none",
                      }}
                    />
                    {/* highlighter wipe: base colour outside the box, tinta inside it */}
                    <span
                      style={{
                        position: "relative",
                        clipPath: `inset(-30% -20% -30% ${a.hl * 100}%)`,
                      }}
                    >
                      {w.text}
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        color: C.tinta,
                        textShadow: "none",
                        clipPath: `inset(-30% ${(1 - a.hl) * 100}% -30% -20%)`,
                      }}
                    >
                      {w.text}
                    </span>
                  </span>
                ) : (
                  <span key={k}>{w.text}</span>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- the three type moments ---------------- */

const HOOK: Line[] = [[{ text: "¿Querés que" }], [{ text: "tu celular" }], [{ text: "suene " }, { text: "así?", hl: true }]];
const SECOND: Line[] = [[{ text: "Así suena un" }], [{ text: "negocio que" }], [{ text: "aparece.", hl: true }]];

/**
 * 102 px at wdth 102 %: the widest line ("¿Querés que") measures ~628 px, so every line sits inside the
 * screen (x 226–854) in a single tone. The old 110 px / 120 % version hung only 30–55 px past the bezel
 * and the papel/tinta split cut single glyphs in half.
 */
export const HEAD_SIZE = 102;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const STRETCH = 102;

const still: LineAnim = { ty: 0, clip: "none", stretch: STRETCH, weight: 800, scale: 1, opacity: 1, hl: 1 };

/** "Stretch punch" (brand signature): enters condensed and heavy, springs open to full width. */
const stretchPunch = (t: number, from: number, fps: number): LineAnim => {
  if (t < from) return { ...still, opacity: 0, hl: 0 };
  const s = spring({ frame: t - from, fps, config: { damping: 13, stiffness: 210, mass: 0.65 } });
  return {
    ty: 0,
    clip: "none",
    stretch: Math.min(STRETCH + 3, 62 + (STRETCH - 62) * s),
    weight: 900 - 100 * Math.min(1, s),
    scale: interpolate(s, [0, 1], [1.28, 1]),
    opacity: 1, // slams in on the beat frame itself
    hl: 0,
  };
};

/** Hook: built in loop time (330–359 = −30…−1) so frame 359 flows into frame 0; leaves at the swap. */
export const HookHeadline: React.FC<{ dx: number }> = ({ dx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = lt(f);
  if (f >= T.swap + 5 && f < T.loopIn) return null;
  const starts = [T.loopIn - 360, T.hook2 - 360, T.hook3 - 360]; // −30, −22, −15
  const anim = (i: number): LineAnim => {
    const a = stretchPunch(t, starts[i], fps);
    // highlighter on "así?" draws after the last word lands
    a.hl = i === 2 ? ip(t, -8, -2, 0, 1, EASE.salida) : 0;
    // exit: lines slide up out of their mask, staggered
    const o = T.swap - 3 + i; // 72, 73, 74 → hook readable for 73 f (0,5 s + 0,32 s × 6 words)
    if (f >= o - 1 && f < T.loopIn) {
      a.ty = ip(f, o, o + 4, 0, -1.4, EASE.in);
      a.clip = "top";
    }
    return a;
  };
  return (
    <DualTone dx={dx}>
      {(onPhone) => <HeadlineLayer lines={HOOK} size={HEAD_SIZE} top={HEAD_TOP} onPhone={onPhone} anim={anim} />}
    </DualTone>
  );
};

/** "Así suena un negocio que aparece." — mask reveal from below at the swap, swept out at f270. */
export const SecondHeadline: React.FC<{ dx: number }> = ({ dx }) => {
  const f = useCurrentFrame();
  if (f < T.swap - 1 || f > T.sweep + 8) return null;
  const anim = (i: number): LineAnim => {
    const s = T.swap + 2 + i * 3; // 77, 80, 83
    const o = T.sweep - 11 + i * 2; // 259, 261, 263 → all lines (and the highlighter) gone by f270
    const leaving = f >= o;
    return {
      ty: leaving ? ip(f, o, o + 7, 0, -1.4, EASE.in) : ip(f, s, s + 13, 1.12, 0, EASE.salida),
      clip: leaving ? "top" : f < s + 13 ? "bottom" : "none",
      stretch: STRETCH,
      weight: 800,
      opacity: f < s ? 0 : 1,
      hl: i === 2 ? ip(f, T.swap + 11, T.swap + 19, 0, 1, EASE.salida) : 0,
      // "aparece." punches on the bar downbeats of the rain
      scale: i === 2 ? KICKS.reduce((acc, k) => acc * interpolate(f, [k, k + 2, k + 9], [1, 1.07, 1], CL), 1) : 1,
    };
  };
  return (
    <DualTone dx={dx}>
      {(onPhone) => <HeadlineLayer lines={SECOND} size={HEAD_SIZE} top={HEAD_TOP} onPhone={onPhone} anim={anim} />}
    </DualTone>
  );
};
