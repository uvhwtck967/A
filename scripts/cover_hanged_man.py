from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out" / "12-hanged-man"
FONT = ROOT / "public" / "fonts" / "serif-semibold.otf"
TITLE = "倒吊人"
SUBTITLE = "受罚却从容"
GOLD = (225, 179, 91)
CREAM = (246, 232, 196)


def background(size, center):
    w, h = size
    texture = Image.open(OUT / "封面纹理底图.png").convert("RGB")
    if h > w:
        texture = texture.crop((0, 0, 527, texture.height))
    texture = ImageOps.fit(texture, size, method=Image.Resampling.LANCZOS)
    return Image.blend(Image.new("RGB", size, (7, 12, 29)), texture, 0.24).convert("RGBA")


def card():
    scale = 2
    w, h = 600 * scale, 1000 * scale
    im = Image.new("RGBA", (w, h), (10, 9, 19, 255))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((4, 4, w - 5, h - 5), radius=44, fill=(10, 9, 18), outline=GOLD, width=12)
    d.rounded_rectangle((27, 27, w - 28, h - 28), radius=28, outline=(172, 122, 45), width=4)
    for cx in (56, w - 56):
        for cy in (56, h - 56):
            d.polygon(((cx, cy - 16), (cx + 16, cy), (cx, cy + 16), (cx - 16, cy)), fill=GOLD)
            d.polygon(((cx, cy - 8), (cx + 8, cy), (cx, cy + 8), (cx - 8, cy)), fill=(10, 9, 18))

    art = Image.open(ROOT / "public" / "cards" / "12-hanged-man" / "art.png").convert("RGBA")
    figure = Image.open(ROOT / "public" / "cards" / "12-hanged-man" / "figure.png").convert("RGBA")
    # The sprite bounds use scan coordinates; the art crop is scan [44,61,1032,1706].
    figure_box = (194, 227.8, 836.4, 1604.2)
    sx = art.width / (1032 - 44)
    figure_xy = (round((figure_box[0] - 44) * sx), round((figure_box[1] - 61) * sx))
    art.alpha_composite(figure, figure_xy)
    art = ImageEnhance.Color(art).enhance(1.18)
    art = ImageEnhance.Brightness(art).enhance(1.25)
    pic = art.resize((1040, 1732), Image.Resampling.LANCZOS)
    im.alpha_composite(pic, (80, 120))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((80, 120, 1120, 1852), radius=8, outline=GOLD, width=4)
    d.rounded_rectangle((66, 106, 1134, 1866), radius=15, outline=(117, 86, 37), width=2)
    latin = ImageFont.truetype(str(ROOT / "public" / "fonts" / "PERTILI.TTF"), 58)
    d.text((w / 2, 1903), "THE HANGED MAN", font=latin, anchor="mt", fill=GOLD, stroke_width=1)
    return im


def text(im, x, label_y, title_y, subtitle_y, title_size, subtitle_size):
    d = ImageDraw.Draw(im)
    label_font = ImageFont.truetype(str(ROOT / "public" / "fonts" / "serif-light.otf"), 36)
    title_font = ImageFont.truetype(str(ROOT / "public" / "fonts" / "serif-light.otf"), title_size)
    subtitle_font = ImageFont.truetype(str(ROOT / "public" / "fonts" / "serif-light.otf"), subtitle_size)
    d.text((x, label_y), "阿卡那图鉴 · XII", font=label_font, fill=(171, 143, 91), anchor="lt")
    d.line((x, label_y + 57, x + 390, label_y + 57), fill=(164, 126, 59), width=2)
    d.text((x + 2, title_y + 3), TITLE, font=title_font, fill=(0, 0, 0, 80), anchor="lt")
    d.text((x, title_y), TITLE, font=title_font, fill=CREAM, anchor="lt")
    d.text((x + 2, subtitle_y + 3), SUBTITLE, font=subtitle_font, fill=(0, 0, 0, 80), anchor="lt")
    d.text((x, subtitle_y), SUBTITLE, font=subtitle_font, fill=GOLD, anchor="lt")


def make(name, size, card_box, text_box):
    x, y, cw, ch = card_box
    im = background(size, (x + cw / 2, y + ch / 2))
    halo = Image.new("RGBA", size)
    hd = ImageDraw.Draw(halo)
    hd.ellipse((x - 80, y - 80, x + cw + 80, y + ch + 80), fill=(230, 150, 40, 175))
    halo = halo.filter(ImageFilter.GaussianBlur(85))
    im = Image.alpha_composite(im, halo)
    im.alpha_composite(card().resize((cw, ch), Image.Resampling.LANCZOS), (x, y))
    text(im, *text_box)
    path = OUT / name
    im.convert("RGB").save(path, quality=95, subsampling=0)
    print(path)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    make("倒吊人_横版封面_v2.jpg", (1920, 1080), (1190, 130, 490, 817), (75, 320, 435, 575, 116, 124))
    make("倒吊人_竖版封面_v2.jpg", (1080, 1920), (258, 716, 564, 940), (125, 150, 295, 435, 120, 120))
