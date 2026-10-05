"""Cut the beat-aligned music beds for every reel from the Suno masters.

Sources: assets/music/suno/<name>.m4a (AAC 200 kbps, 48 kHz, extracted from the public Suno
song videos). Output: studio/public/music/<reel>.wav (48 kHz stereo, -14 LUFS, 10 ms fades)
and docs/music-cuts.md + studio/src/brand/musicCuts.ts with the cue points relative to frame 0.

Every cut starts exactly on a downbeat measured with tools/beatgrid.py, so frame 0 is beat 1.
Cue times below are in seconds of the ORIGINAL song; they are converted to reel time.
"""
import json
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(ROOT, "assets", "music", "suno")
OUT = os.path.join(ROOT, "studio", "public", "music")
FPS = 30

CUTS = {
    "buscando": {
        "song": "1-buscando", "title": "Rise and Grind", "bpm": 132.1,
        "parts": [(112.961, 143.847)],
        "cues": {"tension_bar": 122.045, "drop": 123.862, "energy_down_endcard": 138.397},
    },
    "manifiesto": {
        "song": "2-manifiesto", "title": "Night Drift", "bpm": 131.8,
        "parts": [(29.542, 51.393)],
        "cues": {"dip_start": 36.825, "slam_back": 44.109},
    },
    "despegue": {
        "song": "3-despegue-b", "title": "The Ticking Overture (v2)", "bpm": 100.0,
        "parts": [(26.476, 55.276)],
        "cues": {"loud_bar": 36.076, "fade_starts": 42.0, "silence": 45.2, "impact": 46.655, "calm_endcard": 52.876},
    },
    "pov": {
        "song": "4-pov", "title": "Cozy Afternoon", "bpm": 85.9,
        "parts": [(4.215, 34.948)],
        "cues": {"breakdown": 15.391, "groove_back": 23.773},
    },
    "trabajo": {
        "song": "5-trabajo", "title": "Latin Funk Groove", "bpm": 121.8,
        # Phase corrected by the trabajo builder: the strong kick of bar 1 is one beat later than beatgrid.py said.
        "parts": [(139.587, 165.203)],
        "cues": {"dip": 143.528, "drop": 147.469},
    },
    "rebrand": {
        "song": "6-rebrand", "title": "Cold to Warm", "bpm": 92.2,
        # A: sparse cold piano intro; B: quiet breakdown then the warm bloom.
        "parts": [(0.170, 10.650), (122.854, 143.678)],
        "cues": {"splice": None, "bloom": 128.060},
    },
    "notis": {
        "song": "7-notis", "title": "Playful Plucks", "bpm": 120.0,
        "parts": [(16.760, 28.760)],
        "cues": {"loop_point": 28.760},
    },
}


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def song_to_reel(cut, t):
    """Map an original-song time to reel time across the concatenated parts."""
    acc = 0.0
    for a, b in cut["parts"]:
        if a <= t <= b:
            return acc + (t - a)
        acc += b - a
    return None


def main():
    os.makedirs(OUT, exist_ok=True)
    table = {}
    for reel, c in CUTS.items():
        src = os.path.join(SRC, c["song"] + ".m4a")
        tmp = []
        for i, (a, b) in enumerate(c["parts"]):
            p = os.path.join(OUT, f".{reel}_{i}.wav")
            fade = 0.010
            run(["ffmpeg", "-y", "-v", "error", "-i", src, "-af",
                 f"atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={b - a - fade}:d={fade}",
                 "-ar", "48000", "-ac", "2", p])
            tmp.append(p)
        joined = os.path.join(OUT, f".{reel}_joined.wav")
        if len(tmp) == 1:
            os.replace(tmp[0], joined)
        else:
            # short equal-power crossfade at the splice (both sides are on downbeats)
            run(["ffmpeg", "-y", "-v", "error", "-i", tmp[0], "-i", tmp[1], "-filter_complex",
                 "[0][1]acrossfade=d=0.06:c1=qsin:c2=qsin", "-ar", "48000", joined])
            for p in tmp:
                os.remove(p)
        final = os.path.join(OUT, f"{reel}.wav")
        # loudness-normalise the bed to -14 LUFS / -1.5 dBTP (two-pass)
        meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", joined, "-af",
                               "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                              capture_output=True, text=True).stderr
        js = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
        run(["ffmpeg", "-y", "-v", "error", "-i", joined, "-af",
             "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:"
             f"measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
             f"measured_thresh={js['input_thresh']}:offset={js['target_offset']}",
             "-ar", "48000", "-ac", "2", final])
        os.remove(joined)
        dur = sum(b - a for a, b in c["parts"])
        period = 60.0 / c["bpm"]
        cues = {}
        for k, t in c["cues"].items():
            if k == "splice":
                t_reel = c["parts"][0][1] - c["parts"][0][0]
            else:
                t_reel = song_to_reel(c, t)
            cues[k] = {"s": round(t_reel, 3), "frame": round(t_reel * FPS)}
        table[reel] = {
            "file": f"music/{reel}.wav", "song": c["title"], "bpm": c["bpm"],
            "beat_frames": round(period * FPS, 4), "bar_frames": round(4 * period * FPS, 4),
            "duration_s": round(dur, 3), "duration_frames": int(dur * FPS),
            "cues": cues,
        }
        print(reel, table[reel]["duration_frames"], "frames", cues)

    ts = "// Generated by tools/cut_music.py — beat-aligned music beds (frame 0 = downbeat).\n"
    ts += "// beatFrame(n) = Math.round(n * beat_frames). Cue frames are where the music event lands.\n"
    ts += "export const MUSIC = " + json.dumps(table, indent=2, ensure_ascii=False) + " as const;\n"
    ts += "export const beatFrame = (bpm: number, n: number, fps = 30) => Math.round((n * 60 * fps) / bpm);\n"
    with open(os.path.join(ROOT, "studio", "src", "brand", "musicCuts.ts"), "w") as f:
        f.write(ts)

    md = ["# Cortes de música por reel", "",
          "Generado por `tools/cut_music.py`. Cada corte empieza en un downbeat (frame 0 = tiempo 1 del compás).",
          "Archivos en `studio/public/music/<reel>.wav`, normalizados a −14 LUFS. Pistas de Suno del usuario (plan de pago).", "",
          "| Reel | Canción | BPM | Frames/beat | Duración | Cues (s · frame) |", "|---|---|---|---|---|---|"]
    for reel, t in table.items():
        cues = ", ".join(f"{k} {v['s']}s · f{v['frame']}" for k, v in t["cues"].items())
        md.append(f"| {reel} | {t['song']} | {t['bpm']} | {t['beat_frames']} | {t['duration_s']} s ({t['duration_frames']} f) | {cues} |")
    with open(os.path.join(ROOT, "docs", "music-cuts.md"), "w") as f:
        f.write("\n".join(md) + "\n")


if __name__ == "__main__":
    main()
