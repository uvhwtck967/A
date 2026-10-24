# XVIII 月亮 — card-specific assets, run after restyle.py:
#   python -I cards/18-moon/assets.py scans/RWS_Tarot_18_Moon.jpg
# 1. art_night.png is rebuilt as an even, cool moonlit grade of art.png (same method as 17-star): the whole picture
#    darkens and cools, the open sky and the pool sink a little further.
# 2. Sprites, each written twice (<name>.png from art.png, <name>_night.png from art_night.png):
#      dog.png       the dog's raised head, tilted about the neck by layers.tsx ("howl" raises it, "relax" lowers it)
#      wolf.png      the wolf's head, the same
#      crayfish.png  the crayfish, lifted a little ("emerge") or let down into the water ("sink")
#    Each sprite is a feathered polygon that takes some background with it; the hole under it is inpainted in both
#    arts, so a small move only ever uncovers a soft continuation of the same background.
# 3. water.png: alpha = the painted pool (half resolution, whole picture), used to mask water light in layers.tsx.
# Writes cards/18-moon/fx.json (boxes, pivots and the dew drops, all in scan px of scans/RWS_Tarot_18_Moon.jpg).
import sys, os, json
import numpy as np
import cv2
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
out = os.path.join(root, "public", "cards", "18-moon")
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
SKY_REF = (120, 120, 200, 200)
ref = np.median(scan[SKY_REF[1]:SKY_REF[3], SKY_REF[0]:SKY_REF[2]].reshape(-1, 3), 0)
blue = (np.linalg.norm(scan - ref, axis=-1) < 0.16) & ~ink
n_, lab, st, cen = cv2.connectedComponentsWithStats(blue.astype(np.uint8), connectivity=4)
open_blue = np.zeros(lum.shape, bool)
for k in range(1, n_):
    area, cy = st[k, cv2.CC_STAT_AREA], cen[k][1]
    if (cy < 1000 and area > 3000) or (cy > 1490 and area > 400):
        open_blue |= lab == k
open_blue = cv2.morphologyEx(open_blue.astype(np.uint8), cv2.MORPH_CLOSE, disk(5)) > 0
sink = to_art(open_blue, 3.0)[..., None]

