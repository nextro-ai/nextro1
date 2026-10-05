"""Detect whole-frame shaking in a rendered reel.

For every pair of consecutive frames, estimates the global translation (phase correlation on a
downscaled grayscale frame). Reports runs where the frame keeps jumping by >= THRESH px for at
least MIN_RUN frames — that is sustained camera shake, which should only happen right after hits.

Usage: python3 tools/jitter_scan.py video.mp4 [--thresh 3] [--min-run 12]
"""
import argparse
import subprocess

import numpy as np


def frames(path, w=270, h=480):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                         stdout=subprocess.PIPE)
    n = w * h
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, np.uint8).reshape(h, w).astype(float)


def shift(a, b):
    A, B = np.fft.fft2(a), np.fft.fft2(b)
    R = A * np.conj(B)
    R /= np.abs(R) + 1e-9
    r = np.fft.ifft2(R).real
    y, x = np.unravel_index(np.argmax(r), r.shape)
    if y > r.shape[0] // 2:
        y -= r.shape[0]
    if x > r.shape[1] // 2:
        x -= r.shape[1]
    return x, y, r.max()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--thresh", type=float, default=3.0, help="px at 1080 width")
    ap.add_argument("--min-run", type=int, default=12)
    a = ap.parse_args()
    scale = 1080 / 270
    prev, mags = None, []
    for fr in frames(a.video):
        if prev is not None:
            x, y, conf = shift(fr, prev)
            # direction reversals = shake; a smooth pan keeps the same sign
            mags.append((np.hypot(x, y) * scale, x, y, conf))
        prev = fr
    runs, start, flips = [], None, 0
    for i, (m, x, y, conf) in enumerate(mags):
        shaky = m >= a.thresh and conf > 0.05
        if shaky and start is None:
            start = i
        if not shaky and start is not None:
            if i - start >= a.min_run:
                runs.append((start + 1, i))
            start = None
    if start is not None and len(mags) - start >= a.min_run:
        runs.append((start + 1, len(mags)))
    out = []
    for s, e in runs:
        seg = mags[s - 1:e]
        xs = np.sign([v[1] for v in seg if v[1] != 0])
        reversals = int(np.sum(xs[1:] != xs[:-1])) if len(xs) > 1 else 0
        out.append({"frames": f"{s}-{e}", "seconds": f"{s/30:.2f}-{e/30:.2f}", "max_px": round(max(v[0] for v in seg), 1),
                    "direction_reversals": reversals})
    print(a.video, "sustained-motion runs:", out if out else "none")


if __name__ == "__main__":
    main()
