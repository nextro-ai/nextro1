import React from "react";
import { Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Sfx } from "../../brand";
import { BED_FILE, M, T } from "./timing";

/**
 * Music bed from frame 0 + SFX. Peak offsets measured from the kit files:
 * whoosh_fast peaks 5 f after its start, whoosh_med 11 f, whoosh_down 6 f, swipe 2 f, riser_2s 58 f (60 f long).
 */

/** Reel-local SFX (public/trabajo/sfx, made by cut_music_b.py from the kit's own sounds, just louder/brighter). */
const LocalSfx: React.FC<{ name: "tick_hot" | "ui_tap_hot"; at: number; volume: number }> = ({ name, at, volume }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at))} premountFor={fps} name={`sfx:${name}`}>
      <Audio src={staticFile(`trabajo/sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};

/**
 * Hits where the music ducks a little so the SFX transient reads and the master keeps its true-peak headroom.
 * [frame, gain, hold, release]: gain reached at the frame, held `hold` f, back to 1 after `release` more frames.
 */
const DUCKS: [number, number, number, number][] = [
  // hook: a short 2–3 dB dip under every word so the click reads
  [T.w1, 0.72, 2, 4],
  [T.w2, 0.72, 2, 4],
  [T.w3, 0.72, 2, 4],
  [T.w4, 0.7, 2, 6],
  // the drop: impact + sub boom now sit on the real drop's bass
  [T.c1, 0.5, 6, 12],
  [T.c2, 0.8, 6, 10],
  [T.c3, 0.75, 6, 10],
  [T.countEnd, 0.85, 6, 10],
  [T.c4, 0.75, 6, 10],
  [T.c4rating, 0.85, 6, 10],
  [T.c5, 0.8, 6, 10],
  [T.pin, 0.85, 6, 10],
  [T.grid, 0.75, 6, 10],
  [T.cta, 0.72, 6, 10],
];

const DuckedMusic: React.FC = () => {
  const D = M.duration_frames;
  return (
    <Audio
      src={staticFile(BED_FILE)}
      volume={(f) => {
        let v = 0.9;
        for (const [at, depth, hold, rel] of DUCKS) {
          const k = interpolate(f, [at - 2, at, at + hold, at + hold + rel], [1, depth, depth, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          v *= k;
        }
        // the bed leans back ~2 dB under the end of the riser (kick fill), so the riser reads and the drop hits harder
        v *= interpolate(f, [T.c1 - 30, T.c1 - 8, T.c1 - 1, T.c1], [1, 0.78, 0.78, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = Math.min(1, (D - f) / 20);
        return Math.max(0, v * Math.min(1, (f + 1) / 2) * fadeOut);
      }}
    />
  );
};

export const Soundtrack: React.FC = () => (
  <>
    <DuckedMusic />

    {/* 1 · hook: a click per word, a small hit on "creas." */}
    <LocalSfx name="tick_hot" at={T.w1} volume={0.85} />
    <LocalSfx name="tick_hot" at={T.w2} volume={0.85} />
    <LocalSfx name="tick_hot" at={T.w3} volume={0.85} />
    <LocalSfx name="tick_hot" at={T.w4} volume={0.75} />
    <Sfx name="impact_short" at={T.w4} volume={0.28} />
    <Sfx name="swipe" at={T.underline - 2} volume={0.3} />

    {/* 2 · dip: cut to papel, arrow, riser that ends exactly on the drop (f176 + 60 f = f236) */}
    <Sfx name="whoosh_down" at={T.mira - 6} volume={0.42} />
    <Sfx name="swipe" at={T.arrow} volume={0.32} />
    <Sfx name="riser_2s" at={T.riserStart} volume={0.7} />

    {/* 3 · cards */}
    <Sfx name="whoosh_fast" at={T.c1 - 5} volume={0.36} />
    <Sfx name="impact_short" at={T.c1} volume={0.5} />
    <Sfx name="boom_sub" at={T.c1} volume={0.09} />

    <Sfx name="swipe" at={T.c2 - 2} volume={0.55} />
    <LocalSfx name="ui_tap_hot" at={310} volume={1} />
    <LocalSfx name="ui_tap_hot" at={325} volume={1} />

    <Sfx name="whoosh_fast" at={T.c3 - 5} volume={0.42} />
    {[0, 2, 4, 7, 10, 14, 18, 23, 29, 35].map((d) => (
      <LocalSfx key={d} name="tick_hot" at={T.countFrom + d} volume={0.5} />
    ))}
    <Sfx name="success_chime" at={T.countEnd} volume={0.45} />
    <Sfx name="pop" at={T.c3circle} volume={0.36} />
    <Sfx name="ui_click" at={T.c3circle - 10} volume={0.35} />

    <Sfx name="whoosh_fast" at={T.c4 - 5} volume={0.42} />
    <Sfx name="swipe" at={T.c4 + 6} volume={0.26} />
    <Sfx name="pop" at={T.c4rating} volume={0.5} />

    <Sfx name="swipe" at={T.c5 - 2} volume={0.42} />
    <Sfx name="pop" at={T.pin} volume={0.6} />
    <LocalSfx name="ui_tap_hot" at={T.chip} volume={0.6} />

    {/* 4 · grid + close */}
    <Sfx name="whoosh_med" at={T.grid - 11} volume={0.45} />
    <Sfx name="pop" at={T.tile6} volume={0.5} />
    <Sfx name="whoosh_fast" at={T.cta - 5} volume={0.32} />
    <Sfx name="success_chime" at={T.cta} volume={0.55} />
  </>
);
