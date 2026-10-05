import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Notis } from "./Notis";

const Root: React.FC = () => (
  <Composition
    id="Notis"
    component={Notis}
    durationInFrames={MUSIC.notis.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
