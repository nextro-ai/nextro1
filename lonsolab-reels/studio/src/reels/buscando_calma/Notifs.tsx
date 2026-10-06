import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, Icon, type IconName } from "../../brand";
import { alpha, shadow, useTheme } from "./theme";
import { T, eo, ei, ip } from "./timing";
import { Stars, font } from "./ui";

/**
 * "Y te eligen.": three big notifications, one per bar, that stay stacked. Each new one takes
 * the focus; the older ones recede into the field (spotlight by dimming, not by adding).
 */
type N = { at: number; icon: IconName; title: string; stars?: boolean; tone: "ok" | "star" | "dark" };
const NOTIFS: N[] = [
  { at: T.notifs[0], icon: "tel", title: "Llamada entrante", tone: "ok" },
  { at: T.notifs[1], icon: "estrella", title: "Nueva reseña", stars: true, tone: "star" },
  { at: T.notifs[2], icon: "ruta", title: "Pidieron cómo llegar", tone: "dark" },
];

const LEFT = 90;
const WIDTH = 790; // right edge x 880: clear of the action rail
const H = 166;
const TOP0 = 640;
const STEP = 192;

export const Notifs: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  if (f < T.notifs[0] - 1 || f > T.svc) return null;
  const exit = ip(f, [T.svc - 12, T.svc], [0, 1], ei);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: 1 - exit, translate: `0 ${-30 * exit}px` }}>
      <div
        style={{
          position: "absolute",
          right: 1080 - (LEFT + WIDTH),
          top: TOP0 - 52,
          ...font(28, 600, t.onDark2),
          letterSpacing: "0.02em",
          opacity: ip(f, [T.notifs[0], T.notifs[0] + 10], [0, 1]),
        }}
      >
        Simulación
      </div>
      {NOTIFS.map((n, i) => {
        if (f < n.at) return null;
        const k = ip(f, [n.at, n.at + 14], [0, 1], eo);
        const next = NOTIFS[i + 1];
        const recede = next ? ip(f, [next.at, next.at + 12], [0, 1], eo) : 0;
        const bg = n.tone === "ok" ? t.ok : n.tone === "star" ? t.star : t.dark;
        const fg = n.tone === "star" ? t.ink : t.onDark;
        return (
          <div
            key={n.title}
            style={{
              position: "absolute",
              left: LEFT,
              top: TOP0 + i * STEP,
              width: WIDTH,
              height: H,
              borderRadius: 40,
              background: t.surface,
              boxShadow: shadow(t, 1.2),
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "0 30px",
              boxSizing: "border-box",
              opacity: Math.min(1, k * 1.4),
              translate: `0 ${(1 - k) * 40}px`,
              scale: `${0.97 + 0.03 * k}`,
            }}
          >
            <div
              style={{
                width: 106,
                height: 106,
                borderRadius: "50%",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={n.icon} size={54} color={fg} fill={n.icon === "estrella" ? fg : "none"} strokeWidth={2.2} />
            </div>
            <span style={{ ...font(54, 760, t.ink), letterSpacing: "-0.01em" }}>{n.title}</span>
            {n.stars ? <Stars n={5} size={42} /> : null}
            {/* older notifications step back: the card stays crisp, its content goes pale */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: alpha(t.surface, 0.32 * recede) }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
