import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Manifiesto } from "./Manifiesto";

const Root: React.FC = () => (
  <Composition
    id="Manifiesto"
    component={Manifiesto}
    durationInFrames={MUSIC.manifiesto.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
