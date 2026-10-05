import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Rebrand } from "./Rebrand";

const Root: React.FC = () => (
  <Composition
    id="Rebrand"
    component={Rebrand}
    durationInFrames={MUSIC.rebrand.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
