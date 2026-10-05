import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { EASE } from "../../brand";
import { Card } from "./Card";
import { CARD, COUNTER_SLOT, NOTIFS, SCREEN, STACK_TOP, T, cardHeight, ip, lt } from "./timing";

const GAP = 16;
const X = (SCREEN.w - CARD.w) / 2;
const LEAD = 4; // a card starts sliding in 4 f before it lands on its beat (sound = landing)

const H = NOTIFS.map(cardHeight);

/** Screen-space y of the newest card. From f146 the stack moves down to open the counter's slot. */
export const stackTop = (t: number) =>
  STACK_TOP - SCREEN.y + ip(t, T.counterIn - 4, T.counterIn + 6, 0, COUNTER_SLOT, EASE.salida);

/**
 * Card j's slide into the stack, 0 → 1. A stiff spring that crosses 1 exactly on the beat (f = at) and
 * overshoots ~6 % (the "rebote" feel). The same curve moves the new card in AND pushes the older ones
 * down, so neighbouring cards keep their gap at every frame (no overlap, no double exposure).
 */
const slide = (t: number, j: number) => {
  const k = t - (NOTIFS[j].at - LEAD);
  if (k <= 0) return 0;
  return spring({ frame: k, fps: 30, config: { damping: 17.5, stiffness: 304, mass: 0.6 } });
};

/** Offset added to card i by every newer card. */
const offsetOf = (t: number, i: number) => {
  let y = 0;
  for (let j = i + 1; j < NOTIFS.length; j++) {
    if (t < NOTIFS[j].at - LEAD) break;
    y += (H[j] + GAP) * slide(t, j);
  }
  return y;
};

/** The sweep at f270: small anticipation down, then everything flies up (fastest at the whoosh peak). */
export const sweepY = (f: number) =>
  interpolate(f, [T.sweep - 9, T.sweep - 5], [0, 26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.salida,
  }) +
  interpolate(f, [T.sweep - 5, T.sweep + 7], [0, -1950], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.55, 0, 0.45, 1),
  });

/** Card i's screen-space y at time t: it slides down out of the slot above the stack (hidden by the mask). */
const yOf = (i: number, t: number, sweepFrame: number | null) =>
  stackTop(t) +
  offsetOf(t, i) -
  (H[i] + GAP) * (1 - slide(t, i)) +
  (sweepFrame === null ? 0 : sweepY(sweepFrame));

/**
 * Alpha mask of the stack (screen space): cards appear from a soft line just above the newest slot
 * and dissolve into the wallpaper at the bottom (no ink overlay). The top edge opens for the sweep.
 */
const FADE_FROM = 1250 - SCREEN.y; // canvas y 1250: below the safe zone the pile fades out
const FADE_TO = 1600 - SCREEN.y;
const stackMask = (top: number | null) =>
  top === null
    ? `linear-gradient(to bottom, #000 ${FADE_FROM}px, transparent ${FADE_TO}px)`
    : `linear-gradient(to bottom, transparent ${top - 14}px, #000 ${top + 2}px, #000 ${FADE_FROM}px, transparent ${FADE_TO}px)`;

const CardSlot: React.FC<{ i: number; t: number; y: number; blur: number; f: number }> = ({ i, t, y, blur, f }) => {
  const n = NOTIFS[i];
  const a = n.at;
  // opaque from its first visible pixel; a small "tick" right after it lands
  const scale = interpolate(t, [a, a + 3, a + 9], [1, 1.012, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // a light sheen crosses the card right after it lands (not a flash: thin, 45 % white band)
  const sheen = interpolate(t, [a, a + 12], [-0.4, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const id = `vb-${i}-${f}`;
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: y,
        scale: String(scale),
        zIndex: i,
        filter: blur > 0.5 ? `url(#${id})` : undefined,
      }}
    >
      {blur > 0.5 && (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={id} x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      <Card n={n} ringFrom={n.hero ? 0 : undefined} />
      {sheen > -0.4 && sheen < 1.3 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 160,
              left: `${sheen * 100}%`,
              background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))",
            }}
          />
        </div>
      )}
    </div>
  );
};

/** Directional blur proportional to speed: capped during the rain so glyphs stay distinct, strong for the sweep. */
const blurFor = (v: number, sweeping = false) => Math.min(sweeping ? 16 : 2.4, Math.max(0, Math.abs(v) - 6) * 0.1);

export const Stack: React.FC = () => {
  const f = useCurrentFrame();

  // Loop tail (330–359): only the hero card, timed in loop time so it lands exactly on frame 0.
  if (f >= T.loopIn) {
    const t = lt(f);
    if (t < NOTIFS[0].at - LEAD) return null;
    const v = yOf(0, t, null) - yOf(0, t - 1, null);
    const mask = stackMask(stackTop(t));
    return (
      <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <CardSlot i={0} t={t} y={yOf(0, t, null)} blur={blurFor(v)} f={f} />
      </AbsoluteFill>
    );
  }
  if (f > T.sweep + 10) return null;

  const sweeping = f >= T.sweep - 9;
  const slots: React.ReactNode[] = [];
  for (let i = 0; i < NOTIFS.length; i++) {
    if (f < NOTIFS[i].at - LEAD) break;
    // during the sweep only the cards that were visible fly out (the rest stay hidden below)
    if (sweeping && yOf(i, T.sweep - 9, null) > FADE_TO) continue;
    const y = yOf(i, f, f);
    if (y > FADE_TO || y + H[i] < -60) continue;
    const v = y - yOf(i, f - 1, f - 1);
    slots.push(<CardSlot key={i} i={i} t={f} y={y} blur={blurFor(v, sweeping)} f={f} />);
  }
  const mask = stackMask(sweeping ? null : stackTop(f));
  return <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask }}>{slots}</AbsoluteFill>;
};
