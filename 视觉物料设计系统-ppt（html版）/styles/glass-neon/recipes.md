# Glass Neon · 版式配方

> 模板的 5 页是 5 种基础版式。这里是额外的 4 种常用版式，直接复制 `<section>` 改文字即可。
> 所有配方都用模板里已有的类，不需要新增 CSS。

## 配方 1：对比页（两栏，用来讲「旧办法 vs 我们」）

```html
<section class="slide" aria-label="对比">
  <div class="ghost" aria-hidden="true">06</div>
  <p class="kicker">对比</p>
  <h2>旧办法差在哪，<em>我们补哪一环</em></h2>
  <div class="c2">
    <div class="card"><div class="idx">旧办法</div><b>只交付文字</b><span>剪辑、字幕、发布包还是你自己的事。交付停在稿子，不停在成片。</span></div>
    <div class="card teal"><div class="idx">我们</div><b>交付成片 + 证据链</b><span>从调研到发布包，关键节点人工确认，你只出镜。</span></div>
  </div>
  <div class="yield"><span class="yl">差异</span><span class="yv">不是「多写几版稿」，是<b>把稿子变成能发布的成片</b>。</span></div>
</section>
```

## 配方 2：三条并列结论（能力 / 支柱 / 价值）

```html
<section class="slide" aria-label="三条并列">
  <div class="ghost" aria-hidden="true">07</div>
  <p class="kicker">为什么是我们</p>
  <h2>三件事同时成立，<em>才叫系统</em></h2>
  <div class="plats">
    <div class="plat dy"><div class="pt">01</div><h3>真实成片</h3>
      <span class="role">已验证</span>
      <p>一条 165.87 秒成片，规格与完整解码核验 PASS。</p>
    </div>
    <div class="plat"><div class="pt">02</div><h3>多套模板</h3>
      <span class="role">可切换</span>
      <p>同一条内容可换不同视觉世界，风格可换、证据链不变。</p>
    </div>
    <div class="plat xy"><div class="pt">03</div><h3>数据回流</h3>
      <span class="role">闭环</span>
      <p>发布后数据回流选题池，每发一条系统更准一点。</p>
    </div>
  </div>
</section>
```

## 配方 3：引用/金句页（转场用，一页只放一句话）

```html
<section class="slide" aria-label="金句">
  <div class="ghost" aria-hidden="true">08</div>
  <p class="kicker center" style="justify-content:center">转折</p>
  <p class="quote">方法随处可得，<br><em>产能百里挑一</em>。</p>
  <p class="lead center" style="max-width:none;margin-top:4vh">一句话解释这句为什么成立，<b>不要超过两行</b>。</p>
</section>
```

## 配方 4：行动页（结尾 CTA）

```html
<section class="slide" aria-label="行动">
  <div class="ghost" aria-hidden="true">12</div>
  <p class="kicker">下一步</p>
  <h2>今天就能开始的<em>一件事</em></h2>
  <ul class="steps">
    <li><span class="sn">01</span><b>打开产品页</b><span class="tagline">复制预约信息，或现场扫码。</span></li>
    <li><span class="sn">02</span><b>填一张问诊表</b><span class="tagline">3 分钟：赛道、现状、最想解决的问题。</span></li>
    <li><span class="sn">03</span><b>等回复</b><span class="tagline">我们回复接 / 不接和原因，不让你等空响。</span></li>
  </ul>
  <p class="lead" style="margin-top:3vh"><span class="hl">首批内测 199 元，限 5 位。</span></p>
</section>
```

## 用配方时的三条纪律

1. **页码**：`.ghost` 里的数字 = 实际页码，复制后记得改
2. **来源**：涉及数字的页，末尾加 `<p class="src">来源：…</p>`
3. **一页一件事**：配方只加内容不改结构；如果一页要讲两件事，拆成两页
