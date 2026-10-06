import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, Icon, Topo, fmtAR, punch, type IconName } from "../../brand";
import { TOPO_PATHS } from "../../brand/topoPaths";
import { T, ip, eo, ei, sp, back } from "./timing";
import { Stars, Thumb } from "./ui";

/* -------------------------------------------------------------------------- */
/* Services: three cards stack like a wallet (one per beat-grid hit). Each new */
/* card covers the previous one's body but leaves its header (kicker + line)  */
/* peeking, so the three promises stay readable together, while the top card  */
/* shows its service working: a pin dropping on a map, a post getting likes,  */
/* a website whose WhatsApp button gets tapped. Cards bleed off the bottom so */
/* there is no empty cobalt, and everything keeps moving after it lands.      */
/* -------------------------------------------------------------------------- */

type Svc = {
  at: number;
  n: string;
  kicker: string;
  lead: string;
  verb: string;
  icon: IconName;
  bg: string;
  fg: string;
  kickerC: string;
  tileBg: string;
  tileFg: string;
  numC: string;
  shadow: string;
};

const SVCS: Svc[] = [
  {
    at: T.cards[0],
    n: "01",
    kicker: "Google Maps",
    lead: "Que te",
    verb: "encuentren.",
    icon: "pin",
    bg: C.blanco,
    fg: C.tinta,
    kickerC: C.cobalto,
    tileBg: C.cobalto,
    tileFg: C.papel,
    numC: "#9aa0b0",
    shadow: "rgba(8,12,40,0.45)",
  },
  {
    at: T.cards[1],
    n: "02",
    kicker: "Redes",
    lead: "Que te",
    verb: "elijan.",
    icon: "camara",
    bg: C.cobaltoHondo,
    fg: C.papel,
    kickerC: C.cobaltoClaro,
    tileBg: C.papel,
    tileFg: C.cobaltoHondo,
    numC: "#8ea0f0",
    shadow: "rgba(4,8,30,0.6)",
  },
  {
    at: T.cards[2],
    n: "03",
    kicker: "Web",
    lead: "Que te",
    verb: "escriban.",
    icon: "web",
    bg: C.tinta,
    fg: C.papel,
    kickerC: "#b9bfd3",
    tileBg: C.papel,
    tileFg: C.tinta,
    numC: "#6b7290",
    shadow: "rgba(4,6,20,0.7)",
  },
];

const LEFT = 90;
const W = 900;
const TOP0 = 300;
const PEEK = 170; // header height that stays visible when the next card covers the body
const WA = "#1f9d55";

const SimTag: React.FC<{ color: string; style?: React.CSSProperties }> = ({ color, style }) => (
  <div style={{ position: "absolute", fontFamily: FONT, fontSize: 26, fontWeight: 600, letterSpacing: "0.02em", color, ...style }}>
    Simulación
  </div>
);

