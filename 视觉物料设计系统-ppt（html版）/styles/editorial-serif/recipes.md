# Editorial Serif · 版式配方

> 模板的 5 页是 5 种基础版式。这里是 3 种额外版式，直接复制 `<section>` 改文字。
> 注意：页码用 `<span class="ed-page">NN</span>` 直接放进 section；衬线标题**不要加粗**。

## 配方 1：图片 + 图注页（作品 / 案例展示）

```html
<section class="slide" data-slide-id="figure">
  <div class="ed-head"><span>章节 · 案例</span><span>06 / 12</span></div>
  <div class="ed-body">
    <div class="ed-2col">
      <div>
        <h2 class="ed-title">这一条<em>是怎么做的</em></h2>
        <p>两行说明，把背景讲清楚。<b>加粗只给结论</b>。</p>
      </div>
      <div class="ed-figure">
        <img src="__IMAGE__" alt="案例图">
        <p class="cap">图注：写清楚这张图证明什么（衬线斜体小字）</p>
      </div>
    </div>
  </div>
  <span class="ed-page">06</span>
</section>
```

## 配方 2：列表页（要点 / 纪律 / 交付清单）

```html
<section class="slide" data-slide-id="list">
  <div class="ed-head"><span>章节 · 清单</span><span>07 / 12</span></div>
  <div class="ed-body">
    <h2 class="ed-title">客户拿到<em>七件</em>，不是一条视频</h2>
    <ol class="ed-list" style="margin-top:8px">
      <li><b>选题调研卡</b> —— 证据分级、反方观点、信号缺口</li>
      <li><b>口播稿</b> —— 定稿 + 前三秒钩子 + 事实边界</li>
      <li><b>拍摄单</b> —— 一页能照着拍，手机就能完成</li>
      <li><b>成片 + SRT</b> —— 1080p，105 句字幕逐句人工核对</li>
      <li><b>发布包 + 诊断卡</b> —— 三平台文案与复盘入口</li>
    </ol>
  </div>
  <span class="ed-page">07</span>
</section>
```

## 配方 3：引用 + 回应页（反方观点 / 客户疑虑）

```html
<section class="slide" data-slide-id="objection">
  <div class="ed-head"><span>章节 · 疑虑</span><span>08 / 12</span></div>
  <div class="ed-body">
    <p class="ed-quote">「效果会不会<em>达不到承诺</em>？」</p>
    <p class="ed-quote-src">—— 客户最常问的问题</p>
    <div class="ed-2col" style="margin-top:36px">
      <div><h3>我们不承诺的</h3><p>播放量、涨粉、任何效果数据。</p></div>
      <div class="col-right"><h3>我们保证的</h3><p>七件套按验收标准交付，每一步可回溯；不达标准重做。</p></div>
    </div>
  </div>
  <span class="ed-page">08</span>
</section>
```

## 三条纪律

1. **衬线标题不加粗**，强调用 `<em>` 斜体 + 赭红
2. **每页最多一处赭红**（一个 em / 一条引言线 / 一个标签）
3. **数据不超过 3 个**——这是讲故事的系统，数据多用 Swiss Modern
