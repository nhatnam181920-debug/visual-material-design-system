# Motion Kit · 动效组件库

> 设计语言提取自 [ReactBits](https://www.reactbits.dev/)（170+ 动效组件）、[Uiverse](https://uiverse.io)（开源小组件）、[Aceternity UI](https://ui.aceternity.com/)（Hero / Bento / 视差 / Shader 区块）。
> 全部改写成**单文件 HTML + CSS**，零依赖，复制即用。

## 为什么单独做一份

原版都是 React + Framer Motion + Tailwind 工程，我们的模板是单文件离线 HTML，直接搬不过来。这份把**同样的视觉语言**用纯 CSS 重写，效果一致但不引依赖。

## 组件清单（10 个）

| # | 组件 | 类名 | 来源风格 | 适合 |
|---|---|---|---|---|
| 01 | 流光文字 | `.mk-shimmer` | ReactBits Shimmer | 封面主标题、转场页 |
| 02 | 渐变描边卡 | `.mk-gcard` | Aceternity | 核心能力、卖点 |
| 03 | 光晕追卡 | `.mk-spot` | Aceternity Spotlight | 交互式卡片网格 |
| 04 | 分层滚动 | `.mk-parallax` | Aceternity Parallax | 长页面、滚动叙事 |
| 05 | 逐字浮现 | `.mk-reveal` | ReactBits Stagger | 标题入场 |
| 06 | 3D 倾斜卡 | `.mk-tilt` | Uiverse Tilt | 卡片网格 hover |
| 07 | 呼吸点 | `.mk-pulse` | Uiverse Pulse | 状态指示、徽标 |
| 08 | 流动描边 | `.mk-marquee` | Aceternity Marquee | 强调区块 |
| 09 | 数字翻转 | `.mk-flip` | ReactBits Count | 统计数字切换 |
| 10 | 网格背景 | `.mk-gridbg` | Aceternity Grid | 页面背景层 |

## 怎么用

```bash
# 1. 打开看效果（组件都在一页上）
start motion-kit.html

# 2. 复制：CSS 块 + HTML 片段 + 需要的 JS 增强
```

三步：

1. **复制 CSS**：从 `motion-kit.html` 的 `<style>` 里，复制你用的那几个 `.mk-*` 块
2. **复制 HTML**：复制对应的演示片段，改内容
3. **复制 JS（可选）**：`03 光晕追卡` / `04 视差` / `09 数字翻转` 需要文件末尾那段 JS 的对应部分；删掉 JS 页面仍是静态可用的

## 与四套风格的配合

| 风格 | 推荐组件 | 注意 |
|---|---|---|
| **glass-neon** | 02 渐变描边卡、03 光晕追卡、07 呼吸点 | glass 已有氛围层，不要再加网格背景 |
| **8bit-orbit** | 01 流光文字、08 流动描边、09 数字翻转 | 保持硬边语言：**不要用圆角和 3D 倾斜** |
| **swiss-modern** | 07 呼吸点、09 数字翻转 | 瑞士风克制：**一页最多一个动效组件** |
| **editorial-serif** | 05 逐字浮现、04 分层滚动 | 杂志风安静：**禁用流光和流动描边** |

## 约束（必须遵守）

1. **一页 ≤2 种动效**（[排版规格](排版规格.md) 第 7 条）
2. 入场 0.3–0.6s，hover 0.2–0.4s，氛围 ≥3s
3. 缓动统一 `cubic-bezier(.22,.68,.3,1)`
4. 已内置 `prefers-reduced-motion` 降级——复制时**不要删**
5. 动效是调味，不是主菜：删掉所有动效后页面仍须完整可读

## 许可

本文件的代码可自由使用（MIT）。设计语言参考的原始项目各有其许可：ReactBits / Uiverse / Aceternity UI 均开源，使用时保留原项目 attribution。
