"""Procedural assets for the Rebrand reel (deterministic, seeded).

Run from studio/:  python3 src/reels/rebrand/gen_assets.py
Writes:
  public/rebrand/frost_edges.png   1080x1920 RGBA ice ferns growing in from the edges
  public/rebrand/frost_disc.png    800x800 RGBA ferns growing in from a circle's rim
  public/rebrand/grain.png         512x512 RGBA film grain tile
  public/rebrand/sfx/ice_crack.wav short crackle with a low thump (one per crack burst)
  public/rebrand/sfx/ice_shatter.wav glassy shatter tail for the bloom
  public/rebrand/sfx/glass_ting.wav  soft glass ting in E-flat (hook)
  public/rebrand/sfx/cold_air.wav    cold air bed (hook)
  src/reels/rebrand/shatter.ts     shard polygons + crack segments for the bloom
"""
import json
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.abspath(os.path.join(ROOT, "..", "..", ".."))
PUB = os.path.join(STUDIO, "public", "rebrand")
os.makedirs(os.path.join(PUB, "sfx"), exist_ok=True)


# ---------------------------------------------------------------- frost ferns
def fern(draw, rnd, x, y, ang, length, depth, ss, width, alpha, maxd=3, prob=0.55):
    """Recursive ice fern: a slightly wavy main branch with side branches at ~60 deg."""
    step = rnd.uniform(9, 15) * ss
    travelled = 0.0
    px, py = x, y
    while travelled < length:
        ang += rnd.uniform(-0.09, 0.09)
        nx, ny = px + math.cos(ang) * step, py + math.sin(ang) * step
        a = int(alpha * (1 - 0.55 * travelled / length))
        draw.line([(px, py), (nx, ny)], fill=(240, 247, 255, a), width=max(1, int(width * ss)))
        if depth < maxd and rnd.random() < prob:
            rem = (length - travelled) * rnd.uniform(0.28, 0.5)
            side = 1 if rnd.random() < 0.5 else -1
            fern(draw, rnd, nx, ny, ang + side * rnd.uniform(0.9, 1.15), rem, depth + 1, ss,
                 width * 0.62, alpha * 0.9, maxd, prob)
            if rnd.random() < 0.6:
                fern(draw, rnd, nx, ny, ang - side * rnd.uniform(0.9, 1.15), rem * 0.85, depth + 1, ss,
                     width * 0.62, alpha * 0.9, maxd, prob)
        px, py = nx, ny
        travelled += step


