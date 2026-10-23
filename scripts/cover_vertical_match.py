from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out" / "12-hanged-man"
src = Image.open(OUT / "封面横版参考母版.png").convert("RGB")
w, h = 1280, 1920

# Repeat a clean part of the supplied navy paper, flipping each row at the join.
row_h = round(150 * w / 850)
patch = src.crop((0, 100, 850, 250)).resize((w, row_h), Image.Resampling.LANCZOS)
cover = Image.new("RGB", (w, h))
for i, y in enumerate(range(0, h, row_h)):
    cover.paste(patch.transpose(Image.Transpose.FLIP_TOP_BOTTOM) if i % 2 else patch, (0, y))
cover = cover.convert("RGBA")

glow = Image.new("RGBA", (w, h))
ImageDraw.Draw(glow).ellipse((260, 660, 1020, 1810), fill=(255, 172, 48, 155))
cover = Image.alpha_composite(cover, glow.filter(ImageFilter.GaussianBlur(100)))


def paste_feathered(crop, box, xy, blur):
    layer = src.crop(crop).resize(box, Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", box)
    ImageDraw.Draw(mask).rectangle((blur, blur, box[0] - blur, box[1] - blur), fill=255)
    layer.putalpha(mask.filter(ImageFilter.GaussianBlur(blur / 2)))
    cover.alpha_composite(layer, xy)


# Source pixels retain the supplied cover's exact lettering and printed card texture.
paste_feathered((35, 250, 760, 650), (920, 508), (180, 135), 34)
paste_feathered((900, 20, 1560, 920), (820, 1118), (230, 690), 56)

path = OUT / "倒吊人_竖版封面_2比3.png"
cover.convert("RGB").save(path, optimize=True)
print(path)
