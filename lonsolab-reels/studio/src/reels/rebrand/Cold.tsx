import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EASE, display } from "../../brand";
import { ICE } from "./palette";
import { LOGO_C, SignWorld } from "./Sign";
import { Line } from "./Text";
import { clamp, T } from "./timing";

/** Avatar target in screen space (scene 3). */
export const AVATAR = { x: 206, y: 880, r: 58 };
const DISC_R = 340;
/** During the hook the glass disc sits a little lower than the sign's logo centre (fills the lower half). */
const HOOK_DY = 50;

/**
 * One camera move through the old sign for f0–312:
 * hook (seen through a frosted glass disc) → iris opens on the sign → pull back into a
 * profile avatar. The pull is a single circular clip whose SCREEN radius contracts from the
 * frame corners to the avatar (1365 → 330 by f237 → 58 by f246): it clears the headline block
 * in ~7 frames and the wall bleeds past the frame, so no rectangular edge is ever visible.
 */
const camera = (f: number) => {
  const iris = interpolate(f, [T.sign - 10, T.sign + 12], [0, 1], { ...clamp, easing: EASE.inOut });
  const pull = interpolate(f, [T.circle - 4, T.circle + 12], [0, 1], { ...clamp, easing: EASE.inOut });
  // hook: slow push-in from f0, then a stronger push on the first full piano chord (f78)
  const hookZoom = interpolate(f, [0, T.hookHit, T.hookHit + 30, T.sign], [1.0, 1.06, 1.105, 1.115], clamp);
  const push = hookZoom * (1 - iris) + interpolate(f, [T.sign, T.circle], [1.0, 1.05], clamp) * iris;
  const rWorld = interpolate(iris, [0, 1], [DISC_R, 1300]);
  const sAvatar = AVATAR.r / 250;
  const s = interpolate(pull, [0, 1], [push, sAvatar]);
  const rScreenPull = interpolate(f, [T.circle - 4, T.circle + 3, T.circle + 12], [1300 * 1.05, 330, AVATAR.r], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const R = pull > 0 ? rScreenPull / s : rWorld;
  const dy = HOOK_DY * (1 - iris);
  const cx = interpolate(pull, [0, 1], [LOGO_C.x, AVATAR.x]);
  const cy = interpolate(pull, [0, 1], [LOGO_C.y + dy, AVATAR.y]);
  // the logo loses detail as it shrinks into the avatar
  const blur = interpolate(iris, [0, 0.7], [3.2, 0], clamp) + interpolate(pull, [0.55, 1], [0, 1.4], clamp);
  return { iris, pull, s, R, cx, cy, blur, dy };
};

export const ColdWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camera(frame);
  const out = interpolate(frame, [T.splice - 2, T.splice + 14], [0, 1], { ...clamp, easing: EASE.in });
  // frost on the glass: thin rim, then it crystallises on the first full chord (f78)
  const frost = interpolate(frame, [0, T.hookHit - 2, T.hookHit + 22, T.sign], [0.3, 0.38, 0.86, 0.92], {
    ...clamp,
    easing: EASE.salida,
  });
  const frostFade = 1 - cam.iris;
  const breathe = cam.iris < 1 ? 1 + Math.sin((frame / 30) * Math.PI * 2 * 0.28) * 0.006 : 1;
  const screenR = cam.R * cam.s * breathe;
  const discY = LOGO_C.y + cam.dy;
  // soft drop shadow under the contracting circle (camera pull)
  const shadow = interpolate(cam.pull, [0, 0.15, 1], [0, 1, 0.6], clamp);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 10}px)` : undefined }}>
      <ProfileBack />
      {/* the world, clipped to the disc / avatar circle */}
      <AbsoluteFill style={{ filter: shadow > 0.01 ? `drop-shadow(0 ${18 * shadow}px ${30 * shadow}px rgba(30,45,70,${0.5 * shadow}))` : undefined }}>
        <AbsoluteFill
          style={{
            clipPath: `circle(${cam.R}px at ${LOGO_C.x}px ${LOGO_C.y}px)`,
            transformOrigin: `${LOGO_C.x}px ${LOGO_C.y}px`,
            translate: `${cam.cx - LOGO_C.x}px ${cam.cy - LOGO_C.y}px`,
            scale: `${cam.s * breathe}`,
            filter: cam.blur > 0.05 ? `blur(${cam.blur}px) saturate(${0.55 + 0.45 * cam.iris})` : undefined,
          }}
        >
          <SignWorld />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* glass: tint, frost ferns growing in from the rim, rim light, specular */}
      {frostFade > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: LOGO_C.x - screenR,
            top: discY - screenR,
            width: screenR * 2,
            height: screenR * 2,
            borderRadius: "50%",
            overflow: "hidden",
            opacity: frostFade,
            boxShadow: "0 50px 90px -40px rgba(30,45,70,0.55)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(196,214,234,0.16), rgba(120,148,182,0.5) 82%)" }} />
          {/* breath fog: the glass mists up and clears like a sleeper breathing (same 0.3 Hz as the headline) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 56%, rgba(240,246,252,0.9) 0%, rgba(240,246,252,0.35) 38%, rgba(240,246,252,0) 66%)",
              opacity: 0.12 + 0.3 * (0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2 * 0.3 - Math.PI / 2)),
            }}
          />
          <Img
            src={staticFile("rebrand/frost_disc.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              WebkitMaskImage: `radial-gradient(circle, transparent ${interpolate(frost, [0, 1], [70, 8])}%, black ${interpolate(frost, [0, 1], [96, 58])}%)`,
              maskImage: `radial-gradient(circle, transparent ${interpolate(frost, [0, 1], [70, 8])}%, black ${interpolate(frost, [0, 1], [96, 58])}%)`,
              rotate: `${frame * 0.03}deg`,
              opacity: 0.85 + 0.15 * frost,
            }}
          />
          {/* second, finer frost layer that crystallises on the chord */}
          <Img
            src={staticFile("rebrand/frost_disc.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              rotate: "137deg",
              scale: "1.35",
              opacity: interpolate(frame, [T.hookHit - 2, T.hookHit + 26], [0, 0.75], { ...clamp, easing: EASE.salida }),
              WebkitMaskImage: `radial-gradient(circle, transparent ${interpolate(frost, [0.4, 1], [60, 20], clamp)}%, black ${interpolate(frost, [0.4, 1], [90, 62], clamp)}%)`,
              maskImage: `radial-gradient(circle, transparent ${interpolate(frost, [0.4, 1], [60, 20], clamp)}%, black ${interpolate(frost, [0.4, 1], [90, 62], clamp)}%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.75), inset 0 0 60px rgba(255,255,255,0.55)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.18) 100%)",
            }}
          />
        </div>
      ) : null}
      <ProfileFront />
      <HookText />
      <SignText />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ copy */

