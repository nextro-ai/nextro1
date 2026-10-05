import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { Sfx } from "../../brand";
import { B, MU, NOTIFS, T, type SoundName } from "./timing";

/** Pitched copy of a kit SFX (public/notis/sfx, made by tune_sfx.py). */
const Tone: React.FC<{ name: SoundName; at: number; volume: number }> = ({ name, at, volume }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={at} premountFor={fps} name={`tone:${name}`}>
      <Audio src={staticFile(`notis/sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};

/**
 * Music bed without fades (it is cut on downbeats and the reel loops: a fade would make the
 * seam audible). Light ducking under the sweep so the whoosh reads.
 */
const LoopMusic: React.FC = () => (
  <Audio
    src={staticFile(MU.file)}
    volume={(f) => {
      const d = f >= T.sweep - 2 && f < T.sweep + 10 ? 0.8 : 1;
      return 0.62 * d;
    }}
  />
);

export const Sound: React.FC = () => (
  <>
    <LoopMusic />

    {/* the rain: one in-key tone per notification, landing on the card */}
    {NOTIFS.map((n, i) => (
      <Tone key={i} name={n.sfx} at={n.at} volume={n.vol} />
    ))}
    {/* hook call card: pop + soft G ding (also the first sound of every loop) */}
    <Tone name="ding_G" at={0} volume={0.26} />

    {/* headline swap */}
    <Sfx name="swipe" at={T.swap - 3} volume={0.3} />
    {/* "+24": last card on beat 17 */}
    <Sfx name="snap" at={T.last} volume={0.32} />

    {/* sweep: whoosh peaks on f270 */}
    <Sfx name="whoosh_fast" at={T.sweep - 6} volume={0.6} />

    {/* CTA */}
    <Sfx name="snap" at={T.ctaWord} volume={0.26} />
    <Tone name="pop_2" at={T.ctaPill} volume={0.45} />
    <Sfx name="success_chime" at={T.ctaPill} volume={0.3} />
    <Sfx name="ui_tap" at={B(20)} volume={0.95} />
    <Tone name="pop_3" at={B(20)} volume={0.32} />
    <Sfx name="swipe" at={T.ctaOut - 1} volume={0.22} />

    {/* hook rebuild (loop tail) */}
    <Sfx name="snap" at={T.loopIn} volume={0.3} />
    <Sfx name="snap" at={T.hook2} volume={0.3} />
    <Sfx name="snap" at={T.hook3} volume={0.34} />
  </>
);
