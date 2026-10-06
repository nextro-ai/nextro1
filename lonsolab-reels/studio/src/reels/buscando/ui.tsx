import React from "react";
import { C, FONT, Icon } from "../../brand";
import { TOPO_PATHS } from "../../brand/topoPaths";
import { SCREEN } from "./Device";
import { ip, rnd, sp, eo, io } from "./timing";

/* ------------------------------------------------------------------ */
/* Generic, brand-neutral "maps search" UI (not a copy of Google's).   */
/* Everything is in screen coordinates (716 x 1516).                   */
/* ------------------------------------------------------------------ */

export const UI = {
  searchTop: 104,
  searchH: 92,
  mapTop: 212,
  mapH: 232,
  listTop: 458,
  itemH: 178,
  hoyTuH: 262,
  conMapH: 190,
  conListTop: 414,
  conTuH: 344,
  side: 26,
} as const;

export const SEARCH_TEXT = "ferretería cerca de mí";
export const ALERT_RED = "#b42318";
export const OK_GREEN = "#1d7a3e";
export const CALL_GREEN = "#22a35a";

const font = (size: number, weight = 400, color: string = C.tinta, stretch = 100): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: weight,
  fontStretch: `${stretch}%`,
  color,
  lineHeight: 1.15,
  whiteSpace: "nowrap",
});

/** Character-by-character typing schedule (1 char every 2–3 frames, seeded). */
export const TYPE_TIMES: number[] = (() => {
  const t: number[] = [0];
  for (let i = 1; i < SEARCH_TEXT.length; i++) t.push(t[i - 1] + (rnd(i * 7.3) < 0.38 ? 3 : 2));
  return t;
})();
export const typedCount = (sf: number) => TYPE_TIMES.filter((t) => sf >= t).length;

/* ---------------------------- Search bar ---------------------------- */
export const SearchBar: React.FC<{ text: string; cursor: boolean; top?: number; pressed?: number }> = ({
  text,
  cursor,
  top = UI.searchTop,
  pressed = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: UI.side,
      right: UI.side,
      top,
      height: UI.searchH,
      borderRadius: UI.searchH / 2,
      background: "#eef0f5",
      display: "flex",
      alignItems: "center",
      padding: "0 34px",
      gap: 22,
      scale: 1 - pressed * 0.03,
      zIndex: 12,
    }}
  >
    <Icon name="buscar" size={40} color={C.tinta2} strokeWidth={2.2} />
    <span style={{ ...font(38, 450, C.tinta), letterSpacing: "-0.01em" }}>{text}</span>
    <span style={{ width: 3.5, height: 46, marginLeft: -18, background: C.cobalto, opacity: cursor ? 1 : 0, borderRadius: 2 }} />
  </div>
);

/* ------------------------------ Map -------------------------------- */
const PinShape: React.FC<{ color: string; size: number; label?: string; ring?: string }> = ({ color, size, label, ring }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50% 50% 50% 0",
      rotate: "-45deg",
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: ring ? `0 0 0 4px ${ring}` : "0 4px 10px rgba(19,24,43,0.25)",
    }}
  >
    {label ? (
      <span style={{ rotate: "45deg", ...font(size * 0.46, 800, C.blanco) }}>{label}</span>
    ) : (
      <span style={{ width: size * 0.34, height: size * 0.34, borderRadius: "50%", background: C.tinta }} />
    )}
  </div>
);

