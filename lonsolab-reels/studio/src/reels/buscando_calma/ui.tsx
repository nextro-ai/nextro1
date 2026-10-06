import React from "react";
import { FONT, Icon } from "../../brand";
import { TOPO_PATHS } from "../../brand/topoPaths";
import { SCREEN } from "./Device";
import { BLACK, WHITE, accentEdge, alpha, mix, shadow, useTheme } from "./theme";
import { T } from "./timing";

/* ------------------------------------------------------------------------ */
/* Generic, brand-neutral "maps search" UI (not a copy of any real app).    */
/* Screen coordinates (804 x 1724), drawn 1:1 on the canvas: every text that */
/* has to be read is ≥ 44 px.                                                */
/* ------------------------------------------------------------------------ */

export const UI = {
  side: 28,
  searchTop: 92,
  searchH: 108,
  listTop: 222,
  itemH: 140,
  hoyTuH: 160,
  hoyMapTop: 700,
  hoyMapH: 430,
  kbTop: 650,
  conTuH: 420,
  conMapTop: 960,
  conMapH: 380,
} as const;

export const SEARCH_TEXT = "ferretería cerca de mí";
const CHAR_EVERY = 3;
export const typedCount = (f: number) =>
  Math.max(0, Math.min(SEARCH_TEXT.length, Math.floor((f - T.typeStart) / CHAR_EVERY) + 1));
export const typedAt = (i: number) => T.typeStart + i * CHAR_EVERY;

export const font = (size: number, weight = 400, color?: string, stretch = 100): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: weight,
  fontStretch: `${stretch}%`,
  color,
  lineHeight: 1.12,
  whiteSpace: "nowrap",
});

/* ---------------------------- Search bar ---------------------------- */
export const SearchBar: React.FC<{ text: string; cursor: boolean; pressed?: number; highlight?: string }> = ({
  text,
  cursor,
  pressed = 0,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: UI.side,
        right: UI.side,
        top: UI.searchTop,
        height: UI.searchH,
        borderRadius: UI.searchH / 2,
        background: mix(t.bg2, t.surface, 0.25),
        display: "flex",
        alignItems: "center",
        padding: "0 36px",
        gap: 22,
        scale: `${1 - pressed * 0.025}`,
        zIndex: 12,
      }}
    >
      <Icon name="buscar" size={46} color={t.ink2} strokeWidth={2.2} />
      <span style={{ ...font(48, 460, t.ink), letterSpacing: "-0.01em" }}>{text}</span>
      <span style={{ width: 4, height: 52, marginLeft: -18, background: t.ink, opacity: cursor ? 1 : 0, borderRadius: 2 }} />
    </div>
  );
};

/* ------------------------------ Stars ------------------------------ */
export const Stars: React.FC<{ n: number; size: number }> = ({ n, size }) => {
  const t = useTheme();
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="estrella" size={size} color={i < n ? t.star : t.line} fill={i < n ? t.star : t.line} strokeWidth={1} />
      ))}
    </span>
  );
};

const RoundBtn: React.FC<{ icon: "tel" | "ruta"; filled?: boolean; size?: number }> = ({ icon, filled, size = 84 }) => {
  const t = useTheme();
  const edge = accentEdge(t);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: filled ? (edge ? `2px solid ${edge}` : "none") : `2px solid ${t.line}`,
        background: filled ? t.accent : t.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={size * 0.46} color={filled ? t.onAccent : t.ink2} strokeWidth={2.1} />
    </div>
  );
};

/* ------------------------------ Results ---------------------------- */
export type Rival = { name: string; rating: string; stars: number; count: string; initials: string };
export const RIVALS: Rival[] = [
  { name: "Ferretería Central", rating: "4,8", stars: 5, count: "(212)", initials: "FC" },
  { name: "Corralón del Sur", rating: "4,4", stars: 4, count: "(98)", initials: "CS" },
];

