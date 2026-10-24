# 视觉物料设计系统 · PPT（HTML 版）· Agent 使用说明

> 这是一个「拿到就能做」的 16:9 HTML 演示设计系统仓库。你读这一份文件 + 对应风格的 DESIGN.md + 模板，就能产出与仓库示例同等或更高质量的幻灯片。

## 0. 30 秒速览

```
仓库 = 两套成熟设计系统（glass-neon / 8bit-orbit）+ 可复用模板 + 验收脚本
你  = 选风格 → 复制模板 → 只改内容 → 打包单文件 → 跑验收 → 交付
```

## 1. 先选风格

| 风格 | 视觉语言 | 适合 | 不适合 |
|---|---|---|---|
| **glass-neon** | 暗色玻璃拟态 + 霓虹渐变（深底 + 模糊光晕 + 网格 + 大字号轻字重 + 玻璃卡片 + 红色强调） | 路演、产品介绍、数据汇报、商业计划、SaaS/AI 风格 | 需要强「科技像素感」或 CRT 屏幕感 |
| **8bit-orbit** | 像素复古未来（深空海军蓝 + 霓虹三色 + 4px 像素阴影 + CRT 扫描线/噪点/星野 + 固定 1920×1080 舞台） | 黑客松、产品发布、技术分享、需要记忆点的演示 | 正式保守场合（政策/法务/医疗） |

判断口径：**评委/观众是谁、要什么情绪**。要「高级、克制、可信」→ glass-neon；要「技术、能量、屏幕感、记忆点」→ 8bit-orbit。

## 2. 工作流（照做）

### 第 1 步：复制模板

```bash
cp styles/<风格>/template.html 我的演示.html
```

模板是完整可运行的单文件（5 页示例，覆盖全部组件）。**只改 `<section>` 里的文字与结构**，不要改 `:root` 令牌与组件 CSS。

### 第 2 步：写内容（硬性契约）

- **每页一个信息点**：标题 + 一组组件 + 底部一句金句/结论
- **页数**：8–14 页；3 分钟路演 12–14 页
- **标题**：一句话 ≤ 22 字；关键词用 `<em>`（glass-neon）或 `--yellow` 强调（8bit-orbit）
- **数据**：每个数字必须有来源或标注「假设」；没有来源的数字不要写
- **中文排版**：标题不加宽字距、不做大写；中英混排留空格；中文行高比拉丁放宽 0.15
- **不虚构**：不编客户案例、不编效果数据；「效果不承诺、产能可验证」这类边界句要保留

### 第 3 步：组件组合（按信息类型选）

| 你要表达 | glass-neon | 8bit-orbit |
|---|---|---|
| 结论/钩子 | `h1`/`h2` + `.kicker` | `h1.display` + `.pill` |
| 3–4 个关键数字 | `.stats` + `.stat`（`.hot` 高亮） | `.stat-row` + `.stat` |
| 2–4 个并列能力 | `.c2` + `.card` | `.kpis` + `.card` |
| 五步流程 | `.flow` + `.step` | `.spec-flow` 表 或 `.flow` |
| 对比/矩阵 | `.matrix` | `table.grid` |
| 技术栈拆解 | `.asym` + `.steps` | `table.spec-flow` + `.loop-bar` |
| 条形对比 | `.hbars` | `.bar-row` + `.bar-fill` |
| 交付/产出说明 | `.yield` | `.big-tile`（分点） |
| 收尾金句 | `.quote` | `.statement` + `.close-center` |
| 图片 | `.slot` 里放 `<img>` | `.img-slot` 里放 `<img>` |

### 第 4 步：打包成单文件（离线交付）

模板引用了 `styles/8bit-orbit/fonts/` 的相对字体；要「一个文件带走」时：

```bash
python scripts/bundle-assets.py 我的演示.html 我的演示-单文件.html
# 把 <link>、相对图片、字体 woff2 全部转成 data URI，并校验无外部引用
```

glass-neon 用系统字体，本身无外部资源，可跳过此步（或跑一次校验）。

### 第 5 步：验收（必须跑，不通过不交付）