/* ------------------------------ 01 · map ---------------------------------- */
const MapVisual: React.FC<{ t: number; h: number }> = ({ t, h }) => {
  const mw = W - 36;
  const mh = h - PEEK - 4;
  const pinP = sp(t, 3, 9, 200, 0.9);
  const ring = (k: number) => ((((t - 10 + k * 15) % 30) + 30) % 30) / 30;
  const chip = sp(t, 11, 14, 180);
  const rivals = [
    [150, 250, 0],
    [700, 190, 2],
    [760, 520, 4],
    [120, 640, 6],
  ] as const;
  return (
    <div style={{ position: "absolute", left: 18, top: PEEK + 4, width: mw, height: mh, borderRadius: 24, overflow: "hidden", background: "#e6ebf3" }}>
      {/* slow drift + zoom so the map never sits still */}
      <div style={{ position: "absolute", inset: -60, scale: `${1.02 + t * 0.0009}`, translate: `${-t * 0.5}px ${-t * 0.3}px` }}>
        <svg viewBox="420 120 900 1240" preserveAspectRatio="xMidYMid slice" width={mw + 120} height={mh + 120} style={{ position: "absolute", inset: 0 }}>
          {TOPO_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke="#a9b8dc" strokeWidth={p.major ? 2.4 : 1.4} opacity={p.major ? 0.85 : 0.6} />
          ))}
        </svg>
        <svg width={mw + 120} height={mh + 120} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={170} cy={980} rx={190} ry={120} fill="#d5ead9" />
          <path d={`M -20 760 L ${mw + 140} 420`} stroke="#fff" strokeWidth={34} />
          <path d={`M 360 -20 L 270 ${mh + 140}`} stroke="#fff" strokeWidth={26} />
          <path d={`M 640 -20 L ${mw + 140} 300`} stroke="#fff" strokeWidth={18} />
          <path d={`M -20 300 L 520 520 L 980 1180`} stroke="#fff" strokeWidth={16} fill="none" />
        </svg>
      </div>
      {/* the competitors: small grey pins */}
      {rivals.map(([x, y, d], i) => {
        const p = sp(t, d - 6, 12, 180);
        return (
          <div key={i} style={{ position: "absolute", left: x - 22, top: y - 54, opacity: Math.min(1, p * 2), scale: `${0.6 + 0.4 * p}` }}>
            <div style={{ width: 44, height: 44, borderRadius: "50% 50% 50% 0", rotate: "-45deg", background: "#7d8498", boxShadow: "0 4px 8px rgba(19,24,43,0.25)" }} />
          </div>
        );
      })}
      {/* your pin: drops when the card lands, then keeps pulsing */}
      <div style={{ position: "absolute", left: 432, top: 400 }}>
        {[0, 1].map((k) =>
          t > 10 ? (
            <div
              key={k}
              style={{
                position: "absolute",
                left: -80,
                top: -40,
                width: 160,
                height: 80,
                borderRadius: "50%",
                border: `5px solid ${C.pin}`,
                scale: `${0.25 + ring(k) * 1.5}`,
                opacity: 0.75 * (1 - ring(k)),
              }}
            />
          ) : null,
        )}
        <div
          style={{
            position: "absolute",
            left: -26,
            top: -10,
            width: 52,
            height: 18,
            borderRadius: "50%",
            background: "rgba(19,24,43,0.3)",
            filter: "blur(3px)",
            scale: `${0.3 + 0.7 * Math.min(1, pinP)}`,
          }}
        />
        <div style={{ position: "absolute", left: -46, top: -118, translate: `0 ${(1 - pinP) * -420}px` }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50% 50% 50% 0",
              rotate: "-45deg",
              background: C.pin,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 20px -6px rgba(19,24,43,0.45)",
            }}
          >
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: C.tinta }} />
          </div>
        </div>
      </div>
      {/* place chip under the pin */}
      <div
        style={{
          position: "absolute",
          left: 222,
          top: 440,
          width: 420,
          padding: "20px 28px",
          borderRadius: 26,
          background: C.blanco,
          boxShadow: "0 3px 8px rgba(19,24,43,0.12), 0 24px 40px -18px rgba(19,24,43,0.45)",
          fontFamily: FONT,
          opacity: Math.min(1, chip * 1.5),
          scale: `${0.8 + 0.2 * chip}`,
          translate: `0 ${(1 - chip) * 30}px`,
          transformOrigin: "50% 0%",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 760, color: C.tinta, letterSpacing: "-0.01em", lineHeight: 1.1 }}>Tu negocio</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontSize: 32, fontWeight: 600, color: C.tinta }}>
          4,9 <Stars n={5} size={28} />
        </div>
        <div style={{ marginTop: 6, fontSize: 30, fontWeight: 700, color: "#1d7a3e" }}>Abierto ahora</div>
      </div>
      <SimTag color="#7d8498" style={{ right: 26, top: 20 }} />
    </div>
  );
};

