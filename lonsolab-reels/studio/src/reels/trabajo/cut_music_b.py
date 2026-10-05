"""Re-cut of the "trabajo" bed, one beat later than tools/cut_music.py (reel-local, does not touch the kit).

The bass analysis (30-120 Hz) of 5-trabajo.m4a shows the real section lines one beat after the kit's cut:
the bass drops out at ~143.53 s (dip) and the full groove comes back at ~147.47 s (drop). Starting the bed at
139.587 s (instead of 139.094 s) puts the dip on f118, the drop on f236 and every bar line on the reel's grid.
Same loudness chain as tools/cut_music.py (10 ms fades, two-pass loudnorm -14 LUFS / -1.5 dBTP, 48 kHz stereo).

It also writes two louder UI clicks for this reel (public/trabajo/sfx/), because the kit's `tick` peaks at -17 dBFS
with all its energy above 10 kHz and disappears under this dense funk bed:
- tick_hot.wav: kit tick +12 dB layered with kit ui_click +6 dB (a brighter, fuller click for words / counter).
- ui_tap_hot.wav: kit ui_tap +8 dB.
Sources are the kit's own generated SFX (tools/make_sfx.py), so no third-party material is added.

Usage (from lonsolab-reels/): python3 studio/src/reels/trabajo/cut_music_b.py
"""
import json
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
SRC = os.path.join(ROOT, "assets", "music", "suno", "5-trabajo.m4a")
OUT_DIR = os.path.join(ROOT, "studio", "public", "trabajo")
OUT = os.path.join(OUT_DIR, "trabajo-b.wav")
A, B = 139.587, 165.203  # 768 frames @ 30 fps


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    tmp = os.path.join(OUT_DIR, ".trabajo-b_raw.wav")
    fade = 0.010
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", SRC, "-af",
                    f"atrim=start={A}:end={B},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={B - A - fade}:d={fade}",
                    "-ar", "48000", "-ac", "2", tmp], check=True)
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af",
                           "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    js = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af",
                    "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:"
                    f"measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
                    f"measured_thresh={js['input_thresh']}:offset={js['target_offset']}",
                    "-ar", "48000", "-ac", "2", OUT], check=True)
    os.remove(tmp)
    print(OUT, f"{B - A:.3f} s")

    kit = os.path.join(ROOT, "studio", "public", "sfx")
    sfx_dir = os.path.join(OUT_DIR, "sfx")
    os.makedirs(sfx_dir, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(kit, "tick.wav"), "-i", os.path.join(kit, "ui_click.wav"),
                    "-filter_complex", "[0]volume=12dB[a];[1]volume=6dB[b];[a][b]amix=inputs=2:duration=longest:normalize=0,"
                    "alimiter=limit=0.89:level=false",
                    "-ar", "48000", "-ac", "2", os.path.join(sfx_dir, "tick_hot.wav")], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(kit, "ui_tap.wav"), "-af", "volume=8dB,alimiter=limit=0.89:level=false",
                    "-ar", "48000", "-ac", "2", os.path.join(sfx_dir, "ui_tap_hot.wav")], check=True)
    print(sfx_dir)


if __name__ == "__main__":
    main()
