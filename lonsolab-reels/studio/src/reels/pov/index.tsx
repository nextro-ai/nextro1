import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Pov } from "./Pov";

const Root: React.FC = () => (
  <Composition
    id="Pov"
    component={Pov}
    durationInFrames={MUSIC.pov.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
