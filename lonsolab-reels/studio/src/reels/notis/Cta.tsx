import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT, Icon, Logo } from "../../brand";
import { DualTone, HeadlineLayer, type LineAnim } from "./Headline";
import { B, T, ip } from "./timing";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Block centred on the screen (y 676–1170) instead of hanging under the clock. */
const Y = { logo: 676, word: 808, pill: 958, url: 1108 };
const WORD_SIZE = 104;
const WORD_STRETCH = 112; // "Escribinos." ≈ 615 px wide: inside the screen with air on both sides
const LOGO_H = 100;

/** Penultimate beat of the loop: logo + "Escribinos." + "Auditoría gratis" + lonsolab.com, on the lock screen. */
export const Cta: React.FC<{ dx: number }> = ({ dx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < T.ctaLogo - 1 || f > T.ctaOut + 6) return null;

  // shared exit: everything sinks and fades (5 f, sharp ease-in) before the hook rebuilds at f330
  const out = ip(f, T.ctaOut, T.ctaOut + 5, 0, 1, EASE.in);
  const exitStyle: React.CSSProperties = {
    opacity: 1 - out,
    translate: `0px ${out * 36}px`,
  };

  // word: stretch punch
  const s = spring({ frame: f - T.ctaWord, fps, config: { damping: 13, stiffness: 210, mass: 0.65 } });
  const wordAnim = (): LineAnim => ({
    ty: out * 0.32,
    clip: "none",
    stretch: f < T.ctaWord ? 62 : Math.min(WORD_STRETCH + 3, 62 + (WORD_STRETCH - 62) * s),
    weight: 900 - 100 * Math.min(1, Math.max(0, s)),
    scale: f < T.ctaWord ? 1.28 : interpolate(s, [0, 1], [1.28, 1]),
    opacity: f < T.ctaWord ? 0 : 1 - out,
    hl: 0,
  });

  // logo: rises out of a mask
  const logoIn = ip(f, T.ctaLogo, T.ctaLogo + 7, 0, 1, EASE.salida);

  // pill: pops with the site's "rebote", gets tapped on beat 20, shine on beat 21
  const pillIn = ip(f, T.ctaPill, T.ctaPill + 8, 0, 1, EASE.rebote);
  const tapAt = B(20);
  const press = interpolate(f, [tapAt - 1, tapAt + 1, tapAt + 6], [1, 0.955, 1], CL);
  const ripple = ip(f, tapAt, tapAt + 14, 0, 1, EASE.salida);
  const shine = interpolate(f, [B(21) - 6, B(21) + 8], [-0.5, 1.4], CL);

  const urlIn = ip(f, T.ctaUrl, T.ctaUrl + 7, 0, 1, EASE.salida);

  return (
    <>
      {/* logo */}
      <div
        style={{
          position: "absolute",
          top: Y.logo,
          left: 0,
          width: 1080,
          height: LOGO_H + 8,
          display: "flex",
          justifyContent: "center",
          clipPath: "inset(-10% 0 0 0)",
          ...exitStyle,
        }}
      >
        <div style={{ translate: `0px ${(1 - logoIn) * (LOGO_H + 10)}px` }}>
          <Logo kind="full" variant="white" height={LOGO_H} />
        </div>
      </div>

      {/* Escribinos. */}
      <DualTone dx={dx}>
        {(onPhone) => (
          <HeadlineLayer lines={[[{ text: "Escribinos." }]]} size={WORD_SIZE} top={Y.word} onPhone={onPhone} anim={wordAnim} />
        )}
      </DualTone>

      {/* Auditoría gratis */}
      <div
        style={{
          position: "absolute",
          top: Y.pill,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          ...exitStyle,
        }}
      >
        <div
          style={{
            position: "relative",
            height: 112,
            padding: "0 52px 0 44px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            borderRadius: 999,
            background: C.pin,
            boxShadow: "0 3px 0 rgba(150,40,0,0.35), 0 26px 50px -16px rgba(255,90,38,0.7)",
            scale: String(interpolate(pillIn, [0, 1], [0.55, 1]) * press),
            opacity: ip(f, T.ctaPill, T.ctaPill + 3, 0, 1, Easing.linear),
            overflow: "hidden",
          }}
        >
          <Icon name="chat" size={52} color={C.tinta} strokeWidth={2.4} />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 60,
              fontWeight: 750,
              fontStretch: "106%",
              letterSpacing: "-0.01em",
              color: C.tinta,
              whiteSpace: "nowrap",
            }}
          >
            Auditoría gratis
          </span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 140,
              left: `${shine * 100}%`,
              background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
            }}
          />
          {ripple > 0 && ripple < 1 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 120,
                height: 120,
                marginLeft: -60,
                marginTop: -60,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.35)",
                scale: String(0.2 + ripple * 5),
                opacity: 1 - ripple,
              }}
            />
          )}
        </div>
      </div>

      {/* lonsolab.com */}
      <div
        style={{
          position: "absolute",
          top: Y.url,
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 60,
          fontWeight: 650,
          fontStretch: "108%",
          letterSpacing: "0.005em",
          color: C.papel,
          textShadow: "0 4px 18px rgba(4,8,32,0.45)",
          ...exitStyle,
          opacity: urlIn * (1 - out),
          translate: `0px ${(1 - urlIn) * 24 + out * 36}px`,
        }}
      >
        lonsolab.com
      </div>
    </>
  );
};