def frost_edges():
    W, H, ss = 1080, 1920, 2
    rnd = random.Random(7)
    img = Image.new("RGBA", (W * ss, H * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    seeds = []
    for x in range(0, W, 72):  # top / bottom
        seeds.append((x + rnd.uniform(-16, 16), -4, math.pi / 2))
        seeds.append((x + rnd.uniform(-16, 16), H + 4, -math.pi / 2))
    for y in range(0, H, 72):  # left / right
        seeds.append((-4, y + rnd.uniform(-16, 16), 0.0))
        seeds.append((W + 4, y + rnd.uniform(-16, 16), math.pi))
    for (x, y, a) in seeds:
        # longer ferns near the corners
        cx = min(x, W - x) / (W / 2)
        cy = min(y, H - y) / (H / 2)
        corner = 1 - min(cx, cy)
        length = rnd.uniform(40, 150) + 300 * corner ** 2.4 * rnd.uniform(0.6, 1.0)
        fern(d, rnd, x * ss, y * ss, a + rnd.uniform(-0.6, 0.6), length * ss, 0, ss, 1.7, 210, 2, 0.42)
    img = img.resize((W, H), Image.LANCZOS)
    glow = img.filter(ImageFilter.GaussianBlur(5))
    ga = np.array(glow).astype(np.float32)
    ga[..., 3] *= 0.55
    glow = Image.fromarray(ga.astype(np.uint8))
    # soft frosty haze hugging the edges
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.minimum.reduce([xx, W - xx, yy, H - yy]).astype(np.float32)
    haze = np.clip(1 - dist / 220, 0, 1) ** 2.2 * 95
    base = np.zeros((H, W, 4), np.float32)
    base[..., :3] = 240, 246, 255
    base[..., 3] = haze
    out = Image.alpha_composite(Image.fromarray(base.astype(np.uint8)), glow)
    out = Image.alpha_composite(out, img)
    out.save(os.path.join(PUB, "frost_edges.png"), optimize=True)


def frost_disc():
    S, ss = 800, 2
    R = S / 2
    rnd = random.Random(11)
    img = Image.new("RGBA", (S * ss, S * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    n = 70
    for i in range(n):
        t = 2 * math.pi * i / n + rnd.uniform(-0.03, 0.03)
        x, y = R + math.cos(t) * (R - 2), R + math.sin(t) * (R - 2)
        inward = t + math.pi + rnd.uniform(-0.45, 0.45)
        fern(d, rnd, x * ss, y * ss, inward, rnd.uniform(70, 250) * ss, 0, ss, 1.8, 225)
    # a few crystals floating inside
    for _ in range(26):
        rr = rnd.uniform(0, R * 0.7)
        t = rnd.uniform(0, 2 * math.pi)
        x, y = R + math.cos(t) * rr, R + math.sin(t) * rr
        for k in range(6):
            a = k * math.pi / 3 + rnd.uniform(-0.1, 0.1)
            fern(d, rnd, x * ss, y * ss, a, rnd.uniform(8, 24) * ss, 2, ss, 1.0, 160)
    img = img.resize((S, S), Image.LANCZOS)
    glow = img.filter(ImageFilter.GaussianBlur(4))
    yy, xx = np.mgrid[0:S, 0:S]
    r = np.sqrt((xx - R) ** 2 + (yy - R) ** 2)
    haze = np.clip((r - R * 0.35) / (R * 0.65), 0, 1) ** 2 * 150 * (r < R)
    base = np.zeros((S, S, 4), np.float32)
    base[..., :3] = 242, 247, 255
    base[..., 3] = haze
    out = Image.alpha_composite(Image.fromarray(base.astype(np.uint8)), glow)
    out = Image.alpha_composite(out, img)
    out.save(os.path.join(PUB, "frost_disc.png"), optimize=True)


def grain():
    rng = np.random.default_rng(3)
    S = 512
    n = rng.normal(0.5, 0.22, (S, S))
    # slightly clumpy grain
    n = (n + np.roll(n, 1, 0) * 0.35 + np.roll(n, 1, 1) * 0.35) / 1.7
    g = np.clip(n * 255, 0, 255).astype(np.uint8)
    rgba = np.dstack([g, g, g, np.full_like(g, 255)])
    Image.fromarray(rgba).save(os.path.join(PUB, "grain.png"), optimize=True)


# ---------------------------------------------------------------- shatter geometry
def shatter():
    rnd = random.Random(23)
    cx, cy = 540.0, 960.0
    K = 13
    radii = [0, 64, 140, 240, 370, 540, 760, 1040, 1400]
    thetas = []
    for k in range(K):
        thetas.append(2 * math.pi * k / K + rnd.uniform(-0.16, 0.16))
    V = {}
    for k in range(K):
        for j, r in enumerate(radii):
            if j == 0:
                V[(k, j)] = (cx, cy)
                continue
            th = thetas[k] + rnd.uniform(-0.07, 0.07) * (1 if j > 1 else 0.5)
            rr = r * rnd.uniform(0.86, 1.14)
            V[(k, j)] = (cx + math.cos(th) * rr, cy + math.sin(th) * rr)

    edges = {}

    def edge(a, b):
        key = (a, b) if a < b else (b, a)
        if key not in edges:
            pa, pb = V[key[0]], V[key[1]]
            # jagged polyline: 1-3 interior points with perpendicular jitter
            n = rnd.choice([1, 2, 2, 3])
            pts = [pa]
            dx, dy = pb[0] - pa[0], pb[1] - pa[1]
            L = math.hypot(dx, dy) or 1
            nx, ny = -dy / L, dx / L
            for i in range(1, n + 1):
                t = i / (n + 1) + rnd.uniform(-0.08, 0.08)
                j = rnd.uniform(-1, 1) * min(16, L * 0.07)
                pts.append((pa[0] + dx * t + nx * j, pa[1] + dy * t + ny * j))
            pts.append(pb)
            edges[key] = pts
        pts = edges[key]
        return pts if key[0] == a else list(reversed(pts))

    shards = []
    for k in range(K):
        k2 = (k + 1) % K
        for j in range(len(radii) - 1):
            if j == 0:
                ring = [(k, 0), (k, 1), (k2, 1)]
            else:
                ring = [(k, j), (k, j + 1), (k2, j + 1), (k2, j)]
            poly = []
            for i in range(len(ring)):
                a, b = ring[i], ring[(i + 1) % len(ring)]
                if a == b or V[a] == V[b]:
                    continue
                seg = edge(a, b)
                poly.extend(seg[:-1])
            xs = [p[0] for p in poly]
            ys = [p[1] for p in poly]
            gx, gy = sum(xs) / len(xs), sum(ys) / len(ys)
            shards.append({
                "pts": [[round(p[0], 1), round(p[1], 1)] for p in poly],
                "c": [round(gx, 1), round(gy, 1)],
                "ring": j,
                "seed": round(rnd.random(), 4),
            })
    cracks = []
    for key, pts in edges.items():
        (ka, ja), (kb, jb) = key
        r0 = min(radii[ja], radii[jb])
        r1 = max(radii[ja], radii[jb])
        radial = ka == kb
        d = "M" + " L".join(f"{p[0]:.1f} {p[1]:.1f}" for p in pts)
        cracks.append({"d": d, "r0": r0, "r1": r1 if radial else r0 + 1, "radial": radial})
    cracks.sort(key=lambda c: c["r0"])
    with open(os.path.join(ROOT, "shatter.ts"), "w") as f:
        f.write("// Generated by gen_assets.py: radial 'impact glass' fracture centred on the old logo.\n")
        f.write(f"export const SHATTER_CENTER = {{ x: {cx}, y: {cy} }};\n")
        f.write("export const SHARDS: { pts: number[][]; c: number[]; ring: number; seed: number }[] = ")
        f.write(json.dumps(shards, separators=(",", ":")) + ";\n")
        f.write("export const CRACKS: { d: string; r0: number; r1: number; radial: boolean }[] = ")
        f.write(json.dumps(cracks, separators=(",", ":")) + ";\n")


# ---------------------------------------------------------------- sfx
SR = 48000


def write(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.7
    st = np.stack([x, x], 1)
    wavfile.write(os.path.join(PUB, "sfx", name), SR, (st * 32767).astype(np.int16))


def ice_crack():
    rng = np.random.default_rng(5)
    dur = 0.55
    n = int(SR * dur)
    out = np.zeros(n)
    t0 = 0
    # a burst of sharp clicks, decaying density, each a tiny resonant ping
    for i in range(28):
        t0 += int(SR * rng.exponential(0.012 + i * 0.0012))
        if t0 >= n - 2000:
            break
        L = int(SR * rng.uniform(0.004, 0.02))
        tt = np.arange(L) / SR
        f = rng.uniform(1800, 6500)
        ping = np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(250, 700))
        ping += rng.normal(0, 0.4, L) * np.exp(-tt * 900)
        out[t0:t0 + L] += ping * (1 - i / 32) * rng.uniform(0.5, 1)
    # low creak body
    tt = np.arange(n) / SR
    creak = np.sin(2 * np.pi * (90 + 40 * tt) * tt) * np.exp(-tt * 9) * 0.25
    out += creak
    write("ice_crack.wav", out)


def ice_shatter():
    rng = np.random.default_rng(9)
    dur = 1.6
    n = int(SR * dur)
    tt = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    # bright crash: high-passed noise with fast decay
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    spec *= np.clip((freqs - 2500) / 3000, 0, 1)
    hi = np.fft.irfft(spec, n)
    out = hi * np.exp(-tt * 7)
    # tinkles: many small glassy pings scattered over the tail
    for _ in range(90):
        t0 = int(SR * rng.uniform(0.0, 1.1) ** 1.6)
        L = int(SR * 0.08)
        if t0 + L >= n:
            continue
        x = np.arange(L) / SR
        f = rng.uniform(2800, 9000)
        out[t0:t0 + L] += np.sin(2 * np.pi * f * x) * np.exp(-x * rng.uniform(40, 120)) * rng.uniform(0.1, 0.45)
    write("ice_shatter.wav", out)


def _shape(x, lo, hi, roll=1.0):
    """Band-limit a signal in the frequency domain with soft (linear-in-octaves) skirts."""
    n = len(x)
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR) + 1e-3
    g = np.ones_like(f)
    g *= np.clip(1 - np.log2(lo / f) / roll, 0, 1) ** 2 * (f < lo) + (f >= lo)
    g *= np.clip(1 - np.log2(f / hi) / roll, 0, 1) ** 2 * (f > hi) + (f <= hi)
    return np.fft.irfft(spec * g, n)


def ice_crack_v2():
    """Review pass: the first crack was all 2-6.5 kHz clicks (centroid ~7 kHz, thin/harsh).
    Clicks now 1.2-4.5 kHz and band-limited, plus a short low-passed thump that gives it body."""
    rng = np.random.default_rng(5)
    dur = 0.6
    n = int(SR * dur)
    out = np.zeros(n)
    t0 = int(SR * 0.004)
    for i in range(26):
        t0 += int(SR * rng.exponential(0.012 + i * 0.0012))
        if t0 >= n - 2000:
            break
        L = int(SR * rng.uniform(0.005, 0.022))
        tt = np.arange(L) / SR
        f = rng.uniform(1200, 4500)
        ping = np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(220, 600))
        ping += rng.normal(0, 0.25, L) * np.exp(-tt * 900)
        out[t0:t0 + L] += ping * (1 - i / 30) * rng.uniform(0.5, 1)
    out = _shape(out, 300, 6000) * 0.8
    tt = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (58 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 22)
    burst = _shape(rng.normal(0, 1, n), 40, 380) * np.exp(-tt * 45) * 0.5
    body = (thump + burst) * np.clip(tt / 0.003, 0, 1)
    out += body / (np.max(np.abs(body)) + 1e-9) * 0.55 * np.max(np.abs(out))
    creak = np.sin(2 * np.pi * (90 + 40 * tt) * tt) * np.exp(-tt * 9) * 0.12 * np.max(np.abs(out))
    write("ice_crack.wav", out + creak)


def glass_ting():
    """Soft glass ting tuned to the bed (E-flat major): Eb6 with glassy inharmonic partials + a quiet Bb6."""
    dur = 2.6
    n = int(SR * dur)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for f0, amp, delay in ((1244.5, 1.0, 0.0), (1864.7, 0.35, 0.028)):
        t = np.clip(tt - delay, 0, None)
        on = (tt >= delay) * np.clip(t / 0.004, 0, 1)
        for ratio, a, tau in ((1.0, 1.0, 1.1), (2.32, 0.28, 0.45), (4.25, 0.12, 0.2), (6.63, 0.05, 0.1)):
            out += amp * a * on * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / tau)
    out *= 1 - np.clip((tt - (dur - 0.3)) / 0.3, 0, 1)
    write("glass_ting.wav", out)


def cold_air():
    """Cold air bed for the hook (f0-90): soft band-passed wind with a slow swell, 3.2 s."""
    rng = np.random.default_rng(21)
    dur = 3.2
    n = int(SR * dur)
    tt = np.arange(n) / SR
    low = _shape(rng.normal(0, 1, n), 250, 900, 1.5)
    high = _shape(rng.normal(0, 1, n), 1500, 4000, 1.5)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.35 * tt - np.pi / 2)
    wind = low * (0.7 + 0.3 * lfo) + high * 0.2 * (0.4 + 0.6 * lfo)
    env = np.clip(tt / 0.25, 0, 1) * (1 - np.clip((tt - 2.4) / 0.8, 0, 1)) ** 1.5
    write("cold_air.wav", wind * env)


if __name__ == "__main__":
    frost_edges()
    frost_disc()
    grain()
    shatter()
    ice_crack_v2()  # review pass (ice_crack() kept for reference: the first, thinner version)
    ice_shatter()
    glass_ting()
    cold_air()
    print("ok")
