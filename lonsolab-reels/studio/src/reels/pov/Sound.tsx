import React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { Sfx } from "../../brand";
import { M, T, TICK_LEAD } from "./timing";

/** Music bed from f0 (downbeat) + sparse, paper-and-pen SFX. Peaks land on the visual frame. */
export const Soundtrack: React.FC = () => {
  const D = M.duration_frames;
  return (
    <>
      <Audio
        src={staticFile(M.file)}
        volume={(f) => {
          const fadeIn = Math.min(1, f / 3);
          const fadeOut = Math.min(1, (D - f) / 18);
          return 0.82 * Math.max(0, Math.min(fadeIn, fadeOut));
        }}
      />
      {/* 1 · hook */}
      <Sfx name="tick" at={T.pov} volume={1} />
      <Sfx name="ui_tap" at={T.pov} volume={0.5} />
      <Sfx name="swipe" at={T.nadieHi - 2} volume={0.22} />
      {/* 2 · strikes, one beat after each item lands (swipe peaks ~3 f in, mid-stroke) */}
      {T.strikes.map((at, i) => (
        <Sfx key={`s${i}`} name="swipe" at={at - 1} volume={0.35} />
      ))}
      {/* 3 · loop around "otro" */}
      <Sfx name="swipe" at={T.circulo - 1} volume={0.28} />
      {/* 4 · page turn: whoosh_med peaks ~11 f after its start → peak on f503 */}
      <Sfx name="whoosh_med" at={T.turn - 11} volume={0.6} />
      <Sfx name="swipe" at={T.arrow - 1} volume={0.18} />
      {/* the opener folds into the list title (571→587) */}
      <Sfx name="swipe" at={T.fold + 2} volume={0.16} />
      {/* 5 · ticks: the pen swipe on the stroke start, the click when the tick is drawn (on the beat) */}
      {T.ticks.map((at, i) => (
        <React.Fragment key={`t${i}`}>
          {i > 0 ? (
            <Sfx name="swipe" at={at - TICK_LEAD} volume={0.2} />
          ) : null}
          <Sfx name="tick" at={at} volume={1} />
          <Sfx name="ui_click" at={at} volume={0.7} />
          <Sfx name="ui_tap" at={at} volume={0.5} />
        </React.Fragment>
      ))}
      {/* 6 · highlighter on "se vea" */}
      <Sfx name="swipe" at={T.seVea - 2} volume={0.2} />
      {/* 7 · CTA: the pill reaches full size on T.cta */}
      <Sfx name="pop" at={T.cta} volume={0.6} />
    </>
  );
};
