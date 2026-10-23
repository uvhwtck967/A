# VI 恋人 — card-specific assets, run after restyle.py:
#   python -I cards/06-lovers/assets.py scans/Lovers_clothed.png
# Writes into public/cards/06-lovers/:
#   fruit.png       the fruit on the tree of knowledge (+ outline), brightened one by one in layers.tsx
#   wingL/wingR.png the angel's wings (red feathers + their ink), drawn scaled >= 1 about the shoulder in layers.tsx,
#                   so they always cover the printed wing: nothing behind them is ever exposed
#   hands.png       the angel's hands and forearms in front of the wings, redrawn on top of them
#   flames.png      the twelve flames on the tree of life, flickered one by one in layers.tsx
#   serpent.png     gold mask of the serpent's body, for the glint that runs along it
# and cards/06-lovers/fx.json with the boxes (scan px) layers.tsx needs.
# Coordinates are px of scans/Lovers_clothed.png, measured on gridded crops.
import sys, os, json
import numpy as np
import cv2
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
out = os.path.join(root, "public", "cards", "06-lovers")
X0, Y0, X1, Y1 = json.load(open(os.path.join(here, "restyle.json"), encoding="utf-8"))["frame"]
SCALE = 2.5

scan = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(np.float32) / 255
scan = cv2.medianBlur((scan * 255).astype(np.uint8), 3).astype(np.float32) / 255
art = np.asarray(Image.open(os.path.join(out, "art.png")).convert("RGB"))
H, W = art.shape[:2]
r, g, b = scan[..., 0], scan[..., 1], scan[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
sat = (scan.max(2) - scan.min(2)) / np.maximum(scan.max(2), 1e-4)
ink = lum < 0.30

WING_L = [(57, 185), (250, 185), (372, 285), (372, 420), (300, 470), (210, 610), (57, 610)]
WING_R = [(588, 285), (690, 185), (909, 185), (909, 470), (840, 470), (760, 480), (640, 440)]
HAIR = [(360, 170), (600, 170), (600, 330), (360, 330)]  # angel's red-green hair: not a wing
HAND_L = [(58, 355), (140, 355), (215, 440), (215, 520), (140, 520), (58, 490)]
HAND_R = [(830, 330), (912, 330), (912, 480), (850, 560), (750, 560), (750, 470)]
FRUIT_ZONE = [(57, 540), (250, 540), (250, 780), (57, 780)]  # crown of the tree of knowledge
FLAME_ZONE = [(745, 430), (912, 430), (912, 1170), (790, 1170), (790, 800), (745, 700)]
SERPENT = [(57, 695), (132, 695), (152, 800), (155, 1275), (57, 1275)]


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


def save_crop(name, alpha, box):
    """art pixels inside box (scan px) with the given art-px alpha"""
    x0, y0, x1, y1 = box
    ax0, ay0, ax1, ay1 = [int(round(v)) for v in ((x0 - X0) * SCALE, (y0 - Y0) * SCALE, (x1 - X0) * SCALE, (y1 - Y0) * SCALE)]
    ax0, ay0, ax1, ay1 = max(ax0, 0), max(ay0, 0), min(ax1, W), min(ay1, H)
    rgba = np.dstack([art[ay0:ay1, ax0:ax1], (alpha[ay0:ay1, ax0:ax1] * 255).astype(np.uint8)])
    Image.fromarray(rgba, "RGBA").save(os.path.join(out, name + ".png"), optimize=True)
    # report the box actually written, back in scan px
    return [round(X0 + ax0 / SCALE, 2), round(Y0 + ay0 / SCALE, 2), round(X0 + ax1 / SCALE, 2), round(Y0 + ay1 / SCALE, 2)]


def bbox(m, pad=4):
    ys, xs = np.nonzero(m)
    return [int(xs.min()) - pad, int(ys.min()) - pad, int(xs.max()) + pad, int(ys.max()) + pad]


fx = {}

# ---- hands: skin-yellow + its ink outline, inside the hand polygons ----
skin = (r > 0.75) & (g > 0.62) & (b < 0.70) & (sat > 0.2) & (sat < 0.62)
hands = np.zeros(lum.shape, bool)
for hp in (HAND_L, HAND_R):
    m = skin & poly(hp)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, disk(3))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    m = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 200])
    m = cv2.dilate(m.astype(np.uint8), disk(7)) > 0  # take in the outline
    hands |= m & poly(hp)
fx["hands"] = save_crop("hands", to_art(hands, 1.0), bbox(hands))

