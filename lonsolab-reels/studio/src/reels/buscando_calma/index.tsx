import React from "react";
import { Composition, registerRoot } from "remotion";
import { z } from "zod";
import { MUSIC, THEME_IDS } from "../../brand";
import { BuscandoCalma } from "./BuscandoCalma";

const schema = z.object({
  theme: z.enum(THEME_IDS as [string, ...string[]]),
  safe: z.boolean().optional(),
});

const Root: React.FC = () => (
  <Composition
    id="BuscandoCalma"
    component={BuscandoCalma}
    schema={schema}
    durationInFrames={MUSIC.buscando_calma.duration_frames}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ theme: "web" }}
  />
);

registerRoot(Root);
