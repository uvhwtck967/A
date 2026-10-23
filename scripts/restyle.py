# Restyle a Rider-Waite scan into the series' "night edition" look, keeping the original value structure.
#
#   python -I scripts/restyle.py <scan.jpg> cards/<id>          (writes into public/cards/<id>/ and cards/<id>/generated.json)
#
# Reads cards/<id>/restyle.json:
#   frame    [x0, y0, x1, y1]   picture interior inside the printed black frame (scan px)
#   tone     optional { stops: [...9], cols: [[r,g,b] x9] }  luminance -> colour curve for neutral areas
#   sprites  [{ name, poly: [[x,y],...], patch: {method: "shift", dx} | {method: "inpaint", hatch} }]
#            objects cut out to animate; the hole is patched in art.png
#   sky      [{ name, from: [x0,y0,x1,y1] }]   flat colour sampled from art (fills behind waving regions)
#   reveals  [{ name, box, exclude?: [[x0,y0,x1,y1],...] }]   gold layer for the light areas inside box
#   look     optional { mode: "natural", gain, gamma, sat, lift: [r,g,b] }  art.png keeps the scan's own colours, a little
#            darker (gain/gamma), and the night edition is written as art_night.png for the reversed card
#            (card.json "reverseArt": "art_night.png"). Sprites are cut from art.png.
# Writes public/cards/<id>/art.png, <sprite>.png, <reveal>.png and cards/<id>/generated.json.
import sys, os, json
import numpy as np
import cv2
from PIL import Image

src, card_dir = sys.argv[1], sys.argv[2].rstrip("/\\")
card_id = os.path.basename(card_dir)
root = os.path.dirname(os.path.dirname(os.path.abspath(card_dir)))
out = os.path.join(root, "public", "cards", card_id)
os.makedirs(out, exist_ok=True)
cfg = json.load(open(os.path.join(card_dir, "restyle.json"), encoding="utf-8"))

SCALE = 2.5
X0, Y0, X1, Y1 = cfg["frame"]

scan = np.asarray(Image.open(src).convert("RGB"))
img = scan[Y0:Y1, X0:X1]
h, w = img.shape[:2]
W2, H2 = int(w * SCALE), int(h * SCALE)

# flatten halftone dots / paper grain while keeping ink edges
f = cv2.medianBlur(img, 3).astype(np.float32) / 255.0
f = cv2.bilateralFilter(f, 9, 0.10, 5)
f = np.clip(cv2.resize(f, (W2, H2), interpolation=cv2.INTER_CUBIC), 0, 1)

lum = f @ np.array([0.299, 0.587, 0.114], np.float32)
sat = (f.max(2) - f.min(2)) / np.maximum(f.max(2), 1e-4)
ink = np.clip((0.40 - lum) / 0.12, 0, 1)

# smooth base luminance: closing removes ink + halftone + paper stains (ink is drawn back on top)
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(6 * SCALE) | 1,) * 2)
lum_t = cv2.GaussianBlur(cv2.morphologyEx(lum, cv2.MORPH_CLOSE, k), (0, 0), 3.0)
kb = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(16 * SCALE) | 1,) * 2)
lum_big = cv2.GaussianBlur(cv2.morphologyEx(lum, cv2.MORPH_CLOSE, kb), (0, 0), 4.0)
tone = cfg.get("tone", {})
LIGHT = tone.get("lightThreshold", 0.80)  # raise it when the scan's sky is brighter than its stains
light = np.clip((cv2.GaussianBlur(lum_big, (0, 0), 8) - LIGHT) / 0.05, 0, 1) * (sat < 0.25)
light = cv2.GaussianBlur(light.astype(np.float32), (0, 0), 4)
lum_t = lum_t * (1 - light) + np.maximum(lum_t, lum_big) * light

