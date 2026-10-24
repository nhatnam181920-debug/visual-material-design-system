# scripts · 打包与验收工具

三个脚本，全部零第三方依赖（Node 内置 / Python 标准库 + Pillow）。

## 1. qa-deck.cjs — 验收（必跑）

检查：页数、舞台尺寸、元素溢出（装饰层除外）、字体、图片/视频加载、垂直平衡、外链、JS 异常，并逐页截图。

```bash
# 先起浏览器调试端口（任选其一）
msedge  --headless=new --remote-debugging-port=9222 --user-data-dir=%TEMP%\deck-qa about:blank      # Windows
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/deck-qa about:blank   # macOS

# 跑验收
node scripts/qa-deck.cjs 我的演示.html ./qa 1920 1080
```

- 端口可用环境变量覆盖：`QA_PORT=9333 node scripts/qa-deck.cjs ...`
- 通过：退出码 0；失败：退出码 1，逐页打印问题
- 输出：`qa/slide-01.png …` + `qa/report.json`

**装饰层白名单**：`.deco,.glow,.landscape,.stars,.particles,.atmos,.gridlines,.grain,.ghost,.vignette` —— 这些故意出血，不计入溢出。

## 2. bundle-assets.py — 打包成单文件

把外部字体、图片、视频、CSS、JS 内嵌为 data URI，并校验「零相对外链」。

```bash
python scripts/bundle-assets.py 我的演示.html 我的演示-单文件.html
```

- 有缺失资源或仍有外链时退出码非 0
- 8bit-orbit 模板引用了 `styles/8bit-orbit/fonts/*.woff2`，打包后即可单文件带走

## 3. make-pdf.py — 静态 PDF 备份

```bash
python scripts/make-pdf.py ./qa 我的演示.pdf
```

- 每张截图一页，16:9（720×405pt），JPEG 压缩
- 无动画/翻页，用于投影兜底、拷给评委、打印

## 推荐流程

```bash
cp styles/8bit-orbit/template.html 我的演示.html     # 1. 复制模板
# …改内容…                                            # 2. 写内容
python scripts/bundle-assets.py 我的演示.html 我的演示-单文件.html   # 3. 打包
node scripts/qa-deck.cjs 我的演示-单文件.html ./qa               # 4. 验收
python scripts/make-pdf.py ./qa 我的演示.pdf                    # 5. 静态备份
```
