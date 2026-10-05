import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, Icon, Logo } from "../../brand";
import { T, ip, sp, eo, io, ei } from "./timing";
import { SEARCH_TEXT } from "./ui";

/* Closing: the search bar from the opening becomes the WhatsApp CTA. */
const CX = 535; // CTA column centre (keeps everything left of x 880 below y 840)
const PILL_W = 690;
const PILL_H = 106;
const PILL_Y0 = 800; // search bar position during "Tu próximo cliente…"
const PILL_Y1 = 950; // CTA button position
const LOGO_H = 104; // bigger lockup: the brand now outweighs the button
const LOGO_W = LOGO_H * (5899 / 1312);
const LOGO_TOP = 806;
const MARK_W = LOGO_W * (1013 / 5899);
const PHONE_TOP = 1078;
const URL_TOP = 1168;

export const Closing: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.calm) return null;
  const typedStart = T.calm + 5;
  const n = Math.max(0, Math.min(SEARCH_TEXT.length, Math.floor((f - typedStart) / 2) + 1));
  const pillIn = sp(f, T.calm + 2, 16, 140);
  const m = ip(f, [T.end - 2, T.end + 8], [0, 1], io); // search → button morph
  const pillY = ip(f, [T.end - 4, T.end + 10], [PILL_Y0, PILL_Y1], eo);
  const searchOut = ip(f, [T.end - 2, T.end + 4], [0, 1], ei);
  const btnIn = ip(f, [T.end + 3, T.end + 12], [0, 1], eo);
  const chime = T.pinLand + 4;
  // two shine sweeps (on the chime, then again during the hold) + a slow 1.5 % breathing loop
  const shine = f < chime + 30 ? ip(f, [chime + 2, chime + 18], [-0.3, 1.3]) : ip(f, [chime + 42, chime + 58], [-0.3, 1.3]);
  const breathe = 1 + 0.015 * Math.sin(Math.max(0, f - (chime + 12)) / 9) * ip(f, [chime + 10, chime + 20], [0, 1]);
  const btnPunch = (1 + 0.05 * ip(f, [chime, chime + 2, chime + 10], [0, 1, 0])) * breathe;
  const cursorOn = Math.floor(f / 9) % 2 === 0;

  // pin falling onto the logo mark
  const pinStart = T.pinLand - 8;
  const pinP = ip(f, [pinStart, T.pinLand], [0, 1], ei);
  const landed = f >= T.pinLand;
  const squash = landed ? 1 - 0.22 * Math.exp(-(f - T.pinLand) / 3) * Math.cos((f - T.pinLand) * 0.9) : 1;
  // the pin lands on the bear's head (inside the L), not above the stem where it read as an "i" dot
  const pinX = CX - LOGO_W / 2 + MARK_W * 0.64;
  const pinTipY = LOGO_TOP + LOGO_H * 0.24;
  const ripple = ip(f, [T.pinLand, T.pinLand + 18], [0, 1], eo);
  const logoIn = sp(f, T.end + 3, 14, 160);
  const phoneIn = ip(f, [T.pinLand + 2, T.pinLand + 14], [0, 1], eo);
  const urlIn = ip(f, [T.pinLand + 6, T.pinLand + 18], [0, 1], eo);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* logo */}
      {f >= T.end ? (
        <div
          style={{
            position: "absolute",
            left: CX - LOGO_W / 2,
            top: LOGO_TOP,
            opacity: Math.min(1, logoIn * 1.4),
            scale: `${0.9 + 0.1 * logoIn}`,
            translate: `0 ${(1 - logoIn) * 20}px`,
          }}
        >
          <Logo kind="full" variant="tinta" height={LOGO_H} />
        </div>
      ) : null}
      {/* ripple where the pin lands */}
      {landed && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            left: pinX - 70,
            top: pinTipY - 22,
            width: 140,
            height: 44,
            borderRadius: "50%",
            border: `4px solid ${C.pin}`,
            scale: `${0.2 + ripple * 1.6}`,
            opacity: 0.8 * (1 - ripple),
          }}
        />
      ) : null}
      {/* pin */}
      {f >= pinStart ? (
        <div
          style={{
            position: "absolute",
            left: pinX - 24,
            top: pinTipY - 62 + (1 - pinP) * -900,
            width: 48,
            height: 62,
            transformOrigin: "50% 100%",
            scale: `${2 - squash} ${squash}`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50% 50% 50% 0",
              rotate: "-45deg",
              background: C.pin,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px -6px rgba(19,24,43,0.5)",
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.tinta }} />
          </div>
        </div>
      ) : null}
      {/* search pill → CTA button */}
      <div
        style={{
          position: "absolute",
          left: CX - PILL_W / 2,
          top: pillY,
          width: PILL_W,
          height: PILL_H,
          borderRadius: PILL_H / 2,
          opacity: Math.min(1, pillIn * 1.5),
          translate: `0 ${(1 - pillIn) * 40}px`,
          scale: `${btnPunch}`,
          boxShadow: `0 2px 6px rgba(19,24,43,0.08), 0 22px 44px -20px rgba(19,24,43,${0.35 + 0.15 * m})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: C.blanco }} />
        <div style={{ position: "absolute", inset: 0, background: C.pin, clipPath: `inset(0 ${(1 - m) * 100}% 0 0 round ${PILL_H / 2}px)` }} />
        {/* search content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "0 40px",
            opacity: 1 - searchOut,
            translate: `0 ${-searchOut * 30}px`,
          }}
        >
          <Icon name="buscar" size={44} color={C.tinta2} strokeWidth={2.2} />
          <span style={{ fontSize: 44, fontWeight: 450, color: C.tinta, whiteSpace: "nowrap" }}>{SEARCH_TEXT.slice(0, n)}</span>
          <span style={{ width: 4, height: 50, marginLeft: -18, background: C.cobalto, opacity: cursorOn || n < SEARCH_TEXT.length ? 1 : 0 }} />
        </div>
        {/* button content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            opacity: btnIn,
            translate: `0 ${(1 - btnIn) * 30}px`,
          }}
        >
          <Icon name="chat" size={46} color={C.tinta} strokeWidth={2.4} />
          <span style={{ fontSize: 46, fontWeight: 700, fontStretch: "100%", letterSpacing: "-0.01em", color: C.tinta, whiteSpace: "nowrap" }}>
            Escribinos por WhatsApp
          </span>
        </div>
        {/* shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 160,
            left: shine * PILL_W - 80,
            background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)",
            opacity: m,
          }}
        />
      </div>
      {/* WhatsApp number, so the button's action is possible without the site */}
      <div
        style={{
          position: "absolute",
          left: CX - 360,
          width: 720,
          top: PHONE_TOP,
          textAlign: "center",
          fontSize: 56,
          fontWeight: 760,
          fontStretch: "104%",
          letterSpacing: "-0.01em",
          color: C.tinta,
          fontVariantNumeric: "tabular-nums",
          opacity: phoneIn,
          translate: `0 ${(1 - phoneIn) * 24}px`,
          whiteSpace: "nowrap",
        }}
      >
        +54 3541 33-7818
      </div>
      {/* url */}
      <div
        style={{
          position: "absolute",
          left: CX - 300,
          width: 600,
          top: URL_TOP,
          textAlign: "center",
          fontSize: 46,
          fontWeight: 650,
          fontStretch: "108%",
          letterSpacing: "-0.01em",
          color: C.tinta2,
          opacity: urlIn,
          translate: `0 ${(1 - urlIn) * 24}px`,
        }}
      >
        lonsolab.com
      </div>
    </AbsoluteFill>
  );
};