export const ResultItem: React.FC<{ r: Rival; top: number; pressed?: number; style?: React.CSSProperties }> = ({
  r,
  top,
  pressed = 0,
  style,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: SCREEN.w,
        top,
        height: UI.itemH,
        background: pressed > 0 ? alpha(t.ink, 0.07 * pressed) : "transparent",
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 40, top: 20, ...font(50, 700, t.ink), letterSpacing: "-0.01em" }}>{r.name}</div>
      <div style={{ position: "absolute", left: 40, top: 80, display: "flex", alignItems: "center", gap: 12, ...font(44, 450, t.ink2) }}>
        <span>{r.rating}</span>
        <Stars n={r.stars} size={36} />
        <span>{r.count}</span>
      </div>
      <div style={{ position: "absolute", right: 32, top: 28, display: "flex", gap: 14 }}>
        <RoundBtn icon="tel" />
        <RoundBtn icon="ruta" />
      </div>
      <div style={{ position: "absolute", left: 40, right: 0, bottom: 0, height: 2, background: mix(t.line, t.surface, 0.4) }} />
    </div>
  );
};

/** Picture-with-a-slash ("no photos") line icon. */
export const NoPhotoIcon: React.FC<{ size: number; color: string; gap: string }> = ({ size, color, gap }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17.5l4.6-4.4 3.2 3 2.6-2.4 5.6 4.8" />
    <path d="M3 3.5l18 17" stroke={gap} strokeWidth={4.4} />
    <path d="M3 3.5l18 17" />
  </svg>
);

/** Filled "!" alert dot. */
export const AlertIcon: React.FC<{ size: number; color: string; fg: string }> = ({ size, color, fg }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10.5" fill={color} />
    <path d="M12 6.5v7" stroke={fg} strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="12" cy="17.3" r="1.5" fill={fg} />
  </svg>
);

/** Two empty grey bars where the rating and the hours should be: "missing info" without words. */
export const MissingInfo: React.FC<{ top: number; opacity?: number }> = ({ top, opacity = 1 }) => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: 40, top, display: "flex", gap: 16, opacity }}>
      <div style={{ width: 210, height: 30, borderRadius: 15, background: mix(t.line, t.ink2, 0.1) }} />
      <div style={{ width: 150, height: 30, borderRadius: 15, background: mix(t.line, t.ink2, 0.1) }} />
    </div>
  );
};

