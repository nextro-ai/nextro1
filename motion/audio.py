#!/usr/bin/env python3
"""Synthesises the NEXTRO motion soundtrack (120 BPM, A minor) from the cue sheet
exported by the timeline, so every whoosh, hit and impact lands on its animation.

    python3 motion/audio.py motion/build/cues.json motion/build/audio.wav
"""
import json
import sys
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def filt(x, kind, freq, order=2):
    sos = butter(order, freq, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x)


def saw(freq, t, phase=0.0):
    return 2.0 * ((freq * t + phase) % 1.0) - 1.0


def env_adsr(n, a=0.005, d=0.1, s=0.7, r=0.1, sustain_len=None):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n) if sustain_len is None else int(sustain_len * SR)
    e = np.concatenate([
        np.linspace(0, 1, max(a_n, 1), endpoint=False),
        np.linspace(1, s, max(d_n, 1), endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, max(r_n, 1)),
    ])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def note(n):
    """MIDI note → Hz."""
    return 440.0 * 2 ** ((n - 69) / 12)


class Bus:
    def __init__(self, dur):
        self.L = np.zeros(int(dur * SR) + SR)
        self.R = np.zeros_like(self.L)

    def add(self, sig, at, gain=1.0, pan=0.0):
        i = int(round(at * SR))
        if i >= len(self.L) or len(sig) == 0:
            return
        if i < 0:
            sig, i = sig[-i:], 0
        sig = sig[: len(self.L) - i]
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.L[i:i + len(sig)] += sig * gain * l * 1.414
        self.R[i:i + len(sig)] += sig * gain * r * 1.414

    def stereo(self):
        return np.stack([self.L, self.R])


# ---------------------------------------------------------------- instruments
def kick():
    t = t_axis(0.5)
    f = 46 + 120 * np.exp(-t / 0.032)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.30)
    click = filt(rng.standard_normal(len(t)), 'highpass', 2500) * np.exp(-t / 0.003) * 0.35
    return np.tanh(1.6 * (body + click))


def clap():
    t = t_axis(0.4)
    n = filt(rng.standard_normal(len(t)), 'bandpass', [900, 3200])
    e = np.zeros_like(t)
    for k, off in enumerate((0.0, 0.011, 0.022)):
        m = t >= off
        e[m] += np.exp(-(t[m] - off) / (0.006 if k < 2 else 0.11))
    return n * e * 0.6


def hat(open_=False):
    t = t_axis(0.25 if open_ else 0.08)
    n = filt(rng.standard_normal(len(t)), 'highpass', 7500)
    return n * np.exp(-t / (0.07 if open_ else 0.018)) * 0.5


def tick(freq=1900):
    t = t_axis(0.06)
    return np.sin(2 * np.pi * (freq - 600 * t / 0.06) * t) * np.exp(-t / 0.012)


def hit():
    """Tonal thump + click for kinetic type landing."""
    t = t_axis(0.35)
    f = 70 + 160 * np.exp(-t / 0.02)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
    snap = filt(rng.standard_normal(len(t)), 'bandpass', [1500, 6000]) * np.exp(-t / 0.01) * 0.5
    return np.tanh(1.4 * (tone + snap))


def impact(length=2.4):
    t = t_axis(length)
    f = 38 + 90 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    noise = filt(rng.standard_normal(len(t)), 'lowpass', 1800) * np.exp(-t / 0.25) * 0.5
    crack = filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t / 0.03) * 0.3
    return np.tanh(1.3 * (boom + noise + crack))