# tone map for neutrals: grey sky (~0.65) -> indigo, whites (~0.88) -> parchment. Keep sky/white on the flat parts.
stops = np.array(tone.get("stops", [0.00, 0.30, 0.55, 0.68, 0.80, 0.83, 0.86, 0.95, 1.00]), np.float32)
cols = np.array(tone.get("cols", [
    [0.030, 0.025, 0.055], [0.050, 0.045, 0.090], [0.110, 0.105, 0.200], [0.165, 0.160, 0.290], [0.200, 0.190, 0.320],
    [0.500, 0.445, 0.400], [0.820, 0.735, 0.565], [0.885, 0.810, 0.630], [0.950, 0.885, 0.715],
]), np.float32)
neutral = np.stack([np.interp(lum_t, stops, cols[:, c]) for c in range(3)], -1)

coloured = cv2.GaussianBlur(f, (0, 0), 2.0) * 0.78 + np.array([0.015, 0.012, 0.04], np.float32)
SAT_MIN = tone.get("satMin", 0.18)  # below this, a pixel is treated as neutral (tinted by the tone curve)
wsat = np.clip((sat - SAT_MIN) / 0.25, 0, 1)[..., None]
out_rgb = neutral * (1 - wsat) + coloured * wsat
out_rgb = out_rgb * (1 - ink[..., None]) + cols[0] * ink[..., None]

# gilding: faint gold rim where ink meets light areas
lightE = np.clip((lum - 0.80) / 0.1, 0, 1)
edge = np.clip(cv2.GaussianBlur(ink, (0, 0), 1.6) * cv2.GaussianBlur(lightE, (0, 0), 1.6) * 3.0, 0, 1)[..., None]
out_rgb = out_rgb * (1 - 0.3 * edge) + np.array([0.93, 0.76, 0.42], np.float32) * 0.3 * edge
art = (np.clip(out_rgb, 0, 1) * 255).astype(np.uint8)