```bash
# 1) 起浏览器调试端口（Windows 示例）
msedge --headless=new --remote-debugging-port=9222 --user-data-dir=%TEMP%\deck-qa about:blank

# 2) 跑验收：页数/溢出/字体/媒体/垂直平衡 + 逐页截图
node scripts/qa-deck.cjs 我的演示-单文件.html ./qa 1920 1080

# 3) 出静态 PDF 备份
python scripts/make-pdf.py ./qa 我的演示.pdf
```

**验收通过标准**：见 [docs/验收标准.md](docs/验收标准.md)。核心三条：
1. 内容元素**零溢出**（装饰层允许故意出血）
2. 每页内容**垂直居中**或**均匀分布**，不出现「上挤下空」
3. 页面**零外部依赖**（断网可播），键盘 ← → / 空格可翻页

## 3. 硬性技术契约

| 项 | 要求 |
|---|---|
| 画布 | 16:9；glass-neon 用视口 vw/vh，8bit-orbit 用固定 1920×1080 舞台缩放 |
| 翻页 | ← → 空格 PageUp/PageDown Home/End；触摸左右滑；打印 P |
| 离线 | 断网可播；字体/图片/视频内嵌（bundle 脚本） |
| 可打印 | Ctrl+P 每页一张（glass-neon 自带浅底反转；8bit-orbit 用 `@page 1920px 1080px`） |
| 可维护 | 内容在 `<section>` 里，样式在 `<style>` 里，令牌在 `:root` |
| 无障碍 | 每页 `aria-label`；`prefers-reduced-motion` 时关闭动效 |

## 4. 质量标准（比现有更高）

设计系统已经定死了视觉下限，你要做的是**内容质量**：

- **结论先行**：第 2 页就给结果/数字，不要铺垫
- **一页一件事**：标题讲结论，组件给证据
- **数字有出处**：来源写进 `.src` / `.footline`
- **边界诚实**：不确定的标「假设」，不承诺效果
- **密度适中**：单页组件 ≤ 3 组，留白 ≥ 内容高度的 20%

## 5. 仓库结构

```
视觉物料设计系统-ppt（html版）/
├── SKILL.md                  ← 本文件（agent 入口）
├── DESIGN.md                 ← 两套风格对比 + 通用规则
├── styles/
│   ├── glass-neon/
│   │   ├── DESIGN.md         ← 完整设计系统（令牌/组件/规则）
│   │   ├── template.html     ← 可复用模板（5 页示例，全部组件）
│   │   └── _base.css         ← 抽取的样式基座（供再生成模板）
│   └── 8bit-orbit/
│       ├── DESIGN.md
│       ├── template.html
│       ├── _base.css
│       └── fonts/            ← 拉丁展示字体子集（woff2）
├── scripts/                  ← 打包 / 验收 / 截图 / PDF
├── examples/                 ← 两套成品参考（真实路演稿）
└── docs/                     ← 验收标准 / 字体与资源 / 常见问题
```

## 6. 常见错误（踩过）

1. **8bit-orbit 内容堆在上半页**：忘了给内容包 `.content-mid`（`flex:1; justify-content:center`）
2. **高亮行看不清**：`.spec-flow tr.you` 必须实心青底 + 深蓝字；浅色半透明底 + 深字对比度不足
3. **标题不居中**：`max-width` 块要配 `margin-inline:auto`，否则文字在块内居中但块本身靠左
4. **字体不生效**：8bit-orbit 的 woff2 路径是相对 `styles/8bit-orbit/` 的；移动模板文件时要同步移动 `fonts/`
5. **打包后仍有外链**：跑 `bundle-assets.py` 会校验，出现外部引用会报错
6. **打印黑屏**：glass-neon 的 print 样式会反转浅底；8bit-orbit 需要 `@page` 尺寸，模板已带

## 7. 扩展新风格

在 `styles/` 下新建 `<风格名>/`：`DESIGN.md`（令牌+组件+规则）+ `template.html`（5 页示例）+ `_base.css`，然后在 `DESIGN.md` 末尾补一节「与另两套的差异」，并在本文件第 1 节表格加一行。
