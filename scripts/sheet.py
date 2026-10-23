# Tile PNG stills into one contact sheet (ffmpeg can't open paths with Chinese characters, so this uses PIL).
#   python -I scripts/sheet.py <out.jpg> <cols> <a.png> <b.png> ...
import sys
from PIL import Image
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert("RGB") for f in files]
w = 640
ims = [im.resize((w, int(im.height * w / im.width))) for im in ims]
h = ims[0].height
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h))
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out, quality=88)
print(out)
