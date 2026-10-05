import React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import { C, punch } from "../../brand";
import { EM } from "./metrics";
import { bt, T } from "./timing";
import { Dots, Slam, dotPop, stackBaselines } from "./type";
import { Ghost, useAbs, WIDTH, X0 } from "./common";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = EM.w900s125;
const E112 = EM.w900s112;

/**
 * Hierarchy: the keyword (pin) always runs the full 880 px; statements and outline
 * connectors are left-aligned at 0.78 of that width, so the eye lands on the keyword.
 */
const SHORT = Math.round(WIDTH * 0.78); // 686 px
const STROKE = 4.5;

/** f0–54 · "TENÉS / EL MEJOR / PRODUCTO." — word per beat, keyword widest. */
export const SceneA1: React.FC = () => {
  const f = useAbs(T.tenes);
  const s1 = SHORT / E["TENÉS"]; // 156 px
  const s2 = SHORT / E["EL MEJOR"]; // 106 px
  const s3 = WIDTH / E112["PRODUCTO."]; // 126 px (wdth 112)
  const [b1, b2, b3] = stackBaselines([{ size: s1, accent: true }, { size: s2 }, { size: s3 }], 474, 30);
  return (
    <AbsoluteFill>
      <Ghost frame={f} from={T.producto} text="PRODUCTO" color={C.papel} />
      <AbsoluteFill style={{ scale: punch(f, bt(3), 1.02, 9), transformOrigin: "50% 38%" }}>
        {/* pre-rolled 2 f so frame 0 (autoplay + thumbnail) is crisp, already widening */}
        <Slam frame={f} at={T.tenes - 2} text="TENÉS" size={s1} x={X0} width={SHORT} baseline={b1} />
        <Slam frame={f} at={T.elMejor} text="EL MEJOR" size={s2} x={X0} width={SHORT} baseline={b2} outline strokeWidth={STROKE} />
        <Slam frame={f} at={T.producto} text="PRODUCTO." size={s3} x={X0} width={WIDTH} baseline={b3} color={C.pin} stretch={112} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** f55–108 · "LA MEJOR / ATENCIÓN." */
export const SceneA2: React.FC = () => {
  const f = useAbs(T.laMejor);
  const s1 = SHORT / E["LA MEJOR"]; // 104 px
  const s2 = WIDTH / E112["ATENCIÓN."]; // 135 px (wdth 112)
  const [b1, b2] = stackBaselines([{ size: s1 }, { size: s2, accent: true }], 560, 30);
  const p = punch(f, bt(6), 1.02, 9) * punch(f, bt(7), 1.02, 9);
  return (
    <AbsoluteFill>
      <Ghost frame={f} from={T.atencion} text="ATENCIÓN" color={C.papel} />
      <AbsoluteFill style={{ scale: p, transformOrigin: "50% 32%" }}>
        <Slam frame={f} at={T.laMejor} text="LA MEJOR" size={s1} x={X0} width={SHORT} baseline={b1} outline strokeWidth={STROKE} />
        <Slam frame={f} at={T.atencion} text="ATENCIÓN." size={s2} x={X0} width={WIDTH} baseline={b2} color={C.pin} stretch={112} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * f109–136 · "PERO…" alone, giant, on pin. The dots pop on an 8th-note triplet
 * (114 / 118 / 123) so the last one has settled 8+ frames before the cut at 137.
 */
export const ScenePero: React.FC = () => {
  const f = useAbs(T.pero);
  const { fps } = useVideoConfig();
  const size = WIDTH / (E.PERO + E["…"]); // 180 px
  const dotsAt = [bt(8 + 1 / 3), bt(8 + 2 / 3), bt(9)];
  const push = interpolate(f, [T.pero, T.siNo], [1, 1.02], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ scale: push, transformOrigin: "50% 36%" }}>
      <Ghost frame={f} from={T.pero} text="PERO" color={C.tinta} opacity={0.1} y={1290} speed={3} />
      <Slam
        frame={f}
        at={T.pero}
        size={size}
        x={X0}
        width={WIDTH}
        baseline={760}
        color={C.tinta}
        slamFrom={1.55}
        text={
          <>
            PERO
            <Dots
              color={C.tinta}
              opacities={dotsAt.map((a) => (f >= a ? 1 : 0))}
              scales={dotsAt.map((a) => dotPop(f, a, fps))}
            />
          </>
        }
      />
    </AbsoluteFill>
  );
};

/**
 * f137–217 · "SI NO / APARECÉS EN / GOOGLE…" — same system as A1: outline connector short,
 * statement justified, keyword GOOGLE… alone on the last line at full width (128 px).
 * "EN" lands at the end of line 2 on the same beat as GOOGLE….
 */
export const SceneA4: React.FC = () => {
  const f = useAbs(T.siNo);
  const s1 = 100;
  const w1 = s1 * E["SI NO"];
  const s2 = WIDTH / E["APARECÉS EN"]; // 96 px
  const s3 = WIDTH / (E.GOOGLE + E["…"]); // 128 px
  const [b1, b2, b3] = stackBaselines([{ size: s1 }, { size: s2, accent: true }, { size: s3 }], 476, 30);
  const loadStart = T.enGoogle + 8;
  const dotO = [0, 1, 2].map((i) => {
    if (f < loadStart) return 1;
    const ph = ((f - loadStart - i * 4.5) / M_BEAT) * Math.PI * 2;
    return 0.22 + 0.78 * (0.5 + 0.5 * Math.cos(ph));
  });
  // tension before the dip: slow creep (capped so the 880 px lines stay inside x 90–990)
  const creep = interpolate(f, [bt(15), T.noExistis], [1, 1.02], { ...clamp, easing: Easing.in(Easing.quad) });
  const wAp = s2 * E["APARECÉS"];
  const xEn = X0 + s2 * E["APARECÉS "];
  const wEn = s2 * E.EN;
  return (
    <AbsoluteFill>
      <Ghost frame={f} from={T.enGoogle} text="GOOGLE" color={C.papel} />
      <AbsoluteFill style={{ scale: creep * punch(f, bt(13), 1.015, 9) * punch(f, bt(14), 1.015, 9), transformOrigin: "50% 34%" }}>
        <Slam frame={f} at={T.siNo} text="SI NO" size={s1} x={X0} width={w1 + 6} fit={w1} baseline={b1} outline strokeWidth={STROKE} />
        <Slam frame={f} at={T.aparezes} text="APARECÉS" size={s2} x={X0} width={wAp + 6} fit={wAp} baseline={b2} />
        <Slam frame={f} at={T.enGoogle} text="EN" size={s2} x={xEn} width={wEn + 6} fit={wEn} maxW={980 - xEn} baseline={b2} />
        <Slam
          frame={f}
          at={T.enGoogle}
          size={s3}
          x={X0}
          width={WIDTH}
          baseline={b3}
          color={C.pin}
          text={
            <>
              GOOGLE
              <Dots color={C.pin} opacities={dotO} />
            </>
          }
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const M_BEAT = 13.6571;
