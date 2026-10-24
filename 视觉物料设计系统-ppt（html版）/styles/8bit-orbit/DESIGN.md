# 8-Bit Orbit · 设计系统

> 复古未来像素风。深空海军蓝 + 霓虹三色 + 4px 像素单位 + 硬边堆叠阴影 + CRT 大气层（扫描线/噪点/暗角/星野/粒子/地平线/辉光）。
> 适用范围：黑客松路演、产品发布、技术分享、需要「屏幕感」的演示。固定 1920×1080 舞台整体缩放。

## 1. 设计令牌

| 令牌 | 值 | 用途 |
|---|---|---|
| `--void` | `#0A0E27` | 最深底（页面背景） |
| `--navy` | `#0F1B3D` | 结构色（卡片底、阴影、深色面板） |
| `--cyan` | `#5EDCF4` | 主霓虹（标题、数据、主按钮、括号） |
| `--pink` | `#F0A6CA` | 次霓虹（标签、次要数据、警示） |
| `--yellow` | `#F4D03F` | 高亮（强调词、阴影光晕、徽章） |
| `--lavender` | `#E2D5F2` | 柔和彩色面（合作/CTA 页） |
| `--white` | `#FFFFFF` | 文字（深色面上） |

**4px 像素单位**：边框 2/4px、阴影偏移 4/8px、角标 24px、网格 40px。所有尺寸取 4 的倍数。

## 2. 字体

三套字体各司其职（拉丁展示字已随仓库内嵌 woff2）：

| 角色 | 字体 | 说明 |
|---|---|---|
| 展示（标题/数字/序号） | `Tektur` 700/900 | `fonts/Tektur-400_900-latin.woff2` |
| 正文 | `Chakra Petch` 400/500 | `fonts/ChakraPetch-400_700-latin.woff2` |
| HUD 标签（mono） | `Space Mono` 400/700 | `fonts/SpaceMono-400_700-latin.woff2` |
| 中文 | 系统黑体（Microsoft YaHei / PingFang SC / Noto Sans SC） | 权重用 900 承载展示字分量 |

字号（1920 舞台取值）：

| 角色 | 类名 | 字号 | 字重 |
|---|---|---|---|
| 封面主标题 | `h1.display.hero` | 128px | 900 + 双层像素阴影 |
| 页面标题 | `h1.display` | 64–72px | 700/900 |
| 卡片标题 | `.card .t` / `.tile .t` | 26–40px | 900 |
| 正文 | `.body/.d` | 19–23px | 400 |
| 导语 | `.lede` | 24–30px | 400 |
| HUD 标签 | `.pill` / `caption` | 12–13px | 700 + 0.2em 字距大写 |
| 统计数字 | `.stat .v` | 44–84px | 900 + 3px 阴影 |

**CJK 规则**：中文展示字用 900 字重补足「像素感」；中文不做 uppercase、不加宽字距；行高比拉丁放宽 0.15。

## 3. 大气层（每页都带，不可省）

按 z-index 从下到上：

1. 40px 网格墙纸（青色 7% 线条）— `.slide` 的背景
2. 霓虹辉光 `.glow.cyan/.pink/.yellow`（径向渐变，z 2，位于内容之下）
3. 噪点 `.slide::before`（z 49，opacity .035）
4. 扫描线 `.slide::after`（z 50，multiply，2px/4px 条纹）
5. CRT 暗角 `.vignette`（z 51，径向渐变压暗四角）
6. 星野 `.stars` / 粒子 `.particles` / 像素地平线 `.landscape`（z 1，JS 生成，固定种子）

## 4. 组件清单

