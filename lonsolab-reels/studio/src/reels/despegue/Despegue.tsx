import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { camAt, climbAt, climbSpeed, shakeAt } from "./camera";
import { Darkness, Flare, Flash, Grain, Letterbox, Vignette } from "./Fx";
import { ContourTrail, Converge, IgnitionPulse, PassRings, Trail } from "./Particles";
import { Orbiter, orbiters, OrbitRing, PinGraphic, pinAt } from "./Pin";
import { BoomRing, CloudBand, Countdown, EndCard, EndRings, IgnitionText, LiftText, SetupText } from "./Scenes";
import { Sound } from "./Sound";
import { bt, IGN_TICKS, pbt, T } from "./timing";
import { Dust, Ground, Sky, Stars, Warp } from "./World";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Beat punch on the pin while the radar is alive (S1–S2). */
const pinPunch = (f: number) => {
  if (f >= T.ign && f < T.dark) {
    let p = 1;
    for (const at of IGN_TICKS) {
      if (f >= at && f < at + 8) p = Math.max(p, interpolate(f, [at, at + 1, at + 7], [1, 1.06, 1], clamp));
    }
    return p;
  }
  if (f >= T.s3) return 1;
  const b = Math.floor(f / bt(1));
  const at = bt(b);
  const peak = b % 4 === 0 ? 1.07 : 1.03;
  return interpolate(f, [at, at + 2, at + 10], [1, peak, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
};

/**
 * Pull-back on the strong music onset at 684 (pbt 5): the flight group (pin, wake, orbit, rings) shrinks to ~0.6
 * around the pin for ~12 f, so the long wake below gives the climb a sense of scale, then the camera pushes back in on 699.
 */
const pullK = (f: number) =>
  interpolate(f, [pbt(5), pbt(5) + 5, pbt(5) + 11, pbt(6)], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });

/** Lens streak on the pin: builds through ignition, peaks on liftoff, fades in the climb. */
const flareK = (f: number) => {
  if (f >= T.ign && f < T.lift) return interpolate(f, [T.dark - 30, T.dark, T.lift - 1], [0, 0.55, 0.8], clamp);
  if (f >= T.lift) return interpolate(f, [T.lift, T.lift + 3, T.lift + 30, T.lift + 60], [1, 1, 0.35, 0.18], clamp) * interpolate(f, [T.rise, T.end], [1, 0], clamp);
  return 0;
};

export const Despegue: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(frame);
  const pin = pinAt(frame);
  const sh = shakeAt(frame);
  const climb = climbAt(frame);
  const speed = climbSpeed(frame);
  const orbs = frame >= 640 ? orbiters(frame, pin) : [];
  const pull = pullK(frame);

  // star/dust brightness: darker during ignition, black in the 6-frame silence
  const skyDim = interpolate(frame, [T.ign, T.dark - 4, T.dark, T.lift], [1, 0.5, 0.15, 1], clamp);
  const showGround = frame < T.lift + 60;
  const endFade = interpolate(frame, [T.end - 4, T.end + 14], [1, 0.35], clamp);

  return (
    <AbsoluteFill style={{ background: "#020309", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          translate: `${sh.x}px ${sh.y}px`,
          rotate: `${sh.r}deg`,
          scale: 1.04,
        }}
      >
        <Sky frame={frame} />
        <Stars frame={frame} climb={climb} speed={speed} orbit={cam.orbit} dim={skyDim * endFade} />
        <Warp climb={climb} speed={speed} />
        {showGround && <Ground frame={frame} cam={cam} heat={pin.heat} />}
        <Countdown frame={frame} layer="back" />
        <CloudBand frame={frame} climb={climb} climbAtStart={climbAt(pbt(8) - 30)} />
        <Dust frame={frame} climb={climb} speed={speed} dim={skyDim * (0.6 + 0.4 * endFade)} />
        <Darkness frame={frame} />
        <EndCard frame={frame} />
        <AbsoluteFill
          style={{
            scale: 1 - 0.4 * pull,
            transformOrigin: `${pin.x}px ${pin.y - 100}px`,
          }}
        >
          <ContourTrail frame={frame} pin={pin} reach={pull * 1500} />
          <PassRings frame={frame} pin={pin} half="back" />
          <OrbitRing f={frame} s={pin} half="back" />
          {orbs.filter((o) => !o.front).map((o, i) => <Orbiter key={`b${i}`} o={o} />)}
          <Trail frame={frame} />
          <EndRings frame={frame} x={pin.x} y={pin.y} />
          <IgnitionPulse frame={frame} pin={pin} layer="back" />
          {frame >= T.lift && frame < T.lift + 12 &&
            [3, 2, 1].map((d) => (
              <PinGraphic key={`g${d}`} s={{ ...pinAt(frame - d), opacity: 0.32 - d * 0.08, heat: 0.4 }} />
            ))}
          <PinGraphic s={pin} punch={pinPunch(frame)} />
          <OrbitRing f={frame} s={pin} half="front" />
          <PassRings frame={frame} pin={pin} half="front" />
          <BoomRing frame={frame} x={pin.x} y={pin.y - 40} />
          {orbs.filter((o) => o.front).map((o, i) => <Orbiter key={`f${i}`} o={o} />)}
          <IgnitionPulse frame={frame} pin={pin} layer="front" />
        </AbsoluteFill>
        <Converge frame={frame} pin={pin} />
        <Flare x={pin.x} y={pin.y - 118 * pin.scale} k={flareK(frame)} warm={frame < T.lift} />
        <Countdown frame={frame} layer="front" />
        <SetupText frame={frame} />
        <IgnitionText frame={frame} />
        <LiftText frame={frame} />
      </AbsoluteFill>
      <Flash frame={frame} />
      <Vignette strength={frame >= T.end ? 0.45 : 0.75} />
      <Grain frame={frame} />
      <Letterbox frame={frame} />
      <Sound />
    </AbsoluteFill>
  );
};
