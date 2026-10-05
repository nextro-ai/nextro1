import React from "react";
import { AbsoluteFill, getRemotionEnvironment } from "remotion";
import { SAFE } from "./tokens";

/**
 * Debug overlay that shows Instagram/TikTok UI-reserved areas.
 * Visible only in Studio preview and when `show` is true; never in final renders
 * unless `force` is set (used by the QA pass to render check frames).
 */
export const SafeZone: React.FC<{ show?: boolean; force?: boolean }> = ({ show = true, force = false }) => {
  const env = getRemotionEnvironment();
  if (!force && (!show || env.isRendering)) return null;
  const shade = "rgba(255,0,80,0.22)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: SAFE.top, background: shade }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: SAFE.bottom, background: shade }} />
      <div style={{ position: "absolute", right: 0, top: SAFE.top, height: SAFE.railFromY - SAFE.top, width: SAFE.right, background: shade }} />
      <div style={{ position: "absolute", right: 0, top: SAFE.railFromY, bottom: SAFE.bottom, width: SAFE.railRight, background: shade }} />
      <div style={{ position: "absolute", left: 0, top: SAFE.top, bottom: SAFE.bottom, width: SAFE.left, background: shade }} />
    </AbsoluteFill>
  );
};