const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > T.sign) return null;
  // sleeping breath on the key word
  const breath = 1 + Math.sin((frame / 30) * Math.PI * 2 * 0.3 - Math.PI / 2) * 0.012;
  // frost creeps across "hibernando?" from the first frames (left → right), then crystallises on f78
  const sweep = interpolate(frame, [1, 46], [-30, 115], { ...clamp, easing: EASE.salida });
  const frostMask = `linear-gradient(90deg, black ${sweep}%, transparent ${sweep + 30}%)`;
  return (
    <div style={{ position: "absolute", left: 90, top: TOP, width: 900 }}>
      <Line at={-22} dur={30} outAt={T.sign - 22} outDur={12}>
        <div style={{ ...display(96, ICE.tinta), fontStretch: "112%" }}>¿Tu marca está</div>
      </Line>
      <Line at={-20} dur={34} outAt={T.sign - 20} outDur={12}>
        <div style={{ position: "relative", marginTop: 8, transformOrigin: "0% 60%", scale: `${breath}` }}>
          <div
            style={{
              ...display(144, ICE.tinta),
              fontStretch: "100%",
              backgroundImage: "linear-gradient(180deg, #4b6584 0%, #22344d 58%, #13182b 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            hibernando?
          </div>
          {/* the word itself frosts over */}
          <div
            style={{
              ...display(144, ICE.tinta),
              fontStretch: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              backgroundImage: `url(${staticFile("rebrand/frost_disc.png")})`,
              backgroundSize: "460px 460px",
              backgroundPosition: "-40px -150px",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitMaskImage: frostMask,
              maskImage: frostMask,
              opacity: interpolate(frame, [0, 10, T.hookHit - 2, T.hookHit + 24], [0.2, 0.42, 0.5, 0.8], { ...clamp, easing: EASE.salida }),
            }}
          >
            hibernando?
          </div>
        </div>
      </Line>
    </div>
  );
};

/** Headline top in the cold half (leaves ≥ 36 px under the "Ejemplo ilustrativo" pill). */
const TOP = 384;

const SignText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.sign - 10 || frame > T.circle) return null;
  // in with the iris (sharp by ≈ f161), fully gone by f234 so it never double-exposes "No se lee"
  return (
    <div style={{ position: "absolute", left: 90, top: TOP, width: 900 }}>
      <Line at={T.sign - 8} dur={18} blur={8} rise={30} outAt={T.circle - 10} outDur={8}>
        <div style={{ ...display(104, ICE.tinta), fontStretch: "112%" }}>El mismo logo</div>
      </Line>
      <Line at={T.sign - 5} dur={18} blur={8} rise={30} outAt={T.circle - 8} outDur={8}>
        <div style={{ ...display(104, ICE.tinta), fontStretch: "112%", marginTop: 6 }}>desde siempre.</div>
      </Line>
    </div>
  );
};

