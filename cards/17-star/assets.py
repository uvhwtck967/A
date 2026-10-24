# XVII 星星 — card-specific assets, run after restyle.py:
#   python -I cards/17-star/assets.py scans/Star_clothed.png
# 1. art_night.png is rebuilt as a moonlit grade of art.png. restyle.py's tone-curve night edition does not work on
#    this card: the robe's pale-blue folds have the same luminance and saturation as the sky, so they turned into
#    dark blotches. Here the whole picture is darkened and cooled evenly, and only the open sky and the water
#    (found as large connected regions of sky-blue) sink a little further.
# 2. Sprites, each written twice (<name>.png from art.png, <name>_night.png from art_night.png):
#      wings.png  the bird's two raised wings, flapped gently by layers.tsx (rotated about the shoulder)
#      crown.png  the leafy crown of the tree, swayed about the trunk
#    The hole under each sprite is filled with the surrounding sky in both arts, so the sprite is the only copy.
# Writes cards/17-star/fx.json (boxes in scan px of scans/Star_clothed.png, measured on out/17-star/check/*.jpg).
import sys, os, json
import numpy as np
import cv2
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
out = os.path.join(root, "public", "cards", "17-star")
X0, Y0, X1, Y1 = json.load(open(os.path.join(here, "restyle.json"), encoding="utf-8"))["frame"]
SCALE = 2.5

scan = cv2.medianBlur(np.asarray(Image.open(sys.argv[1]).convert("RGB")), 3).astype(np.float32) / 255
art = np.asarray(Image.open(os.path.join(out, "art.png")).convert("RGB")).copy()
H, W = art.shape[:2]
lum = scan @ np.array([0.299, 0.587, 0.114], np.float32)
ink = lum < 0.35


def to_art(m, blur=1.2):
    """scan-px mask -> art-px float alpha"""
    a = cv2.resize(m.astype(np.float32)[Y0:Y1, X0:X1], (W, H), interpolation=cv2.INTER_LINEAR)
    return np.clip(cv2.GaussianBlur(a, (0, 0), blur), 0, 1) if blur else np.clip(a, 0, 1)


def poly(pts):
    m = np.zeros(lum.shape, np.uint8)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 1)
    return m > 0


def disk(n):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (n, n))


# ---------------- 1. night edition ----------------
SKY_REF = (60, 450, 120, 560)
ref = np.median(scan[SKY_REF[1]:SKY_REF[3], SKY_REF[0]:SKY_REF[2]].reshape(-1, 3), 0)
blue = (np.linalg.norm(scan - ref, axis=-1) < 0.16) & ~ink
n_, lab, st, cen = cv2.connectedComponentsWithStats(blue.astype(np.uint8), connectivity=4)
open_blue = np.zeros(lum.shape, bool)
for k in range(1, n_):
    area, cy = st[k, cv2.CC_STAT_AREA], cen[k][1]
    top = st[k, cv2.CC_STAT_TOP]
    # the sky (touches the top of the picture, or a big region above the horizon) and the pool / streams
    if (top <= Y0 + 6 and area > 2000) or (cy < 820 and area > 15000) or (cy > 1080 and area > 1500):
        open_blue |= lab == k
open_blue = cv2.morphologyEx(open_blue.astype(np.uint8), cv2.MORPH_CLOSE, disk(5)) > 0
sink = to_art(open_blue, 3.0)[..., None]

