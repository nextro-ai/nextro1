"""Master the audio of a rendered reel to -14 LUFS integrated / -1 dBTP (two-pass loudnorm),
copying the video stream untouched. Writes <name>.final.mp4 next to the input.

Usage: python3 tools/master.py studio/out/<reel>.mp4
"""
import json
import os
import subprocess
import sys


def main(path):
    out = os.path.splitext(path)[0] + ".final.mp4"
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af",
                           "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    js = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path, "-c:v", "copy", "-af",
                    "loudnorm=I=-14:TP=-1:LRA=11:linear=true:"
                    f"measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
                    f"measured_thresh={js['input_thresh']}:offset={js['target_offset']},aresample=48000",
                    "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out], check=True)
    chk = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    summary = chk[chk.rindex("Summary:"):]
    print(out)
    print(" ".join(summary.split()))


if __name__ == "__main__":
    main(sys.argv[1])