/** "Tu negocio" today, in the list: grey, no photo, missing info. */
export const HoyTuItem: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const t = useTheme();
  const bg = mix(t.surface, t.bg2, 0.75);
  return (
    <div style={{ position: "absolute", left: 0, width: SCREEN.w, height: UI.hoyTuH, background: bg, ...style }}>
      <div style={{ position: "absolute", left: 40, top: 24, ...font(50, 700, t.ink2) }}>Tu negocio</div>
      <MissingInfo top={96} />
      <div
        style={{
          position: "absolute",
          right: 36,
          top: 22,
          width: 116,
          height: 116,
          borderRadius: 20,
          border: `3px dashed ${t.line}`,
          background: mix(bg, t.surface, 0.5),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NoPhotoIcon size={54} color={mix(t.ink2, t.surface, 0.35)} gap={mix(bg, t.surface, 0.5)} />
      </div>
    </div>
  );
};

/* ------------------------------ Map -------------------------------- */
export type MapPin = { x: number; y: number; kind: "rival" | "ghost" | "you"; label?: string; k: number };

const PinShape: React.FC<{ kind: MapPin["kind"]; size: number; label?: string }> = ({ kind, size, label }) => {
  const t = useTheme();
  const bg = kind === "you" ? t.accent : kind === "rival" ? t.ink : "transparent";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50% 50% 50% 0",
        rotate: "-45deg",
        background: bg,
        border: kind === "ghost" ? `4px dashed ${mix(t.ink2, t.map, 0.3)}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          kind === "ghost"
            ? "none"
            : `${kind === "you" && accentEdge(t) ? `inset 0 0 0 3px ${accentEdge(t)}, ` : ""}0 6px 12px ${alpha(t.ink, 0.25)}`,
      }}
    >
      {label ? (
        <span style={{ rotate: "45deg", ...font(size * 0.46, 800, t.onDark) }}>{label}</span>
      ) : kind === "you" ? (
        <span style={{ width: size * 0.34, height: size * 0.34, borderRadius: "50%", background: t.onAccent }} />
      ) : null}
    </div>
  );
};

export const MapView: React.FC<{ top: number; height: number; pins: MapPin[]; ring?: number }> = ({ top, height, pins, ring = -1 }) => {
  const t = useTheme();
  const w = SCREEN.w - UI.side * 2;
  return (
    <div style={{ position: "absolute", left: UI.side, top, width: w, height, borderRadius: 32, overflow: "hidden", background: t.map }}>
      <svg viewBox="560 240 640 340" preserveAspectRatio="xMidYMid slice" width={w} height={height} style={{ position: "absolute", inset: 0 }}>
        {TOPO_PATHS.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke={mix(t.map, t.topo, 0.28)} strokeWidth={p.major ? 2.2 : 1.3} opacity={p.major ? 0.9 : 0.6} />
        ))}
      </svg>
      <svg width={w} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M -20 ${height * 0.74} L ${w + 20} ${height * 0.42}`} stroke={t.mapRoad} strokeWidth={24} />
        <path d={`M ${w * 0.36} -20 L ${w * 0.28} ${height + 20}`} stroke={t.mapRoad} strokeWidth={18} />
        <path d={`M ${w * 0.64} -20 L ${w + 20} ${height * 0.3}`} stroke={t.mapRoad} strokeWidth={14} />
      </svg>
      {pins.map((p, i) => {
        if (p.k <= 0.001) return null;
        const size = p.kind === "you" ? 76 : 60;
        return (
          <div key={i} style={{ position: "absolute", left: p.x - size / 2, top: p.y - size * 1.25 }}>
            <div
              style={{
                position: "absolute",
                left: size * 0.12,
                top: size * 1.15,
                width: size * 0.76,
                height: size * 0.22,
                borderRadius: "50%",
                background: p.kind === "ghost" ? "transparent" : alpha(t.ink, 0.22),
                scale: `${p.k}`,
              }}
            />
            {p.kind === "you" && ring >= 0 && ring < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: size / 2 - 70,
                  top: size * 1.25 - 70,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  border: `5px solid ${t.accent}`,
                  scale: `${0.3 + ring * 1.2}`,
                  opacity: 0.8 * (1 - ring),
                }}
              />
            ) : null}
            <div style={{ opacity: Math.min(1, p.k * 1.5), translate: `0 ${(1 - p.k) * -60}px` }}>
              <PinShape kind={p.kind} size={size} label={p.label} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------ Keyboard --------------------------- */
const ROWS = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];
export const Keyboard: React.FC<{ y: number; activeKey: string | null; searchPress?: number }> = ({ y, activeKey, searchPress = 0 }) => {
  const t = useTheme();
  const kw = 70;
  const kh = 92;
  const gap = 8;
  const keyBg = t.surface;
  const key = (on: boolean): React.CSSProperties => ({
    height: kh,
    borderRadius: 12,
    background: on ? mix(t.line, t.ink2, 0.25) : keyBg,
    boxShadow: `0 2px 0 ${alpha(t.ink, 0.2)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: UI.kbTop,
        width: SCREEN.w,
        height: 560,
        background: mix(t.bg2, t.ink2, 0.12),
        translate: `0 ${y}px`,
        zIndex: 14,
      }}
    >
      {ROWS.map((row, r) => (
        <div key={r} style={{ position: "absolute", top: 22 + r * (kh + 18), left: 0, right: 0, display: "flex", justifyContent: "center", gap }}>
          {row.split("").map((k) => (
            <div key={k} style={{ ...key(activeKey === k), width: kw, ...font(38, 400, t.ink) }}>
              {k}
            </div>
          ))}
        </div>
      ))}
      <div style={{ position: "absolute", top: 22 + 3 * (kh + 18), left: 0, right: 0, display: "flex", justifyContent: "center", gap }}>
        <div style={{ ...key(false), width: 150, background: mix(t.bg2, t.ink2, 0.28) }} />
        <div style={{ ...key(activeKey === " "), width: 370 }} />
        <div
          style={{
            ...key(false),
            width: 190,
            background: t.ink,
            scale: `${1 - 0.06 * searchPress}`,
            ...font(32, 700, t.surface),
          }}
        >
          Buscar
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- Call screen -------------------------- */
const CallIcon: React.FC<{ kind: "mute" | "keypad" | "speaker"; size: number; color: string }> = ({ kind, size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {kind === "mute" ? (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
        <path d="M4 3.5l16 17" />
      </>
    ) : kind === "keypad" ? (
      <>
        {[6, 12, 18].map((x) => [5, 11, 17].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={color} stroke="none" />))}
        <circle cx="12" cy="22" r="1.5" fill={color} stroke="none" />
      </>
    ) : (
      <>
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" />
      </>
    )}
  </svg>
);

/** Outgoing call to a competitor. `slide` 0..1 brings it up over the list (opaque, no double text). */
export const CallScreen: React.FC<{ t0: number; slide: number; name: string; initials: string }> = ({ t0, slide, name, initials }) => {
  const t = useTheme();
  const dots = ".".repeat(1 + (Math.floor(Math.max(0, t0) / 12) % 3));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${mix(t.ink, t.surface, 0.1)} 0%, ${t.ink} 50%, ${mix(t.ink, BLACK, 0.35)} 100%)`,
        translate: `0 ${(1 - slide) * 102}%`,
        borderRadius: (1 - slide) * 60,
        zIndex: 30,
      }}
    >
      <div style={{ position: "absolute", top: 168, width: "100%", textAlign: "center", ...font(46, 500, t.onDark2) }}>
        Llamando<span style={{ display: "inline-block", width: 40, textAlign: "left" }}>{dots}</span>
      </div>
      <div style={{ position: "absolute", top: 236, width: "100%", textAlign: "center", ...font(66, 760, t.onDark), letterSpacing: "-0.01em" }}>
        {name}
      </div>
      <div style={{ position: "absolute", top: 370, left: SCREEN.w / 2 - 115, width: 230, height: 230 }}>
        {[0, 1].map((k) => {
          const rt = ((((t0 + k * 24) % 48) + 48) % 48) / 48;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `3px solid ${alpha(t.onDark, 0.5)}`,
                scale: `${1 + rt * 0.55}`,
                opacity: t0 > 0 ? 0.7 * (1 - rt) : 0,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: mix(t.ink, t.onDark, 0.22),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...font(88, 700, t.onDark, 110),
          }}
        >
          {initials}
        </div>
      </div>
      <div style={{ position: "absolute", top: 800, width: "100%", display: "flex", justifyContent: "center", gap: 70 }}>
        {(["mute", "keypad", "speaker"] as const).map((k) => (
          <div key={k} style={{ width: 132, height: 132, borderRadius: "50%", background: alpha(t.onDark, 0.13), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CallIcon kind={k} size={58} color={t.onDark} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1030, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 150, height: 150, borderRadius: "50%", background: t.warn, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="tel" size={64} color={t.onDark} strokeWidth={2.2} style={{ rotate: "135deg" }} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Finger ----------------------------- */
export const Finger: React.FC<{ x: number; y: number; opacity: number; press: number; ripple: number }> = ({ x, y, opacity, press, ripple }) => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: x - 52, top: y - 52, width: 104, height: 104, opacity, zIndex: 25 }}>
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: alpha(t.ink, 0.22),
            scale: `${0.4 + ripple * 1.6}`,
            opacity: 0.9 * (1 - ripple),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: alpha(t.ink, 0.24),
          border: `4px solid ${alpha(WHITE, 0.95)}`,
          boxShadow: `0 6px 16px ${alpha(t.ink, 0.28)}`,
          scale: `${1 - press * 0.16}`,
        }}
      />
    </div>
  );
};

/* ------------------- Little illustrated "photos" ------------------- */
export const Thumb: React.FC<{ kind: "fachada" | "interior" | "herramientas"; w: number; h: number }> = ({ kind, w, h }) => {
  const t = useTheme();
  return (
    <svg width={w} height={h} viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" style={{ borderRadius: 16, display: "block" }}>
      {kind === "fachada" ? (
        <>
          <rect width="200" height="100" fill={mix(t.map, t.topo, 0.12)} />
          <rect x="22" y="32" width="156" height="68" fill={t.bg} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={18 + i * 20.5} y="24" width="20.5" height="22" fill={i % 2 ? t.surface : t.accent} />
          ))}
          <rect x="40" y="58" width="44" height="42" fill={t.ink} opacity="0.85" />
          <rect x="100" y="58" width="60" height="28" fill={mix(t.map, t.ink2, 0.3)} />
          <rect x="70" y="8" width="60" height="14" rx="3" fill={t.ink} />
        </>
      ) : kind === "interior" ? (
        <>
          <rect width="200" height="100" fill={t.bg2} />
          {[26, 56, 86].map((y, r) => (
            <g key={y}>
              <rect x="8" y={y} width="184" height="5" fill={t.ink2} />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <rect
                  key={i}
                  x={14 + i * 26}
                  y={y - 16 - ((i + r) % 3) * 3}
                  width="18"
                  height={16 + ((i + r) % 3) * 3}
                  rx="2"
                  fill={[t.ink2, t.accent, t.line, t.star, mix(t.ink2, t.surface, 0.5)][(i + r * 2) % 5]}
                />
              ))}
            </g>
          ))}
        </>
      ) : (
        <>
          <rect width="200" height="100" fill={t.ink} />
          <g fill="none" stroke={t.surface} strokeWidth="9" strokeLinecap="round">
            <path d="M40 82 L92 30" />
            <path d="M150 18 L108 82" stroke={t.star} />
          </g>
          <rect x="80" y="16" width="34" height="18" rx="4" fill={t.surface} transform="rotate(-45 97 25)" />
          <circle cx="150" cy="20" r="13" fill="none" stroke={t.star} strokeWidth="8" />
        </>
      )}
    </svg>
  );
};

