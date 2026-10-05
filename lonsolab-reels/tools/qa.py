"""QA helper for a rendered reel.

Usage: python3 tools/qa.py studio/out/<reel>.mp4 [--every 0.5] [--cols 6]

Produces next to the video:
  <reel>.qa/contact.jpg   grid of frames (with Instagram safe-zone guides + timestamps)
  <reel>.qa/frames/*.jpg  individual frames
and prints duration, resolution, fps, integrated loudness (LUFS) and true peak.
"""
import argparse
import json
import os
import re
import subprocess
from PIL import Image, ImageDraw, ImageFont

SAFE_TOP, SAFE_BOTTOM, SAFE_LEFT, SAFE_RIGHT = 250, 420, 64, 150


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,duration",
         "-show_entries", "format=duration", "-of", "json", path],
        capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def loudness(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    txt = r.stderr
    i = re.findall(r"I:\s+(-?[\d.]+) LUFS", txt)
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", txt)
    return (float(i[-1]) if i else None, float(tp[-1]) if tp else None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--every", type=float, default=0.5)
    ap.add_argument("--cols", type=int, default=6)
    ap.add_argument("--thumb", type=int, default=270)
    a = ap.parse_args()

    info = probe(a.video)
    dur = float(info["format"]["duration"])
    base = os.path.splitext(a.video)[0] + ".qa"
    fdir = os.path.join(base, "frames")
    os.makedirs(fdir, exist_ok=True)
    for f in os.listdir(fdir):
        os.remove(os.path.join(fdir, f))
    subprocess.run(["ffmpeg", "-v", "error", "-i", a.video, "-vf", f"fps=1/{a.every}", "-q:v", "3",
                    os.path.join(fdir, "f_%04d.jpg")], check=True)
    frames = sorted(os.listdir(fdir))
    tw = a.thumb
    th = int(tw * 1920 / 1080)
    rows = (len(frames) + a.cols - 1) // a.cols
    sheet = Image.new("RGB", (a.cols * tw, rows * (th + 22)), "white")
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    except OSError:
        font = ImageFont.load_default()
    sx = tw / 1080
    for idx, name in enumerate(frames):
        im = Image.open(os.path.join(fdir, name)).convert("RGB").resize((tw, th))
        g = ImageDraw.Draw(im)
        g.rectangle([SAFE_LEFT * sx, SAFE_TOP * sx, tw - SAFE_RIGHT * sx, th - SAFE_BOTTOM * sx], outline=(255, 0, 90), width=1)
        x, y = (idx % a.cols) * tw, (idx // a.cols) * (th + 22)
        sheet.paste(im, (x, y + 22))
        d.text((x + 4, y + 3), f"{idx * a.every + a.every / 2:.1f}s", fill="black", font=font)
    sheet.save(os.path.join(base, "contact.jpg"), quality=85)
    lufs, tp = loudness(a.video)
    v = [s for s in info["streams"] if s["codec_type"] == "video"][0]
    print(json.dumps({
        "video": a.video, "duration_s": round(dur, 2), "size": f'{v["width"]}x{v["height"]}', "fps": v["r_frame_rate"],
        "has_audio": any(s["codec_type"] == "audio" for s in info["streams"]),
        "integrated_lufs": lufs, "true_peak_dbfs": tp, "contact_sheet": os.path.join(base, "contact.jpg"),
        "frames": len(frames),
    }, indent=1))


if __name__ == "__main__":
    main()