/** Pin that drops in with a bouncy spring at `at` (story frame). */
const DropPin: React.FC<{
  sf: number;
  at: number;
  x: number;
  y: number;
  color: string;
  size: number;
  label?: string;
  pulse?: boolean;
}> = ({ sf, at, x, y, color, size, label, pulse }) => {
  if (sf < at) return null;
  const p = sp(sf, at, 9, 200, 0.9);
  const dy = (1 - p) * -260;
  const ringT = ((sf - at - 8) % 36) / 36;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size * 1.25 }}>
      {/* shadow */}
      <div
        style={{
          position: "absolute",
          left: size * 0.1,
          top: size * 1.18,
          width: size * 0.8,
          height: size * 0.22,
          borderRadius: "50%",
          background: "rgba(19,24,43,0.28)",
          scale: `${0.4 + 0.6 * Math.min(1, p)}`,
          filter: "blur(2px)",
        }}
      />
      {pulse && sf > at + 8 ? (
        <div
          style={{
            position: "absolute",
            left: size / 2 - 60,
            top: size * 1.25 - 60,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: `4px solid ${color}`,
            scale: `${0.3 + ringT * 1.4}`,
            opacity: 0.7 * (1 - ringT),
          }}
        />
      ) : null}
      <div style={{ translate: `0 ${dy}px` }}>
        <PinShape color={color} size={size} label={label} />
      </div>
    </div>
  );
};

