from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
REF = Path(r"C:/Users/15988/Desktop/阿尔卡那")
OUT = ROOT / "out" / "16-tower"
FONT = ROOT / "public" / "fonts" / "serif-semibold.otf"
SCAN = ROOT / "scans" / "RWS_Tarot_16_Tower.jpg"
SUBTITLE = "一场无法回避的剧变"


def background_patch(im, box, source):
    x0, y0, x1, y1 = box
    patch = source.resize((x1 - x0, y1 - y0), Image.Resampling.LANCZOS)
    mask = Image.new("L", patch.size)
    d = ImageDraw.Draw(mask)
    d.rectangle((24, 24, patch.width - 24, patch.height - 24), fill=255)
    im.paste(patch, (x0, y0), mask.filter(ImageFilter.GaussianBlur(18)))


def foil_text(im, text, xy, max_width, height, top, bottom, shadow=(0, 0, 0)):
    size = height
    d = ImageDraw.Draw(im)
    while True:
        font = ImageFont.truetype(str(FONT), size)
        b = d.textbbox((0, 0), text, font=font, anchor="lt")
        if b[2] <= max_width:
            break
        size -= 1
    mask = Image.new("L", im.size)
    ImageDraw.Draw(mask).text(xy, text, font=font, fill=255, anchor="lt")
    blur = mask.filter(ImageFilter.GaussianBlur(5))
    shadow_layer = Image.new("RGB", im.size, shadow)
    im.paste(shadow_layer, (0, 0), blur.point(lambda p: int(p * 0.75)))
    grad = Image.new("RGB", (1, im.height))
    for y in range(im.height):
        t = min(1, max(0, (y - xy[1]) / max(1, size * 1.05)))
        color = tuple(round(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        grad.putpixel((0, y), color)
    im.paste(grad.resize(im.size), (0, 0), mask)


def make(reference, name, clean_box, art_box, label_xy, title_xy, subtitle_xy, title_size, subtitle_size):
    im = Image.open(REF / reference).convert("RGB")
    source = Image.open(REF / "女祭司2.png").convert("RGB").crop((0, 665, 770, 1010))
    background_patch(im, clean_box, source)

    art = Image.open(SCAN).convert("RGB").crop((36, 55, 1031, 1662))
    art = ImageEnhance.Contrast(art).enhance(1.17)
    art = ImageEnhance.Color(art).enhance(1.09)
    x0, y0, x1, y1 = art_box
    art = ImageOps.fit(art, (x1 - x0, y1 - y0), method=Image.Resampling.LANCZOS)
    im.paste(art, (x0, y0))

    d = ImageDraw.Draw(im)
    label_font = ImageFont.truetype(str(FONT), 32 if im.width > im.height else 31)
    d.text(label_xy, "阿卡那图鉴 · XVI", font=label_font, fill=(220, 170, 88), anchor="lt")
    lx, ly = label_xy
    d.line((lx, ly + 49, lx + (400 if im.width > im.height else 350), ly + 49), fill=(220, 170, 88), width=2)
    foil_text(im, "高塔", title_xy, (art_box[0] - title_xy[0] - 65) if im.width > im.height else 700,
              title_size, (255, 252, 231), (233, 216, 162))
    foil_text(im, SUBTITLE, subtitle_xy, (art_box[0] - subtitle_xy[0] - 145) if im.width > im.height else im.width - subtitle_xy[0] - 80,
              subtitle_size, (255, 222, 103), (196, 132, 25), (18, 9, 1))
    im.save(OUT / name, optimize=True)
    print(OUT / name)


if __name__ == "__main__":
    make("女祭司1.png", "高塔_封面_2比3.png", (130, 105, 950, 550),
         (316, 676, 719, 1326), (180, 134), (180, 235), (180, 365), 120, 104)
    make("女祭司2.png", "高塔_封面_3比2.png", (80, 230, 825, 680),
         (915, 144, 1335, 842), (122, 261), (120, 367), (120, 520), 125, 104)
