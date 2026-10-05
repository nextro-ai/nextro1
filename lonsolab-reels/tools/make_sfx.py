"""Synthesize an original, royalty-free SFX kit for the Lonso Lab reels.

All sounds are generated from scratch (noise, sines, envelopes), so they carry
no third-party license. Output: 48 kHz stereo 16-bit WAV in studio/public/sfx.
"""
import os
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "studio", "public", "sfx")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env_adsr(n, a=0.005, d=0.05, s=0.6, r=0.2, sustain_time=0.0):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n)
    e = np.concatenate([
        np.linspace(0, 1, a_n, endpoint=False),
        np.linspace(1, s, d_n, endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, r_n),
    ])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def exp_env(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lowpass(x, f, order=2):
    sos = signal.butter(order, f, btype="low", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def highpass(x, f, order=2):
    sos = signal.butter(order, f, btype="high", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def sweep_filter(noise, f0, f1, q=2.0, steps=64):
    """Time-varying band-pass by processing short blocks (cheap but smooth enough)."""
    n = len(noise)
    out = np.zeros(n)
    block = n // steps + 1
    win = np.hanning(block * 2)
    for i in range(steps):
        start = max(0, i * block - block // 2)
        end = min(n, start + block * 2)
        frac = i / (steps - 1)
        fc = f0 * (f1 / f0) ** frac
        bw = fc / q
        lo, hi = max(20, fc - bw / 2), min(SR / 2 - 100, fc + bw / 2)
        seg = bandpass(noise[start:end], lo, hi)
        out[start:end] += seg * win[: end - start]
    return out


def stereo(x, width=0.0, delay_ms=0.0):
    if delay_ms <= 0 and width == 0:
        return np.stack([x, x], axis=1)
    d = int(SR * delay_ms / 1000)
    left = x
    right = np.concatenate([np.zeros(d), x])[: len(x)]
    mid = (left + right) / 2
    side = (left - right) / 2 * width
    return np.stack([mid + side, mid - side], axis=1)


def save(name, x, peak_db=-1.0):
    if x.ndim == 1:
        x = stereo(x)
    x = x / (np.max(np.abs(x)) + 1e-9) * (10 ** (peak_db / 20))
    # 5 ms fade in/out to avoid clicks
    f = int(0.005 * SR)
    x[:f] *= np.linspace(0, 1, f)[:, None]
    x[-f:] *= np.linspace(1, 0, f)[:, None]
    wavfile.write(os.path.join(OUT, name), SR, (x * 32767).astype(np.int16))
    print(f"{name:28s} {len(x)/SR:5.2f}s")


# --- Whooshes -----------------------------------------------------------------
def whoosh(dur=0.6, f0=300, f1=4000, peak=0.65, reverse=False):
    n = int(SR * dur)
    noise = rng.standard_normal(n)
    x = sweep_filter(noise, f0, f1, q=1.6)
    pk = int(n * peak)
    e = np.concatenate([np.linspace(0, 1, pk) ** 2.2, np.linspace(1, 0, n - pk) ** 1.6])
    x = x * e
    if reverse:
        x = x[::-1]
    return stereo(x, width=0.6, delay_ms=7)


save("whoosh_fast.wav", whoosh(0.35, 500, 6000, 0.55))
save("whoosh_med.wav", whoosh(0.6, 300, 4500, 0.6))
save("whoosh_long.wav", whoosh(1.1, 200, 3500, 0.7))
save("whoosh_down.wav", whoosh(0.6, 5000, 300, 0.35))
save("swipe.wav", whoosh(0.22, 1500, 8000, 0.4), peak_db=-4)

# --- Impacts / hits -------------------------------------------------------------
def impact(dur=1.2, f_start=140, f_end=38, punch=1.0, noise_amt=0.6, tail=0.45):
    n = int(SR * dur)
    tt = t(dur)
    f = f_end + (f_start - f_end) * np.exp(-tt / 0.06)
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * exp_env(n, tail)
    click = highpass(rng.standard_normal(n), 2000) * exp_env(n, 0.004) * 0.6 * punch
    crack = bandpass(rng.standard_normal(n), 200, 3000) * exp_env(n, 0.05) * noise_amt
    x = body + click + crack
    x = np.tanh(x * 1.8)
    return stereo(x, width=0.3, delay_ms=4)


save("impact_big.wav", impact(1.6, 160, 34, 1.0, 0.7, 0.6))
save("impact_short.wav", impact(0.5, 180, 50, 1.2, 0.5, 0.12))
save("boom_sub.wav", impact(2.2, 90, 28, 0.2, 0.15, 0.9))


def snap_hit():
    n = int(SR * 0.25)
    x = bandpass(rng.standard_normal(n), 800, 7000) * exp_env(n, 0.03)
    x += np.sin(2 * np.pi * 220 * t(0.25)) * exp_env(n, 0.02) * 0.4
    return stereo(x, width=0.4, delay_ms=3)


save("snap.wav", snap_hit(), peak_db=-3)

# --- Risers ---------------------------------------------------------------------
def riser(dur=2.0):
    n = int(SR * dur)
    tt = t(dur)
    noise = sweep_filter(rng.standard_normal(n), 200, 9000, q=2.5, steps=96)
    f = 120 * (16 ** (tt / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    tone += np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.12
    e = (tt / dur) ** 2.5
    x = (noise + tone) * e
    return stereo(x, width=0.7, delay_ms=9)


save("riser_2s.wav", riser(2.0))
save("riser_4s.wav", riser(4.0))

# --- UI sounds ------------------------------------------------------------------
def click(f=2400, dur=0.05, level=1.0):
    n = int(SR * dur)
    x = np.sin(2 * np.pi * f * t(dur)) * exp_env(n, 0.006)
    x += highpass(rng.standard_normal(n), 3000) * exp_env(n, 0.002) * 0.5
    return x * level


save("ui_click.wav", click(), peak_db=-6)
save("ui_tap.wav", click(1400, 0.08), peak_db=-6)


def pop():
    dur = 0.18
    n = int(SR * dur)
    tt = t(dur)
    f = 300 + 900 * np.exp(-tt / 0.02)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_env(n, 0.05)
    return x


save("pop.wav", pop(), peak_db=-4)


def ding(freqs=(1318.5, 1975.5), dur=1.2):
    n = int(SR * dur)
    x = np.zeros(n)
    for i, f in enumerate(freqs):
        start = int(i * 0.09 * SR)
        seg = n - start
        tt = np.arange(seg) / SR
        tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.01 * tt)
                + 0.1 * np.sin(2 * np.pi * f * 3.0 * tt)) * np.exp(-tt / 0.35)
        tone *= np.minimum(1.0, tt / 0.004)  # 4 ms attack avoids an onset click
        x[start:] += tone
    return stereo(x, width=0.3, delay_ms=12)


save("notif_ding.wav", ding(), peak_db=-5)
save("notif_msg.wav", ding((1046.5, 1568.0), 0.8), peak_db=-5)
save("success_chime.wav", ding((1046.5, 1318.5, 1568.0, 2093.0), 1.6), peak_db=-5)


def phone_ring(dur=1.6):
    tt = t(dur)
    gate = ((tt % 0.4) < 0.2).astype(float)
    x = (np.sin(2 * np.pi * 440 * tt) + np.sin(2 * np.pi * 480 * tt)) * gate * 0.5
    x = lowpass(x, 3500)
    return stereo(x, width=0.2, delay_ms=5)


save("phone_ring.wav", phone_ring(), peak_db=-6)


def typing(dur=1.6, rate=13):
    n = int(SR * dur)
    x = np.zeros(n)
    tt = 0.0
    while tt < dur - 0.05:
        k = click(rng.uniform(1800, 3200), 0.035, rng.uniform(0.5, 1.0))
        i = int(tt * SR)
        x[i : i + len(k)] += k[: n - i]
        tt += rng.uniform(0.6, 1.4) / rate
    return stereo(x, width=0.5, delay_ms=2)


save("typing.wav", typing(), peak_db=-8)


def glitch(dur=0.4):
    n = int(SR * dur)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        seg = int(rng.uniform(0.01, 0.05) * SR)
        kind = rng.integers(0, 3)
        tt = np.arange(seg) / SR
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * rng.uniform(80, 900) * tt))
        elif kind == 1:
            s = rng.standard_normal(seg)
        else:
            s = np.sin(2 * np.pi * rng.uniform(1000, 5000) * tt)
        x[pos : pos + seg] = s[: n - pos] * rng.uniform(0.3, 1.0)
        pos += seg
    x = np.round(x * 6) / 6  # bitcrush
    return stereo(x, width=0.8, delay_ms=6)


save("glitch_1.wav", glitch(0.35), peak_db=-6)
save("glitch_2.wav", glitch(0.6), peak_db=-6)


def tick():
    dur = 0.03
    n = int(SR * dur)
    return highpass(rng.standard_normal(n), 4000) * exp_env(n, 0.003)


save("tick.wav", tick(), peak_db=-10)


def camera_shutter():
    dur = 0.25
    n = int(SR * dur)
    x = bandpass(rng.standard_normal(n), 1500, 9000) * (exp_env(n, 0.01))
    second = bandpass(rng.standard_normal(n), 1000, 6000) * exp_env(n, 0.015)
    d = int(0.08 * SR)
    x[d:] += second[: n - d] * 0.8
    return stereo(x, width=0.3, delay_ms=3)


save("shutter.wav", camera_shutter(), peak_db=-5)

# --- Record scratch / tape stop -------------------------------------------------
def tape_stop(dur=0.7):
    tt = t(dur)
    f = 220 * (1 - tt / dur) ** 2 + 20
    x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (1 - tt / dur)
    x = lowpass(x, 2500)
    return stereo(x, width=0.2, delay_ms=4)


save("tape_stop.wav", tape_stop(), peak_db=-5)
print("done ->", os.path.abspath(OUT))
