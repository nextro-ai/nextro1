import React from "react";
import { fraunces } from "./fonts";
import { NewSymbol, Wordmark } from "./NewLogo";
import { ESPIGA } from "./palette";

/** Application mockups for the new La Espiga identity, all drawn in code at 700 x 860. */
export const ART = { w: 700, h: 860 };

const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s });

/* ---------------------------------------------------------- 1 · storefront */
export const ArtCartel: React.FC = () => (
  <div style={{ width: ART.w, height: ART.h, position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #f3e6cf 0%, #efdcc0 100%)" }}>
    {/* facade */}
    <div style={abs({ left: 40, top: 120, width: 620, height: 690, background: ESPIGA.crema, boxShadow: "0 30px 60px -30px rgba(31,27,22,0.5)" })} />
    {/* fascia */}
    <div style={abs({ left: 40, top: 120, width: 620, height: 150, background: ESPIGA.carbon, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 })}>
      <NewSymbol id="cartel" size={104} color={ESPIGA.trigo} />
      <div style={{ ...fraunces(86, ESPIGA.trigo, 560, 100), whiteSpace: "nowrap" }}>La Espiga</div>
    </div>
    {/* awning */}
    <svg width={660} height={130} style={abs({ left: 20, top: 266 })} viewBox="0 0 660 130">
      <defs>
        <linearGradient id="awn-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
      </defs>
      {new Array(11).fill(0).map((_, i) => (
        <path
          key={i}
          d={`M${i * 60} 0 L ${i * 60 + 60} 0 L ${i * 60 + 60} 92 Q ${i * 60 + 30} 124 ${i * 60} 92 Z`}
          fill={i % 2 ? ESPIGA.crema : ESPIGA.horno}
        />
      ))}
      <rect x={0} y={0} width={660} height={96} fill="url(#awn-shade)" />
    </svg>
    {/* window with warm light and loaves */}
    <div
      style={abs({
        left: 80,
        top: 420,
        width: 330,
        height: 300,
        borderRadius: 8,
        background: "radial-gradient(ellipse at 50% 30%, #ffe7b8 0%, #f2c47c 60%, #d99a55 100%)",
        border: `12px solid ${ESPIGA.carbon}`,
        overflow: "hidden",
      })}
    >
      {[0, 1].map((r) => (
        <React.Fragment key={r}>
          <div style={abs({ left: 0, right: 0, top: 118 + r * 120, height: 8, background: "rgba(31,27,22,0.55)" })} />
          {[0, 1, 2].map((k) => (
            <div
              key={k}
              style={abs({
                left: 22 + k * 96,
                top: 70 + r * 120,
                width: 78,
                height: 48,
                borderRadius: r ? "40px 40px 12px 12px" : "50%",
                background: r ? "linear-gradient(180deg, #b8692f, #8e4a1d)" : "linear-gradient(180deg, #d9944a, #a95f27)",
                boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)",
              })}
            />
          ))}
        </React.Fragment>
      ))}
      <div style={abs({ inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.35) 0%, transparent 35%)" })} />
    </div>
    {/* door */}
    <div style={abs({ left: 450, top: 420, width: 170, height: 390, background: ESPIGA.carbon, borderRadius: "6px 6px 0 0" })}>
      <div style={abs({ left: 20, top: 22, width: 130, height: 200, borderRadius: 4, background: "linear-gradient(160deg, #f2c47c, #c98a4b)" })} />
      <div style={abs({ left: 130, top: 250, width: 12, height: 44, borderRadius: 6, background: ESPIGA.trigo })} />
    </div>
    {/* hanging blade sign */}
    <div style={abs({ left: 600, top: 300, width: 6, height: 40, background: ESPIGA.carbon })} />
    <div style={abs({ left: 560, top: 336, width: 92, height: 92, borderRadius: "50%", background: ESPIGA.horno, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px -8px rgba(0,0,0,0.4)" })}>
      <NewSymbol id="blade" size={64} color={ESPIGA.crema} />
    </div>
    {/* sidewalk */}
    <div style={abs({ left: 0, right: 0, top: 810, height: 50, background: "#d8cbb6" })} />
  </div>
);

/* ---------------------------------------------------------- 2 · paper bag */
export const ArtBolsa: React.FC = () => (
  <div style={{ width: ART.w, height: ART.h, position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 40% 30%, #f1d58e 0%, ${ESPIGA.trigo} 60%, #dcb354 100%)` }}>
    {/* shadow */}
    <div style={abs({ left: 190, top: 742, width: 380, height: 50, borderRadius: "50%", background: "rgba(80,55,10,0.35)", filter: "blur(16px)" })} />
    {/* bag body */}
    <div style={abs({ left: 170, top: 190, width: 360, height: 570, background: "linear-gradient(90deg, #d4b183 0%, #e0c296 45%, #d1ad7c 100%)", borderRadius: "4px 4px 8px 8px" })} />
    {/* side gusset */}
    <div style={abs({ left: 530, top: 200, width: 60, height: 560, background: "linear-gradient(90deg, #b8935f, #c6a271)", clipPath: "polygon(0 0, 100% 3%, 100% 100%, 0 100%)" })} />
    {/* zig-zag cut top */}
    <svg width={430} height={30} viewBox="0 0 430 30" style={abs({ left: 170, top: 176 })}>
      <path d={`M0 30 ${new Array(22).fill(0).map((_, i) => `L ${i * 20 + 10} 14 L ${i * 20 + 20} 30`).join(" ")} Z`} fill="#dcbd90" />
    </svg>
    {/* fold line */}
    <div style={abs({ left: 170, top: 300, width: 360, height: 3, background: "rgba(120,85,40,0.25)" })} />
    {/* print */}
    <div style={abs({ left: 170, top: 360, width: 360, display: "flex", flexDirection: "column", alignItems: "center" })}>
      <NewSymbol id="bolsa" size={170} color={ESPIGA.carbon} />
      <div style={{ marginTop: 22 }}>
        <Wordmark size={64} color={ESPIGA.carbon} accent={ESPIGA.carbon} descriptor={false} />
      </div>
      <div style={{ fontFamily: "Archivo", fontWeight: 600, fontStretch: "125%", fontSize: 18, letterSpacing: "0.34em", color: ESPIGA.carbon, marginTop: 12 }}>PANADERÍA</div>
    </div>
    {/* seal sticker */}
    <div style={abs({ left: 300, top: 250, width: 100, height: 100, borderRadius: "50%", background: ESPIGA.horno, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 12px -4px rgba(0,0,0,0.35)" })}>
      <NewSymbol id="seal" size={66} color={ESPIGA.crema} />
    </div>
  </div>
);

/* ---------------------------------------------------------- 3 · social profile (generic UI) */
const Post: React.FC<{ i: number }> = ({ i }) => {
  const base: React.CSSProperties = { width: 196, height: 196, position: "relative", overflow: "hidden", borderRadius: 6 };
  switch (i) {
    case 0:
      return (
        <div style={{ ...base, background: ESPIGA.horno, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NewSymbol id="p0" size={120} color={ESPIGA.crema} />
        </div>
      );
    case 1:
      return (
        <div style={{ ...base, background: ESPIGA.crema, padding: 18, boxSizing: "border-box" }}>
          <div style={{ ...fraunces(34, ESPIGA.carbon, 600, 100), lineHeight: 1.05 }}>Pan de masa madre</div>
          <div style={abs({ left: 18, bottom: 18, width: 40, height: 4, background: ESPIGA.horno })} />
        </div>
      );
    case 2:
      return (
        <div style={{ ...base, background: "radial-gradient(circle at 50% 60%, #e6a35c 0%, #a85a28 70%)" }}>
          <div style={abs({ left: 38, top: 58, width: 120, height: 82, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(180deg, #f2c27c, #b9692e)" })} />
        </div>
      );
    case 3:
      return (
        <div style={{ ...base, background: ESPIGA.trigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...fraunces(58, ESPIGA.carbon, 600, 100) }}>¡Hola!</div>
        </div>
      );
    case 4:
      return (
        <div style={{ ...base, background: ESPIGA.carbon, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wordmark size={40} color={ESPIGA.trigo} descriptor={false} />
        </div>
      );
    default:
      return (
        <div style={{ ...base, background: `repeating-linear-gradient(45deg, ${ESPIGA.crema} 0 18px, #efe2cc 18px 36px)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NewSymbol id={`p${i}`} size={110} color={ESPIGA.horno} />
        </div>
      );
  }
};

export const ArtPerfil: React.FC = () => (
  <div style={{ width: ART.w, height: ART.h, position: "relative", overflow: "hidden", background: "#fffcf7" }}>
    <div style={abs({ left: 48, top: 56, width: 170, height: 170, borderRadius: "50%", background: ESPIGA.horno, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 6px #fffcf7, 0 0 0 10px ${ESPIGA.trigo}` })}>
      <NewSymbol id="avatar" size={120} color={ESPIGA.crema} />
    </div>
    <div style={abs({ left: 262, top: 82, display: "flex", gap: 50 })}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 70, height: 28, borderRadius: 14, background: "rgba(31,27,22,0.22)" }} />
          <div style={{ width: 100, height: 16, borderRadius: 8, background: "rgba(31,27,22,0.12)" }} />
        </div>
      ))}
    </div>
    <div style={abs({ left: 48, top: 252, ...fraunces(54, ESPIGA.carbon, 600, 100) })}>La Espiga</div>
    <div style={abs({ left: 48, top: 318, fontFamily: "Archivo", fontSize: 30, fontWeight: 500, color: "#5a5248" })}>Panadería de barrio</div>
    <div style={abs({ left: 48, top: 372, width: 604, height: 64, borderRadius: 14, background: ESPIGA.horno, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Archivo", fontWeight: 700, fontSize: 28, color: "#fff" })}>
      Seguir
    </div>
    <div style={abs({ left: 48, top: 462, display: "grid", gridTemplateColumns: "repeat(3, 196px)", gap: 8 })}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Post key={i} i={i} />
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------- 4 · web on a phone + map pin */
export const ArtWeb: React.FC = () => (
  <div style={{ width: ART.w, height: ART.h, position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #f4e8d4, #e9d6b6)" }}>
    {/* phone */}
    <div style={abs({ left: 60, top: 70, width: 380, height: 760, borderRadius: 58, background: ESPIGA.carbon, padding: 14, boxSizing: "border-box", boxShadow: "0 40px 70px -30px rgba(31,27,22,0.6)" })}>
      <div style={{ width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: ESPIGA.crema, position: "relative" }}>
        <div style={abs({ left: 126, top: 12, width: 100, height: 28, borderRadius: 14, background: "#000" })} />
        <div style={abs({ left: 24, top: 62, display: "flex", alignItems: "center", gap: 10 })}>
          <NewSymbol id="webnav" size={42} color={ESPIGA.horno} />
          <div style={{ ...fraunces(30, ESPIGA.carbon, 600, 100) }}>La Espiga</div>
        </div>
        <div style={abs({ left: 300, top: 72, width: 28, height: 3, background: ESPIGA.carbon, boxShadow: `0 9px 0 ${ESPIGA.carbon}` })} />
        <div style={abs({ left: 0, right: 0, top: 124, height: 250, background: "radial-gradient(circle at 60% 60%, #f0b765 0%, #b4612b 75%)" })}>
          <div style={abs({ left: 70, top: 92, width: 210, height: 120, borderRadius: "110px 110px 30px 30px", background: "linear-gradient(180deg, #f6cf8e, #b9692e)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.12)" })} />
          {[0, 1, 2].map((k) => (
            <div key={k} style={abs({ left: 112 + k * 46, top: 112, width: 10, height: 50, borderRadius: 5, background: "rgba(255,240,210,0.6)", rotate: "25deg" })} />
          ))}
        </div>
        <div style={abs({ left: 24, top: 396, width: 300, ...fraunces(40, ESPIGA.carbon, 600, 100), lineHeight: 1.05 })}>Pan de verdad, todos los días.</div>
        <div style={abs({ left: 24, top: 510, width: 200, height: 12, borderRadius: 6, background: "rgba(31,27,22,0.14)" })} />
        <div style={abs({ left: 24, top: 532, width: 150, height: 12, borderRadius: 6, background: "rgba(31,27,22,0.14)" })} />
        <div style={abs({ left: 24, top: 574, width: 230, height: 58, borderRadius: 29, background: ESPIGA.horno, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Archivo", fontWeight: 700, fontSize: 24, color: "#fff" })}>
          Hacé tu pedido
        </div>
      </div>
    </div>
    {/* map card */}
    <div style={abs({ left: 360, top: 330, width: 300, height: 400, borderRadius: 26, overflow: "hidden", background: "#efe6d4", boxShadow: "0 30px 60px -24px rgba(31,27,22,0.55)" })}>
      <svg width={300} height={280} viewBox="0 0 300 280" style={{ display: "block" }}>
        <rect width={300} height={280} fill="#ece2cd" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path key={k} d={`M-20 ${40 + k * 44} C 80 ${10 + k * 44}, 180 ${80 + k * 44}, 320 ${30 + k * 44}`} stroke="#d9cab0" strokeWidth={1.6} fill="none" />
        ))}
        <path d="M-10 190 L 310 120" stroke="#fffaf0" strokeWidth={16} />
        <path d="M120 -10 L 170 290" stroke="#fffaf0" strokeWidth={14} />
        <path d="M-10 60 L 310 90" stroke="#fffaf0" strokeWidth={8} />
        <circle cx={150} cy={148} r={34} fill={ESPIGA.horno} opacity={0.18} />
      </svg>
      {/* pin */}
      <div style={abs({ left: 112, top: 62, width: 76, height: 76, borderRadius: "50% 50% 50% 0", rotate: "-45deg", background: ESPIGA.horno, boxShadow: "0 8px 14px -6px rgba(0,0,0,0.45)" })} />
      <div style={abs({ left: 126, top: 72, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" })}>
        <NewSymbol id="pin" size={40} color={ESPIGA.crema} />
      </div>
      <div style={abs({ left: 0, right: 0, top: 280, height: 120, background: "#fffcf7", padding: "20px 22px", boxSizing: "border-box" })}>
        <div style={{ ...fraunces(32, ESPIGA.carbon, 600, 100) }}>La Espiga</div>
        <div style={{ fontFamily: "Archivo", fontSize: 22, fontWeight: 500, color: "#5a5248", marginTop: 8 }}>Panadería · Abierto</div>
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------- extra grid tiles */
export const ArtLogoTile: React.FC = () => (
  <div style={{ width: ART.w, height: ART.h, background: ESPIGA.horno, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <NewSymbol id="tile" size={330} color={ESPIGA.crema} />
    <div style={{ marginTop: 40 }}>
      <Wordmark size={120} color={ESPIGA.crema} accent={ESPIGA.crema} descriptor={false} />
    </div>
  </div>
);

export const ArtPaletteTile: React.FC = () => (
  <div style={{ width: ART.w, height: ART.h, display: "flex" }}>
    {[ESPIGA.trigo, ESPIGA.horno, ESPIGA.crema, ESPIGA.carbon].map((c) => (
      <div key={c} style={{ flex: 1, background: c }} />
    ))}
  </div>
);
