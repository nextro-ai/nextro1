import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";
import { C, EASE, Icon, Logo } from "../../brand";
import { TOPO_PATHS } from "../../brand/topoPaths";
import { Flare } from "./Fx";
import { Stack, typeStyle } from "./Text";
import { bt, COUNT, pbt, T } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PIN_GLOW = "rgba(255,90,38,0.55)";

/* ------------------------------------------------------------- S1–S3: the setup */

export const SetupText: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  if (f < T.s2) {
    // beat-2 bar punch on "despegar."
    const p = interpolate(f, [bt(4), bt(4) + 3, bt(4) + 14], [1, 1.045, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return (
      <Stack
        frame={f}
        top={318}
        out={T.s1Out}
        lineGap={6}
        punch={p}
        lines={[
          {
            size: 98,
            weight: 760,
            stretch: 105,
            color: C.papel,
            words: [
              { t: "Tu", at: T.s1Text },
              { t: "negocio", at: T.s1Text + 2 },
              { t: "tiene", at: T.s1Text + 4 },
            ],
          },
          {
            size: 98,
            weight: 760,
            stretch: 105,
            color: C.papel,
            words: [
              { t: "todo", at: T.s1Text + 7 },
              { t: "para", at: T.s1Text + 9 },
            ],
          },
          {
            size: 164,
            weight: 900,
            stretch: 100,
            tracking: -0.03,
            color: C.pin,
            words: [{ t: "despegar.", at: T.s1Text + 13, fx: "stretch", glow: PIN_GLOW }],
          },
        ]}
      />
    );
  }
  if (f < T.s3) {
    return (
      <Stack
        frame={f}
        top={336}
        out={T.s3 - 9}
        outDur={6}
        lineGap={10}
        lines={[
          { size: 204, weight: 900, stretch: 100, tracking: -0.035, color: C.papel, words: [{ t: "Menos", at: T.s2, fx: "slam", slam: 1.2 }] },
          {
            size: 128,
            weight: 800,
            stretch: 112,
            color: C.papel,
            words: [
              { t: "una", at: T.s2w2, fx: "slam" },
              { t: "cosa:", at: T.s2w3, fx: "slam", origin: "0% 50%", slam: 1.22 },
            ],
          },
        ]}
      />
    );
  }
  if (f < T.t3) {
    // "Que te vean." — the only light left is the text.
    const breathe = 1 + 0.012 * Math.sin((f - T.s3) / 7);
    return (
      <Stack
        frame={f}
        top={346}
        out={T.t3 - 7}
        outDur={6}
        lineGap={4}
        punch={breathe}
        lines={[
          { size: 204, weight: 900, stretch: 100, tracking: -0.035, color: C.pin, words: [{ t: "Que te", at: T.s3, fx: "slam", slam: 1.2, glow: PIN_GLOW }] },
          { size: 250, weight: 900, stretch: 92, tracking: -0.035, color: C.pin, words: [{ t: "vean.", at: T.s3 + 4, fx: "stretch", glow: PIN_GLOW }] },
        ]}
      />
    );
  }
  return null;
};

/* ------------------------------------------------------------- countdown T-3 / T-2 / T-1 */

const NUM_SIZE = 560;

const Numeral: React.FC<{ n: number; frame: number; at: number }> = ({ n, frame, at }) => {
  const t = frame - at;
  // The hit frame (t = 0) is the most energetic frame: fully opaque, big, blurred, max colour split. Settles by t = 5.
  const pIn = interpolate(t, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pOut = interpolate(t, [66, 72], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const hold = interpolate(t, [5, 66], [1, 1.04], clamp);
  const s = interpolate(pIn, [0, 1], [1.45, 1]) * hold * (1 + pOut * 0.9);
  const blur = (1 - pIn) * 9 + pOut * 18;
  const op = 1 - pOut;
  // stretch punch: lands wide, relaxes to wdth 62
  const wd = interpolate(t, [0, 3, 12], [74, 70, 62], { ...clamp, easing: EASE.rebote });
  const ab = interpolate(t, [0, 7], [18, 0], clamp); // chromatic split on impact
  const base: React.CSSProperties = {
    ...typeStyle(NUM_SIZE, 900, wd, C.papel, 0),
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    lineHeight: 1,
  };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 270,
        height: NUM_SIZE,
        scale: s,
        filter: `blur(${blur}px)`,
        opacity: op,
      }}
    >
      {/* glow + pin outline */}
      <div
        style={{
          ...base,
          color: "transparent",
          WebkitTextStroke: `22px ${C.pin}`,
          filter: `drop-shadow(0 0 28px rgba(255,90,38,0.85))`,
          opacity: 0.95,
        }}
      >
        {n}
      </div>
      {ab > 0.5 && (
        <>
          <div style={{ ...base, color: "rgba(35,64,216,0.9)", translate: `${-ab}px 0`, mixBlendMode: "screen" }}>{n}</div>
          <div style={{ ...base, color: "rgba(255,90,38,0.9)", translate: `${ab}px 0`, mixBlendMode: "screen" }}>{n}</div>
        </>
      )}
      <div style={{ ...base, textShadow: "0 6px 40px rgba(0,0,0,0.35)" }}>{n}</div>
    </div>
  );
};

