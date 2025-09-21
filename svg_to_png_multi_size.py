import os

import cairosvg
from PIL import Image

# 変換したいサイズ
SIZES = [16, 32, 48, 128]
SVG_FILE = "icons/icon.svg"  # SVGファイル名

# 一時PNGファイルにまず変換
TMP_PNG = "tmp_icon.png"
cairosvg.svg2png(url=SVG_FILE, write_to=TMP_PNG)

# Pillowでリサイズして各サイズのPNGを保存
with Image.open(TMP_PNG) as img:
    for size in SIZES:
        resized_img = img.resize((size, size), Image.LANCZOS)
        out_name = f"icon{size}.png"
        resized_img.save(out_name)
        print(f"Saved {out_name}")

# 一時ファイル削除
os.remove(TMP_PNG)
