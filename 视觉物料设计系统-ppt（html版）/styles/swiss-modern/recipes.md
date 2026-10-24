# Swiss Modern · 版式配方

> 模板的 5 页是 5 种基础版式。这里是 3 种额外版式，直接复制 `<section>` 改文字。
> 注意：页眉页脚用绝对定位 + `padding:0 var(--pad-x)`（不要用 left/right 变量，会相对内边距盒偏移）。

## 配方 1：两栏对比页（旧办法 vs 我们）

```html
<section class="slide" data-slide-id="compare">
  <div class="swiss-head"><span>章节 · 对比</span><span>06 / 12</span></div>
  <div class="swiss-body">
    <h2 class="swiss-title">旧办法差在哪，<span class="mark">我们补哪一环</span></h2>
    <div class="swiss-2col" style="margin-top:8px">
      <div>
        <h3>旧办法</h3>
        <p>两行说明，把缺口讲清楚。<b>加粗只给结论</b>。</p>
      </div>
      <div>
        <h3>我们</h3>
        <p>两行说明，把差异讲清楚。<b>客户只出镜</b>，其余交给我们。</p>
      </div>
    </div>
  </div>
  <div class="swiss-foot"><span>来源：填写来源</span><span>06 / 12</span></div>
</section>
```

## 配方 2：表格页（技术栈 / 规格 / 对照）

```html
<section class="slide" data-slide-id="table">
  <div class="swiss-head"><span>章节 · 技术栈</span><span>07 / 12</span></div>
  <div class="swiss-body">
    <h2 class="swiss-title">每一步都<span class="mark">经得起追问</span></h2>
    <table class="swiss-table" style="margin-top:8px">
      <thead><tr><th>环节</th><th>技术栈</th><th>人做什么</th></tr></thead>
      <tbody>
        <tr><td class="k">① 需求采集</td><td>MediaCrawler 爬虫 + 评论编码统计</td><td>判断哪个题值得拍</td></tr>
        <tr><td class="k">② 选题调研</td><td>五步调研流程 + A–E 证据分级</td><td>选切入点</td></tr>
        <tr><td class="k">③ 出镜录制</td><td>手机一条录完</td><td>客户本人</td></tr>
      </tbody>
    </table>
  </div>
  <div class="swiss-foot"><span>署名 / 团队</span><span>07 / 12</span></div>
</section>
```

## 配方 3：行动页（结尾 CTA，红底转场）

```html
<section class="slide band" data-slide-id="cta">
  <div class="swiss-head"><span>今天 · 一件事</span><span>12 / 12</span></div>
  <div class="swiss-body">
    <h2 class="swiss-title">打开产品页，<span class="mark" style="color:#fff;text-decoration:underline">复制预约信息</span>。</h2>
    <div class="swiss-2col" style="margin-top:8px">
      <div><h3>第一步</h3><p>复制预约信息，或现场扫码。</p></div>
      <div><h3>第二步</h3><p>填一张问诊表，3 分钟。</p></div>
    </div>
  </div>
  <div class="swiss-foot"><span>署名 / 团队</span><span>12 / 12</span></div>
</section>
```

## 三条纪律

1. **每页最多一个红色元素**（一个红块 / 一句红字 / 一个红序号），多了就花
2. **数据组 2–4 个**，超过就改成表格
3. **编号补零**：`01` `02`，不要写 `1` `2`
