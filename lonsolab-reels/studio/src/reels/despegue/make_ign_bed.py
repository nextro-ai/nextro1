"""Ignition bed for Despegue (f504 -> f599): a C drone + low rumble + a heartbeat thump on every clock tick.

It fills the near-silent trough after T-1 (the track fades out from f466), so the 6 frames of silence at
599-604 stay the only hole. The music centres on C, so the drone is C2/G2/C3. It has harmonics up to ~1.5 kHz
so it still reads on a phone speaker, where the sub does not.

Usage (from studio/): python3 src/reels/despegue/make_ign_bed.py  -> public/despegue/ign_bed.wav
Deterministic (fixed seed). Original material, no third-party samples.
"""
import os

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
START, END = 504, 599  # absolute frames; the bed is placed at START and is cut at END
TICKS = [504, 522, 540, 558, 567, 576, 585, 591, 595]  # = IGN_TICKS in timing.ts
N = int(round((END - START) / FPS * SR))
t = np.arange(N) / SR
T = N / SR
rng = np.random.default_rng(605)


def db(x):
    return 10 ** (x / 20)


def drone(detune):
    """Saw-like additive drone with a cutoff that opens over time (tension)."""
    out = np.zeros(N)
    cutoff = 380 + 1100 * (t / T) ** 1.6
    for f0, amp in [(65.41, 1.0), (98.0, 0.55), (130.81, 0.5)]:
        f = f0 + detune
        for n in range(1, 24):
            fn = f * n
            if fn > 4000:
                break
            # one-pole-ish lowpass weight per harmonic, with a slow tremolo on the upper partials
            w = 1.0 / n / np.sqrt(1 + (fn / cutoff) ** 4)
            trem = 1 + 0.18 * np.sin(2 * np.pi * (0.9 + 0.35 * n) * t + n)
            out += amp * w * trem * np.sin(2 * np.pi * fn * t + rng.uniform(0, 2 * np.pi))
    return out


def rumble():
    x = rng.standard_normal(N)
    sos = butter(2, [45, 420], btype="band", fs=SR, output="sos")
    y = sosfilt(sos, x)
    return y / np.max(np.abs(y))


def thump(i):
    """Heartbeat hit: pitch-dropping sine + its octave (audible on phones) + a soft click."""
    d = int(0.32 * SR)
    tt = np.arange(d) / SR
    f = 48 + 52 * np.exp(-tt / 0.045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.exp(-tt / 0.09) * (1 - np.exp(-tt / 0.002))
    body = np.sin(ph) + 0.55 * np.sin(2 * ph) + 0.18 * np.sin(3 * ph)
    click = rng.standard_normal(d) * np.exp(-tt / 0.006)
    click = sosfilt(butter(2, [1200, 3500], btype="band", fs=SR, output="sos"), click)
    return (body * env + 0.25 * click) * (0.75 + 0.05 * i)


def build(detune):
    x = 0.55 * drone(detune) / 2.2
    x += 0.38 * rumble()
    # level ramp: ~-25 dBFS RMS at the start to ~-20 at the end
    ramp = db(-4.5) + (1 - db(-4.5)) * (t / T) ** 1.3
    x *= ramp
    for i, at in enumerate(TICKS):
        o = int(round((at - START) / FPS * SR))
        th = thump(i)
        e = min(N, o + len(th))
        x[o:e] += 0.7 * th[: e - o]
    return x


L = build(+0.12)
R = build(-0.12)
y = np.stack([L, R], 1)
# 100 ms fade-in, and a fade-out over the last 2 frames so nothing spills into the 599-604 silence
fi = np.clip(t / 0.1, 0, 1)
fo = np.clip((T - t) / (2 / FPS), 0, 1)
y *= (fi * fo)[:, None]
# normalise: sustained RMS of the first second to -25 dBFS
rms0 = np.sqrt(np.mean(y[: SR, 0] ** 2))
y *= db(-25) / rms0
pk = np.max(np.abs(y))
if pk > db(-3):
    y *= db(-3) / pk
out = os.path.join(os.path.dirname(__file__), "../../../public/despegue/ign_bed.wav")
os.makedirs(os.path.dirname(out), exist_ok=True)
sf.write(out, y.astype(np.float32), SR, subtype="PCM_24")
hop = SR // FPS
r = [20 * np.log10(np.sqrt(np.mean(y[k * hop:(k + 1) * hop, 0] ** 2)) + 1e-9) for k in range(len(y) // hop)]
print(os.path.abspath(out), f"{T:.3f}s", "peak", f"{20*np.log10(np.max(np.abs(y))):.1f} dBFS")
print(" ".join(f"{START+k}:{v:.0f}" for k, v in enumerate(r) if k % 3 == 0))