/* ------------------------------ 02 · post --------------------------------- */
const Heart: React.FC<{ size: number; fill: string; stroke?: string }> = ({ size, fill, stroke = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={1.8} strokeLinejoin="round">
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.1 4.5c2.1 0 3.6 1.2 4.9 3 1.3-1.8 2.8-3 4.9-3 3.2 0 5.5 3.1 4.3 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
  </svg>
);

/** Flat storefront illustration for the post (no real photo). */
const Storefront: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} viewBox="0 0 680 500" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b9c6ff" />
        <stop offset="1" stopColor="#e3e8ff" />
      </linearGradient>
    </defs>
    <rect width="680" height="500" fill="url(#sky)" />
    <circle cx="590" cy="70" r="34" fill="#ffd27a" />
    <rect x="36" y="58" width="608" height="420" fill="#eceee6" />
    <rect x="28" y="50" width="624" height="30" rx="4" fill={C.tinta} />
    <rect x="160" y="98" width="360" height="62" rx="12" fill={C.tinta} />
    <text x="340" y="141" textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize="36" letterSpacing="5" fill={C.papel}>
      TU NEGOCIO
    </text>
    {/* awning */}
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={50 + i * 41.4} y="176" width="41.4" height="46" fill={i % 2 ? C.blanco : C.pin} />
    ))}
    <path
      d={`M50 222 ${Array.from({ length: 14 })
        .map((_, i) => `Q ${50 + i * 41.4 + 20.7} 246 ${50 + (i + 1) * 41.4} 222`)
        .join(" ")} Z`}
      fill={C.pin}
    />
    <rect x="50" y="170" width="580" height="10" fill="#d4461a" />
    <rect x="60" y="246" width="560" height="10" fill="rgba(19,24,43,0.12)" />
    {/* shop window with shelves */}
    <rect x="72" y="262" width="330" height="190" rx="6" fill={C.tinta} />
    <rect x="80" y="270" width="314" height="174" fill="#cdd8f6" />
    {[318, 368, 418].map((y, r) => (
      <g key={y}>
        <rect x="80" y={y} width="314" height="6" fill="#4a5168" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={i}
            x={88 + i * 34}
            y={y - 30 - ((i + r) % 3) * 6}
            width="24"
            height={30 + ((i + r) % 3) * 6}
            rx="3"
            fill={[C.cobalto, C.estrella, "#1f7a3e", C.pin, "#9fb0d8"][(i + r * 2) % 5]}
          />
        ))}
      </g>
    ))}
    <path d="M80 270 L200 270 L110 444 L80 444 Z" fill="#fff" opacity="0.28" />
    {/* door */}
    <rect x="432" y="262" width="168" height="216" rx="6" fill={C.tinta} />
    <rect x="450" y="280" width="132" height="120" rx="4" fill="#9fb0d8" />
    <path d="M450 280 L520 280 L470 400 L450 400 Z" fill="#fff" opacity="0.25" />
    <rect x="468" y="316" width="96" height="34" rx="6" fill="#1f7a3e" />
    <text x="516" y="340" textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize="17" letterSpacing="1.5" fill="#fff">
      ABIERTO
    </text>
    <rect x="566" y="410" width="8" height="34" rx="4" fill="#c9ced8" />
    {/* sidewalk + plant */}
    <rect x="0" y="476" width="680" height="24" fill="#c9ced8" />
    <rect x="612" y="436" width="44" height="42" rx="6" fill="#b5532d" />
    <circle cx="622" cy="424" r="18" fill="#2f8f50" />
    <circle cx="644" cy="418" r="20" fill="#1f7a3e" />
    <circle cx="634" cy="400" r="16" fill="#38a35d" />
  </svg>
);

