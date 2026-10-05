import { Easing, interpolate } from "remotion";
import { noise2D } from "@remotion/noise";
import { EASE } from "../../brand";
import { IGN_TICKS, SHAKES, T } from "./timing";

/** Ignition: from here to the silence everything ramps harder (shake, vibration, particles). */
export const IGN_RAMP = 555;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Cam = {
  /** Screen position of the ground plane's centre (= where the pin stands). */
  cx: number;
  cy: number;
  /** Ground tilt (deg): 0 = top-down radar, ~62 = oblique "ground" view. */
  tilt: number;
  /** Rotation of the map around the pin (deg): the slow orbit. */
  orbit: number;
  /** Dolly / push-in scale. */
  zoom: number;
  /** Brightness of the radar layer 0..1. */
  light: number;
  /** Vertical screen y the perspective vanishes toward. */
  horizon: number;
};

const lerp = (f: number, a: number, b: number, from: number, to: number, easing = EASE.inOut) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing });

/** Camera state per frame. Scenes cut hard on beats, moves inside a scene are continuous. */
export const camAt = (f: number): Cam => {
  // S1: slow dolly + orbit around the pin.
  if (f < T.s2) {
    return {
      cx: 540,
      cy: 1150,
      tilt: 60,
      orbit: lerp(f, 0, T.s2, -16, -4, Easing.linear),
      zoom: lerp(f, 0, T.s2, 0.94, 1.0, Easing.linear),
      light: 1,
      horizon: 520,
    };
  }
  // S2: push-in to the pin, accelerating into the cut.
  if (f < T.s3) {
    return {
      cx: 540,
      cy: lerp(f, T.s2, T.s3, 1150, 1185, Easing.in(Easing.quad)),
      tilt: lerp(f, T.s2, T.s3, 60, 64),
      orbit: lerp(f, T.s2, T.s3, -4, 4, Easing.linear),
      zoom: lerp(f, T.s2, T.s3, 1.0, 1.55, Easing.in(Easing.cubic)),
      light: 1,
      horizon: 520,
    };
  }
  // S3: lights drop, pin in shadow, slow pull back.
  if (f < T.t3) {
    return {
      cx: 540,
      cy: 1170,
      tilt: 66,
      orbit: lerp(f, T.s3, T.t3, 18, 22, Easing.linear),
      zoom: lerp(f, T.s3, T.t3, 1.3, 1.18, EASE.salida),
      light: lerp(f, T.s3, T.s3 + 10, 0.55, 0.22),
      horizon: 520,
    };
  }
  // Countdown: top-down radar locked on the service icon (zone B).
  if (f < T.ign) {
    const i = f < T.t2 ? 0 : f < T.t1 ? 1 : 2;
    const at = [T.t3, T.t2, T.t1][i];
    return {
      cx: 540,
      cy: 905,
      tilt: [0, 18, 30][i],
      orbit: [0, 40, 80][i] + lerp(f, at, at + 72, 0, 7, Easing.linear),
      zoom: [1.0, 1.12, 1.24][i] + lerp(f, at, at + 72, 0, 0.06, EASE.salida),
      light: 1,
      horizon: 300,
    };
  }
  // Ignition: oblique ground, dark, slow tense push-in.
  if (f < T.lift) {
    return {
      cx: 540,
      cy: 1160,
      tilt: 64,
      orbit: lerp(f, T.ign, T.lift, 26, 34, Easing.linear),
      zoom: lerp(f, T.ign, T.lift, 1.12, 1.32, Easing.inOut(Easing.quad)),
      light: interpolate(f, [T.ign, T.ign + 20, T.dark - 8, T.dark], [0.6, 0.45, 0.16, 0.04], clamp),
      horizon: 520,
    };
  }
  // Liftoff: the pin leaves first (Pin.tsx), then the camera catches up. The ground scrolls down with the climb
  // (the launch pad stays at y = 1160 + climb, where the wake ends), tilts away and shrinks: it reads as receding
  // below until ~640, then fades (World.tsx).
  const k = interpolate(f, [T.lift + 4, T.lift + 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return {
    cx: 540,
    cy: 1160 + climbAt(f),
    tilt: 64 + k * 18,
    orbit: 34 + k * 30,
    zoom: 1.32 - k * 0.42,
    light: interpolate(f, [T.lift, T.lift + 3, T.lift + 30], [0.04, 1, 0.5], clamp),
    horizon: 520,
  };
};

/** Sum of decaying camera shakes (deterministic noise). */
export const shakeAt = (f: number) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const s of SHAKES) {
    const n = f - s.at;
    if (n < 0 || n > s.dur) continue;
    const k = Math.pow(1 - n / s.dur, 1.7);
    x += noise2D("dx", s.at * 0.31, n * 0.9) * s.amp * k;
    y += noise2D("dy", s.at * 0.47, n * 0.9) * s.amp * k * 0.8;
    r += noise2D("dr", s.at * 0.23, n * 0.7) * s.amp * k * 0.02;
  }
  // Ignition: a rumble that grows until the silence, much harder over the last ~40 f, plus a kick on every clock tick.
  if (f >= T.ign && f < T.dark) {
    const g = interpolate(f, [T.ign, T.dark - 1], [0, 1], clamp);
    const h = interpolate(f, [IGN_RAMP, T.dark - 1], [0, 1], clamp);
    const a = 1 + 5 * g * g + 17 * h * h * h;
    x += noise2D("ix", 0, f * 0.8) * a;
    y += noise2D("iy", 0, f * 0.8) * a;
    r += noise2D("ir", 0, f * 0.6) * 0.035 * a;
    IGN_TICKS.forEach((at, i) => {
      const n = f - at;
      if (n < 0 || n > 5) return;
      const kk = 1 - n / 5;
      x += noise2D("kx", i, n * 1.3) * (3 + i * 1.6) * kk;
      y += noise2D("ky", i, n * 1.3) * (3 + i * 1.6) * kk;
    });
  }
  return { x, y, r };
};

/**
 * Screen-space vertical "altitude" offset after liftoff: how far the world has scrolled down
 * because the camera follows the rising pin (px). Monotonic, continuous.
 */
export const climbAt = (f: number) => {
  const i = Math.max(0, Math.min(CLIMB.length - 1, Math.floor(f)));
  const fr = f - Math.floor(f);
  const a = CLIMB[i];
  const b = CLIMB[Math.min(CLIMB.length - 1, i + 1)];
  return a + (b - a) * fr;
};

export const climbSpeed = (f: number) => {
  if (f <= T.lift) return 0;
  // the camera lags the pin: almost still for the first frames (the pin travels up the screen), then it catches up
  // and holds a fast cruise (px/frame of world scroll)
  const burst = interpolate(f, [T.lift, T.lift + 6, T.lift + 14, T.lift + 24, T.lift + 35, T.lift + 60], [0, 4, 18, 40, 52, 44], clamp);
  const stop = interpolate(f, [T.rise, T.end + 8], [1, 0], { ...clamp, easing: EASE.inOut });
  return burst * stop;
};

/** Pre-integrated climb table (px), index = frame. */
const CLIMB: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (let f = 0; f <= 900; f++) {
    acc += climbSpeed(f);
    out.push(acc);
  }
  return out;
})();
