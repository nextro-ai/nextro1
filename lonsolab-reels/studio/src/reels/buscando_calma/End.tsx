import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, Icon, Logo } from "../../brand";
import { accentEdge, alpha, mix, shadow, useTheme } from "./theme";
import { T, eo, io, ip, lerp } from "./timing";
import { font } from "./ui";

/*
 * 981–1103: a search bar that holds "ferretería" (the opening search) while the closing headline
 * settles, flips through two trades (one per beat) and lands on "lo que vendés" on bar 19 (f1036),
 * which then stays still for ≥ 60 f.
 * 1104–1199: the same bar becomes the accent CTA "Auditoría gratis" (after the headline has left),
 * with the logo above and the contact lines below; the full card holds still from ~f1146.
 */
const CX = 520; // column centre: lines below y 840 stay left of x 880
const PILL0 = { y: 860, w: 780, h: 120 }; // below the closing headline (which ends at y ≈ 650)
const PILL1 = { y: 684, w: 760, h: 150 };
const LOGO_H = 116;
const LOGO_W = LOGO_H * (5899 / 1312);
const LOGO_TOP = 462;
const SUB_TOP = 866;
const WA_TOP = 1012;
const URL_TOP = 1096;

const RUBROS = ["ferretería", "peluquería", "veterinaria", "lo que vendés"] as const;
const SUFFIX = " cerca de mí";

