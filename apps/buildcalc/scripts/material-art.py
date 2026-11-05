"""Generate original material illustrations for BuildCalc cards (900x600 + 480px webp).

Usage: python3 apps/buildcalc/scripts/material-art.py apps/buildcalc/public/images [names...]
Needs numpy, scipy and Pillow.
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter, map_coordinates

W, H = 900, 600
rng = np.random.default_rng(7)


def noise(scale, w=W, h=H, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    n = gaussian_filter(r.standard_normal((h, w)), scale)
    return (n - n.min()) / (n.max() - n.min() + 1e-9)


def fbm(w=W, h=H, octaves=(1, 3, 8, 24)):
    out = np.zeros((h, w))
    for i, s in enumerate(octaves):
        out += noise(s, w, h) * (0.5 ** i)
    return (out - out.min()) / (out.max() - out.min())


def to_img(a):
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def shade(base, amount, n):
    return np.asarray(base, float)[None, None, :] * (1 + amount * (n[..., None] - 0.5))


def masonry():
    mortar = np.array([196, 188, 172], float)
    img = np.ones((H, W, 3)) * mortar
    img = img * (0.92 + 0.16 * fbm())[..., None]
    bh, bw, j = 64, 196, 12
    grain = fbm(octaves=(0.6, 2, 6))
    palette = [(160, 72, 50), (174, 84, 58), (148, 64, 46), (182, 96, 66), (138, 60, 44), (166, 90, 70)]
    y = -20
    row = 0
    while y < H:
        off = 0 if row % 2 == 0 else -(bw + j) // 2
        x = off - 10
        while x < W:
            c = np.array(palette[rng.integers(len(palette))], float) * rng.uniform(0.9, 1.08)
            y0, y1, x0, x1 = max(y, 0), min(y + bh, H), max(x, 0), min(x + bw, W)
            if y1 > y0 and x1 > x0:
                g = grain[y0:y1, x0:x1]
                patch = c[None, None, :] * (0.82 + 0.36 * g[..., None])
                # darker edges for depth
                yy, xx = np.mgrid[y0:y1, x0:x1]
                edge = np.minimum.reduce([yy - y, y + bh - yy, xx - x, x + bw - xx]).astype(float)
                patch *= (0.8 + 0.2 * np.clip(edge / 6, 0, 1))[..., None]
                img[y0:y1, x0:x1] = patch
            x += bw + j
        y += bh + j
        row += 1
    speck = rng.random((H, W)) > 0.985
    img[speck] *= 0.75
    return to_img(img)


def screed():
    base = np.array([168, 166, 160], float)
    n = fbm(octaves=(2, 10, 40, 120))
    img = shade(base, 0.22, n)
    # trowel arcs
    yy, xx = np.mgrid[0:H, 0:W]
    swirl = np.zeros((H, W))
    for _ in range(26):
        cx, cy, r = rng.uniform(-100, W + 100), rng.uniform(-100, H + 100), rng.uniform(120, 340)
        d = np.abs(np.hypot(xx - cx, yy - cy) - r)
        a0 = rng.uniform(0, 2 * np.pi)
        ang = (np.arctan2(yy - cy, xx - cx) - a0) % (2 * np.pi)
        swirl += np.exp(-(d / rng.uniform(10, 26)) ** 2) * (ang < rng.uniform(0.6, 1.6)) * rng.uniform(0.3, 1)
    swirl = gaussian_filter(swirl, 2)
    img *= (1 + 0.09 * swirl)[..., None]
    pores = gaussian_filter((rng.random((H, W)) > 0.996).astype(float), 0.7)
    img *= (1 - 0.6 * np.clip(pores * 4, 0, 1))[..., None]
    out = to_img(img)
    # a straight-edge float lying on top
    d = ImageDraw.Draw(out)
    d.polygon([(560, 600), (900, 380), (900, 430), (620, 600)], fill=(214, 168, 92))
    d.polygon([(560, 600), (900, 380), (900, 392), (578, 600)], fill=(236, 196, 120))
    return out.filter(ImageFilter.GaussianBlur(0.4))


def adhesive():
    base = np.array([186, 184, 178], float)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    n = fbm()
    # notched-trowel combing: wavy diagonal ridges
    t = (xx * 0.8 + yy * 0.6) + 18 * np.sin(yy / 90 + xx / 260) + 4 * (n - 0.5)
    period = 26
    phase = (t % period) / period
    ridge = np.clip(np.abs(phase - 0.5) * 2, 0, 1)  # 0 at ridge centre
    height = 1 - ridge
    light = 0.78 + 0.32 * height + 0.12 * np.gradient(height, axis=1)
    img = base[None, None, :] * light[..., None] * (0.94 + 0.12 * fbm(octaves=(1, 4)))[..., None]
    out = to_img(img)
    # tiles already pressed in (top-left corner area)
    d = ImageDraw.Draw(out)
    ts, g = 230, 10
    for r in range(2):
        for c in range(2):
            x0, y0 = -60 + c * (ts + g), -70 + r * (ts + g)
            if r == 1 and c == 1:
                continue
            d.rectangle([x0 + 6, y0 + 8, x0 + ts + 6, y0 + ts + 8], fill=(120, 118, 112))
            d.rectangle([x0, y0, x0 + ts, y0 + ts], fill=(232, 228, 216))
            d.rectangle([x0, y0, x0 + ts, y0 + 6], fill=(244, 242, 234))
    # notched trowel
    d.polygon([(520, 470), (860, 330), (900, 420), (560, 560)], fill=(150, 160, 168))
    for k in range(13):
        px = 560 + k * 26.5
        py = 560 - k * 10.9
        d.polygon([(px, py), (px + 13, py - 5.4), (px + 8, py + 12)], fill=(186, 184, 178))
    d.polygon([(520, 470), (860, 330), (866, 346), (528, 486)], fill=(196, 206, 212))
    d.polygon([(630, 418), (790, 352), (802, 380), (642, 446)], fill=(60, 90, 72))
    return out.filter(ImageFilter.GaussianBlur(0.5))


def wallpaper():
    bg = (236, 226, 204)
    ink = (93, 128, 108)
    ink2 = (214, 140, 112)
    tile = Image.new('RGB', (150, 150), bg)
    d = ImageDraw.Draw(tile)
    # simple leaf/diamond motif
    d.polygon([(75, 18), (100, 75), (75, 132), (50, 75)], outline=ink, width=4)
    d.ellipse([63, 63, 87, 87], fill=ink2)
    for cx, cy in [(0, 0), (150, 0), (0, 150), (150, 150)]:
        d.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=ink)
    d.line([(0, 75), (30, 75)], fill=ink, width=3)
    d.line([(120, 75), (150, 75)], fill=ink, width=3)
    big = Image.new('RGB', (W, H), bg)
    strip_w = 300
    for s in range(0, W, strip_w):
        shift = (s // strip_w) * 9  # slight misalignment at seams
        for y in range(-150, H, 150):
            for x in range(s, s + strip_w, 150):
                big.paste(tile, (x, y + shift))
    a = np.asarray(big, float) * (0.95 + 0.08 * fbm(octaves=(2, 6)))[..., None]
    out = to_img(a)
    d = ImageDraw.Draw(out)
    for s in range(strip_w, W, strip_w):
        d.line([(s, 0), (s, H)], fill=(205, 194, 170), width=2)
    # peeled corner of the last strip
    d.polygon([(600, 0), (900, 0), (900, 0), (600, 0)], fill=bg)
    d.polygon([(720, 600), (900, 420), (900, 600)], fill=(200, 205, 196))
    d.polygon([(720, 600), (900, 420), (780, 470)], fill=(250, 246, 236))
    d.line([(720, 600), (900, 420)], fill=(190, 180, 158), width=3)
    return out.filter(ImageFilter.GaussianBlur(0.3))


def insulation():
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    # fibrous texture: anisotropic noise stretched horizontally, then warped
    r = rng.standard_normal((H, W))
    fib = gaussian_filter(r, (0.8, 9))
    fib2 = gaussian_filter(rng.standard_normal((H, W)), (2, 20))
    warp = noise(30) * 40
    fib = map_coordinates(fib, [yy + warp - 20, xx], mode='reflect')
    f = (fib - fib.min()) / (fib.max() - fib.min())
    f2 = (fib2 - fib2.min()) / (fib2.max() - fib2.min())
    base = np.array([222, 178, 92], float)
    img = base[None, None, :] * (0.72 + 0.4 * f[..., None] + 0.12 * f2[..., None])
    # batt seams with soft shadows
    for y0 in (190, 400):
        sh = np.exp(-((yy - y0) / 14) ** 2)
        img *= (1 - 0.35 * sh)[..., None]
    out = to_img(img)
    d = ImageDraw.Draw(out)
    # timber studs
    for x0 in (0, 430):
        d.rectangle([x0 - 40, 0, x0 + 40, H], fill=(196, 150, 96))
        d.rectangle([x0 - 40, 0, x0 - 30, H], fill=(170, 124, 76))
        d.rectangle([x0 + 30, 0, x0 + 40, H], fill=(214, 172, 116))
    d.rectangle([860, 0, 900, H], fill=(196, 150, 96))
    return out


ALL = dict(masonry=masonry, screed=screed, adhesive=adhesive, wallpaper=wallpaper, insulation=insulation)

if __name__ == '__main__':
    outdir = sys.argv[1]
    for name in sys.argv[2:] or ALL:
        im = ALL[name]()
        im.save(f'{outdir}/{name}.webp', 'WEBP', quality=72, method=6)
        im.resize((480, 320), Image.LANCZOS).save(f'{outdir}/{name}-480.webp', 'WEBP', quality=70, method=6)
        print(name)