/**
 * "No se lee / en el circulito de Instagram." (7 words → ≥ 82 f). Rendered by Rebrand OUTSIDE the
 * cold world so the night blur never touches it: both lines land together at f235 (sharp ≈ f239),
 * hold through the splice and leave at f324 while the night rises from the bottom of the frame.
 */
export const CircleText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.circle || frame > T.splice + 24) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: TOP, width: 900 }}>
      <Line at={T.circle + 1} dur={8} blur={4} rise={16} outAt={T.splice + 12} outDur={7}>
        <div style={{ ...display(170, ICE.tinta), fontStretch: "112%" }}>No se lee</div>
      </Line>
      <Line at={T.circle + 1} dur={8} blur={4} rise={16} outAt={T.splice + 12} outDur={7}>
        <div style={{ fontFamily: "Archivo", fontWeight: 600, fontStretch: "100%", fontSize: 62, lineHeight: 1.1, color: ICE.tinta2, marginTop: 22 }}>
          en el circulito de Instagram.
        </div>
      </Line>
    </div>
  );
};

/* ------------------------------------------------------------------ scene 3 UI */

const Skel: React.FC<{ w: number; h?: number; o?: number; style?: React.CSSProperties }> = ({ w, h = 22, o = 0.16, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: `rgba(19,24,43,${o})`, ...style }} />
);

const useCardP = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [T.circle + 4, T.circle + 24], [0, 1], { ...clamp, easing: EASE.salida });
};

/** Generic, desaturated profile mock (no platform branding), behind the avatar. */
const ProfileBack: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useCardP();
  if (frame < T.circle) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 780,
        width: 900,
        height: 600,
        borderRadius: 44,
        background: "linear-gradient(180deg, rgba(248,251,253,0.86), rgba(236,242,247,0.8))",
        border: "2px solid rgba(255,255,255,0.9)",
        boxShadow: "0 30px 80px -30px rgba(30,45,70,0.45)",
        overflow: "hidden",
        opacity: p,
        translate: `0 ${(1 - p) * 60}px`,
      }}
    >
      <div style={{ position: "absolute", left: 220, top: 66, display: "flex", gap: 56 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Skel w={74} h={30} o={0.22} />
            <Skel w={118} h={18} o={0.12} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, top: 196, fontFamily: "Archivo", fontWeight: 700, fontSize: 44, color: ICE.tinta }}>
        Panadería La Espiga
      </div>
      <Skel w={420} h={18} o={0.12} style={{ position: "absolute", left: 40, top: 268 }} />
      <Skel w={300} h={18} o={0.12} style={{ position: "absolute", left: 40, top: 300 }} />
      <div style={{ position: "absolute", left: 40, top: 356, display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 268, height: 268, borderRadius: 10, background: `rgba(120,138,160,${0.22 + i * 0.05})` }} />
        ))}
      </div>
    </div>
  );
};

