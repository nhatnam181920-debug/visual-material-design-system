# 8-Bit Orbit · 版式配方

> 模板的 5 页是 5 种基础版式。这里是额外的 4 种常用版式，直接复制 `<section>` 改文字即可。
> 所有配方都用模板里已有的类，不需要新增 CSS。注意：内容统一包在 `.content-mid` 里（垂直居中）。

## 配方 1：议程/清单页（七件套、交付清单）

```html
<section class="slide" data-slide-id="deliverables">
  <div class="vignette"></div>
  <div class="deck-frame center">
    <div class="content-mid">
      <p class="pill cyan">交付 · 清单</p>
      <h1 class="display" style="margin-top:14px;margin-bottom:24px">客户拿到七件，不是一条视频。</h1>
      <div class="agenda">
        <div class="row"><p class="ord">01</p><p class="name">选题调研卡</p><p class="kind">证据分级 · 反方观点 · 信号缺口</p></div>
        <div class="row"><p class="ord">02</p><p class="name">口播稿</p><p class="kind">定稿 + 前三秒钩子 + 事实边界</p></div>
        <div class="row"><p class="ord">03</p><p class="name">拍摄单</p><p class="kind">一页能照着拍 · 手机 · 风险勾选</p></div>
        <div class="row"><p class="ord">04</p><p class="name">剪辑与字幕说明</p><p class="kind">流程 + 逐句人工核对手记</p></div>
        <div class="row"><p class="ord">05</p><p class="name">三平台发布包</p><p class="kind">标题 / 封面文案 / 正文 / 标签</p></div>
      </div>
      <div class="statement"><span class="mark">证据链</span><p>每一步都能回溯：谁说的、哪条评论、哪个文件。</p></div>
    </div>
  </div>
</section>
```

## 配方 2：大长框分点页（给谁用 / 拿到什么 / 两个方案）

```html
<section class="slide" data-slide-id="two-boxes">
  <div class="vignette"></div>
  <div class="deck-frame center">
    <div class="content-mid">
      <p class="pill pink">定位 · 取舍</p>
      <h1 class="display" style="margin-top:14px;margin-bottom:26px">只服务一类人。</h1>
      <div class="cols" style="min-height:420px">
        <div class="big-tile brackets">
          <p class="t">服务谁</p>
          <ul>
            <li>单人出镜的口播博主：知识 / 职场 / 成长 / 校园类</li>
            <li>没有剪辑团队，一个人干全部的活</li>
            <li>粉丝几千到几万，有稳定更新意愿</li>
          </ul>
          <p class="kicker-line">你只做一件事：出镜录制。</p>
        </div>
        <div class="big-tile paper brackets">
          <p class="t">不服务谁</p>
          <ul>
            <li>需要外景拍摄、剧情演员、带货直播的账号</li>
            <li>要求代发布、代运营，或要交账号密码的需求</li>
          </ul>
          <p class="kicker-line">账号始终只在你手里。</p>
        </div>
      </div>
      <div class="statement"><span class="mark">口径</span><p>窄客群，深交付：先吃透一类人，再谈扩大。</p></div>
    </div>
  </div>
</section>
```

## 配方 3：时间线页（路线图 / 里程碑 / 三步走）

```html
<section class="slide" data-slide-id="timeline">
  <div class="vignette"></div>
  <div class="deck-frame center">
    <div class="content-mid">
      <p class="pill">路线 · 三步</p>
      <h1 class="display" style="margin-top:14px;margin-bottom:24px">三步走，每步都有可验证的产出。</h1>
      <div class="timeline">
        <div class="tl-item active">
          <p class="t">第一步 · 内测</p>
          <p class="d">跑完 5 单，换案例授权与反馈。</p>
          <p class="cost">验证：有人愿意付钱</p>
        </div>
        <div class="tl-item">
          <p class="t">第二步 · 回填实测</p>
          <p class="d">5 条真实制作逐条计时，把「待实测」换成中位数。</p>
          <p class="cost">验证：单位经济成立</p>
        </div>
        <div class="tl-item">
          <p class="t">第三步 · 放大</p>
          <p class="d">联盟分销 + 开源引擎，把产能变成杠杆。</p>
          <p class="cost">验证：规模化可行</p>
        </div>
      </div>
      <div class="statement"><span class="mark">顺序</span><p>先验证付费，再验证经济，最后放大。</p></div>
    </div>
  </div>
</section>
```

## 配方 4：行动页（结尾 CTA + 徽章）

```html
<section class="slide" data-slide-id="cta">
  <div class="glow cyan" style="width:1400px;height:900px;left:50%;top:50%;transform:translate(-50%,-50%)"></div>
  <div class="stars" data-stars="48"></div>
  <div class="vignette"></div>
  <div class="landscape" data-landscape></div>
  <div class="deck-frame center">
    <div class="content-mid">
      <p class="pill cyan">今天 · 一件事</p>
      <h1 class="display" style="margin-top:14px;margin-bottom:20px">打开产品页，复制预约信息。</h1>
      <p class="lede" style="max-width:1000px;margin-bottom:26px">发给一位做口播的朋友，或者在现场直接找我们聊。</p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <span class="badge cyan">首批内测 199 元 · 限 5 位</span>
        <span class="badge">社群联盟 · 30–50% 分成</span>
        <span class="badge cyan">creatorflow · MIT</span>
      </div>
    </div>
  </div>
</section>
```

## 用配方时的四条纪律

1. **每一页都要有 `.content-mid`**（垂直居中），否则内容会堆在上半页
2. **`data-slide-id` 唯一**（脚本用它切换页，重复会出错）
3. **页眉 `.pill` 只标章节**，不要和标题重复
4. **涉及数字的页**：来源写进 `.statement` 或 `.footline`；没有来源的数字不写
