import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { Sfx, type SfxName } from "../../brand";
import { DUR, M, T } from "./timing";

/** Gentle dips of the bed under the phone ring (the only "voice-like" SFX). */
const duck = (f: number) => {
  const dips: [number, number, number, number, number][] = [
    // [start, full, holdEnd, releaseEnd, gain]
    [T.callIn - 2, T.callIn, T.callIn + 26, T.callIn + 40, 0.8],
    [T.drop - 0.5, T.drop, T.drop + 4, T.drop + 18, 0.82],
  ];
  let g = 1;
  for (const [a, b, h, c, gain] of dips) {
    if (f < a || f > c) continue;
    const k = f < b ? (f - a) / Math.max(1, b - a) : f <= h ? 1 : 1 - (f - h) / Math.max(1, c - h);
    g = Math.min(g, 1 - (1 - gain) * Math.max(0, Math.min(1, k)));
  }
  return g;
};

/** SFX trimmed to `dur` frames with a 4 f fade (so a ring or typing never runs under the next idea). */
const SfxCut: React.FC<{ name: SfxName; at: number; volume: number; dur: number }> = ({ name, at, volume, dur }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={at} durationInFrames={dur} premountFor={fps} name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={(f) => volume * Math.max(0, Math.min(1, (dur - f) / 4))} />
    </Sequence>
  );
};

/** Fewer, softer SFX than `buscando`: one sound per event, nothing stacked. */
export const Soundtrack: React.FC = () => (
  <>
    <Audio
      src={staticFile(M.file)}
      volume={(f) => 0.9 * duck(f) * Math.max(0, Math.min(1, (DUR - f) / 24))}
    />
    {/* 1 · search */}
    <SfxCut name="typing" at={T.typeStart} volume={0.24} dur={46} />
    <SfxCut name="typing" at={T.typeStart + 44} volume={0.2} dur={22} />
    <Sfx name="ui_click" at={T.submit} volume={0.35} />
    {T.results.map((r) => (
      <Sfx key={r} name="pop" at={r} volume={0.4} />
    ))}
    {/* 2 · spotlight */}
    <Sfx name="swipe" at={T.spot + 4} volume={0.26} />
    <Sfx name="swipe" at={T.h3 + 4} volume={0.18} />
    {/* 3 · le compra a otro */}
    <Sfx name="ui_tap" at={T.tap} volume={0.5} />
    <SfxCut name="phone_ring" at={T.callIn - 1} volume={0.3} dur={44} />
    {/* 4 · soft ◀◀ */}
    <Sfx name="whoosh_long" at={T.rewind} volume={0.24} />
    <Sfx name="ui_click" at={T.search2} volume={0.3} />
    {/* 5 · the single hit of the reel */}
    <Sfx name="whoosh_fast" at={T.drop - 6} volume={0.3} />
    <Sfx name="impact_big" at={T.drop} volume={0.5} />
    <Sfx name="pop" at={T.conRows[0]} volume={0.28} />
    <Sfx name="pop" at={T.conRows[1]} volume={0.28} />
    <Sfx name="pop" at={T.conPin} volume={0.22} />
    {/* 6 · one pop per notification */}
    {T.notifs.map((n) => (
      <Sfx key={n} name="pop" at={n} volume={0.5} />
    ))}
    {/* 7 · services, one soft swipe per row */}
    {T.svcRows.map((r) => (
      <Sfx key={r} name="swipe" at={r - 2} volume={0.22} />
    ))}
    {/* 8 · back to bg, trades flip */}
    <Sfx name="whoosh_down" at={T.calm - 4} volume={0.36} />
    {T.rubros.slice(1, -1).map((r) => (
      <Sfx key={r} name="tick" at={r} volume={0.3} />
    ))}
    <Sfx name="pop" at={T.rubros[T.rubros.length - 1]} volume={0.38} />
    {/* 9 · close: whoosh into the morph (f1104), one chime when the CTA has landed */}
    <Sfx name="whoosh_fast" at={T.end + 10} volume={0.24} />
    <Sfx name="success_chime" at={T.end + 24} volume={0.5} />
  </>
);
