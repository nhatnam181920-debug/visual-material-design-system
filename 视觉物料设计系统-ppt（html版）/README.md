# 视觉物料设计系统-ppt（html版）

> 两套生产级 16:9 HTML 演示设计系统：**Glass Neon**（暗色玻璃拟态 + 霓虹渐变）与 **8-Bit Orbit**（像素复古未来）。
> 拿到模板就能改，改完跑验收就能交付。

## 30 秒上手

```bash
cp styles/8bit-orbit/template.html 我的演示.html     # 或用 glass-neon
# 改 <section> 里的文字与结构
.\scripts\build.ps1 -Deck .\我的演示.html            # Windows：一键打包+验收+PDF
bash scripts/build.sh 我的演示.html                  # macOS/Linux
```

验收会**自动拉起浏览器**，逐页检查溢出/垂直平衡/键盘翻页/占位文案/媒体/外链，并出截图与 PDF。看到 `ALL PASSED` 才算完。

详细契约见 [SKILL.md](SKILL.md)（Agent 入口）与 [DESIGN.md](DESIGN.md)（风格选择）。

## 两套风格

| | Glass Neon | 8-Bit Orbit |
|---|---|---|
| 视觉 | 深底 + 模糊光晕 + 网格 + 大字号轻字重 + 玻璃卡片 + 红色强调 | 深空海军蓝 + 霓虹三色 + 4px 像素阴影 + CRT 大气层（扫描线/噪点/星野/辉光） |
| 适用 | 路演、产品介绍、数据汇报、商业计划 | 黑客松、产品发布、技术分享 |
| 字体 | 系统字体（零依赖） | Tektur / Chakra Petch / Space Mono（内嵌）+ 系统中文字体 |
| 画布 | 视口 vw/vh（16:9 屏幕等比） | 固定 1920×1080 整体缩放 |
| 模板 | [template.html](styles/glass-neon/template.html) | [template.html](styles/8bit-orbit/template.html) |
| 设计文档 | [DESIGN.md](styles/glass-neon/DESIGN.md) | [DESIGN.md](styles/8bit-orbit/DESIGN.md) |

## 仓库结构

```
SKILL.md              ← Agent 主入口：工作流 + 硬性契约 + 常见错误
DESIGN.md             ← 风格选择与通用规则
styles/<风格>/        ← DESIGN.md + template.html + _base.css + fonts/
scripts/              ← bundle-assets.py / qa-deck.cjs / make-pdf.py
examples/             ← 两套真实成品（OPC 路演 / 开口成片路演）
docs/                 ← 验收标准 / 字体与资源
```

## 验收

`qa-deck.cjs` 自动检查：页数、元素级溢出、垂直平衡、字体、媒体、外链、JS 异常，并逐页截图。标准见 [docs/验收标准.md](docs/验收标准.md)。不通过不交付。

## 质量基准

两个 `examples/` 是真实路演稿，代表这套系统能达到的质量下限。新做的稿子应当**不低于**它们：结论先行、一页一件事、数字有出处、边界诚实。

## 许可

仓库内原创模板与脚本采用 MIT。字体遵循各自许可（见 [docs/字体与资源.md](docs/字体与资源.md)）。
