import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { Sfx, type SfxName } from "../../brand";
import { M, T, DUR } from "./timing";
import { NOTIFS } from "./Notifs";

/**
 * Music bed with a duck envelope: a short "air gap" right before the drop (so the impact
 * hits twice as hard) and a gentle dip under the phone rings.
 */
const duck = (f: number) => {
  // [start, full, holdEnd, releaseEnd, gain]
  const dips: [number, number, number, number, number][] = [
    // air gap: riser ends at f323, music down ~26 dB f323-326 (only a 5-frame whoosh swells
    // inside it), drop lands clean on f327
    [T.drop - 6, T.drop - 4, T.drop - 1, T.drop - 1, 0.05],
    // after the impact transient, give it room
    [T.drop - 0.5, T.drop, T.drop + 6, T.drop + 22, 0.76],
    [T.callIn - 1, T.callIn + 2, T.callIn + 2, T.callIn + 24, 0.7],
    [T.conCall - 1, T.conCall + 1, T.conCall + 1, T.conCall + 18, 0.8],
    [T.heroCall - 1, T.heroCall + 1, T.heroCall + 1, T.heroCall + 20, 0.72],
    // short dips under the card whooshes
    ...T.cards.map((c) => [c - 3, c - 1, c - 1, c + 8, 0.78] as [number, number, number, number, number]),
  ];
  let g = 1;
  for (const [a, b, h, c, gain] of dips) {
    if (f < a || f > c) continue;
    const k = f < b ? (f - a) / Math.max(1, b - a) : f <= h ? 1 : 1 - (f - h) / Math.max(1, c - h);
    g = Math.min(g, 1 - (1 - gain) * Math.max(0, Math.min(1, k)));
  }
  return g;
};

/** SFX cut to `dur` frames (for a ring that should not run under the next scene). */
const SfxCut: React.FC<{ name: SfxName; at: number; volume: number; dur: number }> = ({ name, at, volume, dur }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={at} durationInFrames={dur} premountFor={fps} name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={(f) => volume * Math.min(1, (dur - f) / 4)} />
    </Sequence>
  );
};

export const Soundtrack: React.FC = () => (
  <>
    <Audio
      src={staticFile(M.file)}
      volume={(f) => {
        const fadeOut = Math.min(1, (DUR - f) / 24);
        return 0.9 * duck(f) * Math.max(0, fadeOut);
      }}
    />
    {/* 1 · hook */}
    <Sfx name="typing" at={0} volume={0.42} />
    <Sfx name="ui_click" at={T.submit} volume={0.4} />
    <Sfx name="pop" at={T.pins[0]} volume={0.55} />
    <Sfx name="pop" at={T.pins[1]} volume={0.55} />
    <Sfx name="pop" at={T.pins[2]} volume={0.55} />
    {/* 2 · así te ve */}
    <Sfx name="swipe" at={105} volume={0.5} />
    <Sfx name="whoosh_fast" at={T.lift - 4} volume={0.32} />
    <Sfx name="swipe" at={T.liftBack - 2} volume={0.32} />
    {/* 3 · le compra a otro */}
    <Sfx name="ui_tap" at={T.tap} volume={0.6} />
    <Sfx name="phone_ring" at={T.callIn} volume={0.5} />
    {/* 4 · rewind */}
    <Sfx name="riser_2s" at={T.drop - 64} volume={0.38} />
    <Sfx name="tape_stop" at={T.tapeStop} volume={0.75} />
    <Sfx name="glitch_2" at={T.rewind} volume={0.3} />
    <Sfx name="glitch_1" at={285} volume={0.55} />
    {/* 5 · drop */}
    <Sfx name="whoosh_fast" at={T.drop - 5} volume={0.42} />
    <Sfx name="impact_big" at={T.drop} volume={0.48} />
    <Sfx name="swipe" at={T.conPin - 2} volume={0.32} />
    <Sfx name="pop" at={T.conPin} volume={0.3} />
    <Sfx name="ui_tap" at={T.conTap} volume={0.6} />
    <SfxCut name="phone_ring" at={T.conCall} volume={0.3} dur={24} />
    {/* 6 · notifications */}
    {NOTIFS.map((n) => (
      <Sfx key={n.at} name={n.sfx} at={n.at} volume={n.vol} />
    ))}
    <Sfx name="impact_short" at={T.heroCall} volume={0.45} />
    {/* 7 · services */}
    <Sfx name="whoosh_fast" at={T.cards[0] - 6} volume={0.5} />
    <Sfx name="whoosh_fast" at={T.cards[1] - 6} volume={0.5} />
    <Sfx name="whoosh_fast" at={T.cards[2] - 6} volume={0.5} />
    <Sfx name="pop" at={T.cards[0] + 7} volume={0.38} />
    <Sfx name="pop" at={T.cards[1] + 9} volume={0.32} />
    <Sfx name="ui_tap" at={T.cards[2] + 24} volume={0.45} />
    <Sfx name="notif_msg" at={T.cards[2] + 30} volume={0.32} />
    {/* 8 · calm + close */}
    <Sfx name="whoosh_down" at={T.calm - 6} volume={0.6} />
    <Sfx name="typing" at={T.calm + 5} volume={0.25} />
    <Sfx name="pop" at={T.pinLand} volume={0.6} />
    <Sfx name="success_chime" at={850} volume={0.6} />
  </>
);