/** Avatar ring, callout and a loupe on the tiny avatar. */
const ProfileFront: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useCardP();
  if (frame < T.circle) return null;
  const loupe = interpolate(frame, [T.circle + 20, T.circle + 36], [0, 1], { ...clamp, easing: EASE.rebote });
  const callout = interpolate(frame, [T.circle + 16, T.circle + 30], [0, 1], { ...clamp, easing: EASE.salida });
  const L = { x: 735, y: 905, r: 150 };
  // callout lines: tangents from the avatar to the loupe (approximation: top & bottom offsets)
  const ang = Math.atan2(L.y - AVATAR.y, L.x - AVATAR.x);
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  // once the pull lands, the avatar becomes what a phone really shows: the 30 px raster, upscaled (mush)
  const tiny = interpolate(frame, [T.circle + 8, T.circle + 14], [0, 1], clamp);
  return (
    <>
      {tiny > 0 ? (
        <div
          style={{
            position: "absolute",
            left: AVATAR.x - AVATAR.r,
            top: AVATAR.y - AVATAR.r,
            width: AVATAR.r * 2,
            height: AVATAR.r * 2,
            borderRadius: "50%",
            overflow: "hidden",
            opacity: tiny,
            background: "#d9cfb2",
          }}
        >
          <Img src={staticFile("rebrand/old_avatar_tiny.png")} style={{ width: "100%", height: "100%", filter: "blur(1.6px) saturate(0.8)", scale: "1.04" }} />
        </div>
      ) : null}
      {/* avatar ring */}
      <div
        style={{
          position: "absolute",
          left: AVATAR.x - AVATAR.r - 7,
          top: AVATAR.y - AVATAR.r - 7,
          width: (AVATAR.r + 7) * 2,
          height: (AVATAR.r + 7) * 2,
          borderRadius: "50%",
          border: "3px solid rgba(95,115,139,0.55)",
          opacity: p,
        }}
      />
      {/* callout lines */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: callout }}>
        {[1, -1].map((s) => (
          <line
            key={s}
            x1={AVATAR.x + nx * AVATAR.r * s}
            y1={AVATAR.y + ny * AVATAR.r * s}
            x2={AVATAR.x + nx * AVATAR.r * s + (L.x + nx * L.r * s - AVATAR.x - nx * AVATAR.r * s) * callout}
            y2={AVATAR.y + ny * AVATAR.r * s + (L.y + ny * L.r * s - AVATAR.y - ny * AVATAR.r * s) * callout}
            stroke={ICE.acero}
            strokeWidth={2}
            strokeDasharray="6 8"
          />
        ))}
      </svg>
      {/* loupe: the avatar as it really reaches the eye — a few blurry pixels */}
      <div
        style={{
          position: "absolute",
          left: L.x - L.r,
          top: L.y - L.r,
          width: L.r * 2,
          height: L.r * 2,
          scale: `${loupe}`,
          opacity: Math.min(1, loupe * 2),
        }}
      >
        <div style={{ position: "absolute", left: L.r * 1.55, top: L.r * 1.55, width: 34, height: 150, borderRadius: 17, background: "linear-gradient(90deg, #3b4a60, #1c2433)", rotate: "-45deg", transformOrigin: "50% 0%" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#d9cfb2",
            border: "12px solid #2a3446",
            boxShadow: "0 24px 60px -18px rgba(19,24,43,0.6)",
          }}
        >
          <Img
            src={staticFile("rebrand/old_avatar_tiny.png")}
            style={{ width: "100%", height: "100%", imageRendering: "pixelated", filter: "blur(0.6px)" }}
          />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(140deg, rgba(255,255,255,0.4), transparent 40%)" }} />
        </div>
      </div>
    </>
  );
};