def sweep_noise(dur, f0, f1, shape):
    """Band-limited noise whose band slides from f0 to f1 (block-wise filtering)."""
    n = int(dur * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 24
    edges = np.linspace(0, n, blocks + 1).astype(int)
    win_pad = int(0.01 * SR)
    for b in range(blocks):
        a, z = edges[b], edges[b + 1]
        fc = f0 * (f1 / f0) ** ((a + z) / 2 / n)
        lo, hi = max(40, fc * 0.6), min(SR / 2 - 100, fc * 1.6)
        seg_a, seg_z = max(0, a - win_pad), min(n, z + win_pad)
        y = filt(x[seg_a:seg_z], 'bandpass', [lo, hi])
        w = np.ones(seg_z - seg_a)
        ramp = np.linspace(0, 1, win_pad)
        if seg_a < a:
            w[:win_pad] = ramp
        if seg_z > z:
            w[-win_pad:] = ramp[::-1]
        out[seg_a:seg_z] += y * w
    return out * shape


def whoosh(dur, rev=False):
    dur = max(dur, 0.2) + 0.25
    t = t_axis(dur)
    p = t / dur
    if rev:   # swells into the cut
        shape = p ** 2.2 * (p < 0.97)
        sig = sweep_noise(dur, 300, 7000, shape)
    else:     # passes by: rises then falls
        shape = np.sin(np.pi * np.clip(p, 0, 1)) ** 1.6
        sig = sweep_noise(dur, 500, 5000, shape)
    return sig * 0.9


def riser(dur):
    t = t_axis(dur)
    p = t / dur
    shape = p ** 2.5
    noise = sweep_noise(dur, 200, 9000, shape)
    f = 220 * 2 ** (p * 2)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * shape * 0.25
    out = noise * 0.8 + tone
    out[-int(0.04 * SR):] *= np.linspace(1, 0, int(0.04 * SR))
    return out


def pluck(freq, length=0.5):
    t = t_axis(length)
    tri = 2 * np.abs(saw(freq, t)) - 1
    s = 0.6 * np.sin(2 * np.pi * freq * t) + 0.4 * tri
    return filt(s, 'lowpass', min(9000, freq * 6)) * np.exp(-t / 0.16)


def pad_chord(freqs, dur, cutoff):
    t = t_axis(dur)
    sig = np.zeros_like(t)
    for f in freqs:
        for det, ph in ((-0.12, 0.0), (0.0, 0.33), (0.13, 0.71)):
            sig += saw(f * 2 ** (det / 12), t, ph)
    sig = filt(sig / (len(freqs) * 3), 'lowpass', cutoff, order=2)
    return sig * env_adsr(len(t), a=0.25, d=0.4, s=0.85, r=0.6)


def bass_note(freq, dur):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * filt(saw(freq, t), 'lowpass', 380)
    return s * env_adsr(len(t), a=0.004, d=0.08, s=0.65, r=0.05)


def reverb_ir(length=2.4, decay=0.55):
    t = t_axis(length)
    ir = np.stack([rng.standard_normal(len(t)), rng.standard_normal(len(t))])
    ir *= np.exp(-t / decay)
    ir[:, : int(0.012 * SR)] = 0  # pre-delay
    ir = np.stack([filt(ch, 'lowpass', 6500) for ch in ir])
    return ir / np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))


# ---------------------------------------------------------------- arrangement
CHORDS = [  # (pad voicing, bass root, arp tones) — Am · F · C · G
    ([57, 60, 64], 33, [69, 72, 76, 81]),
    ([53, 57, 60], 29, [65, 69, 72, 77]),
    ([55, 60, 64], 36, [67, 72, 76, 79]),
    ([55, 59, 62], 31, [67, 71, 74, 79]),
]


def in_ranges(t, ranges):
    return any(a <= t < b for a, b in ranges)


