import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, Icon, type IconName } from "../../brand";
import { alpha, useTheme } from "./theme";
import { T, eo, ip } from "./timing";
import { font } from "./ui";

/**
 * The three services as a plain list that builds one row per beat (icon + name + verb), then
 * holds still as a whole for ~2.2 s.
 * No headline: the list is the text. Everything on the `dark` field, no accent.
 */
type Row = { at: number; icon: IconName; name: string; verb: string };
const ROWS: Row[] = [
  { at: T.svcRows[0], icon: "pin", name: "Google Maps", verb: "que te encuentren" },
  { at: T.svcRows[1], icon: "camara", name: "Redes", verb: "que te elijan" },
  { at: T.svcRows[2], icon: "web", name: "Web", verb: "que te escriban" },
];

const TILE = 150;
const STEP = 290;
const TOP0 = 290 + (950 - (2 * STEP + TILE)) / 2; // block centred in y 290..1240

export const Services: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  // the list leaves before the closing headline arrives (no two text layers at once)
  if (f < T.svc - 2 || f > T.calm) return null;
  const out = ip(f, [T.calm - 8, T.calm], [0, 1]);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: 1 - out }}>
      {ROWS.map((r, i) => {
        // a short fade with a small 10 px slide: each row is readable ~5 f after it appears
        const k = ip(f, [r.at, r.at + 10], [0, 1], eo);
        if (k <= 0) return null;
        return (
          <div
            key={r.name}
            style={{
              position: "absolute",
              left: 96,
              top: TOP0 + i * STEP,
              display: "flex",
              alignItems: "center",
              gap: 40,
              opacity: Math.min(1, k * 1.3),
              translate: `${(1 - k) * -10}px 0`,
            }}
          >
            <div
              style={{
                width: TILE,
                height: TILE,
                borderRadius: 38,
                background: alpha(t.onDark, 0.12),
                border: `2px solid ${alpha(t.onDark, 0.28)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                scale: `${0.9 + 0.1 * k}`,
              }}
            >
              <Icon name={r.icon} size={76} color={t.onDark} strokeWidth={1.9} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ ...font(92, 800, t.onDark, 112), letterSpacing: "-0.025em", lineHeight: 1 }}>{r.name}</span>
              <span style={{ ...font(60, 500, t.onDark2, 100), lineHeight: 1 }}>{r.verb}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
