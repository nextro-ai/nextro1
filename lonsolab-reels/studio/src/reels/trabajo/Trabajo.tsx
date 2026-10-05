import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { C } from "../../brand";
import { Cards } from "./Cards";
import { CtaCard, FinalHeadline, TileAndCta } from "./Final";
import { SceneHook } from "./SceneHook";
import { SceneMira, Stage } from "./SceneMira";
import { Soundtrack } from "./Sound";
import { T } from "./timing";
import { Grain } from "./ui";

export const Trabajo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <Stage />
      <SceneMira />
      <Cards />
      <CtaCard />
      <TileAndCta />
      <FinalHeadline />
      <Sequence name="1 Hook" durationInFrames={T.mira} premountFor={fps}>
        <SceneHook />
      </Sequence>
      <Grain opacity={0.07} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
