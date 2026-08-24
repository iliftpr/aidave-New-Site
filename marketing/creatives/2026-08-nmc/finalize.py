"""Crop the chosen stills to Meta's 4:5 (1080x1350) and 1:1 (1080x1080) and add the overlay line to
the founder portraits (generated without text). Run: python finalize.py
Picks are declared in PICKS below after eyeballing the candidates."""
from PIL import Image, ImageDraw, ImageFont
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'final')
os.makedirs(OUT, exist_ok=True)

# source file -> (output stem, overlay text or None). Scene stills already carry their text.
PICKS = {
    'C1-contractor-ladder-v1.png': ('C1-contractor-ladder', None),
    'C2-contractor-split-v1.png': ('C2-contractor-split', None),
    'D1-dental-frontdesk-v1.png': ('D1-dental-frontdesk', None),
    'D2-medspa-split-v1.png': ('D2-medspa-split', None),
    'R1-restaurant-rush-v1.png': ('R1-restaurant-rush', None),
    'R2-restaurant-split-v1.png': ('R2-restaurant-split', None),
    # founder portraits from fal-ai/gpt-image-2/edit already carry their overlay line
    'C3-founder-yard-fal.png': ('C3-founder-yard', None),
    'D3-founder-dental-fal.png': ('D3-founder-dental', None),
    'R3-founder-diner-fal.png': ('R3-founder-diner', None),
}

FONT_CANDIDATES = [
    r'C:\Windows\Fonts\segoeuib.ttf',  # Segoe UI Bold
    r'C:\Windows\Fonts\arialbd.ttf',
]


def font(size):
    for f in FONT_CANDIDATES:
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def crop_to(im, w, h, anchor='top'):
    """Center-crop horizontally; vertically keep the top (headline space) unless anchor='center'."""
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    im = im.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    sw, sh = im.size
    left = (sw - w) // 2
    top = 0 if anchor == 'top' else (sh - h) // 2
    return im.crop((left, top, left + w, top + h))


def overlay(im, text):
    d = ImageDraw.Draw(im)
    W, H = im.size
    size = int(W * 0.075)
    f = font(size)
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x, y = (W - tw) // 2, int(H * 0.06)
    # soft shadow for legibility on any background
    for dx, dy in ((2, 2), (3, 3)):
        d.text((x + dx, y + dy), text, font=f, fill=(0, 0, 0, 160))
    d.text((x, y), text, font=f, fill=(255, 255, 255))
    return im


for src, (stem, text) in PICKS.items():
    p = os.path.join(HERE, src)
    if not os.path.exists(p):
        print('missing', src)
        continue
    im = Image.open(p).convert('RGB')
    for (w, h, tag) in ((1080, 1350, '4x5'), (1080, 1080, '1x1')):
        out = crop_to(im.copy(), w, h, anchor='top')
        if text:
            out = overlay(out, text)
        out.save(os.path.join(OUT, f'{stem}-{tag}.jpg'), quality=92)
    print('ok', stem)
