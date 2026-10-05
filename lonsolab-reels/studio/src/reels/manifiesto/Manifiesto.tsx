import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Sfx } from "../../brand";
import { Backdrop } from "./Backdrop";
import { Flash, Glitch, Grain, MusicDuck, Vignette, glitchAt, shakeAt } from "./fx";
import { SceneA1, SceneA2, SceneA4, ScenePero } from "./SceneA";
import { SceneLedger, SceneNoExistis } from "./SceneB";
import { SceneLogoCta, SceneMapa, SceneStack } from "./SceneC";
import { M, T, bt } from "./timing";

/** Everything that moves with the camera (rendered several times during a glitch). */
const World: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Sequence name="A1 Tenés el mejor producto" from={T.tenes} durationInFrames={T.laMejor - T.tenes} premountFor={fps}>
        <SceneA1 />
      </Sequence>
      <Sequence name="A2 La mejor atención" from={T.laMejor} durationInFrames={T.pero - T.laMejor} premountFor={fps}>
        <SceneA2 />
      </Sequence>
      <Sequence name="A3 Pero…" from={T.pero} durationInFrames={T.siNo - T.pero} premountFor={fps}>
        <ScenePero />
      </Sequence>
      <Sequence name="A4 Si no aparecés en Google…" from={T.siNo} durationInFrames={T.noExistis - T.siNo} premountFor={fps}>
        <SceneA4 />
      </Sequence>
      <Sequence name="B1 No existís" from={T.noExistis} durationInFrames={T.ficha - T.noExistis} premountFor={fps}>
        <SceneNoExistis />
      </Sequence>
      <Sequence name="B2 Ledger" from={T.ficha} durationInFrames={T.mapa - T.ficha} premountFor={fps}>
        <SceneLedger />
      </Sequence>
      <Sequence name="C1 Te ponemos en el mapa" from={T.mapa} durationInFrames={T.stack - T.mapa} premountFor={fps}>
        <SceneMapa />
      </Sequence>
      <Sequence name="C2 Google Maps · Redes · Web" from={T.stack} durationInFrames={T.logo - T.stack} premountFor={fps}>
        <SceneStack />
      </Sequence>
      <Sequence name="C3+C4 Logo y CTA" from={T.logo} durationInFrames={T.end - T.logo} premountFor={fps}>
        <SceneLogoCta />
      </Sequence>
    </AbsoluteFill>
  );
};

const Soundtrack: React.FC = () => {
  const D = M.duration_frames;
  const { fps } = useVideoConfig();
  return (
    <>
      <MusicDuck
        src={M.file}
        durationInFrames={D}
        volume={0.9}
        ducks={[
          [T.pero, T.pero + 16, 0.42], // "PERO…" breath
          [T.noExistis, T.noExistis + 14, 0.6], // room for the boom
          // no pre-duck before 437: the bed's own sub-bass pickup (f427–436) runs into the slam
          [T.mapa, T.mapa + 6, 0.74], // under the impact only (keeps the master in linear mode)
          [bt(34), bt(34) + 4, 0.75], // pin lands
          [T.stack, T.stack + 3, 0.8],
          [T.stackRedes, T.stackRedes + 3, 0.8],
          [T.stackWeb, T.stackWeb + 3, 0.8],
          [T.logo, T.logo + 8, 0.68],
          [bt(46), bt(46) + 3, 0.8], // let the button tap through
        ]}
      />
      {/* A */}
      <Sfx name="impact_short" at={T.tenes} volume={0.35} />
      <Sfx name="impact_short" at={T.producto} volume={0.3} />
      <Sfx name="impact_short" at={T.atencion} volume={0.3} />
      <Sfx name="glitch_1" at={T.pero - 5} volume={0.4} />
      <Sfx name="snap" at={T.pero} volume={0.55} />
      <Sfx name="tape_stop" at={T.pero} volume={0.26} />
      <Sfx name="whoosh_fast" at={T.siNo - 5} volume={0.3} />
      <Sfx name="impact_short" at={T.enGoogle} volume={0.3} />
      <Sfx name="glitch_2" at={T.noExistis - 6} volume={0.45} />
      {/* B */}
      <Sfx name="boom_sub" at={T.noExistis} volume={0.26} />
      <Sfx name="impact_big" at={T.noExistis} volume={0.32} />
      <Sfx name="snap" at={T.ficha} volume={0.65} />
      <Sfx name="swipe" at={bt(21) - 1} volume={0.55} />
      <Sfx name="snap" at={T.redes} volume={0.65} />
      <Sfx name="swipe" at={bt(25) - 1} volume={0.55} />
      <Sfx name="snap" at={T.web} volume={0.65} />
      <Sfx name="swipe" at={bt(29) - 1} volume={0.55} />
      {/* whoosh_long peaks 24 frames after its start → lands on 437 */}
      <Sfx name="whoosh_long" at={T.mapa - 24} volume={0.72} />
      {/* C */}
      <Sfx name="impact_big" at={T.mapa} volume={0.28} />
      <Sfx name="whoosh_fast" at={bt(34) - 5} volume={0.26} />
      <Sfx name="impact_short" at={bt(34)} volume={0.3} />
      <Sfx name="impact_short" at={T.stack} volume={0.36} />
      <Sfx name="impact_short" at={T.stackRedes} volume={0.36} />
      <Sfx name="impact_short" at={T.stackWeb} volume={0.36} />
      <Sfx name="impact_big" at={T.logo} volume={0.4} />
      <Sfx name="whoosh_med" at={T.logo + 12} volume={0.18} />
      <Sfx name="pop" at={T.cta} volume={0.5} />
      {/* the kit's ui_tap / ui_click peak at −17 dBFS: this reel uses copies normalised to −4 dBFS */}
      <Sequence from={bt(45)} premountFor={fps} name="sfx:ui_tap (hot)">
        <Audio src={staticFile("manifiesto/sfx/ui_tap_hot.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={bt(46)} premountFor={fps} name="sfx:ui_click (hot)">
        <Audio src={staticFile("manifiesto/sfx/ui_click_hot.wav")} volume={0.6} />
      </Sequence>
    </>
  );
};

export const Manifiesto: React.FC = () => {
  const frame = useCurrentFrame();
  const sh = shakeAt(frame);
  const g = glitchAt(frame);
  const world = (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <World />
    </AbsoluteFill>
  );
  const onPapel = frame >= T.stack && frame < T.logo;
  const inB = frame >= T.noExistis && frame < T.mapa;
  const vig = onPapel ? 0.1 : inB ? interpolate(frame, [T.noExistis, T.noExistis + 30], [0.45, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0.42;
  return (
    <AbsoluteFill style={{ background: C.tinta, overflow: "hidden" }}>
      {g ? (
        <Glitch k={g.k} seed={g.seed}>
          {world}
        </Glitch>
      ) : (
        world
      )}
      <Flash />
      <Vignette strength={vig} />
      <Grain opacity={onPapel ? 0.12 : 0.09} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
