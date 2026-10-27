# 视觉物料设计系统 · 升级说明（v3 · 参考 MotionSites / ReactBits / HTML Anything）

> 本轮升级的三条依据，都来自你给的三篇文章。每条都落到仓库的具体文件。

## 依据一：AI 审美差（AI Slop）是共性痛点 → 给「设计意图」加一层提示词

**出处**：[MotionSites.ai 深度测评](https://mp.weixin.qq.com/s/fGqozIskjvI0Vse1yHbCcw)

文章核心判断：AI 写的业务逻辑很强，但审美很灾难；MotionSites 的价值不是代替 AI 写代码，而是**把页面结构、视觉风格和交互效果整理成 AI 能理解的「终极咒语」**。

**我们的对应**：
- 仓库本身就是「设计提示词库」——四套 DESIGN.md 就是给 AI 读的设计意图
- 但缺一层**「怎么向 AI 描述设计」的元提示词**。已补：[prompts/README.md](prompts/README.md)（10 个场景提示词）

## 依据二：动效与区块组件是「高级感」的来源 → 建零依赖动效库

**出处**：[UI 设计师的 5 个封神参考网站](https://mp.weixin.qq.com/s/IvjjQqMViZGR3LCOXEpzsg)

文章点了五个站：Remocn（AI 生成演示视频）、MotionSites（提示词库）、ReactBits（170+ 动效组件）、Uiverse（开源小组件）、Aceternity（Hero/Bento/视差/Shader 区块）。共同点：**都是「拿来即用」的视觉零件**。

**我们的对应**：
- 原来四套风格只有**静态版式**，没有可复用动效零件
- 已补：[motion-kit.html](motion-kit.html) + [motion-kit.md](motion-kit.md)——把 ReactBits / Uiverse / Aceternity 的设计语言用纯 CSS 重写成 **10 个零依赖组件**（流光文字、渐变描边卡、光晕追卡、分层滚动、逐字浮现、3D 倾斜、呼吸点、流动描边、数字翻转、网格背景）

## 依据三：排版约束要内置在骨骼里，不是事后补救 → 建显式规格库

**出处**：[HTML Anything](https://mp.weixin.qq.com/s/O4XFlyG6HFk2Q-K9xo2zgg)

文章最打动人的一点：「每个模板自带设计系统定义——CJK 优先字体栈、8px 基线网格、对比度不低于 4.5。瑞士国际风格幻灯片用 16 列网格配单一饱和强调色」——**把排版当一等公民**。

**我们的对应**：
- 原来我们的约束散在各风格 DESIGN.md 里，没有统一规格
- 已补：[排版规格.md](排版规格.md)——8px 基线网格、CJK 优先字体栈、对比度 ≥4.5:1、字号阶梯（≤6 级）、留白下限、动效约束、禁用清单、交付前自检
- 并且**回填进四套模板**：补上全部缺失的 `prefers-reduced-motion` 硬约束

---

## 本轮新增文件

| 文件 | 作用 |
|---|---|
| `motion-kit.html` | 10 个动效组件，单文件演示页，可直接打开看效果 |
| `motion-kit.md` | 组件用法 + 与四套风格的配合矩阵 + 约束 |
| `排版规格.md` | 排版硬约束（网格/字体/对比度/字号/留白/动效/禁用清单） |
| `prompts/README.md` | 10 个场景提示词（让 AI 按设计系统干活） |
| `UPGRADE-v3.md` | 本文件 |

## 本轮修改文件

| 文件 | 改动 |
|---|---|
| `styles/*/template.html`（4 套） | 全部补 `@media (prefers-reduced-motion: reduce)` 硬约束 |
| `SKILL.md` | 新增「排版规格」与「动效组件」两个必读项，任务路由表补动效场景 |
| `README.md` | 资产清单补 motion-kit / 排版规格 / prompts |

## 还没做的（下轮候选）

1. **输出表面扩展**（HTML Anything 的 9 种表面思维）：目前只有 16:9 幻灯片，可扩小红书卡片 / A4 长页 / 视频封面
2. **Remocn 式演示视频**：把 motion-kit 的动效接到 creatorflow 渲染管线，产出产品演示片段
3. **实时流式预览**：HTML Anything 的「看见 AI 逐行写 HTML」体验，需要配 MCP 或本地 agent
