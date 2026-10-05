import React from "react";
import { Composition, registerRoot } from "remotion";
import { MUSIC } from "../../brand";
import { Buscando } from "./Buscando";

const Root: React.FC = () => (
  <Composition
    id="Buscando"
    component={Buscando}
    durationInFrames={MUSIC.buscando.duration_frames}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
