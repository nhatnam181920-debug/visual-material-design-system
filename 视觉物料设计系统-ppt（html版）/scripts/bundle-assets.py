#!/usr/bin/env python3
"""bundle-assets.py — 把演示稿的外部资源内嵌成单文件，并校验零外部依赖。

用法：
    python scripts/bundle-assets.py 输入.html 输出-单文件.html

处理顺序（重要，避免误伤 JS 字符串）：
    1. <link rel=stylesheet> → 内联 <style>（其中的 url() 一并内嵌）
    2. <style> 块与 style="..." 属性里的 url() → data URI
    3. <img src> / <video src|poster> / srcset → data URI
    4. 最后才内联 <script src>（JS 里的字符串不会被 CSS 正则误伤）
    5. 校验：剥离 <script> 后仍不能有相对外链

不处理 @font-face 里的 data URI（已经是内嵌的，原样保留）。
"""
import base64
import mimetypes
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

MIME = {
    '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
    '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg',
    '.css': 'text/css', '.js': 'application/javascript',
}


def to_data_uri(path: Path) -> str:
    mime = MIME.get(path.suffix.lower()) or mimetypes.guess_type(str(path))[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    src, dst = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
    html = src.read_text(encoding='utf-8')
    base = src.parent
    missing = []
    embedded = []

    def resolve(rel):
        p = (base / rel).resolve()
        if not p.exists():
            missing.append(rel)
            return None
        return p

    def inline_css_urls(css, css_dir):
        def rep(mm):
            rel = mm.group(1)
            if rel.startswith(('data:', '#', '%23')):
                return mm.group(0)
            q = (css_dir / rel).resolve()
            if not q.exists():
                missing.append(rel)
                return mm.group(0)
            embedded.append(q.name)
            return f"url('{to_data_uri(q)}')"
        return re.sub(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", rep, css)

    # ---------- 1. 样式表内联 ----------
    def inline_css(m):
        p = resolve(m.group(1))
        if not p:
            return ''
        css = p.read_text(encoding='utf-8')
        if '@import' in css:
            raise SystemExit(f'CSS 含 @import，需先手动内联：{p}')
        embedded.append(p.name)
        return '<style>\n' + inline_css_urls(css, p.parent) + '\n</style>'

    html = re.sub(r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>', inline_css, html, flags=re.I)

    # ---------- 2. <style> 块与 style 属性里的 url() ----------
    def style_block(m):
        return '<style>' + inline_css_urls(m.group(1), base) + '</style>'

    html = re.sub(r'<style>(.*?)</style>', style_block, html, flags=re.S)

    def style_attr(m):
        return 'style="' + inline_css_urls(m.group(1), base) + '"'

    html = re.sub(r'style="([^"]*url\([^"]*)"', style_attr, html)

    # ---------- 3. 媒体属性 ----------
    def media_rep(m):
        attr, rel = m.group(1), m.group(2)
        if rel.startswith('data:'):
            return m.group(0)
        p = resolve(rel)
        if not p:
            return m.group(0)
        embedded.append(p.name)
        return f'{attr}="{to_data_uri(p)}"'

    html = re.sub(r'(src|poster)="([^"]+)"', media_rep, html)

    # ---------- 4. 脚本内联（放到最后，避免被 CSS 正则误伤） ----------
    def inline_js(m):
        attrs, rel = m.group(1), m.group(2)
        p = resolve(rel)
        if not p:
            return ''
        embedded.append(p.name)
        return f'<script{attrs}>\n{p.read_text(encoding="utf-8")}\n</script>'

    html = re.sub(r'<script([^>]*)src=["\']([^"\']+)["\'][^>]*></script>', inline_js, html, flags=re.I)

    if missing:
        print('[MISS] resources not embedded:')
        for m in sorted(set(missing)):
            print('  -', m)
        sys.exit(1)

    # ---------- 5. 校验：剥离 <script> 后不能有相对外链 ----------
    no_scripts = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S)
    leftover = [u for u in re.findall(r'(?:href|src|poster)="([^"]+)"', no_scripts)
                if not u.startswith(('data:', '#', 'http://', 'https://', 'mailto:'))]
    if leftover:
        print('[MISS] still relative refs:', leftover[:10])
        sys.exit(1)

    dst.write_text(html, encoding='utf-8')
    print(f'[OK] single-file: {dst}')
    print(f'     size: {dst.stat().st_size/1024:.0f} KB  embedded: {len(set(embedded))} files')


if __name__ == '__main__':
    main()
