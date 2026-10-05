import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Despegue } from "./Despegue";

const Root: React.FC = () => (
  <Composition
    id="Despegue"
    component={Despegue}
    durationInFrames={MUSIC.despegue.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
