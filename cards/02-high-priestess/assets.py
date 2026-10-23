# II 女祭司 — card-specific assets, run after restyle.py:
#   python -I cards/02-high-priestess/assets.py <scan.jpg>
# Writes into public/cards/02-high-priestess/:
#   hold.png        art.png with alpha = everything that must stay still while the veil ripples
#                   (all of the picture outside the veil, plus the priestess and her crown in front of it)
#   tora_gold.png   gold copy of the TORA letters on the scroll, revealed left to right in layers.tsx
# Coordinates are scan px; the veil outline and the scroll band are measured on a gridded crop.
import sys, os, json
import numpy as np
import cv2
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
out = os.path.join(root, "public", "cards", "02-high-priestess")
X0, Y0, X1, Y1 = json.load(open(os.path.join(here, "restyle.json"), encoding="utf-8"))["frame"]
SCALE = 2.5

scan = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(np.float32) / 255
art = np.asarray(Image.open(os.path.join(out, "art.png")).convert("RGB"))
H, W = art.shape[:2]

# veil panel between the pillars: domed top, open down to the bench behind her
VEIL = [(270, 245), (300, 150), (400, 112), (560, 104), (710, 112), (790, 150), (814, 230), (814, 1275), (268, 1275)]
# crown (horns + globe) and forehead: no blue/white blob spans these rows, so they are traced by hand
HEAD = [(402, 440), (412, 410), (470, 402), (540, 392), (610, 402), (712, 410), (722, 440), (700, 482), (640, 500), (612, 560), (604, 625), (492, 625), (484, 560), (452, 500), (404, 482)]
# TORA lettering band on the scroll (slanted)
TORA = [(428, 1002), (540, 1010), (607, 1033), (599, 1058), (532, 1043), (428, 1033)]  # inside the scroll's outline strokes

# ---- the priestess, found on the scan by colour, inside the veil ----
r, g, b = scan[..., 0], scan[..., 1], scan[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
sat = (scan.max(2) - scan.min(2)) / np.maximum(scan.max(2), 1e-4)
blue = ((b - r) > 0.14) & ((g - r) > 0.08)  # cape, robe, head veil, crown horns
white = (lum > 0.78) & (sat < 0.2)
# large white areas only (globe, robe folds); the veil's speckle dots are removed by the opening
white = cv2.morphologyEx(white.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
fig = ((blue | (white > 0)) * 255).astype(np.uint8)
veil = np.zeros(fig.shape, np.uint8)
cv2.fillPoly(veil, [np.array(VEIL, np.int32)], 255)
fig = cv2.bitwise_and(fig, veil)
fig = cv2.morphologyEx(fig, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
# her parts are separate colour blobs (cape, head veil, robe, globe) with ink between them:
# keep every large blob, then fill each row between her outermost pixels — she is one span per row
n, lab, st, _ = cv2.connectedComponentsWithStats(fig)
big = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 1500 and 330 < st[i, cv2.CC_STAT_LEFT] + st[i, cv2.CC_STAT_WIDTH] / 2 < 760])
fill = np.zeros(fig.shape, np.uint8)
for y in range(fig.shape[0]):
    xs = np.flatnonzero(big[y])
    if xs.size:
        fill[y, xs[0]:xs[-1] + 1] = 255
cv2.fillPoly(fill, [np.array(HEAD, np.int32)], 255)
fig = cv2.bitwise_and(fill, veil)
# take in her ink outline so the moving veil never slides a line over her edge
fig = cv2.dilate(fig, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
print("figure px", int((fig > 0).sum()), "of veil", int((veil > 0).sum()))

moving = (veil > 0) & (fig == 0)
still = (~moving).astype(np.float32)[Y0:Y1, X0:X1]
still = cv2.resize(still, (W, H), interpolation=cv2.INTER_LINEAR)
still = np.clip(cv2.GaussianBlur(still, (0, 0), 2.0), 0, 1)
hold = np.dstack([art, (still * 255).astype(np.uint8)])
Image.fromarray(hold, "RGBA").save(os.path.join(out, "hold.png"), optimize=True)

# ---- TORA letters in gold ----
band = np.zeros(fig.shape, np.uint8)
cv2.fillPoly(band, [np.array(TORA, np.int32)], 255)
ink = np.clip((0.42 - lum) / 0.14, 0, 1) * (band > 0)
# drop specks
nb, lb, sb, _ = cv2.connectedComponentsWithStats((ink > 0.5).astype(np.uint8))
ink *= np.isin(lb, [i for i in range(1, nb) if sb[i, cv2.CC_STAT_AREA] > 12])
bx0, by0, bw, bh = cv2.boundingRect(np.array(TORA, np.int32))
pad = 6
bx0, by0, bx1, by1 = bx0 - pad, by0 - pad, bx0 + bw + pad, by0 + bh + pad
a_ = cv2.resize(ink[by0:by1, bx0:bx1].astype(np.float32), ((bx1 - bx0) * 3, (by1 - by0) * 3), interpolation=cv2.INTER_CUBIC)
# gold sits inside each stroke, leaving a black rim: the bold letters nearly touch and would merge into a bar
a_ = cv2.erode(a_, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
a_ = np.clip(cv2.GaussianBlur(a_, (0, 0), 0.8), 0, 1)
gold = np.zeros((*a_.shape, 4), np.uint8)
gold[..., 0], gold[..., 1], gold[..., 2] = 255, 200, 98
gold[..., 3] = (a_ * 255).astype(np.uint8)
Image.fromarray(gold, "RGBA").save(os.path.join(out, "tora_gold.png"), optimize=True)
print("tora box", [bx0, by0, bx1, by1])
