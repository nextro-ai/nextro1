"""Comparison sheet of the four palettes of `buscando_calma` (same six moments side by side).

Usage (from studio/): python3 src/reels/buscando_calma/comparacion.py
Reads out/buscando_calma-<theme>.final.mp4 and src/brand/themes.ts, writes
out/buscando_calma-comparacion.jpg (4 rows × 6 columns, thumbnails 270×480, labelled header bands).
"""
import os
import re
import subprocess

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
THEMES_TS = os.path.join(ROOT, "src", "brand", "themes.ts")
FONT = os.path.join(ROOT, "public", "fonts", "archivo-latin-var.woff2")
OUT = os.path.join(ROOT, "out", "buscando_calma-comparacion.jpg")
ORDER = ["web", "mono", "bosque", "marino"]
# (frame, label): the same six moments in every palette
MOMENTS = [
    (150, "Gancho"),
    (232, "Así te encuentra hoy"),
    (590, "Drop · con Lonso Lab"),
    (840, "Notificaciones"),
    (945, "Servicios"),
    (1170, "Cierre · CTA"),
]
SWATCHES = [("bg", "fondo"), ("ink", "texto"), ("dark", "campo"), ("accent", "acento")]
TW, TH = 270, 480
M, GAP, ROWGAP = 28, 12, 26
TOP, BAND = 158, 70


def themes():
    src = open(THEMES_TS, encoding="utf-8").read()
    out = {}
    for tid in ORDER:
        block = re.search(rf"\n  {tid}: \{{(.*?)\n  \}}", src, re.S).group(1)
        out[tid] = dict(re.findall(r'(\w+): "([^"]+)"', block))
    return out


def font(size, wght=700, wdth=100):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([wght, wdth])
    return f


def grab(theme):
    path = os.path.join(ROOT, "out", f"buscando_calma-{theme}.final.mp4")
    sel = "+".join(f"eq(n\\,{n})" for n, _ in MOMENTS)
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", f"select='{sel}',scale={TW}:{TH}:flags=lanczos",
         "-vsync", "0", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True).stdout
    n = TW * TH * 3
    assert len(raw) == n * len(MOMENTS), (theme, len(raw) // n)
    return [Image.frombytes("RGB", (TW, TH), raw[i * n:(i + 1) * n]) for i in range(len(MOMENTS))]


def main():
    th = themes()
    W = 2 * M + len(MOMENTS) * TW + (len(MOMENTS) - 1) * GAP
    H = TOP + len(ORDER) * (BAND + TH) + (len(ORDER) - 1) * ROWGAP + M
    S = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(S)
    ink, ink2 = "#16181d", "#5d6270"
    d.text((M, 22), "Te están buscando · versión pausada: las 4 paletas", fill=ink, font=font(34, 800, 112))
    d.text((M, 64), "Mismo video, mismos 6 momentos; solo cambian los colores.", fill=ink2, font=font(21, 480))
    for c, (fr, label) in enumerate(MOMENTS):
        x = M + c * (TW + GAP)
        d.text((x, TOP - 58), f"{c + 1} · {label}", fill=ink, font=font(21, 720))
        d.text((x, TOP - 30), f"{fr / 30:.1f} s".replace(".", ","), fill=ink2, font=font(17, 480))
    for r, tid in enumerate(ORDER):
        t = th[tid]
        y = TOP + r * (BAND + TH + ROWGAP)
        # header band: palette name + its main swatches
        d.rounded_rectangle((M, y, W - M, y + BAND - 8), radius=12, fill=t["bg"], outline=t["line"], width=2)
        d.text((M + 20, y + (BAND - 8) // 2), t["name"], fill=t["ink"], font=font(30, 800, 108), anchor="lm")
        sx = W - M - 20
        for key, lab in reversed(SWATCHES):
            lw = d.textlength(lab, font=font(18, 560))
            sx -= lw
            d.text((sx, y + (BAND - 8) // 2), lab, fill=t["ink2"], font=font(18, 560), anchor="lm")
            sx -= 8 + 34
            d.rounded_rectangle((sx, y + 14, sx + 34, y + BAND - 22), radius=8, fill=t[key], outline=t["line"], width=1)
            sx -= 22
        for c, im in enumerate(grab(tid)):
            x = M + c * (TW + GAP)
            S.paste(im, (x, y + BAND))
            d.rectangle((x, y + BAND, x + TW - 1, y + BAND + TH - 1), outline="#d8dadf", width=1)
    S.save(OUT, quality=90)
    print(OUT, S.size)


if __name__ == "__main__":
    main()
