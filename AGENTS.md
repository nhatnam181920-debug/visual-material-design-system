# Agent 入口

这是一个「视觉物料设计系统」仓库，按模块组织。每个模块自带 `SKILL.md`，读它即可开始。

## 路由

- 用户要做 **16:9 演示稿 / 路演 PPT / HTML 幻灯片** → 读 [视觉物料设计系统-ppt（html版）/SKILL.md](<视觉物料设计系统-ppt（html版）/SKILL.md>)
  - 选风格 → [视觉物料设计系统-ppt（html版）/DESIGN.md](<视觉物料设计系统-ppt（html版）/DESIGN.md>)
  - 具体风格细节 → `styles/<风格>/DESIGN.md`
  - 模板 → `styles/<风格>/template.html`
  - **通用硬约束（必读）** → `排版规格.md`（8px 网格 / CJK 字体栈 / 对比度 ≥4.5 / 字号 ≤6 级）
  - **要加动效** → `motion-kit.md`（10 个零依赖组件 + 四套风格配合矩阵）
  - 打包与验收 → `scripts/`

## 硬性边界（所有模块通用）

- 交付物必须**离线可播**：字体/图片/视频内嵌，不用 CDN。
- 交付前必须**跑验收**：不通过不交付（标准见各模块 `docs/验收标准.md`）。
- 不虚构数据与案例：没有来源的数字不写；效果类承诺标为假设或不写。
- 发布/上传/登录动作停在人工确认前。

## 常用命令

```bash
python scripts/bundle-assets.py 输入.html 输出-单文件.html
node scripts/qa-deck.cjs 单文件.html ./qa 1920 1080
python scripts/make-pdf.py ./qa 交付.pdf
```