def main(cue_path, out_path):
    spec = json.load(open(cue_path))
    D = float(spec['duration'])
    cues = spec['cues']

    dry, verb, pads, bass = Bus(D + 3), Bus(D + 3), Bus(D + 3), Bus(D + 3)

    KICK = [(4.0, 8.0), (10.0, 31.0)]
    HATS = [(0.0, 31.0)]
    CLAP = [(4.0, 8.0), (10.0, 31.0)]
    BASS = [(4.0, 8.0), (10.0, 31.25)]
    ARP = [(8.0, 12.0), (24.0, 28.0)]

    k, c, ho, hc = kick(), clap(), hat(True), hat(False)
    kick_times = []
    pulse = filt(kick(), 'lowpass', 160)
    for i in range(1, 8):                     # heartbeat under the opening question
        dry.add(pulse, i * BEAT, 0.55 if i % 2 else 0.35)
    steps = int(D / (BEAT / 4))
    for s in range(steps):
        t = s * BEAT / 4
        pos = s % 16
        if in_ranges(t, KICK) and pos % 4 == 0:
            dry.add(k, t, 0.95)
            kick_times.append(t)
        if in_ranges(t, CLAP) and pos in (4, 12):
            dry.add(c, t, 0.45, pan=0.05)
            verb.add(c, t, 0.25)
        if in_ranges(t, HATS):
            intro = t < 4.0
            if pos % 4 == 2:
                dry.add(ho if (pos == 14 and not intro) else hc, t, 0.22 if intro else 0.28, pan=0.25)
            elif not intro or pos % 2 == 0:
                dry.add(hc, t, 0.06 if intro else 0.1, pan=-0.2)

    for b in range(int(np.ceil(D / BAR))):
        t0 = b * BAR
        chord, root, arp = CHORDS[b % 4]
        if t0 >= 31.5:
            break
        cutoff = 900 if t0 < 4 else 1300 if t0 < 10 else 1900
        lift = 2.4 if t0 < 4 else 1.7 if 8 <= t0 < 10 else 1.0   # intro + break carry the energy without drums
        pads.add(pad_chord([note(n) for n in chord], BAR + 0.6, cutoff), t0, 0.32 * lift, pan=0.0)
        pads.add(pad_chord([note(n + 12) for n in chord[:2]], BAR + 0.6, cutoff * 1.4), t0, 0.08 * lift, pan=0.4)
        if t0 < 4 or 8 <= t0 < 10:
            bass.add(bass_note(note(root), BAR) * env_adsr(int(BAR * SR), a=0.3, d=0.2, s=0.8, r=0.4), t0, 0.3)
        for e in range(8):
            te = t0 + e * BEAT / 2
            if in_ranges(te, BASS):
                bass.add(bass_note(note(root + (12 if e % 2 else 0)), BEAT / 2 * 0.92), te, 0.42)
        for s in range(16):
            ts = t0 + s * BEAT / 4
            if in_ranges(ts, ARP):
                fq = note(arp[(s * 3 + b) % 4] + (12 if s % 8 == 7 else 0))
                g = 0.2 if ts < 12 else 0.1
                pan = -0.45 if s % 2 else 0.45
                dry.add(pluck(fq), ts, g, pan=pan)
                verb.add(pluck(fq), ts, g * 1.2)
                dry.add(pluck(fq) * 0.5, ts + BEAT * 0.75, g * 0.5, pan=-pan)  # dotted-8th echo

    # final chord: Am held with a long tail
    pads.add(pad_chord([note(n) for n in (45, 57, 60, 64, 69)], 3.2, 2400), 31.5, 0.38)
    verb.add(pad_chord([note(n) for n in (57, 60, 64, 69, 76)], 3.0, 3000), 31.5, 0.25)
    for i, n in enumerate((69, 72, 76, 81)):
        dry.add(pluck(note(n), 1.2), 31.5 + i * 0.09, 0.12, pan=(-0.4, 0.4)[i % 2])
        verb.add(pluck(note(n), 1.2), 31.5 + i * 0.09, 0.2)

    # ---- cues from the timeline
    for q in cues:
        t, kind, g = float(q['t']), q['type'], float(q.get('gain', 1.0))
        if kind == 'impact':
            dry.add(impact(), t, 0.75 * g)
            verb.add(impact(), t, 0.35 * g)
        elif kind == 'final':
            dry.add(impact(3.0), t, 0.95)
            verb.add(impact(3.0), t, 0.5)
        elif kind == 'hit':
            dry.add(hit(), t, 0.42 * g)
            verb.add(hit(), t, 0.12 * g)
        elif kind == 'tick':
            dry.add(tick(), t, 0.16 * g, pan=0.15)
            verb.add(tick(), t, 0.06 * g)
        elif kind == 'whoosh':
            w = whoosh(float(q.get('dur', 0.5)), bool(q.get('rev')))
            start = t - 0.1
            dry.add(w, start, 0.42 * g)
            verb.add(w, start, 0.12 * g)
        elif kind == 'riser':
            r = riser(float(q['end']) - t)
            dry.add(r, t, 0.28 * g)
            verb.add(r, t, 0.12 * g)
        elif kind == 'shimmer':
            dur = float(q.get('dur', 1.0))
            n_notes = int(dur / (BEAT / 4))
            for i in range(n_notes):
                fq = note([81, 84, 88, 93, 88, 84][i % 6])
                dry.add(pluck(fq, 0.6) * 0.6, t + i * BEAT / 4, 0.07 * g, pan=np.sin(i) * 0.6)
                verb.add(pluck(fq, 0.6), t + i * BEAT / 4, 0.1 * g)

    # ---- sidechain (pads + bass duck under the kick)
    n = len(pads.L)
    duck = np.ones(n)
    tt = np.arange(n) / SR
    for kt in kick_times:
        i = int(kt * SR)
        seg = tt[i:i + int(0.4 * SR)] - kt
        duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - 0.65 * np.exp(-seg / 0.11))
    music = pads.stereo() * duck + bass.stereo() * duck

    ir = reverb_ir()
    wet_src = verb.stereo() + pads.stereo() * 0.35
    wet = np.stack([fftconvolve(wet_src[i], ir[i])[: n] for i in range(2)])

    mix = dry.stereo() + music + wet * 0.55
    mix = np.stack([filt(ch, 'highpass', 28) for ch in mix])
    mix = mix[:, : int(D * SR)]

    # gentle glue + loudness for social platforms (≈ -14 LUFS, peak < -1 dBFS)
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    fade_in, fade_out = int(0.01 * SR), int(0.45 * SR)
    mix[:, :fade_in] *= np.linspace(0, 1, fade_in)
    mix[:, -fade_out:] *= np.linspace(1, 0, fade_out) ** 1.5
    try:
        import pyloudnorm as pyln
        meter = pyln.Meter(SR)
        lufs = meter.integrated_loudness(mix.T)
        mix *= 10 ** ((-14.0 - lufs) / 20)
    except Exception:
        mix *= 0.25 / (np.sqrt(np.mean(mix ** 2)) + 1e-9)
    peak = np.max(np.abs(mix))
    if peak > 0.89:
        mix = np.tanh(mix / peak * 1.4) / np.tanh(1.4) * 0.89

    pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f'✓ {out_path}  ({D:.1f}s, {len(cues)} cues)')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