| 组件 | 类名 | 用法要点 |
|---|---|---|
| 固定舞台 | `.deck-stage` + `.slide` | 1920×1080 整体 scale，16:9 不重排 |
| 中央帧 | `.deck-frame` / `.deck-frame.center` | 内容 max-width 1520px 居中 |
| 垂直居中内容 | `.content-mid` | `flex:1; justify-content:center`，消除上挤下空 |
| 标签胶囊 | `.pill` `.pill.cyan/.pink/.cjk` | 页眉标签；`.cjk` 变体为中文（去 uppercase/字距） |
| 徽章 | `.badge` `.badge.cyan` | 描边 + 结果数字芯片 |
| L 形角标 | `.brackets` `.brackets.y/.p/.n` | 卡片/统计块四角中的两角，替代完整描边 |
| 统计块 | `.stat` | 深色统计瓦片：`.k` 标签 + `.v` 数字 + `.d` 说明 |
| 卡片 | `.card` `.card.featured` | 半透明卡片；`.featured` 为反色高亮 + 8px 黄色阴影 |
| 大长框 | `.big-tile` / `.big-tile.paper` | 深蓝/白色实色大框 + 分点列表（`ul`/`li`） |
| 规格表 | `table.spec-flow` | 九步流水线：序号 / 环节 / 技术栈 / 人工动作；`tr.you` 高亮唯一人工环节（实心青底 + 深蓝字） |
| 闭环条 | `.loop-bar` | 数据回流闭环：`⑩ 导出 → AI 复盘 → 自训练 → ↺ 选题池` |
| 图表 | `.bar-row` `.bar-fill` | 像素条形：`.bar-fill` + `data-bar="百分比"`，JS 生长 |
| 议程行 | `.agenda` | 序号 + 名称 + 说明的三列清单 |
| 时间线 | `.timeline` `.tl-item` | 虚线轨道 + 方形节点，`.active` 变黄 |
| 金句条 | `.statement` | 底部固定：标签 + 一句结论（`margin-top:auto`） |
| 图片位 | `.img-slot` | 虚线占位框，直接放 `<img>` |
| 版头/版尾 | `.masthead` / `.footline` | 封面与收尾页的页眉页脚（mono 小字） |

## 5. 阴影系统（全部硬边、零模糊）

```
--sh-l:        4px 0 0 0 navy, 0 4px 0 0 navy, 4px 4px 0 0 navy          /* 三层 L 形 */
--sh-btn:      三层 navy + 三层 yellow 光晕（8px 步进）                    /* 按钮 */
--sh-text:     4px 4px 0 yellow, 8px 8px 0 navy                          /* 封面大标题 */
--sh-text-sm:  3px 3px 0 navy                                            /* 统计数字 */
```

**规则**：所有阴影零模糊；只向右下偏移；不要用 `box-shadow: 0 4px 12px rgba(...)`。

## 6. 版式规则

- 一页一个信息点；标题 + 一组组件 + 底部 `.statement`
- 内容用 `.content-mid` 垂直居中；标题下 22–30px，组件间距 20–26px
- 数据页放 2–4 个统计块；表格类页面行数 ≤ 9
- 页眉 `.pill` 只标章节（如「成果 · 先看结果」），不要与标题重复

## 7. 动效

- 数字滚动：`data-count-to`（可选 `data-count-format="comma"` / `data-count-prefix` / `data-count-suffix`）
- 条形生长：`data-bar="70%"`
- 星野闪烁（3s）/ 粒子浮动（8s）/ 辉光呼吸（CSS keyframes）
- 翻页入场：建议 0.4–0.6s 位移淡入
- 尊重 `prefers-reduced-motion`；打印时静态化

## 8. Do / Don't

**Do**
- 每页都保留大气层（网格/噪点/扫描线/暗角），装饰元素故意出血时用 `.glow` 等独立层
- 中文标题用 900 字重，靠阴影与大气层承载「像素感」
- 反色只用于「唯一人工环节」或「推荐项」这类强调点
- 数字用 `data-count-to` 做滚动，增强现场感

**Don't**
- 不要加圆角（`border-radius` 只出现在导航图标等个别元素）
- 不要用模糊阴影或渐变替代硬边阴影
- 不要把霓虹色用在正文（正文用半透明白）
- 不要让内容页出现空白下半页——用 `.content-mid` 居中或放大组件
- 不要在 `.spec-flow` 的 `tr.you` 上用浅色底 + 深色字（对比度不足，必须实心青底）