const PostCard: React.FC<{ pw: number; t: number; second?: boolean }> = ({ pw, t, second }) => {
  const ih = second ? 420 : 470;
  const likes = Math.round(ip(t, [6, 44], [1187, 1248], eo));
  const liked = !second && t >= 9;
  const beatK = second ? 0 : ip(t, [9, 11, 18], [0, 1, 0]);
  const burst = second ? 0 : ip(t, [7, 10, 22, 30], [0, 1, 1, 0]);
  const burstS = ip(t, [7, 11, 14], [0.2, 1.15, 1], eo);
  const follow = t >= 20;
  const floaters = second
    ? []
    : [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
        const s0 = 12 + k * 6;
        const q = ip(t, [s0, s0 + 26], [0, 1]);
        return { k, q, on: t >= s0 && q < 1 };
      });
  return (
    <div style={{ borderRadius: 30, background: C.blanco, overflow: "hidden", boxShadow: "0 30px 60px -24px rgba(4,8,30,0.7)", marginBottom: 30 }}>
      <div style={{ height: 90, display: "flex", alignItems: "center", gap: 16, padding: "0 26px" }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: C.pin,
            boxShadow: `0 0 0 3px ${C.blanco}, 0 0 0 6px ${C.pin}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
            color: C.tinta,
          }}
        >
          TN
        </div>
        <span style={{ fontSize: 32, fontWeight: 700, color: C.tinta }}>Tu negocio</span>
        {!second ? (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 27,
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: 12,
              background: follow ? "#eef0f5" : C.cobalto,
              color: follow ? C.tinta : C.blanco,
            }}
          >
            {follow ? "Siguiendo" : "Seguir"}
          </span>
        ) : null}
      </div>
      <div style={{ position: "relative", width: pw, height: ih, overflow: "hidden" }}>
        <div style={{ scale: `${1.02 + Math.max(0, t) * 0.0011}`, transformOrigin: "50% 70%" }}>
          {second ? <Thumb kind="interior" w={pw} h={ih} /> : <Storefront w={pw} h={ih} />}
        </div>
        {burst > 0 ? (
          <div
            style={{
              position: "absolute",
              left: pw / 2 - 95,
              top: ih / 2 - 95,
              opacity: burst,
              scale: `${burstS}`,
              filter: "drop-shadow(0 10px 24px rgba(19,24,43,0.45))",
            }}
          >
            <Heart size={190} fill={C.blanco} />
          </div>
        ) : null}
      </div>
      <div style={{ height: 80, display: "flex", alignItems: "center", gap: 28, padding: "0 26px" }}>
        <div style={{ scale: `${1 + 0.3 * beatK}`, position: "relative" }}>
          <Heart size={48} fill={liked ? C.pin : "none"} stroke={liked ? C.pin : C.tinta} />
          {floaters.map(({ k, q, on }) =>
            on ? (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 8 + Math.sin(k * 2.1 + q * 4) * 20,
                  top: -q * 250,
                  opacity: (1 - q) * 0.95,
                  scale: `${0.6 + 0.6 * q}`,
                }}
              >
                <Heart size={32} fill={k % 3 === 0 ? C.estrella : C.pin} />
              </div>
            ) : null,
          )}
        </div>
        <Icon name="chat" size={44} color={C.tinta} strokeWidth={2} />
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={C.tinta} strokeWidth={2} strokeLinejoin="round">
          <path d="M21 3L3 10.5l7 2.5 2.5 7z M10 13l5-5" />
        </svg>
      </div>
      {!second ? (
        <div style={{ padding: "0 28px 28px", fontSize: 31, color: C.tinta }}>
          <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmtAR(likes)}</span> Me gusta
        </div>
      ) : null}
    </div>
  );
};

/** A feed that keeps scrolling: the liked post on top, the next one coming up from below. */
const PostVisual: React.FC<{ t: number }> = ({ t }) => {
  const pw = 700;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: PEEK, bottom: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: (W - pw) / 2, top: 48, width: pw, fontFamily: FONT, translate: `0 ${-Math.max(0, t) * 1.1}px` }}>
        <PostCard pw={pw} t={t} />
        <PostCard pw={pw} t={t} second />
      </div>
      <SimTag color={C.cobaltoClaro} style={{ right: 106, top: 8 }} />
    </div>
  );
};

/* ------------------------------ 03 · web ---------------------------------- */
const WebVisual: React.FC<{ t: number; h: number }> = ({ t, h }) => {
  const bw = 720;
  const tap = 24;
  const scroll = Math.max(0, t) * 0.9;
  const press = ip(t, [tap - 2, tap, tap + 4], [0, 1, 0]);
  const fingerO = ip(t, [tap - 12, tap - 8, tap + 6, tap + 10], [0, 1, 1, 0]);
  const fingerY = ip(t, [tap - 12, tap - 2], [160, 0], eo);
  const ripple = ip(t, [tap, tap + 12], [0, 1]);
  const bubble = sp(t, tap + 6, 12, 190);
  const typing = t > tap + 16;
  const dotsK = (k: number) => 0.35 + 0.65 * Math.max(0, Math.sin((t - k * 4) / 3));
  const winH = h - PEEK - 40;
  const btnTop = 54 + 250 + 176; // inside the page, before scrolling
  return (
    <div style={{ position: "absolute", left: (W - bw) / 2 - 30, top: PEEK + 40, width: bw, height: winH, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.blanco, overflow: "hidden", boxShadow: "0 30px 60px -24px rgba(0,0,0,0.75)" }}>
        {/* page (scrolls slowly under the browser chrome) */}
        <div style={{ position: "absolute", left: 0, top: 54, width: bw, translate: `0 ${-scroll}px` }}>
          <div style={{ position: "relative", height: 250, overflow: "hidden" }}>
            <div style={{ scale: `${1.03 + Math.max(0, t) * 0.001}` }}>
              <Thumb kind="interior" w={bw + 40} h={250} />
            </div>
          </div>
          <div style={{ padding: "26px 36px 0", height: 176, boxSizing: "border-box" }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.tinta, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Tu negocio</div>
            <div style={{ marginTop: 10, fontSize: 30, color: C.tinta2 }}>Lo que buscás, cerca tuyo.</div>
            <div style={{ marginTop: 6, fontSize: 29, fontWeight: 700, color: "#1d7a3e" }}>Abierto ahora</div>
          </div>
          <div style={{ padding: "0 36px", position: "relative" }}>
            <div
              style={{
                height: 96,
                borderRadius: 48,
                background: WA,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                scale: `${1 - 0.06 * press}`,
                filter: press > 0 ? `brightness(${1 + 0.15 * press})` : undefined,
                boxShadow: "0 12px 24px -12px rgba(31,157,85,0.8)",
              }}
            >
              <Icon name="chat" size={42} color={C.blanco} strokeWidth={2.4} />
              <span style={{ fontSize: 36, fontWeight: 760, color: C.blanco }}>Consultá por WhatsApp</span>
            </div>
            {fingerO > 0 ? (
              <div style={{ position: "absolute", left: bw / 2 + 70 - 46, top: 2 + fingerY, width: 92, height: 92, opacity: fingerO }}>
                {ripple > 0 && ripple < 1 ? (
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "6px solid rgba(255,255,255,0.95)", scale: `${0.5 + ripple * 2.2}`, opacity: 1 - ripple }} />
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.42)",
                    border: "4px solid rgba(255,255,255,0.95)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                    scale: `${1 - press * 0.18}`,
                  }}
                />
              </div>
            ) : null}
          </div>
          {/* more page below the fold */}
          <div style={{ padding: "40px 36px 0", display: "flex", gap: 24 }}>
            <div style={{ flex: 1, borderRadius: 20, background: "#f2f4f8", padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 30, fontWeight: 700, color: C.tinta }}>
                <Icon name="reloj" size={32} color={C.cobalto} strokeWidth={2.2} /> Horarios
              </div>
              <div style={{ marginTop: 12, fontSize: 26, color: C.tinta2, lineHeight: 1.45 }}>
                Lun. a vie. 8 a 20 h<br />Sáb. 8 a 13 h
              </div>
            </div>
            <div style={{ flex: 1, borderRadius: 20, background: "#e6ebf3", position: "relative", overflow: "hidden" }}>
              <svg width="100%" height="100%" viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
                <path d="M-10 120 L310 60" stroke="#fff" strokeWidth="14" />
                <path d="M120 -10 L90 180" stroke="#fff" strokeWidth="10" />
                <path d="M150 52 c0-16 26-16 26 0 c0 12-13 24-13 24 s-13-12-13-24z" fill={C.pin} />
                <circle cx="163" cy="52" r="5" fill={C.tinta} />
              </svg>
              <div style={{ position: "absolute", left: 18, bottom: 14, fontSize: 26, fontWeight: 700, color: C.tinta }}>Cómo llegar</div>
            </div>
          </div>
          <div style={{ padding: "30px 36px 0", display: "flex", gap: 18 }}>
            {(["fachada", "interior", "bolsa"] as const).map((k) => (
              <div key={k} style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}>
                <Thumb kind={k} w={(bw - 72 - 36) / 3} h={150} />
              </div>
            ))}
          </div>
        </div>
        {/* browser chrome (sticky) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: bw, height: 54, background: "#e9ebf1", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", boxSizing: "border-box" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: "#c9ced8" }} />
          ))}
          <div style={{ marginLeft: 14, flex: 1, height: 32, borderRadius: 16, background: C.blanco, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a90a3" strokeWidth={2.4} strokeLinecap="round">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span style={{ width: 230, height: 12, borderRadius: 6, background: "#dfe2ea" }} />
          </div>
        </div>
      </div>
      {/* the message arrives: chat preview floating over the page */}
      {bubble > 0.01 ? (
        <div
          style={{
            position: "absolute",
            right: -54,
            top: btnTop + 150,
            padding: "22px 30px",
            borderRadius: "28px 28px 6px 28px",
            background: "#dcf8c6",
            boxShadow: "0 22px 44px -16px rgba(0,0,0,0.7)",
            opacity: Math.min(1, bubble * 2),
            scale: `${0.6 + 0.4 * bubble}`,
            transformOrigin: "85% 0%",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 600, color: C.tinta }}>Hola, ¿tienen stock?</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, fontSize: 24, color: "#5d7a5f" }}>
            ahora
            <svg width="30" height="18" viewBox="0 0 30 18" fill="none" stroke="#3a9bd8" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9l5 5L17 3M12 14L22 3" />
            </svg>
          </div>
          {typing ? (
            <div style={{ position: "absolute", left: -30, top: "calc(100% + 18px)", display: "flex", gap: 9, padding: "18px 22px", borderRadius: "24px 24px 24px 6px", background: C.blanco, boxShadow: "0 16px 30px -14px rgba(0,0,0,0.6)" }}>
              {[0, 1, 2].map((k) => (
                <span key={k} style={{ width: 14, height: 14, borderRadius: "50%", background: "#8a90a3", opacity: dotsK(k) }} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <SimTag color="#8a90a3" style={{ right: 6, top: -38 }} />
    </div>
  );
};

/* ------------------------------- card ------------------------------------- */
export const ServiceCards: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.cards[0] - 10 || f > T.calm + 6) return null;
  return (
    <AbsoluteFill>
      {SVCS.map((s, i) => {
        if (f < s.at - 8) return null;
        const t = f - s.at;
        const top = TOP0 + i * PEEK;
        const pIn = ip(f, [s.at - 7, s.at + 6], [0, 1], eo);
        const pPrev = ip(f - 1, [s.at - 7, s.at + 6], [0, 1], eo);
        const vx = Math.abs(pIn - pPrev) * 1000;
        const mb = Math.min(28, vx * 0.22);
        const mbId = `mbx-${i}-${f}`;
        const out = ip(f, [T.calm - 10 + i * 2, T.calm + 2 + i * 2], [0, 1], ei);
        const x = (1 - pIn) * 1000;
        const rot = (1 - pIn) * 9 + out * (i % 2 ? 7 : -7);
        // secondary motion: a slow 3 px float, out of phase per card
        const float = Math.sin(t / 15 + i * 1.9) * 3 * pIn * (1 - out);
        const y = top + float + out * 1500;
        const pu = punch(f, s.at + 1, 1.025, 9);
        const markAt = s.at + 5;
        const markP = ip(f, [markAt, markAt + 5], [0, 1], eo);
        const markPunch = 1 + 0.08 * ip(f, [markAt, markAt + 2, markAt + 9], [0, 1, 0]);
        const tileBob = Math.sin(t / 7) * 3 * Math.min(1, Math.max(0, t / 10));
        const H = 1920 - top + 200;
        return (
          <React.Fragment key={s.n}>
            {mb > 0.8 ? (
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <filter id={mbId} x="-20%" y="0" width="140%" height="100%">
                  <feGaussianBlur stdDeviation={`${mb} 0`} />
                </filter>
              </svg>
            ) : null}
            <div
              style={{
                position: "absolute",
                filter: mb > 0.8 ? `url(#${mbId})` : undefined,
                left: LEFT,
                top: y,
                width: W,
                height: H,
                translate: `${x}px 0`,
                rotate: `${rot}deg`,
                scale: `${pu}`,
                transformOrigin: "50% 0%",
                borderRadius: 34,
                background: s.bg,
                overflow: "hidden",
                boxShadow: `0 -16px 36px -12px ${s.shadow}, 0 2px 6px rgba(19,24,43,0.12)`,
                fontFamily: FONT,
              }}
            >
              {s.bg === C.blanco ? (
                <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
                  <Topo color={C.cobalto} opacity={0.14} scale={0.55} rotate={0} drift={4} strokeWidth={1.4} />
                </div>
              ) : null}
              {/* body visual */}
              {i === 0 ? <MapVisual t={t} h={H} /> : i === 1 ? <PostVisual t={t} /> : <WebVisual t={t} h={H} />}
              {/* header */}
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  top: 36,
                  width: 96,
                  height: 96,
                  borderRadius: 26,
                  background: s.tileBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  rotate: `${ip(f, [s.at - 2, s.at + 10], [-25, 0], back)}deg`,
                  translate: `0 ${tileBob}px`,
                }}
              >
                <Icon name={s.icon} size={56} color={s.tileFg} strokeWidth={2.1} />
              </div>
              <span
                style={{
                  position: "absolute",
                  left: 156,
                  top: 22,
                  fontWeight: 700,
                  fontStretch: "110%",
                  fontSize: 40,
                  letterSpacing: "0.005em",
                  color: s.kickerC,
                }}
              >
                {s.kicker}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: 38,
                  top: 26,
                  fontWeight: 600,
                  fontSize: 38,
                  color: s.numC,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.n}
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 156,
                  top: 70,
                  fontWeight: 820,
                  fontStretch: `${ip(f, [s.at - 3, s.at + 12], [78, 102], eo)}%`,
                  fontSize: 68,
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                  color: s.fg,
                  whiteSpace: "nowrap",
                }}
              >
                {s.lead}{" "}
                <span style={{ position: "relative", display: "inline-block", scale: `${markPunch}`, color: markP > 0.5 ? C.tinta : s.fg }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "-0.08em",
                      right: "-0.08em",
                      top: "0.04em",
                      bottom: "-0.04em",
                      background: C.pin,
                      borderRadius: "0.1em",
                      transformOrigin: "left center",
                      scale: `${markP} 1`,
                      zIndex: -1,
                    }}
                  />
                  <span style={{ position: "relative" }}>{s.verb}</span>
                </span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