/**
 * Impact echo: an outline copy of the numeral, concentric with it, that expands and fades in 12 f.
 * (Replaces the old 1350 px ghost numeral, whose cropped straight edges read as stray boxes.)
 */
const NumeralEcho: React.FC<{ n: number; frame: number; at: number }> = ({ n, frame, at }) => {
  const t = frame - at;
  if (t < 0 || t > 12) return null;
  const k = Easing.out(Easing.cubic)(t / 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 270,
        height: NUM_SIZE,
        textAlign: "center",
        ...typeStyle(NUM_SIZE, 900, 62, "transparent", 0),
        WebkitTextStroke: `${6 - 4 * k}px ${C.pin}`,
        opacity: 0.55 * (1 - k),
        scale: 1.05 + 0.55 * k,
        filter: `blur(${1 + 3 * k}px)`,
      }}
    >
      {n}
    </div>
  );
};

/** Lock-on brackets that close in around the radar target. */
const Brackets: React.FC<{ frame: number; at: number; cx: number; cy: number }> = ({ frame, at, cx, cy }) => {
  const t = frame - at;
  const p = interpolate(t, [0, 10], [0, 1], { ...clamp, easing: EASE.rebote });
  const d = interpolate(p, [0, 1], [180, 92]);
  const op = interpolate(t, [-1, 0, 64, 70], [0, 1, 1, 0], clamp);
  const L = 30;
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: op, rotate: `${(1 - p) * 45}deg`, transformOrigin: `${cx}px ${cy}px` }}
    >
      {corners.map(([sx, sy], i) => (
        <path
          key={i}
          d={`M${cx + sx * d} ${cy + sy * (d - L)} L${cx + sx * d} ${cy + sy * d} L${cx + sx * (d - L)} ${cy + sy * d}`}
          stroke={C.pin}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

export const RADAR_CY = 905;

export const Countdown: React.FC<{ frame: number; layer: "back" | "front" }> = ({ frame, layer }) => {
  if (frame < T.t3 || frame >= T.ign) return null;
  const item = frame < T.t2 ? COUNT[0] : frame < T.t1 ? COUNT[1] : COUNT[2];
  const t = frame - item.at;
  if (layer === "back") {
    return (
      <AbsoluteFill>
        {/* scrim so the numeral and the service text read over the radar */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 60% 26% at 50% 28%, rgba(6,8,18,0.6) 0%, rgba(6,8,18,0) 100%), radial-gradient(ellipse 52% 16% at 47% 57%, rgba(6,8,18,0.72) 0%, rgba(6,8,18,0) 100%)",
          }}
        />
      </AbsoluteFill>
    );
  }
  const disc = interpolate(t, [-2, 8], [0, 1], { ...clamp, easing: EASE.rebote });
  const outP = interpolate(t, [64, 71], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // service plate: in at t 1–8 / 3–12, out at t 67–71 (title slides up behind its clip line, the line fades)
  const svcIn = interpolate(t, [1, 8], [0, 1], { ...clamp, easing: EASE.salida });
  const lineIn = interpolate(t, [3, 12], [0, 1], { ...clamp, easing: EASE.salida });
  const txtOut = interpolate(t, [67, 71], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const ring = interpolate(t % 18, [0, 17], [0, 1]);
  return (
    <AbsoluteFill>
      <NumeralEcho n={item.n} frame={frame} at={item.at} />
      <Numeral n={item.n} frame={frame} at={item.at} />
      <Flare x={540} y={530} k={interpolate(t, [0, 1, 13], [0.9, 0.8, 0], clamp)} width={1700} warm />
      {/* radar target: service icon */}
      <div
        style={{
          position: "absolute",
          left: 540 - 70,
          top: RADAR_CY - 70,
          width: 140,
          height: 140,
          borderRadius: "50%",
          scale: disc * (1 - outP * 0.4),
          opacity: 1 - outP,
          background: "radial-gradient(circle at 35% 30%, #1d2547 0%, #0d1226 75%)",
          border: `5px solid ${C.pin}`,
          boxShadow: `0 0 0 10px rgba(255,90,38,0.14), 0 0 60px rgba(255,90,38,0.55)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={item.icon} size={76} color={C.papel} strokeWidth={2} />
      </div>
      {/* lock pulse */}
      <div
        style={{
          position: "absolute",
          left: 540 - 70,
          top: RADAR_CY - 70,
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: `3px solid ${C.pin}`,
          scale: 1 + ring * 0.7,
          opacity: (1 - ring) * 0.7 * (1 - outP) * disc,
        }}
      />
      <Brackets frame={frame} at={item.at} cx={540} cy={RADAR_CY} />
      {/* service name + promise (zone B, x ≤ 880) */}
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          marginLeft: 0,
        }}
      >
        <div style={{ overflow: "hidden", padding: "0.08em 0.1em 0.14em", margin: "-0.08em -0.1em -0.14em" }}>
          <div
            style={{
              ...typeStyle(92, 820, 108, C.papel),
              translate: `0 ${(1 - svcIn) * 115 - txtOut * 115}%`,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {item.service}
          </div>
        </div>
        <div
          style={{
            ...typeStyle(58, 600, 104, C.cobaltoClaro, -0.01),
            opacity: lineIn * (1 - txtOut),
            translate: `0 ${(1 - lineIn) * 24}px`,
            filter: `blur(${(1 - lineIn) * 6 + txtOut * 6}px)`,
            textShadow: "0 3px 18px rgba(0,0,0,0.6)",
          }}
        >
          {item.line}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- ignition text */

export const IgnitionText: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  if (f < T.ign || f >= T.dark) return null;
  const a = T.ignText;
  return (
    <Stack
      frame={f}
      top={330}
      out={T.ignTextOut - 7}
      outDur={7}
      lineGap={8}
      lines={[
        {
          size: 100,
          weight: 800,
          stretch: 112,
          color: C.papel,
          words: [
            { t: "Sin", at: a },
            { t: "presencia", at: a + 3 },
          ],
        },
        {
          size: 100,
          weight: 800,
          stretch: 112,
          color: C.papel,
          words: [
            { t: "online,", at: a + 7 },
            { t: "no", at: a + 10 },
            { t: "hay", at: a + 12 },
          ],
        },
        { size: 132, weight: 900, stretch: 100, tracking: -0.03, color: C.pin, words: [{ t: "despegue.", at: a + 17, fx: "stretch", glow: PIN_GLOW }] },
      ]}
    />
  );
};

/* ------------------------------------------------------------- after liftoff */

export const LiftText: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  if (f < T.txt2 || f >= T.end) return null;
  const p = interpolate(f, [pbt(5), pbt(5) + 3, pbt(5) + 16], [1, 1.05, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Stack
      frame={f}
      top={322}
      out={T.txt2Out - 8}
      outDur={8}
      lineGap={14}
      punch={p}
      lines={[
        { size: 178, weight: 900, stretch: 100, tracking: -0.035, color: C.pin, words: [{ t: "Despegá", at: T.txt2, fx: "stretch", glow: PIN_GLOW }] },
        {
          size: 94,
          weight: 800,
          stretch: 112,
          color: C.papel,
          words: [
            { t: "con", at: T.txt2 + 9 },
            { t: "Lonso", at: T.txt2 + 12 },
            { t: "Lab.", at: T.txt2 + 15 },
          ],
        },
      ]}
    />
  );
};

/** A band of contour lines the pin flies through (pattern interrupt mid-climb). */
export const CloudBand: React.FC<{ frame: number; climb: number; climbAtStart: number }> = ({ frame, climb, climbAtStart }) => {
  const start = pbt(8) - 30; // band enters ~1 s before beat 730
  if (frame < start || frame > start + 90) return null;
  const y = -900 + (climb - climbAtStart) * 1.6; // nearer than the stars: faster
  return (
    <div style={{ position: "absolute", left: -300, width: 1680, top: y, height: 900, opacity: 0.85 }}>
      <svg viewBox="300 200 1000 520" preserveAspectRatio="none" width={1680} height={900} fill="none" stroke="#7d93ff">
        {TOPO_PATHS.map((p, i) => (
          <path key={i} d={p.d} strokeWidth={p.major ? 3.2 : 1.8} opacity={p.major ? 0.9 : 0.55} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------- end card */

/** End-card stack (all centred on x = 540). The pin beacon sits above it with its tip at END_PIN_Y (timing.ts). */
const END_LOGO_TOP = 632;
const END_LOGO_H = 104;
const END_CTA_TOP = 770;

export const EndCard: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  if (f < T.end - 6) return null;
  const t = f - T.end;
  const logoIn = interpolate(t, [4, 15], [0, 1], { ...clamp, easing: EASE.salida });
  const l1 = interpolate(t, [7, 17], [0, 1], { ...clamp, easing: EASE.salida });
  const l1b = interpolate(t, [9, 19], [0, 1], { ...clamp, easing: EASE.salida });
  const l2 = interpolate(t, [12, 22], [0, 1], { ...clamp, easing: EASE.salida });
  const pill = interpolate(t, [14, 27], [0, 1], { ...clamp, easing: EASE.rebote });
  const sweep = interpolate(t, [20, 44], [-0.3, 1.3], clamp);
  const topoDraw = interpolate(t, [-6, 50], [0, 1], { ...clamp, easing: EASE.salida });
  return (
    <AbsoluteFill>
      {/* topo on cobalt, like the site's closing section */}
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", width: 1920 * 1.25, height: 1080 * 1.25, left: 540 - 1200, top: 960 - 675, rotate: "90deg", opacity: 0.22 }}
        fill="none"
        stroke={C.papel}
      >
        {TOPO_PATHS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - Math.min(1, Math.max(0, topoDraw * 1.3 - (i % 8) * 0.04))}
            strokeWidth={p.major ? 2.2 : 1.3}
            opacity={p.major ? 0.9 : 0.55}
          />
        ))}
      </svg>
      {/* logo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: END_LOGO_TOP,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          translate: `0 ${(1 - logoIn) * 30}px`,
          filter: `blur(${(1 - logoIn) * 8}px)`,
        }}
      >
        <div style={{ position: "relative" }}>
          <Logo kind="full" variant="papel" height={END_LOGO_H} />
          {/* light sweep */}
          <div
            style={{
              position: "absolute",
              inset: -10,
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 100 - 12}%, rgba(255,255,255,0.75) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 12}%)`,
              maskImage: `url(${staticFile("brand/logo-full-papel.svg")})`,
              maskSize: "calc(100% - 20px) calc(100% - 20px)",
              maskPosition: "10px 10px",
              maskRepeat: "no-repeat",
            }}
          />
        </div>
      </div>
      {/* CTA: centred on x = 540 like the pin and the logo; y ≈ 772–1195, every line ≤ x 880 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: END_CTA_TOP, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ overflow: "hidden", padding: "0.1em 0.06em 0.1em", margin: "-0.1em -0.06em -0.1em" }}>
          <div style={{ ...typeStyle(112, 860, 106, C.papel, -0.03), lineHeight: 0.94, translate: `0 ${(1 - l1) * 115}%` }}>Auditoría</div>
        </div>
        <div style={{ overflow: "hidden", padding: "0.1em 0.06em 0.16em", margin: "-0.1em -0.06em -0.16em" }}>
          <div style={{ ...typeStyle(112, 860, 106, C.papel, -0.03), lineHeight: 0.94, translate: `0 ${(1 - l1b) * 115}%` }}>gratis</div>
        </div>
        <div
          style={{
            ...typeStyle(58, 600, 104, C.cobaltoClaro, -0.01),
            marginTop: 16,
            opacity: l2,
            translate: `0 ${(1 - l2) * 20}px`,
          }}
        >
          en 24 h hábiles
        </div>
        <div
          style={{
            marginTop: 28,
            scale: 0.6 + 0.4 * pill,
            opacity: Math.min(1, pill * 1.5),
            background: C.pin,
            borderRadius: 999,
            padding: "24px 54px 27px",
            boxShadow: "0 18px 40px -12px rgba(255,90,38,0.6), 0 2px 6px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span style={{ ...typeStyle(56, 700, 108, C.tinta, -0.005) }}>lonsolab.com</span>
          <Icon name="flecha" size={50} color={C.tinta} strokeWidth={2.6} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Flat ping rings around the pin on the end card. */
export const EndRings: React.FC<{ frame: number; x: number; y: number }> = ({ frame, x, y }) => {
  if (frame < T.end) return null;
  const rings = [0, 24, 48].map((d) => {
    const t = ((frame - T.end - d) % 72 + 72) % 72;
    if (frame - T.end - d < 0) return null;
    return t / 72;
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {rings.map((k, i) =>
        k === null ? null : (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={30 + 260 * Easing.out(Easing.cubic)(k)}
            ry={(30 + 260 * Easing.out(Easing.cubic)(k)) * 0.26}
            fill="none"
            stroke={C.pin}
            strokeWidth={4 * (1 - k) + 1}
            opacity={(1 - k) * 0.9}
          />
        ),
      )}
      <ellipse cx={x} cy={y} rx={46} ry={12} fill="rgba(6,10,40,0.45)" />
    </svg>
  );
};

/** "Sound barrier" ring when the pin punches through the contour band (beat 730). */
export const BoomRing: React.FC<{ frame: number; x: number; y: number }> = ({ frame, x, y }) => {
  const at = pbt(8);
  const t = frame - at;
  if (t < 0 || t > 26) return null;
  const k = Easing.out(Easing.cubic)(t / 26);
  const rx = 60 + 620 * k;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.2} fill="none" stroke={C.papel} strokeWidth={7 * (1 - k) + 1} opacity={0.85 * (1 - k)} />
      <ellipse cx={x} cy={y} rx={rx * 0.8} ry={rx * 0.16} fill="none" stroke={C.pin} strokeWidth={5 * (1 - k) + 1} opacity={0.7 * (1 - k)} />
    </svg>
  );
};
