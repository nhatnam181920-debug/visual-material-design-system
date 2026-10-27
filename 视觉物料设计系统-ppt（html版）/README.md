# 视觉物料设计系统-ppt（html版）

> 四套生产级 16:9 HTML 演示设计系统：**Glass Neon** / **8-Bit Orbit** / **Swiss Modern** / **Editorial Serif**，外加一套零依赖动效组件库和一份排版硬约束。
> 拿到模板就能改，改完跑验收就能交付。

## 30 秒上手

```bash
cp styles/8bit-orbit/template.html 我的演示.html     # 或 glass-neon / swiss-modern / editorial-serif
# 改 <section> 里的文字与结构
.\scripts\build.ps1 -Deck .\我的演示.html            # Windows：一键打包+验收+PDF
bash scripts/build.sh 我的演示.html                  # macOS/Linux
```

验收会**自动拉起浏览器**，逐页检查溢出/垂直平衡/键盘翻页/占位文案/媒体/外链，并出截图与 PDF。看到 `ALL PASSED` 才算完。

详细契约见 [SKILL.md](SKILL.md)（Agent 入口）与 [DESIGN.md](DESIGN.md)（风格选择）。

## 四套风格

| | Glass Neon | 8-Bit Orbit | Swiss Modern | Editorial Serif |
|---|---|---|---|---|
| 视觉 | 深底 + 模糊光晕 + 网格 + 大字号轻字重 + 玻璃卡片 + 红色强调 | 深空海军蓝 + 霓虹三色 + 4px 像素阴影 + CRT 大气层 | 白底 + 黑白红 + 一种字体 + 12 列网格 + 严格左对齐 | 暖纸白 + 衬线标题 + 赭红单一强调 + 不对称分栏 |
| 适用 | 路演、产品介绍、数据汇报 | 黑客松、产品发布、技术分享 | 融资路演、正式商务汇报 | 品牌故事、内容/IP 介绍 |
| 一句话口诀 | 高级、克制、可信 | 技术、能量、记忆点 | 稳、正式、不出错 | 安静、有分量、讲故事 |
| 模板 | [template.html](styles/glass-neon/template.html) | [template.html](styles/8bit-orbit/template.html) | [template.html](styles/swiss-modern/template.html) | [template.html](styles/editorial-serif/template.html) |
| 设计文档 | [DESIGN.md](styles/glass-neon/DESIGN.md) | [DESIGN.md](styles/8bit-orbit/DESIGN.md) | [DESIGN.md](styles/swiss-modern/DESIGN.md) | [DESIGN.md](styles/editorial-serif/DESIGN.md) |
| 版式配方 | [recipes.md](styles/glass-neon/recipes.md) | [recipes.md](styles/8bit-orbit/recipes.md) | [recipes.md](styles/swiss-modern/recipes.md) | [recipes.md](styles/editorial-serif/recipes.md) |

## 通用层（所有产出都要过）

| 文件 | 管什么 |
|---|---|
| [排版规格.md](排版规格.md) | **硬约束**：8px 基线网格、CJK 优先字体栈、对比度 ≥4.5:1、字号 ≤6 级、留白下限、动效约束、禁用清单、交付自检 |
| [motion-kit.html](motion-kit.html) | 10 个动效组件演示页（打开就能看效果） |
| [motion-kit.md](motion-kit.md) | 组件用法 + 与四套风格的配合矩阵（哪套能用哪些、哪套禁用哪些） |
| [prompts/README.md](prompts/README.md) | 10 个场景提示词（让 AI 按本系统干活，而不是给一个 Bootstrap 页面） |
| [UPGRADE-v3.md](UPGRADE-v3.md) | v3 升级说明：参考 MotionSites / ReactBits / Uiverse / Aceternity / HTML Anything |

## 仓库结构

```
SKILL.md              ← Agent 主入口：工作流 + 硬性契约 + 常见错误
DESIGN.md             ← 四套风格选择 + 通用规则
排版规格.md            ← 排版硬约束（所有产出都要过）
motion-kit.html/.md   ← 动效组件库 + 配合矩阵
prompts/              ← 场景提示词
styles/<风格>/        ← DESIGN.md + template.html + recipes.md + _base.css (+ fonts/)
scripts/              ← build.ps1/sh（一键）+ doctor + bundle + qa-deck + make-pdf
examples/             ← 两套真实成品（OPC 路演 / 开口成片路演）+ echarts vendor
docs/                 ← 验收标准 / 字体与资源
```

## 验收

`qa-deck.cjs` 自动检查：页数、元素级溢出、垂直平衡、字体、媒体、外链、JS 异常，并逐页截图。标准见 [docs/验收标准.md](docs/验收标准.md)。不通过不交付。

## 质量基准

两个 `examples/` 是真实路演稿，代表这套系统能达到的质量下限。新做的稿子应当**不低于**它们：结论先行、一页一件事、数字有出处、边界诚实。

## 许可

仓库内原创模板与脚本采用 MIT。字体遵循各自许可（见 [docs/字体与资源.md](docs/字体与资源.md)）。