a = art.astype(np.float32) / 255
l = (a @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
moon = l * np.array([0.78, 0.86, 1.12], np.float32)  # moonlight: luminance tinted cool
night = (0.55 * a + 0.45 * moon) * 0.66
night = night * (1 - 0.30 * sink) + np.array([0.010, 0.014, 0.045], np.float32) * 0.30 * sink  # open sky and water sink further
night = (np.clip(night, 0, 1) * 255).astype(np.uint8)
arts = {"": art, "_night": night}


# ---------------- 2. sprites ----------------
def abox(box):
    x0, y0, x1, y1 = box
    return int((x0 - X0) * SCALE), int((y0 - Y0) * SCALE), int(np.ceil((x1 - X0) * SCALE)), int(np.ceil((y1 - Y0) * SCALE))


def bbox(m, pad=3):
    ys, xs = np.nonzero(m)
    return [float(max(X0, xs.min() - pad)), float(max(Y0, ys.min() - pad)), float(min(X1, xs.max() + 1 + pad)), float(min(Y1, ys.max() + 1 + pad))]


def sky_fill(hole_scan, img, sigma=6):
    """fill a hole (scan-px mask) from the open sky around it: normalized convolution at 1/8 scale + grain"""
    hole = to_art(cv2.dilate(hole_scan.astype(np.uint8), disk(5)) > 0, 2.0)
    keep = to_art(blue & ~cv2.dilate(hole_scan.astype(np.uint8), disk(7)).astype(bool), 0)  # any sky-blue pixel
    keep = (keep > 0.99).astype(np.float32)
    q = 8
    sa = cv2.resize(img.astype(np.float32) * keep[..., None], (W // q, H // q), interpolation=cv2.INTER_AREA)
    sk = cv2.resize(keep, (W // q, H // q), interpolation=cv2.INTER_AREA)
    num, den = cv2.GaussianBlur(sa, (0, 0), sigma), cv2.GaussianBlur(sk, (0, 0), sigma)[..., None]
    filled = cv2.resize(num / np.maximum(den, 1e-4), (W, H), interpolation=cv2.INTER_CUBIC)
    grain = (np.random.default_rng(17).standard_normal((H, W)) * 1.8)[..., None]
    return np.clip(img * (1 - hole[..., None]) + (filled + grain) * hole[..., None], 0, 255).astype(np.uint8)


fx = {}
# wings: the two raised wings, from the shoulder (≈808,476) to the tips (837,439) and (856,457)
WING_ZONE = [(806, 471), (811, 453), (831, 436), (845, 437), (843, 449), (859, 453), (858, 464), (840, 476), (822, 486), (809, 486)]
# crown of the tree: leaves and branches above the trunk fork; the bird and its perch stay painted
CROWN_ZONE = [(742, 545), (760, 515), (790, 512), (815, 520), (840, 500), (875, 500), (893, 512), (893, 610), (878, 645), (855, 640), (845, 615), (828, 615), (805, 622), (775, 612), (748, 595), (740, 570)]
BIRD_KEEP = [(745, 430), (870, 430), (870, 512), (812, 528), (780, 528), (745, 500)]

sprites = {}
wz = poly(WING_ZONE)
sprites["wings"] = wz & ~blue  # the wing itself, not the sky between the two wings
cz = poly(CROWN_ZONE) & ~poly(BIRD_KEEP)
leaf = cz & ~open_blue
leaf = cv2.morphologyEx(leaf.astype(np.uint8), cv2.MORPH_CLOSE, disk(3)).astype(bool) & cz
sprites["crown"] = leaf

for name, m in sprites.items():
    b = bbox(m)
    alpha = to_art(m, 1.0)
    ax0, ay0, ax1, ay1 = abox(b)
    for suf, img in arts.items():
        rgba = np.dstack([img[ay0:ay1, ax0:ax1], (alpha[ay0:ay1, ax0:ax1] * 255).astype(np.uint8)])
        Image.fromarray(rgba, "RGBA").save(f"{out}/{name}{suf}.png", optimize=True)
    fx[name] = b
for name, m in sprites.items():
    for suf in arts:
        arts[suf] = sky_fill(m, arts[suf])

# ---------------- 3. water mask ----------------
# water.png: white, alpha = the painted streams and the water on the land (whole-picture size, half resolution).
# layers.tsx uses it as a mask, so the moving glints only ever sit on painted water.
WATER_REF = (150, 1300, 180, 1330)
wref = np.median(scan[WATER_REF[1]:WATER_REF[3], WATER_REF[0]:WATER_REF[2]].reshape(-1, 3), 0)
wet = (np.linalg.norm(scan - wref, axis=-1) < 0.17) & ~ink
zone = poly([(226, 1012), (290, 1012), (290, 1242), (226, 1242)]) | poly([(605, 1170), (892, 1170), (892, 1416), (560, 1416), (560, 1300), (605, 1300)])
# the right-hand fall is paler than the pool: inside its narrow strip take every bluish, non-ink pixel
fall = poly([(776, 845), (806, 845), (806, 1250), (776, 1250)]) & ~ink & (scan[..., 2] - scan[..., 0] > 0.04)
wet = cv2.morphologyEx(((wet & zone) | fall).astype(np.uint8), cv2.MORPH_OPEN, disk(2)) > 0
wa = cv2.resize(to_art(wet, 1.5), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
Image.fromarray(np.dstack([np.full(wa.shape + (3,), 255, np.uint8), (wa * 255).astype(np.uint8)]), "RGBA").save(f"{out}/water.png", optimize=True)

fx["wingPivot"] = [808, 478]
fx["crownPivot"] = [836, 655]
Image.fromarray(arts[""]).save(f"{out}/art.png", optimize=True)
Image.fromarray(arts["_night"]).save(f"{out}/art_night.png", optimize=True)
json.dump(fx, open(os.path.join(here, "fx.json"), "w"), indent=1)
print("17-star:", {k: [round(v) for v in b] for k, b in fx.items()})
