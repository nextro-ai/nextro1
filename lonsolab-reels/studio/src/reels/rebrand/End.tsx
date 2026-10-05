import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, Logo, Topo, display, label, punch } from "../../brand";
import { Line } from "./Text";
import { B, clamp, T } from "./timing";

/** Lonso Lab end card (f859–939): papel iris opens from the centre — bookends the hook's glass disc. */
export const End: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.end) return null;
  const iris = interpolate(frame, [T.end, T.end + 13], [0, 1], { ...clamp, easing: EASE.inOut });
  const R = iris * 1250;
  const logo = interpolate(frame, [T.end + 7, T.end + 20], [0, 1], { ...clamp, easing: EASE.salida });
  const pill = interpolate(frame, [T.end + 11, T.end + 24], [0, 1], { ...clamp, easing: EASE.rebote });
  const url = interpolate(frame, [T.end + 15, T.end + 27], [0, 1], { ...clamp, easing: EASE.salida });
  // the hold keeps breathing: the CTA pill swells 2 % on the two beats of the hold (f898, f918)
  const breathe = punch(frame, B(46), 1.02, 14) * punch(frame, B(47), 1.02, 14);
  return (
    // the iris opens from the board's centre, so the board copy stays readable until ≈ f863
    <AbsoluteFill style={{ clipPath: `circle(${R}px at 540px 1040px)` }}>
      <AbsoluteFill style={{ background: C.papel }} />
      <Topo color={C.cobalto} opacity={0.3} drawFrom={T.end} drawDuration={60} drift={26} />
      <div style={{ position: "absolute", left: 90, top: 470, width: 900, textAlign: "center" }}>
        <Line at={T.end + 1} dur={12} mode="mask">
          <div style={{ ...display(116, C.tinta), fontStretch: "112%" }}>Contanos</div>
        </Line>
        <Line at={T.end + 3} dur={12} mode="mask">
          <div style={{ ...display(116, C.cobalto), fontStretch: "112%", marginTop: 4 }}>de tu marca.</div>
        </Line>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 906,
          display: "flex",
          justifyContent: "center",
          opacity: logo,
          translate: `0 ${(1 - logo) * 30}px`,
        }}
      >
        <Logo kind="full" variant="tinta" height={92} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1052, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: C.pin,
            padding: "22px 30px",
            borderRadius: 999,
            boxShadow: "0 2px 6px rgba(19,24,43,0.08), 0 18px 36px -18px rgba(19,24,43,0.4)",
            scale: `${pill * breathe}`,
            opacity: Math.min(1, pill * 2),
          }}
        >
          {/* ≤ 780 px wide (x 150–930) and the number ends left of the x 880 rail */}
          <span style={{ ...label(44, C.tinta), fontStretch: "100%", whiteSpace: "nowrap" }}>WhatsApp +54 3541 33-7818</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1170,
          textAlign: "center",
          ...label(46, C.tinta),
          opacity: url,
          translate: `0 ${(1 - url) * 16}px`,
        }}
      >
        lonsolab.com
      </div>
    </AbsoluteFill>
  );
};
