#!/usr/bin/env python3
"""make-pdf.py — 把 qa-deck.cjs 的逐页截图拼成 16:9 静态 PDF 备份。

用法：
    python scripts/make-pdf.py <截图目录> <输出.pdf>

说明：
    - 每张 slide-XX.png 一页，按文件名排序
    - 页面尺寸 720x405 pt（16:9），JPEG 压缩控制体积
    - 这是「静态备份」，没有动画与翻页；给评委拷走/投影兜底用
"""
import io
import sys
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit('需要 Pillow：pip install pillow')


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    qa_dir, out = Path(sys.argv[1]), Path(sys.argv[2])
    shots = sorted(qa_dir.glob('slide-*.png'))
    if not shots:
        raise SystemExit(f'目录里没有 slide-*.png：{qa_dir}')

    pages = []
    for p in shots:
        im = Image.open(p).convert('RGB')
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=88, optimize=True)
        pages.append(Image.open(io.BytesIO(buf.getvalue())))

    pages[0].save(out, 'PDF', save_all=True, append_images=pages[1:],
                  resolution=192.0, title=out.stem)
    print(f'✓ PDF：{out}（{len(pages)} 页，{out.stat().st_size/1024/1024:.1f} MB）')


if __name__ == '__main__':
    main()
