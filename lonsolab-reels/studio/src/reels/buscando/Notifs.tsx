import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, Icon, type IconName, type SfxName } from "../../brand";
import { T, ip, sp, ei } from "./timing";
import { CALL_GREEN, Stars } from "./ui";

export type Notif = {
  at: number;
  icon: IconName;
  color: string;
  title: string;
  body: string;
  stars?: boolean;
  hero?: boolean;
  sfx: SfxName;
  vol: number;
};

const WA = "#1f9d55";
/** Intervals shrink 20 → 14 → 10 → 7 → 5 → 5 → 5 f, then the hero call lands on the bar. */
export const NOTIFS: Notif[] = [
  { at: 450, icon: "chat", color: WA, title: "Mensaje nuevo", body: "¿Tienen stock?", sfx: "notif_msg", vol: 0.5 },
  { at: 470, icon: "estrella", color: C.estrella, title: "Nueva reseña", body: "“Excelente atención.”", stars: true, sfx: "notif_ding", vol: 0.45 },
  { at: 484, icon: "ruta", color: C.cobalto, title: "Cómo llegar", body: "Pidieron cómo llegar a tu local", sfx: "pop", vol: 0.5 },
  { at: 494, icon: "chat", color: WA, title: "Mensaje nuevo", body: "¿Hasta qué hora abren?", sfx: "notif_msg", vol: 0.4 },
  { at: 501, icon: "estrella", color: C.estrella, title: "Nueva reseña", body: "“Súper recomendable.”", stars: true, sfx: "pop", vol: 0.42 },
  { at: 506, icon: "ruta", color: C.cobalto, title: "Cómo llegar", body: "Pidieron cómo llegar a tu local", sfx: "notif_ding", vol: 0.3 },
  { at: 511, icon: "chat", color: WA, title: "Mensaje nuevo", body: "¿Hacen envíos?", sfx: "pop", vol: 0.4 },
  { at: 516, icon: "estrella", color: C.estrella, title: "Nueva reseña", body: "“Me resolvieron todo.”", stars: true, sfx: "notif_msg", vol: 0.32 },
  {
    at: T.heroCall,
    icon: "tel",
    color: CALL_GREEN,
    title: "Llamada entrante",
    body: "Un cliente te encontró en Google",
    hero: true,
    sfx: "phone_ring",
    vol: 0.42,
  },
];

const CARD_H = 142;
const HERO_H = 170;
const GAP = 16;
const LEFT = 150;
const WIDTH = 730;
const STACK_TOP = 618;

const Card: React.FC<{ n: Notif }> = ({ n }) => {
  const h = n.hero ? HERO_H : CARD_H;
  return (
    <div
      style={{
        width: WIDTH,
        height: h,
        borderRadius: 34,
        background: n.hero ? C.tinta : "rgba(255,255,255,0.97)",
        boxShadow: "0 2px 6px rgba(19,24,43,0.10), 0 26px 50px -22px rgba(19,24,43,0.55)",
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: n.hero ? "0 32px" : "0 28px",
        fontFamily: FONT,
        position: "relative",
      }}
    >
      <div
        style={{
          width: n.hero ? 96 : 84,
          height: n.hero ? 96 : 84,
          borderRadius: "50%",
          background: n.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          name={n.icon}
          size={n.hero ? 50 : 44}
          color={n.icon === "estrella" ? C.blanco : C.blanco}
          fill={n.icon === "estrella" ? C.blanco : "none"}
          strokeWidth={2.2}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: n.hero ? 46 : 40,
              letterSpacing: "-0.01em",
              color: n.hero ? C.blanco : C.tinta,
              whiteSpace: "nowrap",
            }}
          >
            {n.title}
          </span>
          {n.stars ? <Stars n={5} size={32} /> : null}
        </div>
        <span style={{ fontWeight: 400, fontSize: n.hero ? 36 : 35, color: n.hero ? "#c8ccda" : C.tinta2, whiteSpace: "nowrap" }}>{n.body}</span>
      </div>
      <span
        style={{
          position: "absolute",
          right: 30,
          top: n.hero ? 26 : 24,
          fontSize: 28,
          fontWeight: 500,
          color: n.hero ? "#b9bfd3" : "#8a90a3",
        }}
      >
        ahora
      </span>
    </div>
  );
};

export const NotifRain: React.FC = () => {
  const f = useCurrentFrame();
  if (f < NOTIFS[0].at - 2 || f > T.cards[0] + 8) return null;
  const exit = ip(f, [T.cards[0] - 14, T.cards[0] + 6], [0, 1], ei);
  const arrived = NOTIFS.map((n) => sp(f, n.at, 16, 170));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 200,
          top: 566,
          fontFamily: FONT,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: C.cobaltoClaro,
          opacity: ip(f, [NOTIFS[0].at, NOTIFS[0].at + 8], [0, 1]) * (1 - exit),
        }}
      >
        Simulación
      </div>
      {NOTIFS.map((n, i) => {
        if (f < n.at) return null;
        const p = arrived[i];
        // pushed down by every newer notification (by its own height)
        let push = 0;
        for (let j = i + 1; j < NOTIFS.length; j++) push += arrived[j] * ((NOTIFS[j].hero ? HERO_H : CARD_H) + GAP);
        const depth = NOTIFS.slice(i + 1).filter((m) => f >= m.at).length;
        const heroIn = n.hero ? sp(f, n.at, 11, 200, 0.8) : 1;
        const y = STACK_TOP + push + (1 - p) * -70 + exit * (1500 + i * 40);
        const s = (0.86 + 0.14 * p) * (1 - Math.min(depth, 6) * 0.012) * (n.hero ? 0.9 + 0.1 * heroIn : 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LEFT,
              top: y,
              scale: `${s}`,
              opacity: Math.min(1, p * 1.6),
              rotate: `${exit * (i % 2 ? 6 : -6)}deg`,
              zIndex: 10 + i,
            }}
          >
            <Card n={n} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