# ---- wings: red feathers, closed over their hatching, minus hair and hands ----
red = (r - g > 0.22) & (r - b > 0.12)
for name, wp in (("wingL", WING_L), ("wingR", WING_R)):
    m = (red & poly(wp)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, disk(23))  # bridge the black hatching between feathers
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    m = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 1500])
    # fill every hole that doesn't reach the polygon edge (dark feathers enclosed by red); open gaps stay background
    ff = (~m & poly(wp)).astype(np.uint8)
    nn, lb, sb, _ = cv2.connectedComponentsWithStats(ff)
    # a hole that only touches the picture frame (dark feather tips at the card edge) is still wing
    rim = cv2.dilate((~poly(wp)).astype(np.uint8), disk(3)) > 0
    rim[:, : X0 + 3] = False
    rim[:, X1 - 3 :] = False
    edge = set(np.unique(lb[rim]))
    m |= np.isin(lb, [i for i in range(1, nn) if i not in edge and sb[i, cv2.CC_STAT_AREA] < 20000])
    if name == "wingR":
        # dark feather tips at the card's right edge join the sky below them, so take them by darkness
        m |= (lum < 0.33) & poly([(820, 190), (909, 190), (909, 335), (820, 335)])
    m = (cv2.dilate(m.astype(np.uint8), disk(5)) > 0) & poly(wp) & ~poly(HAIR) & ~hands
    print(name, "px", int(m.sum()))
    a = to_art(m, 1.0)
    if name == "wingL":
        # below y~431 the left wing's dark tips mix with the purple sleeve and can't be told apart by colour:
        # fade the sprite out over its last 36 px so the moving part blends into the printed one, no seam
        ys = (np.arange(H, dtype=np.float32) / SCALE + Y0)[:, None]
        a *= np.clip((431 - ys) / 36, 0, 1)
    fx[name] = save_crop(name, a, bbox(m))

# ---- fruit on the tree of knowledge: lit one by one in layers.tsx (the tree itself stays still) ----
fr = (r > 0.75) & (g > 0.25) & (g < 0.68) & (b < 0.45) & (sat > 0.5) & poly(FRUIT_ZONE)
n, lab, st, cen = cv2.connectedComponentsWithStats(fr.astype(np.uint8))
fruits, fmk = [], np.zeros(lum.shape, bool)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] < 60:
        continue
    fmk |= cv2.dilate((lab == i).astype(np.uint8), disk(5)) > 0  # fruit + its outline
    fruits.append([round(float(cen[i][0]), 1), round(float(cen[i][1]), 1), round(max(st[i, 2], st[i, 3]) / 2 + 2, 1)])
fruits.sort(key=lambda f: f[1])
print("fruit", len(fruits))
fx["fruitBox"] = save_crop("fruit", to_art(fmk, 1.0), bbox(fmk, 8))
fx["fruit"] = fruits

# ---- flames: saturated red-orange blobs on the tree of life ----
fl = (r > 0.78) & (g > 0.25) & (g < 0.68) & (b < 0.45) & (sat > 0.5) & poly(FLAME_ZONE)
fl = cv2.morphologyEx(fl.astype(np.uint8), cv2.MORPH_CLOSE, disk(5))
n, lab, st, cen = cv2.connectedComponentsWithStats(fl)
flames = []
fmask = np.zeros(lum.shape, bool)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] < 120 or st[i, cv2.CC_STAT_HEIGHT] > 70:  # tall blob = the man's forearm, not a flame
        continue
    m = cv2.dilate((lab == i).astype(np.uint8), disk(7)) > 0  # flame + its black outline
    fmask |= m
    x, y, w, h = st[i, :4]
    flames.append([int(x) - 4, int(y) - 4, int(x + w) + 4, int(y + h) + 4])
flames.sort(key=lambda bx: bx[1])
print("flames", len(flames))
fx["flamesBox"] = save_crop("flames", to_art(fmask, 1.0), bbox(fmask, 8))
fx["flames"] = flames

# ---- serpent: light yellow-green body on the trunk ----
sp = (np.abs(g - r) < 0.07) & (g > b + 0.15) & (lum > 0.45) & poly(SERPENT)  # pale olive (~197,196,133)
sp = cv2.morphologyEx(sp.astype(np.uint8), cv2.MORPH_OPEN, disk(3))
n, lab, st, _ = cv2.connectedComponentsWithStats(sp)
sp = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 150])
print("serpent px", int(sp.sum()))
box = bbox(sp, 6)
sa = to_art(cv2.erode(sp.astype(np.uint8), disk(3)) > 0, 1.0)
x0, y0, x1, y1 = [int(round(v)) for v in ((box[0] - X0) * SCALE, (box[1] - Y0) * SCALE, (box[2] - X0) * SCALE, (box[3] - Y0) * SCALE)]
x0, y0, x1, y1 = max(x0, 0), max(y0, 0), min(x1, W), min(y1, H)
gold = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
gold[..., 0], gold[..., 1], gold[..., 2] = 255, 214, 120
gold[..., 3] = (sa[y0:y1, x0:x1] * 255).astype(np.uint8)
Image.fromarray(gold, "RGBA").save(os.path.join(out, "serpent.png"), optimize=True)
fx["serpent"] = [round(X0 + x0 / SCALE, 2), round(Y0 + y0 / SCALE, 2), round(X0 + x1 / SCALE, 2), round(Y0 + y1 / SCALE, 2)]

json.dump(fx, open(os.path.join(here, "fx.json"), "w", encoding="utf-8"), indent=1)
print("fx.json", {k: v for k, v in fx.items() if k != "flames"})
