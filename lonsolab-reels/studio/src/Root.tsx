import React from "react";
import { Composition, Folder } from "remotion";
import { z } from "zod";
import { MUSIC, THEME_IDS } from "./brand";
import { Buscando } from "./reels/buscando/Buscando";
import { BuscandoCalma } from "./reels/buscando_calma/BuscandoCalma";
import { Manifiesto } from "./reels/manifiesto/Manifiesto";
import { Despegue } from "./reels/despegue/Despegue";
import { Pov } from "./reels/pov/Pov";
import { Trabajo } from "./reels/trabajo/Trabajo";
import { Rebrand } from "./reels/rebrand/Rebrand";
import { Notis } from "./reels/notis/Notis";

/**
 * Remotion Studio root (`npm run dev`): every reel in one place for live preview.
 * Each reel also keeps its own entry in src/reels/<id>/index.tsx for rendering.
 */
const themed = z.object({ theme: z.enum(THEME_IDS as [string, ...string[]]), safe: z.boolean().optional() });
const reel = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Pausados-con-paletas">
      <Composition id="BuscandoCalma" component={BuscandoCalma} schema={themed} defaultProps={{ theme: "web" }}
        durationInFrames={MUSIC.buscando_calma.duration_frames} {...reel} />
    </Folder>
    <Folder name="Primera-tanda">
      <Composition id="Buscando" component={Buscando} durationInFrames={MUSIC.buscando.duration_frames} {...reel} />
      <Composition id="Manifiesto" component={Manifiesto} durationInFrames={MUSIC.manifiesto.duration_frames} {...reel} />
      <Composition id="Despegue" component={Despegue} durationInFrames={MUSIC.despegue.duration_frames} {...reel} />
      <Composition id="Pov" component={Pov} durationInFrames={MUSIC.pov.duration_frames} {...reel} />
      <Composition id="Trabajo" component={Trabajo} durationInFrames={MUSIC.trabajo.duration_frames} {...reel} />
      <Composition id="Rebrand" component={Rebrand} durationInFrames={MUSIC.rebrand.duration_frames} {...reel} />
      <Composition id="Notis" component={Notis} durationInFrames={MUSIC.notis.duration_frames} {...reel} />
    </Folder>
  </>
);
