import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Sfx } from "../../brand";
import { B, clamp, M, T } from "./timing";

/** Reel-local SFX (public/rebrand/sfx, synthesised by gen_assets.py). */
const Local: React.FC<{ name: "ice_crack" | "ice_shatter" | "glass_ting" | "cold_air"; at: number; volume: number }> = ({ name, at, volume }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at))} premountFor={fps} name={`sfx:${name}`}>
      <Audio src={staticFile(`rebrand/sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};

/**
 * Short music dips under the SFX hits so transients read. Review pass: shallower (×0.8 ≈ −1.9 dB)
 * and no pre-attack — the dip starts ON the hit frame, where the transient masks the step, and
 * recovers over 8–10 f (≈ 0.2 dB per frame), so no pumping or zipper steps.
 */
const DUCKS: { at: number; depth: number; release: number }[] = [
  { at: T.bloom, depth: 0.8, release: 10 },
  ...[T.snap, ...T.chips, T.type, ...T.appBeats, T.grid, T.end].map((at) => ({ at, depth: 0.8, release: 8 })),
];

const duckGain = (f: number) => {
  let g = 1;
  for (const d of DUCKS) {
    if (f >= d.at && f < d.at + d.release) g *= d.depth + (1 - d.depth) * ((f - d.at) / d.release);
  }
  return g;
};

/** The hook's piano is ~17 dB under the body: lift it +3 dB, easing back to unity into the f78 chord. */
const hookLift = (f: number) => interpolate(f, [0, T.hookHit - 18, T.hookHit - 2], [1.41, 1.41, 1], clamp);

/**
 * Music from f0 (downbeat) + SFX. Levels were set with an offline mix simulation (numpy, 4x
 * oversampled true peak + ebur128) so the raw mix sits ≈ −15,5 LUFS / −3,4 dBTP and master.py can
 * normalise linearly. Peak offsets (measured): whoosh_long +23 f, whoosh_med +11 f, swipe +3 f,
 * riser_2s ends at +60 f, boom_sub +3 f.
 */
export const Soundtrack: React.FC = () => {
  const D = M.duration_frames;
  return (
    <>
      <Audio
        src={staticFile(M.file)}
        volume={(f) => {
          const fade = Math.max(0, Math.min(1, f / 2, (D - f) / 20));
          return 0.9 * fade * duckGain(f) * hookLift(f);
        }}
      />
      {/* A · cold: air bed + a glass ting on frame 0 (both reel-local, tuned to the bed's E-flat) */}
      <Local name="cold_air" at={0} volume={0.2} />
      <Local name="glass_ting" at={0} volume={0.2} />
      <Local name="glass_ting" at={B(2)} volume={0.12} />
      <Sfx name="whoosh_long" at={0} volume={0.18} />
      <Sfx name="whoosh_med" at={T.sign - 9} volume={0.22} />
      <Sfx name="whoosh_fast" at={T.circle - 4} volume={0.2} />
      <Sfx name="tick" at={T.circle} volume={0.9} />
      <Sfx name="pop" at={T.circle + 22} volume={0.25} />
      {/* B · night → cracks */}
      <Sfx name="whoosh_down" at={T.splice - 4} volume={0.16} />
      <Sfx name="swipe" at={T.grow - 2} volume={0.25} />
      {/* −3 dB vs the first pass; the crack now carries a low-passed thump (gen_assets.ice_crack_v2) */}
      <Local name="ice_crack" at={T.crack + 8} volume={0.21} />
      <Local name="ice_crack" at={T.crack + 34} volume={0.27} />
      <Local name="ice_crack" at={T.bloom - 22} volume={0.32} />
      <Local name="ice_crack" at={T.bloom - 10} volume={0.35} />
      <Sfx name="riser_2s" at={T.bloom - 60} volume={0.22} />
      {/* BLOOM */}
      <Sfx name="whoosh_long" at={T.bloom - 23} volume={0.2} />
      <Sfx name="boom_sub" at={T.bloom} volume={0.18} />
      <Local name="ice_shatter" at={T.bloom} volume={0.16} />
      {/* C · new identity */}
      <Sfx name="snap" at={T.snap} volume={0.42} />
      <Sfx name="whoosh_med" at={T.palette - 11} volume={0.25} />
      {T.chips.map((f) => (
        <Sfx key={`c${f}`} name="pop" at={f} volume={0.36} />
      ))}
      <Sfx name="whoosh_med" at={T.type - 11} volume={0.25} />
      <Sfx name="whoosh_fast" at={T.apps - 6} volume={0.22} />
      {T.appBeats.map((f) => (
        <Sfx key={`a${f}`} name="swipe" at={f - 5} volume={0.42} />
      ))}
      <Sfx name="whoosh_med" at={T.grid - 8} volume={0.25} />
      <Sfx name="success_chime" at={T.end} volume={0.42} />
    </>
  );
};