export const MapView: React.FC<{
  top: number;
  height: number;
  sf: number;
  pinsAt: readonly number[];
  yourPinAt?: number;
}> = ({ top, height, sf, pinsAt, yourPinAt }) => {
  const w = SCREEN.w - UI.side * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: UI.side,
        top,
        width: w,
        height,
        borderRadius: 30,
        overflow: "hidden",
        background: "#e6ebf3",
      }}
    >
      <svg viewBox="560 260 640 300" preserveAspectRatio="xMidYMid slice" width={w} height={height} style={{ position: "absolute", inset: 0 }}>
        {TOPO_PATHS.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke="#9fb0d8" strokeWidth={p.major ? 2.2 : 1.3} opacity={p.major ? 0.85 : 0.6} />
        ))}
      </svg>
      {/* streets */}
      <svg width={w} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M -20 ${height * 0.78} L ${w + 20} ${height * 0.5}`} stroke="#fff" strokeWidth={20} />
        <path d={`M ${w * 0.38} -20 L ${w * 0.3} ${height + 20}`} stroke="#fff" strokeWidth={16} />
        <path d={`M ${w * 0.62} -20 L ${w + 20} ${height * 0.36}`} stroke="#fff" strokeWidth={12} />
      </svg>
      <DropPin sf={sf} at={pinsAt[0]} x={w * 0.17} y={height * 0.48} color={C.tinta} size={50} label="1" />
      <DropPin sf={sf} at={pinsAt[1]} x={w * 0.56} y={height * 0.3} color={C.tinta} size={50} label="2" />
      <DropPin sf={sf} at={pinsAt[2]} x={w * 0.84} y={height * 0.74} color={C.tinta} size={50} label="3" />
      {yourPinAt !== undefined ? (
        <DropPin sf={sf} at={yourPinAt} x={w * 0.43} y={height * 0.66} color={C.pin} size={66} pulse />
      ) : null}
    </div>
  );
};

/* ------------------------------ Lists ------------------------------ */
export const Stars: React.FC<{ n: number; size: number; dim?: boolean }> = ({ n, size, dim }) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Icon
        key={i}
        name="estrella"
        size={size}
        color={i < n ? C.estrella : "#d9dce4"}
        fill={i < n ? C.estrella : "#d9dce4"}
        strokeWidth={1}
        style={{ opacity: dim ? 0.5 : 1 }}
      />
    ))}
  </span>
);

const RoundBtn: React.FC<{ icon: "tel" | "ruta"; filled?: boolean; dim?: boolean; pressed?: number }> = ({ icon, filled, dim, pressed = 0 }) => (
  <div
    style={{
      scale: `${1 - 0.16 * pressed}`,
      filter: pressed > 0 ? `brightness(${1 + 0.12 * pressed})` : undefined,
      width: 76,
      height: 76,
      borderRadius: "50%",
      border: filled ? "none" : "2px solid #e1e4eb",
      background: filled ? C.pin : C.blanco,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: dim ? 0.45 : 1,
    }}
  >
    <Icon name={icon} size={36} color={filled ? C.tinta : C.cobalto} strokeWidth={2} />
  </div>
);

export type Rival = { name: string; rating: string; stars: number; count: string; meta: string };
export const RIVALS: Rival[] = [
  { name: "Ferretería Central", rating: "4,8", stars: 5, count: "(212)", meta: "Ferretería · 650 m" },
  { name: "Corralón del Sur", rating: "4,4", stars: 4, count: "(98)", meta: "Corralón · 1,2 km" },
  { name: "Ferretería El Tornillo", rating: "4,3", stars: 4, count: "(61)", meta: "Ferretería · 900 m" },
];

export const ResultItem: React.FC<{ r: Rival; top: number; pressed?: number; style?: React.CSSProperties }> = ({
  r,
  top,
  pressed = 0,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      width: SCREEN.w,
      top,
      height: UI.itemH,
      background: pressed > 0 ? `rgba(35,64,216,${0.07 * pressed})` : "transparent",
      ...style,
    }}
  >
    <div style={{ position: "absolute", left: 36, top: 26, ...font(40, 700, C.tinta, 100), letterSpacing: "-0.01em" }}>{r.name}</div>
    <div style={{ position: "absolute", left: 36, top: 80, display: "flex", alignItems: "center", gap: 10, ...font(31, 450, C.tinta2) }}>
      <span>{r.rating}</span>
      <Stars n={r.stars} size={27} />
      <span>{r.count}</span>
    </div>
    <div style={{ position: "absolute", left: 36, top: 124, ...font(29, 400, C.tinta2) }}>
      {r.meta} · <span style={{ color: OK_GREEN, fontWeight: 600 }}>Abierto ahora</span>
    </div>
    <div style={{ position: "absolute", right: 30, top: 50, display: "flex", gap: 12 }}>
      <RoundBtn icon="tel" />
      <RoundBtn icon="ruta" />
    </div>
    <div style={{ position: "absolute", left: 36, right: 0, bottom: 0, height: 2, background: "#eceef3" }} />
  </div>
);

const AlertRow: React.FC<{ text: string; top: number; size?: number }> = ({ text, top, size = 31 }) => (
  <div style={{ position: "absolute", left: 36, top, display: "flex", alignItems: "center", gap: 12 }}>
    <svg width={size * 1.05} height={size * 1.05} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10.5" fill={ALERT_RED} />
      <path d="M12 6.5v7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="12" cy="17.3" r="1.5" fill="#fff" />
    </svg>
    <span style={{ ...font(size, 600, ALERT_RED) }}>{text}</span>
  </div>
);

/** Picture-with-a-slash ("no photos") line icon. */
export const NoPhotoIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17.5l4.6-4.4 3.2 3 2.6-2.4 5.6 4.8" />
    <path d="M3 3.5l18 17" stroke="#eef0f4" strokeWidth={4.2} />
    <path d="M3 3.5l18 17" />
  </svg>
);

/**
 * "Tu negocio" before: grey, no photo, missing info.
 * `big` (0..1) grows the type for the lifted close-up so it reads ≥ 44 px on canvas.
 */
export const HoyTuCard: React.FC<{ style?: React.CSSProperties; boxed?: number; big?: number }> = ({ style, boxed = 0, big = 0 }) => {
  const k = (a: number, b: number) => a + (b - a) * big;
  const slot = k(118, 104);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: SCREEN.w,
        height: UI.hoyTuH,
        background: "#f6f7f9",
        borderRadius: 28 * boxed,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 36, top: k(28, 20), ...font(k(40, 46), 700, "#8a90a3", 100) }}>Tu negocio</div>
      <div style={{ position: "absolute", left: 36, top: k(82, 78), ...font(k(29, 39), 400, "#868c9c") }}>
        Sin fotos · {big > 0.5 ? "1,8 km" : "Ferretería · 1,8 km"}
      </div>
      <AlertRow text="Horario no disponible" top={k(136, 134)} size={k(31, 40)} />
      <AlertRow text="Reseñas sin responder" top={k(190, 194)} size={k(31, 40)} />
      {/* empty photo slot */}
      <div
        style={{
          position: "absolute",
          right: k(34, 30),
          top: k(30, 22),
          width: slot,
          height: slot,
          borderRadius: 18,
          border: "3px dashed #c9ced8",
          background: "#eef0f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NoPhotoIcon size={k(54, 50)} color="#a9afbf" />
      </div>
    </div>
  );
};

/* Little illustrated "photos" of the business (flat SVG, no real images). */
export const Thumb: React.FC<{ kind: "fachada" | "interior" | "herramientas" | "bolsa"; w: number; h: number }> = ({ kind, w, h }) => (
  <svg width={w} height={h} viewBox="0 0 200 104" preserveAspectRatio="xMidYMid slice" style={{ borderRadius: 16, display: "block" }}>
    {kind === "fachada" ? (
      <>
        <rect width="200" height="104" fill="#c9d2ff" />
        <rect x="22" y="34" width="156" height="70" fill="#f3f4ef" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={18 + i * 20.5} y="26" width="20.5" height="22" fill={i % 2 ? "#fff" : C.pin} />
        ))}
        <path d="M18 48 Q 28 58 38.5 48 Q 49 58 59 48 Q 69.5 58 80 48 Q 90 58 100.5 48 Q 111 58 121 48 Q 131.5 58 141.5 48 Q 152 58 162 48 Q 172.5 58 182 48 Z" fill={C.pin} />
        <rect x="40" y="62" width="44" height="42" fill="#13182b" opacity="0.85" />
        <rect x="100" y="62" width="60" height="30" fill="#9fb0d8" />
        <rect x="70" y="10" width="60" height="14" rx="3" fill="#13182b" />
      </>
    ) : kind === "interior" ? (
      <>
        <rect width="200" height="104" fill="#e8eae2" />
        {[24, 54, 84].map((y, r) => (
          <g key={y}>
            <rect x="8" y={y} width="184" height="5" fill="#4a5168" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect
                key={i}
                x={14 + i * 26}
                y={y - 16 - ((i + r) % 3) * 3}
                width="18"
                height={16 + ((i + r) % 3) * 3}
                rx="2"
                fill={[C.cobalto, C.estrella, "#1f7a3e", C.pin, "#9fb0d8"][(i + r * 2) % 5]}
              />
            ))}
          </g>
        ))}
      </>
    ) : kind === "bolsa" ? (
      <>
        <rect width="200" height="104" fill={C.cobaltoClaro} />
        <path d="M84 36 C84 18 116 18 116 36" fill="none" stroke={C.tinta} strokeWidth="5" strokeLinecap="round" />
        <rect x="68" y="34" width="64" height="62" rx="6" fill={C.papel} />
        <path d="M100 52 c-8 0 -13 6 -13 12 c0 9 13 20 13 20 s13-11 13-20 c0-6-5-12-13-12z" fill={C.pin} />
        <circle cx="100" cy="64" r="4.5" fill={C.tinta} />
        <rect x="146" y="58" width="34" height="38" rx="5" fill={C.estrella} />
        <rect x="20" y="64" width="34" height="32" rx="5" fill={C.cobalto} />
      </>
    ) : (
      <>
        <rect width="200" height="104" fill="#13182b" />
        <g fill="none" stroke="#f3f4ef" strokeWidth="9" strokeLinecap="round">
          <path d="M40 84 L92 32" />
          <path d="M150 20 L108 84" stroke={C.estrella} />
        </g>
        <rect x="80" y="18" width="34" height="18" rx="4" fill="#f3f4ef" transform="rotate(-45 97 27)" />
        <circle cx="150" cy="22" r="13" fill="none" stroke={C.estrella} strokeWidth="8" />
      </>
    )}
  </svg>
);

/** "Tu negocio" with Lonso Lab: complete profile, answered reviews, photos. */
export const ConTuCard: React.FC<{ style?: React.CSSProperties; glow?: number; callPress?: number }> = ({ style, glow = 0, callPress = 0 }) => {
  const inner = SCREEN.w - 28 - 56;
  const tw = (inner - 24) / 3;
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        width: SCREEN.w - 28,
        height: UI.conTuH,
        background: "#fff4ef",
        border: `3px solid ${C.pin}`,
        borderRadius: 26,
        boxShadow: `0 0 0 ${glow * 10}px rgba(255,90,38,${0.18 * glow})`,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 28, top: 22, ...font(42, 700, C.tinta, 100), letterSpacing: "-0.01em" }}>Tu negocio</div>
      <div style={{ position: "absolute", left: 28, top: 78, display: "flex", alignItems: "center", gap: 10, ...font(32, 600, C.tinta) }}>
        <span>4,9</span>
        <Stars n={5} size={28} />
        <span style={{ fontWeight: 400, color: C.tinta2 }}>(96)</span>
      </div>
      <div style={{ position: "absolute", left: 28, top: 128, display: "flex", alignItems: "center", gap: 8, ...font(29, 600, OK_GREEN) }}>
        <Icon name="check" size={30} color={OK_GREEN} strokeWidth={2.6} />
        Ficha completa · Reseñas respondidas
      </div>
      <div style={{ position: "absolute", left: 28, top: 172, ...font(29, 400, C.tinta2) }}>
        <span style={{ color: OK_GREEN, fontWeight: 700 }}>Abierto ahora</span> · Ferretería · 400 m
      </div>
      <div style={{ position: "absolute", right: 24, top: 26, display: "flex", gap: 12 }}>
        <RoundBtn icon="tel" filled pressed={callPress} />
        <RoundBtn icon="ruta" />
      </div>
      <div style={{ position: "absolute", left: 28, top: 220, display: "flex", gap: 12 }}>
        <Thumb kind="fachada" w={tw} h={100} />
        <Thumb kind="interior" w={tw} h={100} />
        <Thumb kind="herramientas" w={tw} h={100} />
      </div>
    </div>
  );
};

/* --------------------- Autocomplete while typing ------------------- */
/* Ordered so that every prefix of SEARCH_TEXT still matches ≥ 3 rows (the screen never empties). */
const SUGG = [
  "ferretería cerca de mí",
  "ferretería cerca de mí abierta",
  "ferretería cerca de mí con envío",
  "ferretería cerca de mí 24 horas",
  "ferretería abierta ahora",
  "ferretería industrial",
  "ferretería y corralón",
];
const SUGG_ROWS = 5;
export const Suggestions: React.FC<{ typed: string; opacity: number }> = ({ typed, opacity }) => {
  const rows = SUGG.filter((s) => s.startsWith(typed)).slice(0, SUGG_ROWS);
  return (
    <div style={{ position: "absolute", left: 0, top: 206, width: SCREEN.w, height: SCREEN.h - 206, background: C.blanco, opacity, zIndex: 10 }}>
      {rows.map((s, i) => (
        <div key={s} style={{ position: "absolute", left: 40, right: 40, top: 22 + i * 92, height: 92, display: "flex", alignItems: "center", gap: 28 }}>
          <Icon name={i === 0 ? "reloj" : "buscar"} size={38} color="#8a90a3" strokeWidth={2} />
          <span style={{ ...font(35, 400, C.tinta2) }}>
            <span style={{ fontWeight: 700, color: C.tinta }}>{typed}</span>
            {s.slice(typed.length)}
          </span>
          <svg width="30" height="30" viewBox="0 0 24 24" style={{ marginLeft: "auto" }}>
            <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="#b3b9c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
      {/* quick filters under the suggestions */}
      <div style={{ position: "absolute", left: 40, top: 22 + SUGG_ROWS * 92 + 26, display: "flex", gap: 14 }}>
        {["Abierto ahora", "Mejor valorados", "Cerca"].map((c) => (
          <span
            key={c}
            style={{ ...font(28, 500, C.tinta2), padding: "13px 22px", borderRadius: 999, border: "2px solid #e1e4eb", background: "#f7f8fa" }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------- Skeleton loading ------------------------ */
export const Skeleton: React.FC<{ sf: number; top: number; opacity: number }> = ({ sf, top, opacity }) => {
  const sh = ((sf * 22) % 1200) - 300;
  return (
    <div style={{ position: "absolute", left: 0, top, width: SCREEN.w, opacity }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 36, top: i * UI.itemH + 30, width: 640 }}>
          {[
            [0, 360, 36],
            [56, 250, 26],
            [98, 300, 26],
          ].map(([y, w, h], j) => (
            <div
              key={j}
              style={{
                position: "absolute",
                top: y,
                width: w,
                height: h,
                borderRadius: 10,
                background: `linear-gradient(100deg, #eceef3 ${sh - 160}px, #f7f8fa ${sh}px, #eceef3 ${sh + 160}px)`,
              }}
            />
          ))}
          <div style={{ position: "absolute", right: 0, top: 22, width: 76, height: 76, borderRadius: "50%", background: "#eef0f4" }} />
        </div>
      ))}
    </div>
  );
};

