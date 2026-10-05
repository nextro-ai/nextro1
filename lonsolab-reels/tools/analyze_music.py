"""Analyse music tracks for beat-synced editing.

For every audio file given, writes <file>.analysis.json and <file>.analysis.png with:
  - tempo (BPM) and beat times, downbeat estimate (bar phase with strongest low-end onsets)
  - RMS energy curve (0.5 s hop) and onset-strength curve
  - candidate "drop" moments: biggest positive jumps in smoothed energy
  - candidate sections from novelty (self-similarity) boundaries
Usage: python3 tools/analyze_music.py file1.m4a file2.m4a ...
"""
import json
import sys

import librosa
import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402


def analyse(path):
    y, sr = librosa.load(path, sr=22050, mono=True)
    dur = len(y) / sr
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units="time", tightness=120)
    tempo = float(np.atleast_1d(tempo)[0])
    # Downbeat phase: choose the beat phase (0..3) whose beats carry the most low-frequency onset energy.
    y_low = librosa.effects.preemphasis(y, coef=-0.97)  # de-emphasis keeps lows
    onset_low = librosa.onset.onset_strength(y=y_low, sr=sr, fmax=200)
    times_on = librosa.times_like(onset_low, sr=sr)
    beat_strength = np.interp(beats, times_on, onset_low) if len(beats) else np.array([])
    phase_scores = [float(beat_strength[p::4].mean()) if len(beat_strength[p::4]) else 0 for p in range(4)]
    phase = int(np.argmax(phase_scores))
    downbeats = beats[phase::4]

    hop = int(sr * 0.5)
    rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0]
    rms_db = librosa.amplitude_to_db(rms, ref=np.max)
    t_rms = librosa.times_like(rms, sr=sr, hop_length=hop)
    smooth = np.convolve(rms_db, np.ones(4) / 4, mode="same")
    jump = np.diff(smooth, prepend=smooth[0])
    # drops: biggest energy rises, at least 6 s apart
    order = np.argsort(-jump)
    drops = []
    for i in order:
        tt = float(t_rms[i])
        if jump[i] < 2.0:
            break
        if all(abs(tt - d["t"]) > 6 for d in drops):
            # snap to nearest downbeat
            snap = float(downbeats[np.argmin(np.abs(downbeats - tt))]) if len(downbeats) else tt
            drops.append({"t": round(tt, 2), "snapped_downbeat": round(snap, 2), "rise_db": round(float(jump[i]), 1)})
        if len(drops) >= 6:
            break

    # Section boundaries via novelty on chroma+mfcc
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=2048)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, hop_length=2048)
    feat = np.vstack([librosa.util.normalize(chroma, axis=1), librosa.util.normalize(mfcc, axis=1)])
    k = max(2, min(10, int(dur // 15)))
    bounds = librosa.segment.agglomerative(feat, k)
    bound_t = librosa.frames_to_time(bounds, sr=sr, hop_length=2048)

    res = {
        "file": path,
        "duration": round(dur, 2),
        "tempo_bpm": round(tempo, 2),
        "beat_period_s": round(60 / tempo, 4) if tempo else None,
        "n_beats": int(len(beats)),
        "first_beats": [round(float(b), 3) for b in beats[:16]],
        "downbeat_phase": phase,
        "downbeats": [round(float(b), 3) for b in downbeats],
        "drops": drops,
        "sections": [round(float(b), 2) for b in bound_t],
        "energy_db_per_2s": [round(float(v), 1) for v in smooth[::4]],
    }
    with open(path + ".analysis.json", "w") as f:
        json.dump(res, f, indent=1)

    fig, ax = plt.subplots(2, 1, figsize=(14, 5), sharex=True)
    ax[0].plot(t_rms, rms_db, lw=0.8)
    ax[0].plot(t_rms, smooth, lw=1.6)
    for d in drops:
        ax[0].axvline(d["snapped_downbeat"], color="r", lw=1)
    for b in bound_t:
        ax[0].axvline(b, color="g", lw=0.8, ls="--")
    ax[0].set_title(f"{path.split('/')[-1]}  {tempo:.1f} BPM  dur {dur:.1f}s  (red=drops, green=sections)")
    ax[1].plot(times_on, onset_low, lw=0.5)
    for b in downbeats:
        ax[1].axvline(b, color="k", lw=0.3, alpha=0.4)
    ax[1].set_xlim(0, dur)
    ax[1].set_xticks(np.arange(0, dur, 5))
    plt.tight_layout()
    plt.savefig(path + ".analysis.png", dpi=60)
    plt.close(fig)
    return res


if __name__ == "__main__":
    for p in sys.argv[1:]:
        r = analyse(p)
        print(json.dumps({k: r[k] for k in ("file", "duration", "tempo_bpm", "downbeat_phase", "drops", "sections")}))
