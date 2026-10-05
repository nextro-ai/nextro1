import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Trabajo } from "./Trabajo";

const Root: React.FC = () => (
  <Composition
    id="Trabajo"
    component={Trabajo}
    durationInFrames={MUSIC.trabajo.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