/* ------------------------------ Keyboard --------------------------- */
const ROWS = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];
export const Keyboard: React.FC<{ y: number; activeKey: string | null }> = ({ y, activeKey }) => {
  const kw = 61;
  const kh = 84;
  const gap = 8;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: SCREEN.h - 520,
        width: SCREEN.w,
        height: 520,
        background: "#d6d9e1",
        translate: `0 ${y}px`,
        zIndex: 14,
      }}
    >
      {ROWS.map((row, r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            top: 22 + r * (kh + 22),
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap,
          }}
        >
          {row.split("").map((k) => {
            const on = activeKey === k;
            return (
              <div
                key={k}
                style={{
                  width: kw,
                  height: kh,
                  borderRadius: 10,
                  background: on ? C.cobaltoClaro : C.blanco,
                  boxShadow: "0 2px 0 rgba(19,24,43,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  translate: on ? "0 -6px" : "0 0",
                  ...font(34, 400, C.tinta),
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ position: "absolute", top: 22 + 3 * (kh + 22), left: 0, right: 0, display: "flex", justifyContent: "center", gap }}>
        <div style={{ width: 140, height: kh, borderRadius: 10, background: "#b9bec9" }} />
        <div
          style={{
            width: 330,
            height: kh,
            borderRadius: 10,
            background: activeKey === " " ? C.cobaltoClaro : C.blanco,
            boxShadow: "0 2px 0 rgba(19,24,43,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...font(28, 400, C.tinta2),
          }}
        >
          espacio
        </div>
        <div
          style={{
            width: 170,
            height: kh,
            borderRadius: 10,
            background: C.cobalto,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...font(28, 700, C.blanco),
          }}
        >
          Buscar
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- Call screen -------------------------- */
const RoundIcon: React.FC<{ children: React.ReactNode; bg: string; size: number }> = ({ children, bg, size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </div>
);

/** Generic in-call line icons (mute, keypad, speaker). */
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

export type Callee = { name: string; initials: string; avatarBg: string; avatarFg: string; rating: string };
export const CALLEE_CENTRAL: Callee = { name: "Ferretería Central", initials: "FC", avatarBg: "#39405a", avatarFg: C.blanco, rating: "4,8" };
export const CALLEE_TU: Callee = { name: "Tu negocio", initials: "TN", avatarBg: C.pin, avatarFg: C.tinta, rating: "4,9" };

/** Outgoing-call screen. `slide` 0..1 slides it up over the list (opaque: no text double-exposure). */
export const CallScreen: React.FC<{ t: number; slide: number; who?: Callee }> = ({ t, slide, who = CALLEE_CENTRAL }) => {
  const dots = ".".repeat(1 + (Math.floor(Math.max(0, t) / 9) % 3));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #232a42 0%, #13182b 55%, #0d1120 100%)",
        translate: `0 ${(1 - slide) * 104}%`,
        borderRadius: (1 - slide) * 60,
        boxShadow: slide < 1 ? "0 -30px 60px rgba(13,17,32,0.45)" : undefined,
        zIndex: 16,
      }}
    >
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", ...font(34, 500, "#b9bfd3") }}>
        Llamando{dots}
      </div>
      <div style={{ position: "absolute", top: 202, width: "100%", textAlign: "center", ...font(54, 700, C.blanco), letterSpacing: "-0.01em" }}>
        {who.name}
      </div>
      <div style={{ position: "absolute", top: 290, left: SCREEN.w / 2 - 110, width: 220, height: 220 }}>
        {[0, 1].map((k) => {
          const rt = (((t + k * 18) % 36) + 36) % 36 / 36;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `3px solid ${who.avatarBg === C.pin ? C.pin : "#6f86ff"}`,
                scale: `${1 + rt * 0.7}`,
                opacity: t > 0 ? 0.6 * (1 - rt) : 0,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: who.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...font(80, 700, who.avatarFg, 110),
          }}
        >
          {who.initials}
        </div>
      </div>
      <div style={{ position: "absolute", top: 548, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 10, ...font(30, 500, "#b9bfd3") }}>
        {who.rating} <Icon name="estrella" size={28} color={C.estrella} fill={C.estrella} strokeWidth={1} /> · Abierto ahora
      </div>
      <div style={{ position: "absolute", top: 960, width: "100%", display: "flex", justifyContent: "center", gap: 64 }}>
        {(
          [
            ["mute", "Silencio"],
            ["keypad", "Teclado"],
            ["speaker", "Altavoz"],
          ] as const
        ).map(([k, label]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <RoundIcon bg="rgba(255,255,255,0.13)" size={124}>
              <CallIcon kind={k} size={54} color="#e4e7f2" />
            </RoundIcon>
            <span style={{ ...font(27, 500, "#b9bfd3") }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1250, width: "100%", display: "flex", justifyContent: "center" }}>
        <RoundIcon bg="#e5484d" size={140}>
          <Icon name="tel" size={60} color={C.blanco} strokeWidth={2.2} style={{ rotate: "135deg" }} />
        </RoundIcon>
      </div>
    </div>
  );
};

/* ------------------------------ Finger ----------------------------- */
export const Finger: React.FC<{ x: number; y: number; opacity: number; press: number; ripple: number; light?: boolean }> = ({
  x,
  y,
  opacity,
  press,
  ripple,
  light = false,
}) => (
  <div style={{ position: "absolute", left: x - 48, top: y - 48, width: 96, height: 96, opacity, zIndex: 25 }}>
    {ripple > 0 && ripple < 1 ? (
      light ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "6px solid rgba(255,255,255,0.95)",
              scale: `${0.5 + ripple * 2.2}`,
              opacity: 1 - ripple,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
              scale: `${0.4 + ripple * 1.3}`,
              opacity: 0.9 * (1 - ripple),
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(35,64,216,0.30)",
            scale: `${0.4 + ripple * 1.6}`,
            opacity: 0.9 * (1 - ripple),
          }}
        />
      )
    ) : null}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: light ? "rgba(255,255,255,0.42)" : "rgba(19,24,43,0.22)",
        border: "4px solid rgba(255,255,255,0.95)",
        boxShadow: light ? "0 6px 18px rgba(19,24,43,0.35), 0 0 0 2px rgba(19,24,43,0.12)" : "0 6px 16px rgba(19,24,43,0.25)",
        scale: `${1 - press * 0.18}`,
      }}
    />
  </div>
);

export { eo, io, ip };
