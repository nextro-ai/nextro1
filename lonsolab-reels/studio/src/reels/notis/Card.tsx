import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, Icon } from "../../brand";
import { APPS, CARD, cardHeight, twoLineBody, type Notif } from "./timing";

const STAR = "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z";

export const Stars: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", gap: size * 0.1 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }}>
        <path d={STAR} fill={C.estrella} stroke={C.estrella} strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    ))}
  </div>
);

const txt = (size: number, weight: number, color: string, stretch = 100): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: weight,
  fontStretch: `${stretch}%`,
  color,
  lineHeight: 1.12,
  whiteSpace: "nowrap",
});

/** Generic (non-iOS) lock-screen notification: white glass 85 %, radius 28, round app icon. */
export const Card: React.FC<{ n: Notif; ringFrom?: number }> = ({ n, ringFrom }) => {
  const frame = useCurrentFrame();
  const app = APPS[n.app];
  const h = cardHeight(n);
  const twoLines = twoLineBody(n);
  // incoming-call pulse around the hero icon (period 30 f = 1 bar/2, loop-safe)
  const ring = ringFrom === undefined ? -1 : ((((frame - ringFrom) % 30) + 30) % 30) / 30;
  return (
    <div
      style={{
        width: CARD.w,
        height: h,
        borderRadius: 28,
        background: n.hero
          ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))"
          : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.82))",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(5,10,35,0.25), 0 22px 44px -18px rgba(5,10,35,0.7)",
        display: "flex",
        gap: 22,
        padding: `${CARD.padY}px ${CARD.padX}px`,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", width: CARD.icon, height: CARD.icon, flexShrink: 0 }}>
        {ring >= 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `4px solid ${app.color}`,
              scale: String(1 + ring * 0.55),
              opacity: (1 - ring) * 0.55,
            }}
          />
        )}
        <div
          style={{
            width: CARD.icon,
            height: CARD.icon,
            borderRadius: "50%",
            background: app.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.12)",
          }}
        >
          <Icon
            name={app.icon}
            size={44}
            color={C.blanco}
            strokeWidth={2.2}
            fill={n.app === "resenas" ? C.blanco : "none"}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <div style={{ height: CARD.rowHead, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={txt(44, 700, C.tinta2, 100)}>{app.name}</span>
          <span style={txt(44, 400, "#5a6078", 96)}>ahora</span>
        </div>
        {n.title && (
          <div style={{ height: CARD.rowTitle, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={txt(48, 750, C.tinta, 100)}>{n.title}</span>
            {n.stars && <Stars size={30} />}
          </div>
        )}
        {n.stars && !n.title && (
          <div style={{ height: CARD.rowStars, display: "flex", alignItems: "center" }}>
            <Stars size={36} />
          </div>
        )}
        {n.body && (
          <div
            style={{
              ...txt(46, 500, C.tinta, 97),
              lineHeight: `${CARD.rowBody}px`,
              whiteSpace: twoLines ? "pre-line" : "nowrap",
              height: CARD.rowBody * (twoLines ? 2 : 1),
            }}
          >
            {n.body}
          </div>
        )}
      </div>
    </div>
  );
};
