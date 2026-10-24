# examples · 两份真实成品

两份都是真实路演稿，代表这套系统能达到的质量下限。**它们是参考，不是模板**——做新稿请复制 `styles/<风格>/template.html`。

| 文件 | 形态 | 说明 |
|---|---|---|
| `8bit-orbit示例-开口成片路演.html` | **单文件**（3.1MB，媒体全内嵌） | 直接双击可播；含 13 页、两段视频、真实后台截图。跑 QA 应 ALL PASSED |
| `glass-neon示例-OPC路演.html` | 多文件（引用 `vendor/echarts.min.js`） | 设计参考；图表依赖 echarts（`vendor/` 已附），用浏览器直接打开即可 |
| `vendor/echarts.min.js` | 第三方库 | 仅 glass 示例的图表需要；ECharts 5.5.1，Apache-2.0 |

## 跑验收

```bash
node scripts/qa-deck.cjs examples/8bit-orbit示例-开口成片路演.html ./qa
```

glass 示例是**多文件参考稿**，直接跑 QA 会报「未内嵌的外部资源: vendor/echarts.min.js」——这是预期的（它不是单文件交付物）。要交付玻璃风格，请从 `styles/glass-neon/template.html` 起稿，图表用模板内置的纯 CSS 条形图（无 echarts 依赖）。