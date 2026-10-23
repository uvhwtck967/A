# XVI 高塔 — card-specific assets, run after restyle.py:
#   python -I cards/16-tower/assets.py scans/RWS_Tarot_16_Tower.jpg
# Every overlay is written twice: <name>.png from art.png (upright, natural look) and <name>_night.png from
# art_night.png (reversed); layers.tsx crossfades them with the reversed tint.
#   crown.png   the crown with its spiky aura, knocked off the tower top in the opening, hanging in the air after
#   yods.png    the falling drops of fire, drifting slowly (one clip box each in fx.json)
#   flames.png  the flames at the top and in the windows, flickered one by one (stretched up from their base)
#   bolt.png    the zigzag bolt, brightened by the "strike" effect
# The crown and the yods are cut out of art.png / art_night.png (patched with the sky around them), so the
# sprites drawn by layers.tsx are the only copy and can move freely.
# Writes cards/16-tower/fx.json with the boxes (scan px). Coordinates are px of scans/RWS_Tarot_16_Tower.jpg,
# measured on a gridded crop (out/16-tower/check/top_grid.png).
import sys, os, json
import numpy as np
import cv2
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
out = os.path.join(root, "public", "cards", "16-tower")
X0, Y0, X1, Y1 = json.load(open(os.path.join(here, "restyle.json"), encoding="utf-8"))["frame"]
SCALE = 2.5

scan = cv2.medianBlur(np.asarray(Image.open(sys.argv[1]).convert("RGB")), 3).astype(np.float32) / 255
arts = {"": np.asarray(Image.open(os.path.join(out, "art.png")).convert("RGB")).copy(),
        "_night": np.asarray(Image.open(os.path.join(out, "art_night.png")).convert("RGB")).copy()}
H, W = arts[""].shape[:2]
r, g, b = scan[..., 0], scan[..., 1], scan[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
sat = (scan.max(2) - scan.min(2)) / np.maximum(scan.max(2), 1e-4)
yellow = (r > 0.70) & (g > 0.60) & (b < 0.55) & (r - b > 0.25)
red = (r > 0.55) & (r - g > 0.25) & (r - b > 0.25)
white = (lum > 0.80) & (sat < 0.30)
ink = lum < 0.30

CROWN_ZONE = [(188, 140), (245, 62), (350, 45), (408, 70), (442, 140), (445, 240), (425, 300), (405, 345), (330, 348), (255, 340), (205, 315), (186, 240)]
BOLT_ZONE = [(530, 55), (1031, 55), (1031, 330), (900, 330), (720, 400), (540, 400), (530, 200)]
FLAME_ZONE = [(370, 250), (560, 200), (830, 330), (830, 500), (640, 500), (640, 700), (380, 700), (380, 420)]
# The crown's lower-right edge overlaps the yellow tips of the top fire.
TOP_FIRE_CUT = [(425, 235), (500, 235), (500, 390), (330, 390), (330, 334), (355, 320), (380, 303), (400, 280), (416, 258)]
# 22 yods: 12 left of the tower, 10 right of it (checked on out/16-tower/check/yods_r.png); the yellow tongues of
# the right-hand flame (centres inside FLAME_TIPS) are not yods
YOD_ZONES = [(30, 600, 230, 1330), (740, 300, 1031, 660)]
FLAME_TIPS = (620, 320, 825, 500)


def poly(pts):
    m = np.zeros(lum.shape, np.uint8)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 255)
    return m > 0


def disk(n):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (n, n))


def to_art(m, blur=1.2):
    """scan-px mask -> art-px float alpha"""
    a = cv2.resize(m.astype(np.float32)[Y0:Y1, X0:X1], (W, H), interpolation=cv2.INTER_LINEAR)
    return np.clip(cv2.GaussianBlur(a, (0, 0), blur), 0, 1)


def abox(box):
    x0, y0, x1, y1 = box
    return int((x0 - X0) * SCALE), int((y0 - Y0) * SCALE), int(np.ceil((x1 - X0) * SCALE)), int(np.ceil((y1 - Y0) * SCALE))