# natural look: the scan's own colours, slightly darkened; the night edition is kept for the reversed card
look = cfg.get("look", {})
night = None
if look.get("mode") == "natural":
    night = art
    nat = np.power(f, look.get("gamma", 1.1)) * look.get("gain", 0.84)
    nl = (nat @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
    nat = nl + (nat - nl) * look.get("sat", 1.0) + np.array(look.get("lift", [0.01, 0.008, 0.022]), np.float32)
    art = (np.clip(nat, 0, 1) * 255).astype(np.uint8)


def to_art(pts):
    return ((np.asarray(pts, np.float32) - [X0, Y0]) * SCALE).astype(np.int32)


def box_art(b):
    (x0, y0), (x1, y1) = to_art([b[:2], b[2:]])
    return x0, y0, x1, y1


# ---- sprites: cut everything first, then patch ----
gen = {"sprites": {}, "sky": {}}
cuts = []
for sp in cfg.get("sprites", []):
    poly = to_art(sp["poly"])
    mask = np.zeros(art.shape[:2], np.uint8)
    cv2.fillPoly(mask, [poly], 1)
    x0, y0 = poly.min(0)
    x1, y1 = poly.max(0) + 1
    # optional matte "connected": inside the polygon, remove every background region (sky, wood…) that is
    # connected to the background outside it — only the object itself is left to move.
    mt = sp.get("matte")
    if mt and mt.get("method") == "connected":
        def feat(px):  # chroma-weighted colour features: (r-g, g-b, luminance)
            return np.stack([2 * (px[..., 0] - px[..., 1]), 2 * (px[..., 1] - px[..., 2]), px @ np.array([0.299, 0.587, 0.114], np.float32)], -1)
        F = feat(f)
        # hatched backgrounds (wood drawn with dense lines) are matched on a blurred copy, ink included
        Fb = feat(cv2.GaussianBlur(f, (0, 0), 2.5 * SCALE))
        bg = np.zeros(mask.shape, bool)
        for bx in mt["bg"]:
            x0b, y0b, x1b, y1b = box_art(bx)
            sample = F[y0b:y1b, x0b:x1b][ink[y0b:y1b, x0b:x1b] < 0.5]
            bg |= (np.linalg.norm(F - np.median(sample, 0), axis=-1) < mt.get("tol", 0.15)) & (ink < 0.5)
        for bx in mt.get("bgHatched", []):
            x0b, y0b, x1b, y1b = box_art(bx)
            ref = np.median(Fb[y0b:y1b, x0b:x1b].reshape(-1, 3), 0)
            bg |= np.linalg.norm(Fb - ref, axis=-1) < mt.get("tolHatched", 0.12)
        # background reachable from outside the polygon (through non-ink pixels)
        ring = cv2.dilate(mask, np.ones((9, 9), np.uint8)) & (1 - mask)
        n_, lab = cv2.connectedComponents(bg.astype(np.uint8), connectivity=4)
        touching = np.unique(lab[(ring > 0) & bg])
        outside_bg = np.isin(lab, touching[touching > 0])
        # ink lines that sit inside background (wood grain, the trunk's own outline) go with the background
        share = cv2.GaussianBlur(outside_bg.astype(np.float32), (0, 0), 3 * SCALE)
        outside_bg |= (ink >= 0.5) & (share > mt.get("inkShare", 0.62))
        fig = (mask > 0) & ~outside_bg
        # regions that never belong to the object (e.g. hatched wood the colour test can't separate)
        for poly in mt.get("drop", []):
            km = np.zeros(mask.shape, np.uint8)
            cv2.fillPoly(km, [to_art(poly)], 1)
            fig &= km == 0
        # regions that always belong to the object (e.g. hair that happens to look like wood)
        for poly in mt.get("keep", []):
            km = np.zeros(mask.shape, np.uint8)
            cv2.fillPoly(km, [to_art(poly)], 1)
            fig |= (km > 0) & (mask > 0)
        # drop specks, keep the object
        n_, lab, st, _ = cv2.connectedComponentsWithStats(fig.astype(np.uint8), connectivity=8)
        keep = np.zeros_like(fig)
        for k in range(1, n_):
            if st[k, cv2.CC_STAT_AREA] > mt.get("minArea", 400) * SCALE * SCALE / 6.25:
                keep |= lab == k
        mask = keep.astype(np.uint8)
        # edges where the cutout slices through the drawing (polygon / drop lines) rather than following the
        # object's outline against background: keep the original pixels under them, or a seam shows at rest
        static = (mask == 0) & ~outside_bg & (cv2.dilate(mask, np.ones((5, 5), np.uint8)) > 0)
        sp["_keepOriginal"] = cv2.dilate(static.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(5 * SCALE) | 1,) * 2))
    alpha = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.0 if mt else 1.5)
    alpha = alpha[y0:y1, x0:x1]
    Image.fromarray(np.dstack([art[y0:y1, x0:x1], (np.clip(alpha, 0, 1) * 255).astype(np.uint8)]), "RGBA").save(f"{out}/{sp['name']}.png", optimize=True)
    gen["sprites"][sp["name"]] = [float(x0 / SCALE + X0), float(y0 / SCALE + Y0), float(x1 / SCALE + X0), float(y1 / SCALE + Y0)]
    cuts.append((sp, mask))

