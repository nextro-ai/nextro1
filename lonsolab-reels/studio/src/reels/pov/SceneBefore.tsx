import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../../brand";
import { List, ListHeader, Row } from "./List";
import { MapCard } from "./MapCard";
import { Loop, MarkerFilter } from "./marks";
import { T } from "./timing";
import { PRE, Rise, head } from "./type";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Item 1 lands on the cut (f168), so it starts PRE frames early like the title. */
const ROWS: Row[] = [
  {
    lines: ["Fotos viejas en tu", "ficha de Google"],
    at: T.items[0] - PRE,
    strikeAt: T.strikes[0],
  },
  { lines: ["Reseñas sin responder"], at: T.items[1], strikeAt: T.strikes[1] },
  { lines: ["Último posteo: marzo"], at: T.items[2], strikeAt: T.strikes[2] },
  {
    lines: ["Tu web no se ve bien", "en el celu"],
    at: T.items[3],
    strikeAt: T.strikes[3],
  },
];

/**
 * 168–376: "Por qué no te encuentran" + counter + 4 items, each crossed out one beat after it lands.
 * Below the list, the hook's map card stays as a grey speck: still nobody finds the pin.
 * 335: the music empties → header and map leave. The list stays crisp until 377 (item 4 needs
 * 101 f for 9 words; it gets 115), then drains to grey and sinks out of the headline zone.
 */
export const SceneBefore: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [T.breakdown, T.breakdown + 14], [0, 1], {
    ...clamp,
    easing: EASE.inOut,
  });
  const sink = interpolate(frame, [T.sink, T.sink + 30], [0, 1], {
    ...clamp,
    easing: EASE.inOut,
  });
  const mapIn = interpolate(frame, [T.lista, T.lista + 16], [0, 1], {
    ...clamp,
    easing: EASE.salida,
  });
  return (
    <AbsoluteFill>
      {out < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            translate: `0 ${out * 60 + (1 - mapIn) * 40}px`,
          }}
        >
          <MapCard
            top={1166}
            zf={[0, 1]}
            zv={[0.27, 0.27]}
            ze={[(t) => t]}
            dropAt={-100}
            starsAt={-100}
            pings={[]}
            grey={1}
            opacity={1 - out}
          />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out,
          translate: `0 ${-out * 24}px`,
        }}
      >
        <ListHeader
          lines={["Por qué no te", "encuentran"]}
          counterAts={[T.items[0] - PRE, ...T.items.slice(1)]}
          at={T.lista - PRE}
          lineFrom={T.lista}
          accent={C.tinta}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter:
            sink > 0
              ? `grayscale(${sink}) blur(${sink * 1.6}px)`
              : undefined,
          opacity: 1 - 0.72 * sink,
          translate: `0 ${sink * 380}px`,
        }}
      >
        {/* the rule draws once the title has landed, so it never crosses the rising title */}
        <List rows={ROWS} mode="strike" seed="antes" ruleAt={T.lista + 10} />
      </div>
    </AbsoluteFill>
  );
};

/** 377–502: "Cada día que no aparecés, / alguien le compra a otro." with a marker loop on "otro". */
export const SceneBreak: React.FC = () => {
  const frame = useCurrentFrame();
  const s = head(108, C.tinta, 104);
  const push = interpolate(frame, [T.cada, T.turn], [1, 1.025], clamp);
  return (
    <AbsoluteFill>
      <MarkerFilter id="mk-otro" />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 306,
          scale: String(push),
          transformOrigin: "0 0",
        }}
      >
        <Rise at={T.cada} style={s}>
          Cada día que
        </Rise>
        <Rise at={T.cada + 3} style={s}>
          no aparecés,
        </Rise>
        <div style={{ height: 24 }} />
        <Rise at={T.alguien} style={s}>
          alguien le
        </Rise>
        <Rise at={T.alguien + 3} style={s}>
          compra a{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              marginLeft: "0.14em",
              color: C.pinHondo,
            }}
          >
            otro
            <span style={{ color: C.tinta }}>.</span>
            <Loop
              at={T.circulo}
              seed="otro"
              w={300}
              h={160}
              dx={20}
              dy={2}
              width={8}
              color={C.pinHondo}
              filterId="mk-otro"
            />
          </span>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
