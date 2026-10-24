# scripts · 打包与验收工具

一个一键脚本 + 三个独立工具，零第三方依赖（Node 内置 / Python 标准库 + Pillow 可选）。

## 一键（推荐）

```powershell
# Windows
.\scripts\build.ps1 -Deck .\我的演示.html
# 指定运行时（PATH 里没有 node/python 时）
.\scripts\build.ps1 -Deck .\我的演示.html -Node "C:\Program Files\nodejs\node.exe" -Python "D:\anaconda3\python.exe"
```

```bash
# macOS / Linux
bash scripts/build.sh 我的演示.html
```

依次执行：打包单文件 → 验收（自动拉起浏览器）→ 生成 PDF。验收不通过不会出 PDF。

## 1. qa-deck.cjs — 验收（核心）

```bash
node scripts/qa-deck.cjs <deck.html> [输出目录] [宽] [高]
```

**零配置**：端口没开时会自动找一个 Chrome/Edge 启动（临时 profile，跑完自动清理）。

| 检查项 | 说明 |
|---|---|
| 页数/舞台 | `.slide` 数量、舞台尺寸（固定 1920×1080 或 fluid） |
| 元素溢出 | 内容元素越界/裁切；装饰层（`.glow/.deco/.stars/.atmos/.ghost` 等）白名单 |
| 垂直平衡 | `ok(上/下)` = 居中；`filled(≥85%)` = 内容填满；`tight(≥96%)` = **过挤告警**；`偏` = 上挤下空（失败） |
| 键盘翻页 | 用真实键盘事件实测 → ← End Home 是否切页（失败说明交互坏了） |
| 占位文案 | 扫全文找模板残留（`主标题第一行`、`步骤一`…），有残留 = 失败 |
| 媒体 | 所有 `<img>`/`<video>` 是否加载 |
| 外链 | 是否有相对外部资源（离线要求） |
| JS 异常 | 未捕获异常 |

环境变量：`QA_PORT`（复用已开端口）、`QA_BROWSER`（指定浏览器）、`QA_ALLOW_PLACEHOLDER=1`（跳过占位检查，不推荐）。

输出：`qa/slide-01.png…` + `qa/report.json`（含耗时、导航结果、逐页数据）。退出码 0=通过。

> 对**模板本身**跑会报占位文案——预期行为，模板不是成品。

## 2. bundle-assets.py — 打包成单文件

```bash
python scripts/bundle-assets.py 输入.html 输出-单文件.html
```

内联 `<link>`、`<script src>`、相对图片/视频/字体（data URI），跳过 SVG 内部 `url(#id)` 引用；有缺失资源或仍有相对外链时退出码非 0。

## 3. make-pdf.py — 静态 PDF 备份

```bash
python scripts/make-pdf.py <qa截图目录> <输出.pdf>
```

每页一张截图、16:9（720×405pt）、JPEG 压缩。无动画/翻页，用于投影兜底、拷给评委。

## 编码规则（Windows 必读）

| 文件 | 编码 |
|---|---|
| `.ps1` | UTF-8 **带 BOM**（PowerShell 5.1 否则按 GBK 解析，中文注释导致语法错误） |
| `.js` / `.cjs` / `.py` / `.html` / `.md` | UTF-8 **不带 BOM**（Node 会把 BOM 当语法错误） |

## 环境

- Node 18+（`build.ps1` 自动在 PATH、`C:\Program Files\nodejs`、`QA_NODE` 找）
- Python 3.10+（`build.ps1` 自动找 `python` / `python3` / `py -3`，或 `-Python` 指定）
- Chrome 或 Edge（`qa-deck.cjs` 自动拉起；也可 `QA_BROWSER` 指定）