# inpaint first, then shift fills (a shift may sample ground an inpaint just repaired)
for sp, mask in sorted(cuts, key=lambda c: c[0].get("patch", {}).get("method") == "shift"):
    patch = sp.get("patch", {"method": "inpaint"})
    if patch["method"] == "shift":
        # fill with the picture shifted sideways (keeps the same ground hatching)
        hole = cv2.GaussianBlur(cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))).astype(np.float32), (0, 0), 4)[..., None]
        dx = int(patch["dx"] * SCALE)
        shifted = np.zeros_like(art)
        if dx < 0:
            shifted[:, -dx:] = art[:, : art.shape[1] + dx]
        else:
            shifted[:, : art.shape[1] - dx] = art[:, dx:]
        art = (art * (1 - hole) + shifted * hole).astype(np.uint8)
    elif patch["method"] == "fill":
        # normalized convolution: a smooth fill from the surrounding colour (no inpaint streaks), plus faint grain
        grow = patch.get("grow", 31)
        hole = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (grow, grow))).astype(np.float32)
        if "_keepOriginal" in sp:
            hole *= 1 - sp["_keepOriginal"]
        # sample only open background around the hole — ink outlines would smear in as a dark ghost
        gray = cv2.cvtColor(art, cv2.COLOR_RGB2GRAY).astype(np.float32)
        keep = (1 - hole) * (gray > np.percentile(gray, 35))
        # only sample the plain background the hole should look like (e.g. sky, not the trunk beside it)
        if patch.get("fillRef"):
            refs = [np.median(art[y0r:y1r, x0r:x1r].reshape(-1, 3).astype(np.float32), 0) for (x0r, y0r, x1r, y1r) in (box_art(b) for b in patch["fillRef"])]
            near = np.min([np.linalg.norm(art.astype(np.float32) - r, axis=-1) for r in refs], 0) < patch.get("fillTol", 28)
            keep = keep * near
        # done at 1/8 scale so the blur reaches from the hole's edge to its middle
        q = 8
        small_a = cv2.resize(art.astype(np.float32) * keep[..., None], (art.shape[1] // q, art.shape[0] // q), interpolation=cv2.INTER_AREA)
        small_k = cv2.resize(keep.astype(np.float32), (art.shape[1] // q, art.shape[0] // q), interpolation=cv2.INTER_AREA)
        sig = patch.get("sigma", 40) / 2.5
        num = cv2.GaussianBlur(small_a, (0, 0), sig)
        den = cv2.GaussianBlur(small_k, (0, 0), sig)[..., None]
        filled = cv2.resize(num / np.maximum(den, 1e-4), (art.shape[1], art.shape[0]), interpolation=cv2.INTER_CUBIC)
        grain = (np.random.default_rng(1).standard_normal(art.shape[:2]) * 2.0)[..., None]
        hf = cv2.GaussianBlur(hole, (0, 0), 3)[..., None]
        art = np.clip(art * (1 - hf) + (filled + grain) * hf, 0, 255).astype(np.uint8)
        # rebuild a vertical object that ran behind (e.g. a trunk) by stretching a visible piece of it
        st = patch.get("stretch")
        if st:
            sx0, sy0, sx1, sy1 = box_art(st["src"])
            ix0, iy0, ix1, iy1 = box_art(st["into"])
            piece = art[sy0:sy1, sx0:sx1]
            col = cv2.resize(piece, (ix1 - ix0, iy1 - iy0), interpolation=cv2.INTER_CUBIC).astype(np.float32)
            m = cv2.GaussianBlur(hole, (0, 0), 3)[iy0:iy1, ix0:ix1][..., None]
            xf = np.minimum(np.arange(ix1 - ix0), np.arange(ix1 - ix0)[::-1])
            m = m * np.clip(xf / (3 * SCALE), 0, 1)[None, :, None]
            region = art[iy0:iy1, ix0:ix1].astype(np.float32)
            art[iy0:iy1, ix0:ix1] = (region * (1 - m) + col * m).astype(np.uint8)
    else:
        # inpaint at quarter scale (soft fill), upscale, re-add faint horizontal hatching
        hole = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
        ys, xs = np.nonzero(hole)
        py0, py1, px0, px1 = max(0, ys.min() - 60), ys.max() + 60, max(0, xs.min() - 60), xs.max() + 60
        reg, hreg = art[py0:py1, px0:px1], hole[py0:py1, px0:px1]
        q = 4
        small = cv2.resize(reg, (reg.shape[1] // q, reg.shape[0] // q), interpolation=cv2.INTER_AREA)
        hsmall = cv2.resize(hreg * 255, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
        filled = cv2.resize(cv2.inpaint(small, hsmall, 7, cv2.INPAINT_TELEA), (reg.shape[1], reg.shape[0]), interpolation=cv2.INTER_CUBIC)
        hatch = (0.5 + 0.5 * np.sin(np.arange(reg.shape[0])[:, None] * 2 * np.pi / (7 * SCALE))) ** 6
        filled = (filled.astype(np.float32) * (1 - patch.get("hatch", 0.28) * hatch[..., None])).astype(np.uint8)
        hf = cv2.GaussianBlur(hreg.astype(np.float32), (0, 0), 4)[..., None]
        art[py0:py1, px0:px1] = (reg * (1 - hf) + filled * hf).astype(np.uint8)
        # optional: rebuild something that ran behind the object (e.g. a tree trunk) by tiling a visible piece of it
        tile = patch.get("tile")
        if tile:
            sx0, sy0, sx1, sy1 = box_art(tile["src"])
            ix0, iy0, ix1, iy1 = box_art(tile["into"])
            piece = art[sy0:sy1, sx0:sx1].astype(np.float32)
            th = piece.shape[0]
            m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[iy0:iy1, ix0:ix1][..., None]
            # feather the column edges so the rebuilt trunk blends into the inpainted sky
            xf = np.minimum(np.arange(ix1 - ix0), np.arange(ix1 - ix0)[::-1])
            m = m * np.clip(xf / (4 * SCALE), 0, 1)[None, :, None]
            col = np.concatenate([piece] * ((iy1 - iy0) // th + 2), 0)[: iy1 - iy0, : ix1 - ix0]
            region = art[iy0:iy1, ix0:ix1].astype(np.float32)
            art[iy0:iy1, ix0:ix1] = (region * (1 - m) + col * m).astype(np.uint8)

# ---- flat fill colours sampled from the finished art ----
for s in cfg.get("sky", []):
    x0, y0, x1, y1 = box_art(s["from"])
    gen["sky"][s["name"]] = [int(v) for v in np.median(art[y0:y1, x0:x1].reshape(-1, 3), 0)]

# ---- gold reveal layers: light areas inside a box, plus a thin rim ----
for rv in cfg.get("reveals", []):
    rx0, ry0, rx1, ry1 = box_art(rv["box"])
    rl = lum[ry0:ry1, rx0:rx1]
    white = (cv2.GaussianBlur(rl, (0, 0), 3) > 0.55).astype(np.uint8)
    white = cv2.morphologyEx(white, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
    n_, lab, st, _ = cv2.connectedComponentsWithStats(white)
    white = (lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
    petals = np.clip((rl - 0.55) / 0.2, 0, 1) * (1 - ink[ry0:ry1, rx0:rx1]) * white
    outline = cv2.dilate(white, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))) - cv2.erode(white, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    rim = cv2.GaussianBlur(outline.astype(np.float32), (0, 0), 1.5) * (1 - white * 0.6)
    a_ = np.clip(np.maximum(petals * 0.85, rim * 0.9), 0, 1)
    xx, yy = np.meshgrid(np.arange(rl.shape[1]) / SCALE + rv["box"][0], np.arange(rl.shape[0]) / SCALE + rv["box"][1])
    for ex in rv.get("exclude", []):
        a_ *= 1 - ((xx >= ex[0]) & (xx < ex[2]) & (yy >= ex[1]) & (yy < ex[3]))
    gold = np.zeros((*rl.shape, 4), np.uint8)
    gold[..., 0], gold[..., 1], gold[..., 2] = 255, 196, 92
    gold[..., 3] = (a_ * 255).astype(np.uint8)
    Image.fromarray(gold, "RGBA").save(f"{out}/{rv['name']}.png", optimize=True)

Image.fromarray(art).save(f"{out}/art.png", optimize=True)
if night is not None:
    Image.fromarray(night).save(f"{out}/art_night.png", optimize=True)
json.dump(gen, open(os.path.join(card_dir, "generated.json"), "w"), indent=1)
print(f"{card_id}: art {W2}x{H2}, sprites {list(gen['sprites'])}, sky {list(gen['sky'])}")
