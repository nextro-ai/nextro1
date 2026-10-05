"""Pitched variants of the kit's notification SFX so the 'rain' of notifications plays in tune
with the music bed (Playful Plucks, centred on G: safe notes G A C D).

Resamples (pitch + length change, like a music box) public/sfx/{notif_ding,notif_msg,pop}.wav
into public/notis/sfx/<name>_<note>.wav. Run from studio/: python3 src/reels/notis/tune_sfx.py
"""
import os
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly
from fractions import Fraction

SRC = "public/sfx"
DST = "public/notis/sfx"
os.makedirs(DST, exist_ok=True)

# base pitch of each source: notif_ding = E6 (+B6), notif_msg = C6 (+G6), pop = unpitched thump
VARIANTS = {
    "notif_ding": {"C": -4, "D": -2, "G": 3, "A": 5},
    "notif_msg": {"C": 0, "D": 2, "G": 7, "A": 9},
    "pop": {"1": 0, "2": 2, "3": 4, "4": 7},
}

for name, notes in VARIANTS.items():
    y, sr = sf.read(os.path.join(SRC, f"{name}.wav"))
    for note, semis in notes.items():
        ratio = 2 ** (semis / 12)  # pitch factor; output is 1/ratio as long
        fr = Fraction(ratio).limit_denominator(200)
        out = resample_poly(y, fr.denominator, fr.numerator, axis=0) if semis else y.copy()
        # 4 ms fade-out to avoid clicks
        n = int(0.004 * sr)
        out[-n:] *= np.linspace(1, 0, n)[:, None] if out.ndim > 1 else np.linspace(1, 0, n)
        short = name.replace("notif_", "")
        path = os.path.join(DST, f"{short}_{note}.wav")
        sf.write(path, out.astype(np.float32), sr, subtype="PCM_16")
        print(path, f"{len(out)/sr:.2f}s", f"x{float(fr):.3f}")