/** "Tu negocio" with Lonso Lab: first result, complete profile. */
export const ConTuCard: React.FC<{ style?: React.CSSProperties; glow?: number }> = ({ style, glow = 0 }) => {
  const t = useTheme();
  const inner = SCREEN.w - 28 - 64;
  const tw = (inner - 28) / 3;
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        width: SCREEN.w - 28,
        height: UI.conTuH,
        background: t.surface,
        border: `4px solid ${t.accent}`,
        borderRadius: 30,
        // light accents (marino, bosque) get a thin darker edge outside the accent border
        boxShadow: `${accentEdge(t) ? `0 0 0 2px ${accentEdge(t)}, ` : ""}${shadow(t, 0.8)}, 0 0 0 ${glow * 14}px ${alpha(t.accent, 0.25 * glow)}`,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 32, top: 22, ...font(54, 760, t.ink), letterSpacing: "-0.01em" }}>Tu negocio</div>
      <div style={{ position: "absolute", left: 32, top: 96, display: "flex", alignItems: "center", gap: 12, ...font(46, 700, t.ink) }}>
        <span>4,9</span>
        <Stars n={5} size={40} />
        <span style={{ fontWeight: 450, color: t.ink2 }}>(96)</span>
      </div>
      <div style={{ position: "absolute", left: 32, top: 162, display: "flex", alignItems: "center", gap: 12, ...font(44, 700, t.ok) }}>
        <Icon name="check" size={42} color={t.ok} strokeWidth={2.8} />
        Abierto ahora
      </div>
      <div style={{ position: "absolute", left: 32, top: 222, display: "flex", alignItems: "center", gap: 12, ...font(44, 700, t.ok) }}>
        <Icon name="check" size={42} color={t.ok} strokeWidth={2.8} />
        Reseñas respondidas
      </div>
      <div style={{ position: "absolute", right: 28, top: 26, display: "flex", gap: 14 }}>
        <RoundBtn icon="tel" filled size={92} />
        <RoundBtn icon="ruta" size={92} />
      </div>
      <div style={{ position: "absolute", left: 32, top: 292, display: "flex", gap: 14 }}>
        <Thumb kind="fachada" w={tw} h={100} />
        <Thumb kind="interior" w={tw} h={100} />
        <Thumb kind="herramientas" w={tw} h={100} />
      </div>
    </div>
  );
};
