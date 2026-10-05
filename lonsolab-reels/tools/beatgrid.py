"""Precise beat grid for a known tempo.

Given a track, a tempo (BPM) and an analysis window, find the beat phase that best
matches onsets, pick the downbeat phase (strongest low-end onsets), and print
downbeat times plus a per-bar energy profile so edit points can be chosen by eye.

Usage: python3 tools/beatgrid.py <wav> <bpm> <start_s> <end_s>
"""
import json
import sys

import librosa
import numpy as np


def grid(path, bpm, a, b):
    y, sr = librosa.load(path, sr=44100, mono=True, offset=a, duration=b - a)
    hop = 64
    fps = sr / hop
    o = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    yl = librosa.effects.preemphasis(y, coef=-0.97)
    ol = librosa.onset.onset_strength(y=yl, sr=sr, hop_length=hop, fmax=150)
    t = np.arange(len(o)) / fps
    period = 60.0 / bpm
    # phase search (1 ms steps) maximising onset strength on the grid
    best = None
    for ph in np.arange(0, period, 0.001):
        g = np.arange(ph, b - a, period)
        s = np.interp(g, t, o).mean()
        if best is None or s > best[0]:
            best = (s, ph)
    ph = best[1]
    beats = np.arange(ph, b - a, period)
    low = np.interp(beats, t, ol)
    dphase = int(np.argmax([low[k::4].mean() for k in range(4)]))
    downs = beats[dphase::4]
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    trms = np.arange(len(rms)) * 512 / sr
    bars = []
    for d in downs:
        m = (trms >= d) & (trms < d + 4 * period)
        e = 20 * np.log10(rms[m].mean() + 1e-9) if m.any() else None
        bars.append({"t": round(float(d + a), 3), "energy_db": round(float(e), 1) if e is not None else None})
    return {"bpm": bpm, "period": period, "beat_phase_s": round(float(ph + a), 4), "downbeat_index": dphase, "bars": bars}


if __name__ == "__main__":
    path, bpm, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
    r = grid(path, bpm, a, b)
    print(json.dumps(r))