export const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  if (f < T.calm) return null;

  /* --- search pill with the trade flip --- */
  let idx = 0;
  for (let i = 0; i < RUBROS.length; i++) if (f >= T.rubros[i]) idx = i;
  const flipAt = T.rubros[idx];
  const flipP = idx === 0 ? 1 : ip(f, [flipAt, flipAt + 9], [0, 1], eo);
  const prev = idx > 0 ? RUBROS[idx - 1] : null;
  const isFinal = idx === RUBROS.length - 1;
  const pillIn = ip(f, [T.calm + 4, T.calm + 16], [0, 1], eo);

  /* --- morph into the CTA --- */
  // "lo que vendés" (in on bar 19, f1036, settled ~f1044) stays still until f1104 (60 f); the
  // headline has left at f1098, so the morph and the logo never overlap it
  const M0 = T.end + 14;
  const m = ip(f, [M0, M0 + 16], [0, 1], io); // move + resize
  const fill = ip(f, [M0, M0 + 10], [0, 1], eo); // accent wipe left → right
  const searchOut = ip(f, [M0, M0 + 5], [0, 1]);
  const btnIn = ip(f, [M0 + 5, M0 + 15], [0, 1], eo);
  const pill = { y: lerp(PILL0.y, PILL1.y, m), w: lerp(PILL0.w, PILL1.w, m), h: lerp(PILL0.h, PILL1.h, m) };
  const logoIn = ip(f, [M0, M0 + 14], [0, 1], eo);
  const edge = accentEdge(t);
  const subIn = ip(f, [T.endSub, T.endSub + 12], [0, 1], eo);
  const waIn = ip(f, [T.endWa, T.endWa + 12], [0, 1], eo);
  const urlIn = ip(f, [T.endUrl, T.endUrl + 12], [0, 1], eo);
  const settle = f >= T.end ? 1 + 0.03 * ip(f, [M0 + 14, M0 + 18, M0 + 26], [0, 1, 0]) : 1;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* soft accent glow behind the button once it has landed (no flash) */}
      <div
        style={{
          position: "absolute",
          left: CX - PILL1.w / 2 - 40,
          top: PILL1.y - 30,
          width: PILL1.w + 80,
          height: PILL1.h + 60,
          borderRadius: 120,
          background: alpha(t.accent, 0.16 * ip(f, [M0 + 16, M0 + 30], [0, 1])),
          filter: "blur(24px)",
        }}
      />
      {/* logo */}
      {logoIn > 0 ? (
        <div style={{ position: "absolute", left: CX - LOGO_W / 2, top: LOGO_TOP, opacity: logoIn, translate: `0 ${(1 - logoIn) * 18}px` }}>
          <Logo kind="full" color={t.ink} height={LOGO_H} />
        </div>
      ) : null}
      {/* pill → CTA */}
      <div
        style={{
          position: "absolute",
          left: CX - pill.w / 2,
          top: pill.y,
          width: pill.w,
          height: pill.h,
          borderRadius: pill.h / 2,
          opacity: pillIn,
          translate: `0 ${(1 - pillIn) * 30}px`,
          scale: `${settle}`,
          boxShadow: shadow(t, 0.9 + 0.3 * m),
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: t.surface }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: t.accent,
            borderRadius: pill.h / 2,
            // light accents (marino, bosque) get a thin darker edge so the button separates from bg
            boxShadow: edge ? `inset 0 0 0 3px ${edge}` : undefined,
            clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)`,
          }}
        />
        {/* search content */}
        {searchOut < 1 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 36px",
              opacity: 1 - searchOut,
            }}
          >
            <Icon name="buscar" size={48} color={t.ink2} strokeWidth={2.2} />
            <span style={{ ...font(48, 460, t.ink), display: "flex", alignItems: "center" }}>
              <span style={{ position: "relative", display: "inline-block", height: 64, clipPath: "inset(0 -600px 0 -24px)" }}>
                {prev && flipP < 1 ? (
                  <span style={{ position: "absolute", left: 0, top: 0, lineHeight: "64px", translate: `0 ${-flipP * 64}px`, opacity: 1 - flipP }}>
                    {prev}
                  </span>
                ) : null}
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                    lineHeight: "64px",
                    translate: `0 ${(1 - flipP) * 64}px`,
                    opacity: flipP,
                    fontWeight: isFinal ? 760 : 460,
                    color: isFinal ? t.onAccent : t.ink,
                  }}
                >
                  {isFinal ? (
                    <span
                      style={{
                        position: "absolute",
                        left: -10,
                        right: -10,
                        top: 4,
                        bottom: 2,
                        borderRadius: 12,
                        background: t.accent,
                        zIndex: -1,
                        transformOrigin: "left center",
                        scale: `${ip(f, [flipAt + 2, flipAt + 10], [0, 1], eo)} 1`,
                      }}
                    />
                  ) : null}
                  {RUBROS[idx]}
                </span>
              </span>
              <span style={{ whiteSpace: "pre", marginLeft: isFinal ? 10 : 0 }}>{SUFFIX}</span>
            </span>
          </div>
        ) : null}
        {/* CTA content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: btnIn,
            translate: `0 ${(1 - btnIn) * 20}px`,
            ...font(74, 800, t.onAccent, 108),
            letterSpacing: "-0.02em",
          }}
        >
          Auditoría gratis
        </div>
      </div>
      {/* sub line */}
      <div
        style={{
          position: "absolute",
          left: CX - 400,
          width: 800,
          top: SUB_TOP,
          textAlign: "center",
          ...font(56, 620, t.ink2, 104),
          opacity: subIn,
          translate: `0 ${(1 - subIn) * 16}px`,
        }}
      >
        en 24 h hábiles
      </div>
      {/* thin divider */}
      <div
        style={{
          position: "absolute",
          left: CX - 120,
          width: 240,
          top: (SUB_TOP + 70 + WA_TOP) / 2,
          height: 3,
          borderRadius: 2,
          background: mix(t.line, t.ink2, 0.2),
          opacity: waIn,
          scale: `${waIn} 1`,
        }}
      />
      {/* WhatsApp */}
      <div
        style={{
          position: "absolute",
          left: CX - 380,
          width: 760,
          top: WA_TOP,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          ...font(50, 740, t.ink, 102),
          fontVariantNumeric: "tabular-nums",
          opacity: waIn,
          translate: `0 ${(1 - waIn) * 16}px`,
        }}
      >
        <span style={{ fontWeight: 520, color: t.ink2 }}>WhatsApp</span>
        <span>+54 3541 33-7818</span>
      </div>
      {/* url */}
      <div
        style={{
          position: "absolute",
          left: CX - 300,
          width: 600,
          top: URL_TOP,
          textAlign: "center",
          ...font(52, 640, t.ink2, 106),
          opacity: urlIn,
          translate: `0 ${(1 - urlIn) * 16}px`,
        }}
      >
        lonsolab.com
      </div>
    </AbsoluteFill>
  );
};