a = art.astype(np.float32) / 255
l = (a @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
moon = l * np.array([0.78, 0.86, 1.12], np.float32)
night = (0.55 * a + 0.45 * moon) * 0.66
night = night * (1 - 0.30 * sink) + np.array([0.010, 0.014, 0.045], np.float32) * 0.30 * sink
night = (np.clip(night, 0, 1) * 255).astype(np.uint8)
arts = {"": art, "_night": night}


# ---------------- 2. sprites ----------------
def abox(box):
    x0, y0, x1, y1 = box
    return int((x0 - X0) * SCALE), int((y0 - Y0) * SCALE), int(np.ceil((x1 - X0) * SCALE)), int(np.ceil((y1 - Y0) * SCALE))


def bbox(m, pad=6):
    ys, xs = np.nonzero(m)
    return [float(max(X0, xs.min() - pad)), float(max(Y0, ys.min() - pad)), float(min(X1, xs.max() + 1 + pad)), float(min(Y1, ys.max() + 1 + pad))]


def inpaint(hole_scan, img):
    """fill the hole (scan-px mask, grown a little) with cv2 inpainting at half art resolution, in its bounding box only"""
    hole = to_art(cv2.dilate(hole_scan.astype(np.uint8), disk(5)) > 0, 0) > 0.5
    ys, xs = np.nonzero(hole)
    pad = 40
    y0, y1, x0, x1 = max(0, ys.min() - pad), min(H, ys.max() + pad), max(0, xs.min() - pad), min(W, xs.max() + pad)
    reg, hr = img[y0:y1, x0:x1], hole[y0:y1, x0:x1].astype(np.uint8) * 255
    q = 2
    small = cv2.resize(reg, (reg.shape[1] // q, reg.shape[0] // q), interpolation=cv2.INTER_AREA)
    hs = cv2.resize(hr, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
    filled = cv2.resize(cv2.inpaint(small, hs, 9, cv2.INPAINT_TELEA), (reg.shape[1], reg.shape[0]), interpolation=cv2.INTER_CUBIC)
    soft = cv2.GaussianBlur(hr.astype(np.float32) / 255, (0, 0), 2.0)[..., None]
    res = img.copy()
    res[y0:y1, x0:x1] = np.clip(reg * (1 - soft) + filled * soft, 0, 255).astype(np.uint8)
    return res


# polygons measured on out/18-moon/check/dog.jpg, wolf.jpg, crayfish.jpg
ZONES = {
    "dog": [(432, 912), (470, 905), (494, 945), (506, 985), (502, 1012), (470, 1018), (420, 1016), (382, 1004), (386, 975), (410, 945)],
    "wolf": [(588, 958), (650, 962), (700, 972), (740, 958), (792, 950), (812, 966), (796, 998), (768, 1028), (748, 1058), (690, 1066), (632, 1052), (596, 1032), (582, 1000)],
    "crayfish": [(392, 1342), (470, 1336), (482, 1440), (518, 1440), (522, 1360), (582, 1355), (590, 1460), (566, 1500), (604, 1560), (596, 1640), (566, 1672), (418, 1672), (386, 1620), (376, 1540), (414, 1490), (386, 1440)],
}
PIVOTS = {"dog": [452, 1015], "wolf": [725, 1062], "crayfish": [490, 1670]}

fx = {}
for name, pts in ZONES.items():
    m = poly(pts)
    b = bbox(m)
    alpha = to_art(cv2.erode(m.astype(np.uint8), disk(3)) > 0, 3.0)  # feathered edge, inside the polygon
    ax0, ay0, ax1, ay1 = abox(b)
    for suf, img in arts.items():
        rgba = np.dstack([img[ay0:ay1, ax0:ax1], (alpha[ay0:ay1, ax0:ax1] * 255).astype(np.uint8)])
        Image.fromarray(rgba, "RGBA").save(f"{out}/{name}{suf}.png", optimize=True)
    fx[name] = b
    fx[name + "Pivot"] = PIVOTS[name]
for name, pts in ZONES.items():
    for suf in arts:
        arts[suf] = inpaint(poly(pts), arts[suf])

# ---------------- 3. pool mask ----------------
WATER_REF = (150, 1560, 260, 1600)
wref = np.median(scan[WATER_REF[1]:WATER_REF[3], WATER_REF[0]:WATER_REF[2]].reshape(-1, 3)[~ink[WATER_REF[1]:WATER_REF[3], WATER_REF[0]:WATER_REF[2]].reshape(-1)], 0)
wet = (np.linalg.norm(scan - wref, axis=-1) < 0.17) & ~ink & (np.arange(lum.shape[0])[:, None] > 1495)
wet = cv2.morphologyEx(wet.astype(np.uint8), cv2.MORPH_OPEN, disk(2)) > 0
wa = cv2.resize(to_art(wet, 1.5), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
Image.fromarray(np.dstack([np.full(wa.shape + (3,), 255, np.uint8), (wa * 255).astype(np.uint8)]), "RGBA").save(f"{out}/water.png", optimize=True)

# ---------------- 4. dew drops ----------------
# the falling yods: small yellow blobs below the moon, not connected to its disc and rays
yellow = (scan[..., 0] > 0.75) & (scan[..., 1] > 0.6) & (scan[..., 2] < 0.55) & ~ink
n_, lab, st, cen = cv2.connectedComponentsWithStats(yellow.astype(np.uint8), connectivity=8)
dew = []
for k in range(1, n_):
    area = st[k, cv2.CC_STAT_AREA]
    cx, cy = cen[k]
    if 40 < area < 1500 and 560 < cy < 960 and np.hypot(cx - 580, cy - 393) > 330:  # nearer than that are the ray tips
        dew.append([round(float(cx), 1), round(float(cy), 1), round(float(np.sqrt(area / np.pi)), 1)])
fx["dew"] = sorted(dew, key=lambda d: d[1])

Image.fromarray(arts[""]).save(f"{out}/art.png", optimize=True)
Image.fromarray(arts["_night"]).save(f"{out}/art_night.png", optimize=True)
json.dump(fx, open(os.path.join(here, "fx.json"), "w"), indent=1)
print("18-moon:", {k: v for k, v in fx.items() if k != "dew"}, "dew drops:", len(fx["dew"]))
