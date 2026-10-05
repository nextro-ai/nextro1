// Dev-only entry used by gen_assets to rasterise the old avatar (not part of the reel render).
import React from "react";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import "./fonts";
import { LOGO_C, SignWorld } from "./Sign";

const OldAvatar: React.FC = () => (
  <AbsoluteFill style={{ background: "#d9cfb2" }}>
    <div style={{ position: "absolute", left: 250 - LOGO_C.x, top: 250 - LOGO_C.y, width: 1080, height: 1920 }}>
      <SignWorld />
    </div>
  </AbsoluteFill>
);

registerRoot(() => <Composition id="OldAvatar" component={OldAvatar} durationInFrames={1} fps={30} width={500} height={500} />);