def save_crop(name, alpha, box, srcs=arts):
    ax0, ay0, ax1, ay1 = abox(box)
    for suf, art in srcs.items():
        rgba = np.dstack([art[ay0:ay1, ax0:ax1], (alpha[ay0:ay1, ax0:ax1] * 255).astype(np.uint8)])
        Image.fromarray(rgba, "RGBA").save(f"{out}/{name}{suf}.png", optimize=True)


def bbox(m, pad=4):
    ys, xs = np.nonzero(m)
    return [float(max(X0, xs.min() - pad)), float(max(Y0, ys.min() - pad)), float(min(X1, xs.max() + 1 + pad)), float(min(Y1, ys.max() + 1 + pad))]


def patch(hole_scan, art, ref_lum_max=None, sigma=3):
    """fill a hole (scan-px mask) from the open sky around it: normalized convolution at 1/8 scale + grain"""
    hole = to_art(cv2.dilate(hole_scan.astype(np.uint8), disk(7)) > 0, 2.0)
    hard = hole > 0.02
    gray = cv2.cvtColor(art, cv2.COLOR_RGB2GRAY).astype(np.float32)
    keep = (~hard).astype(np.float32)
    if ref_lum_max is not None:
        keep *= gray < ref_lum_max  # sample only the black sky, never the clouds or the crown's ink
    q = 8
    sa = cv2.resize(art.astype(np.float32) * keep[..., None], (W // q, H // q), interpolation=cv2.INTER_AREA)
    sk = cv2.resize(keep, (W // q, H // q), interpolation=cv2.INTER_AREA)
    num, den = cv2.GaussianBlur(sa, (0, 0), sigma), cv2.GaussianBlur(sk, (0, 0), sigma)[..., None]
    filled = cv2.resize(num / np.maximum(den, 1e-4), (W, H), interpolation=cv2.INTER_CUBIC)
    grain = (np.random.default_rng(16).standard_normal((H, W)) * 2.2)[..., None]
    return np.clip(art * (1 - hole[..., None]) + (filled + grain) * hole[..., None], 0, 255).astype(np.uint8)


fx = {}

# ---- crown: yellow rim + spikes and the ink inside them; the black sky between spikes is background ----
cz = poly(CROWN_ZONE)
solid = cz & ~red & ~((lum > 0.45) & (sat < 0.25) & ~yellow)  # no flames, no grey cloud
dark = solid & ~yellow
n_, lab = cv2.connectedComponents(dark.astype(np.uint8), connectivity=4)
ring = cv2.dilate(cz.astype(np.uint8), disk(9)).astype(bool) & ~cz
outside = np.isin(lab, np.unique(lab[ring | (cv2.dilate((~cz).astype(np.uint8), disk(3)).astype(bool) & dark)]))
outside &= lab > 0
crown = solid & ~outside
crown = cv2.morphologyEx(crown.astype(np.uint8), cv2.MORPH_CLOSE, disk(3)).astype(bool) & cz
n_, lab, st, _ = cv2.connectedComponentsWithStats(crown.astype(np.uint8), connectivity=8)
body = lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
# the black opening of the tipped crown is enclosed by its rim: fill everything inside the body's outline
cs, _ = cv2.findContours(cv2.morphologyEx((body | crown).astype(np.uint8), cv2.MORPH_CLOSE, disk(15)), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
filled = np.zeros(lum.shape, np.uint8)
cv2.drawContours(filled, [c for c in cs if cv2.contourArea(c) > 2000], -1, 1, -1)
# plus every loose dot of the aura
crown = (filled > 0) & cz & ~red | crown | (yellow & cz & ~red)
# the aura's spike tips are paper white: take the light specks just outside the crown with it
crown |= cv2.dilate(crown.astype(np.uint8), disk(13)).astype(bool) & cz & (lum > 0.55) & (sat < 0.35) & ~red & ~poly([(400, 40), (560, 40), (560, 400), (400, 400)])
crown &= ~poly(TOP_FIRE_CUT)
_, yellow_lab, yellow_stats, yellow_centres = cv2.connectedComponentsWithStats(yellow.astype(np.uint8), connectivity=8)
for k in range(1, len(yellow_stats)):
    x, y = yellow_centres[k]
    if 330 < x < 450 and 300 < y < 380 and yellow_stats[k, cv2.CC_STAT_AREA] > 500:
        crown &= ~cv2.dilate((yellow_lab == k).astype(np.uint8), disk(7)).astype(bool)
assert not crown[336, 375] and crown[310, 330], "top fire must stay off the crown without cutting its rim"
fx["crown"] = bbox(crown, 6)
ys, xs = np.nonzero(crown)
fx["crownC"] = [float(xs.mean()), float(ys.mean())]
crown_a = to_art(crown, 0.9)

# ---- bolt: the largest yellow shape in the upper right ----
bz = yellow & poly(BOLT_ZONE)
n_, lab, st, _ = cv2.connectedComponentsWithStats(bz.astype(np.uint8), connectivity=8)
bolt = lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
bolt = cv2.dilate(bolt.astype(np.uint8), disk(3)).astype(bool) & (yellow | white | ~ink)
fx["bolt"] = bbox(bolt, 8)

# ---- yods: every separate yellow drop beside the tower ----
yods = []
ym = np.zeros(lum.shape, bool)
for x0, y0, x1, y1 in YOD_ZONES:
    zone = np.zeros(lum.shape, bool)
    zone[y0:y1, x0:x1] = True
    n_, lab, st, cen = cv2.connectedComponentsWithStats((yellow & zone & ~cz).astype(np.uint8), connectivity=8)
    for k in range(1, n_):
        cx, cy = cen[k]
        if FLAME_TIPS[0] < cx < FLAME_TIPS[2] and FLAME_TIPS[1] < cy < FLAME_TIPS[3] or (bolt & (lab == k)).any():
            continue  # a flame tongue, or the lower end of the bolt reaching into the zone
        if 120 < st[k, cv2.CC_STAT_AREA] < 2500:
            m = cv2.dilate((lab == k).astype(np.uint8), disk(5)).astype(bool) & (yellow | (lum < 0.45))
            m &= cv2.dilate((lab == k).astype(np.uint8), disk(5)).astype(bool)
            ym |= m
            yods.append([*bbox(lab == k, 4), float(cen[k][0]), float(cen[k][1])])
# lighting order for the count: left side top to bottom, then right side top to bottom
yods.sort(key=lambda y: (y[4] > 500, y[5]))
fx["yods"] = yods
fx["yodsBox"] = bbox(ym, 20)
yod_a = to_art(cv2.dilate(ym.astype(np.uint8), disk(3)) > 0, 0.9)

# ---- flames: red tongues with their white / yellow cores and outlines ----
fz = poly(FLAME_ZONE) & ~crown
core = red & fz
near = cv2.dilate(core.astype(np.uint8), disk(13)).astype(bool)
flame = near & fz & (red | white | yellow) & ~bolt
flame = cv2.morphologyEx(flame.astype(np.uint8), cv2.MORPH_CLOSE, disk(3)).astype(bool)
n_, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(flame.astype(np.uint8), disk(9)), connectivity=8)
fx["flames"] = [bbox((lab == k) & flame, 2) for k in range(1, n_) if st[k, cv2.CC_STAT_AREA] > 300]
fx["flamesBox"] = bbox(flame, 20)
flame_a = to_art(flame, 0.9)

# ---- write overlays (before the holes are patched), then patch the crown and the yods out of both arts ----
save_crop("crown", crown_a, fx["crown"])
save_crop("yods", yod_a, fx["yodsBox"])
save_crop("flames", flame_a, fx["flamesBox"])
save_crop("bolt", to_art(bolt, 1.0), fx["bolt"])
# the crown hangs in black sky: sample only the sky; the yods also sit on clouds: sample whatever is around them
for suf, art in arts.items():
    art = patch(cv2.dilate(crown.astype(np.uint8), disk(5)).astype(bool), art, ref_lum_max=40, sigma=14)
    art = patch(cv2.dilate(ym.astype(np.uint8), disk(5)).astype(bool), art)
    Image.fromarray(art).save(f"{out}/art{suf}.png", optimize=True)

json.dump(fx, open(os.path.join(here, "fx.json"), "w"), indent=1)
assert len(yods) == 22, f"expected 22 yods, found {len(yods)}: {[(round(y[4]), round(y[5])) for y in yods]}"
print(f"crown {[round(v) for v in fx['crown']]}, yods {len(yods)}, flames {len(fx['flames'])}, bolt {[round(v) for v in fx['bolt']]}")
