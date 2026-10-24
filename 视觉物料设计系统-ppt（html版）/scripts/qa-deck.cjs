#!/usr/bin/env node
/**
 * qa-deck.cjs — 16:9 HTML 演示稿验收
 *
 * 用法：
 *   node scripts/qa-deck.cjs <deck.html> [输出目录] [宽] [高]
 *   例：node scripts/qa-deck.cjs deck.html ./qa 1920 1080
 *
 * 前置：先起浏览器远程调试端口（任选其一）
 *   Windows: msedge --headless=new --remote-debugging-port=9222 --user-data-dir=%TEMP%\deck-qa about:blank
 *   macOS  : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/deck-qa about:blank
 *
 * 检查项：
 *   1. 页数与舞台尺寸        2. 元素级溢出（装饰层除外）
 *   3. 字体加载              4. 图片/视频加载
 *   5. 垂直平衡（内容是否居中） 6. 逐页截图
 *
 * 退出码：0 全部通过；1 有失败项
 */
const { writeFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.QA_PORT || 9222);
const args = process.argv.slice(2);
if (!args[0]) { console.error('用法: node scripts/qa-deck.cjs <deck.html> [输出目录] [宽] [高]'); process.exit(2); }
const DECK = path.resolve(args[0]);
const OUT = path.resolve(args[1] || './qa');
const W = Number(args[2] || 1920);
const H = Number(args[3] || 1080);
const DECOR = '.deco,.glow,.landscape,.stars,.particles,.atmos,.gridlines,.grain,.ghost,.vignette,.slot,.img-slot';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  let targets = [];
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      targets = await res.json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch (e) {}
    await sleep(300);
  }
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error(`连不上调试端口 ${PORT}，请先启动浏览器（见脚本头部说明）`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      events.push((d.exception && d.exception.description || d.text || '').split('\n')[0]);
    }
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const mid = ++id;
    pending.set(mid, { res, rej });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  return { ws, send, events };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const { ws, send, events } = await connect();
  const evalJS = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r.result.value;
  };
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable');
  await send('Runtime.enable');
  const loaded = new Promise((res) => {
    const h = (ev) => { const m = JSON.parse(ev.data); if (m.method === 'Page.loadEventFired') { ws.removeEventListener('message', h); res(); } };
    ws.addEventListener('message', h);
  });
  const fileUrl = 'file:///' + DECK.replace(/\\/g, '/').split('/')
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  await send('Page.navigate', { url: fileUrl });
  await loaded;
  await sleep(1200);

  const setup = JSON.parse(await evalJS(`JSON.stringify({
    title: document.title,
    slides: document.querySelectorAll('.slide').length,
    stage: (function(){ const s = document.querySelector('.deck-stage'); return s ? Math.round(s.getBoundingClientRect().width)+'x'+Math.round(s.getBoundingClientRect().height) : 'fluid'; })(),
    hasNav: !!document.querySelector('.nav, .deck-controls, .footline'),
    fonts: document.fonts ? [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family) : []
  })`));

  console.log(`\n=== 演示稿验收 ===\n文件：${DECK}`);
  console.log(`标题：${setup.title}`);
  console.log(`页数：${setup.slides}　舞台：${setup.stage}　视口：${W}x${H}`);
  console.log(`已加载字体：${setup.fonts.length ? setup.fonts.join(', ') : '（系统字体）'}`);
  if (setup.slides === 0) {
    console.log('\n✗ 没有找到 .slide 元素——页面可能未加载或结构不符（检查 file:// 路径与 .slide 类）');
    ws.close(); process.exit(1);
  }

  let fails = 0;
  const report = [];

  console.log('\n页  元素溢出  垂直平衡  媒体');
  for (let i = 0; i < setup.slides; i++) {
    // 切页：兼容两种导航（.slide 直接切换 / 有下一帧按钮）
    await evalJS(`(function(){
      const slides = [...document.querySelectorAll('.slide')];
      slides.forEach((s, k) => { s.classList.toggle('active', k === ${i}); s.classList.toggle('visible', k === ${i}); s.setAttribute('aria-hidden', String(k !== ${i})); });
      return true;
    })()`);
    await sleep(420);
    const diag = JSON.parse(await evalJS(`(function(){
      const slide = document.querySelectorAll('.slide')[${i}];
      const decos = slide.querySelectorAll('${DECOR}');
      decos.forEach(d => { d.style.display = 'none'; });
      const bad = [];
      slide.querySelectorAll('*').forEach(el => {
        if (el.closest('${DECOR}')) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        const over = [];
        if (r.right > ${W} + 1) over.push('right+' + Math.round(r.right - ${W}));
        if (r.bottom > ${H} + 1) over.push('bottom+' + Math.round(r.bottom - ${H}));
        if (r.left < -1) over.push('left' + Math.round(r.left));
        if (r.top < -1) over.push('top' + Math.round(r.top));
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).overflowX !== 'scroll') over.push('scrollW+' + (el.scrollWidth - el.clientWidth));
        if (el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflowY === 'hidden') over.push('clippedH+' + (el.scrollHeight - el.clientHeight));
        if (over.length) bad.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/)[0] : '') + '[' + over.join(',') + ']');
      });
      // 垂直平衡：内容块（.content-mid 或直接子元素并集）在容器内是否居中
      const host = slide.querySelector('.content-mid') || slide;
      const kids = [...host.children].filter(k => k.getBoundingClientRect().height > 0 && !k.matches('${DECOR}'));
      let balance = 'n/a';
      if (kids.length) {
        const box = host.getBoundingClientRect();
        const top = Math.min(...kids.map(k => k.getBoundingClientRect().top));
        const bottom = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
        const gapTop = Math.round(top - box.top);
        const gapBottom = Math.round(box.bottom - bottom);
        var contentH = bottom - top;
        balance = contentH >= box.height * 0.85
          ? 'filled(' + Math.round(contentH / box.height * 100) + '%)'
          : (Math.min(gapTop, gapBottom) >= 12 ? 'ok(' + gapTop + '/' + gapBottom + ')' : '偏(' + gapTop + '/' + gapBottom + ')');
      }
      // 媒体
      const media = [...slide.querySelectorAll('img,video')].map(m => m.tagName === 'IMG'
        ? (m.complete && m.naturalWidth > 0 ? 'img-ok' : 'img-FAIL')
        : (m.readyState >= 2 ? 'video-ok' : 'video-FAIL'));
      decos.forEach(d => { d.style.display = ''; });
      return JSON.stringify({bad: bad.slice(0, 8), badCount: bad.length, balance: balance, media: media});
    })()`));
    const d = diag;
    const overflow = d.badCount === 0 ? '0' : d.badCount + ' ' + d.bad.join(' ');
    const media = d.media.length ? d.media.join(',') : '-';
    const badMedia = d.media.some(m => m.includes('FAIL'));
    const offBalance = d.balance.indexOf('偏') === 0;
    if (d.badCount > 0 || badMedia || offBalance) fails++;
    console.log(String(i + 1).padStart(2) + '  ' + overflow + '  ' + d.balance + '  ' + media);
    report.push({ slide: i + 1, overflow: d.badCount, balance: d.balance, media: d.media });

    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
    writeFileSync(path.join(OUT, `slide-${String(i + 1).padStart(2, '0')}.png`), Buffer.from(shot.data, 'base64'));
  }

  if (events.length) {
    console.log('\nJS 异常：');
    events.slice(0, 5).forEach((e) => console.log('  ' + e));
    fails++;
  }

  // 外链检查
  const ext = JSON.parse(await evalJS(`JSON.stringify({
    links: [...document.querySelectorAll('link[href],[src]')].map(e => e.getAttribute('href') || e.getAttribute('src')).filter(u => u && !/^(data:|#|file:)/.test(u))
  })`));
  if (ext.links.length) { console.log('\n未内嵌的外部资源：' + ext.links.join(', ')); fails++; }

  writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ file: DECK, setup, report, fails }, null, 2));
  console.log(`\n截图与报告：${OUT}`);
  console.log(fails === 0 ? '\nALL PASSED' : `\nFAILED: ${fails} item(s)`);
  ws.close();
  process.exit(fails === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERR', e.message); process.exit(2); });
