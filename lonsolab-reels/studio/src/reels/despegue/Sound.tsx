import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { MUSIC, Sfx } from "../../brand";
import { bt, IGN_TICKS, T } from "./timing";

/** [from, to, gain, ramp] — the music dips under the protagonist SFX (research §3.10: −4 to −8 dB). */
const DUCKS: [number, number, number, number][] = [
  [T.s3, T.s3 + 8, 0.7, 1],
  [T.t3, T.t3 + 16, 0.68, 1],
  [T.t2, T.t2 + 16, 0.68, 1],
  [T.t1, T.t1 + 16, 0.68, 1],
  [T.lift, T.lift + 23, 0.42, 1], // our impact replaces the track's own hit (keeps true peak in check)
  [T.lift + 23, T.lift + 55, 0.72, 10],
];

const duckGain = (f: number) => {
  let g = 1;
  for (const [a, b, gain, r] of DUCKS) {
    const k = Math.max(
      0,
      Math.min(1, Math.min((f - a + r) / r, (b + r - f) / r)),
    );
    g *= 1 - (1 - gain) * k;
  }
  return g;
};

/** Copy of the kit's <Music> with a ducking envelope (the kit takes a fixed volume only). */
const DuckedMusic: React.FC<{ volume: number }> = ({ volume }) => {
  const dur = MUSIC.despegue.duration_frames;
  return (
    <Audio
      src={staticFile(MUSIC.despegue.file)}
      volume={(f) => {
        const fadeIn = Math.min(1, f / 1);
        const fadeOut = Math.min(1, (dur - f) / 30);
        return Math.max(0, Math.min(fadeIn, fadeOut)) * volume * duckGain(f);
      }}
    />
  );
};

/**
 * Soundtrack. Music bed from frame 0 (starts on a downbeat). Impacts land on the exact frame,
 * whooshes start early so their peak hits the cut (whoosh_med peaks ~11 f after start,
 * whoosh_long ~24 f; riser_4s is 120 f long and peaks on its last frame).
 * Levels were balanced with an offline mix simulation so the mastered file keeps ≥ 1 dB of
 * true-peak headroom at −14 LUFS.
 */
export const Sound: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <DuckedMusic volume={0.88} />

      {/* S1: soft air as the letterbox closes */}
      <Sfx name="whoosh_long" at={0} volume={0.32} />

      {/* S2: "Menos una cosa:" ticking on the beats */}
      <Sfx name="tick" at={bt(7)} volume={2.2} />
      <Sfx name="tick" at={bt(8)} volume={2.2} />
      <Sfx name="tick" at={bt(9)} volume={2.2} />
      <Sfx name="tick" at={bt(10)} volume={2.2} />
      <Sfx name="tick" at={bt(11)} volume={2.2} />

      {/* S3: "Que te vean." */}
      <Sfx name="impact_short" at={T.s3} volume={0.5} />

      {/* Countdown: whoosh into each number, impact on the downbeat */}
      <Sfx name="whoosh_med" at={T.t3 - 11} volume={0.3} />
      <Sfx name="impact_big" at={T.t3} volume={0.34} />
      <Sfx name="whoosh_med" at={T.t2 - 11} volume={0.3} />
      <Sfx name="impact_big" at={T.t2} volume={0.34} />
      <Sfx name="whoosh_med" at={T.t1 - 11} volume={0.3} />
      <Sfx name="impact_big" at={T.t1} volume={0.3} />

      {/* Ignition: riser ending on f599, a clock that speeds up, then 6 frames of silence */}
      <Sfx name="riser_4s" at={T.dark - 120} volume={0.62} />
      {/* Ignition bed (make_ign_bed.py): C drone + rumble + a heartbeat on every tick. Fills the trough after T-1
        (the track fades out from 466) and is cut exactly at 599, so 599-604 stays the only hole. */}
      <Sequence
        from={T.ign}
        durationInFrames={T.dark - T.ign}
        premountFor={fps}
        name="ign_bed"
      >
        <Audio src={staticFile("despegue/ign_bed.wav")} volume={0.9} />
      </Sequence>
      {IGN_TICKS.map((at, i) => (
        <Sfx key={at} name="tick" at={at} volume={1.4 + i * 0.05} />
      ))}

      {/* LIFTOFF on the music impact (f605). whoosh_long trimmed by 15 f so it starts on 605 and peaks on 612 */}
      <Sfx name="impact_big" at={T.lift} volume={0.4} />
      <Sfx name="boom_sub" at={T.lift} volume={0.24} />
      <Sequence
        from={T.lift}
        premountFor={fps}
        name="sfx:whoosh_long (trimmed)"
      >
        <Audio
          src={staticFile("sfx/whoosh_long.wav")}
          trimBefore={15}
          volume={0.26}
        />
      </Sequence>

      {/* orbiting service icons pop in */}
      <Sfx name="pop" at={640} volume={0.2} />
      <Sfx name="pop" at={646} volume={0.2} />
      <Sfx name="pop" at={652} volume={0.22} />

      {/* camera stops following, pin rises to the end card */}
      <Sfx name="whoosh_med" at={T.rise - 2} volume={0.42} />
      <Sfx name="success_chime" at={T.end} volume={0.55} />
    </>
  );
};
