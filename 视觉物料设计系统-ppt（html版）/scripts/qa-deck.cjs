#!/usr/bin/env node
/**
 * qa-deck.cjs — 16:9 HTML 演示稿验收（零配置：自动拉起浏览器）
 *
 * 用法：
 *   node scripts/qa-deck.cjs <deck.html> [输出目录] [宽] [高]
 *   node scripts/qa-deck.cjs deck.html ./qa 1920 1080
 *
 * 环境变量：
 *   QA_PORT=9222        已有调试端口时复用（不自动启动浏览器）
 *   QA_BROWSER=<path>   指定浏览器可执行文件
 *   QA_ALLOW_PLACEHOLDER=1  跳过占位文案检查（不推荐）
 *
 * 检查项：
 *   1. 页数与舞台尺寸          2. 元素级溢出（装饰层除外）
 *   3. 垂直平衡 + 过挤警告      4. 字体加载
 *   5. 图片/视频加载            6. 未替换的模板占位文案
 *   7. 真实键盘翻页（→ / ← / Home / End）
 *   8. 相对外链                 9. JS 异常
 *
 * 退出码：0 全部通过；1 有失败项；2 用法/环境错误
 */
const { writeFileSync, mkdirSync, mkdtempSync, rmSync } = require('node:fs');
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');

const PORT = Number(process.env.QA_PORT || 9222);
const args = process.argv.slice(2);
if (!args[0]) { console.error('用法: node scripts/qa-deck.cjs <deck.html> [输出目录] [宽] [高]'); process.exit(2); }
const DECK = path.resolve(args[0]);
const OUT = path.resolve(args[1] || './qa');
const W = Number(args[2] || 1920);
const H = Number(args[3] || 1080);
const ALLOW_PH = process.env.QA_ALLOW_PLACEHOLDER === '1';

const DECOR = '.deco,.glow,.landscape,.stars,.particles,.atmos,.gridlines,.grain,.ghost,.vignette,.slot,.img-slot';

// 模板自带的演示文案：没改就说明这一页还是模板
const PLACEHOLDERS = [
  // 只收「模板演示专用」的句子；合法业务文案（谁负责 / 日期 / 五步流程）不在列表里
  '主标题第一行', '强调词在第二行', '副标题 · 品类', '产品名 · 一句话定位',
  '指标一 · 补充说明', '指标二 · 补充说明', '指标三 · 补充说明', '指标的含义与口径',
  '我不是来讲概念的，先给你看结果。', '一句把因果讲透的结论。',
  '问题 · 拆开看', '第一块', '第二块', '第三块', '第四块', '第五块', '第六块',
  '两行说明，把机制或证据讲清楚。', '一句点破本质的话。',
  '系统 · 怎么做到的', '九步流水线，每一步都有技术栈。',
  '一句可以被引用的话', '把它留在评委脑子里', '行动一', '行动二', '行动三',
  '成果 · 先看结果', '步骤一', '步骤二', '步骤三', '步骤四', '步骤五',
  '做什么、用什么', '对比项一', '对比项二', '对比项三',
  '能力一', '能力二（青色变体）', '能力三', '能力四（技术变体）', '同一套卡片，切换颜色表达不同语义。',
  '两到三行说明，把机制讲清楚。', '这一步做完手里有什么', '关键标签', '能力标签', '普通标签',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findBrowser() {
  const cands = [
    process.env.QA_BROWSER,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const { existsSync } = require('node:fs');
  for (const c of cands) { try { if (existsSync(c)) return c; } catch (e) {} }
  return null;
}

async function pingPort() {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`, { signal: AbortSignal.timeout(800) });
    return res.ok;
  } catch (e) { return false; }
}

async function ensureBrowser() {
  if (await pingPort()) return { spawned: null, external: true };
  const bin = findBrowser();
  if (!bin) {
    console.error('找不到 Chrome / Edge。请安装其一，或设置 QA_BROWSER=<浏览器路径>，');
    console.error('或手动启动：msedge --headless=new --remote-debugging-port=9222 --user-data-dir=<临时目录> about:blank');
    process.exit(2);
  }
  const profile = mkdtempSync(path.join(os.tmpdir(), 'deck-qa-'));
  const child = spawn(bin, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'],
    { stdio: 'ignore', detached: false });
  for (let i = 0; i < 60; i++) {
    if (await pingPort()) return { spawned: child, profile, external: false };
    await sleep(250);
  }
  child.kill();
  console.error('浏览器启动超时（15s）。检查是否被安全软件拦截，或手动启动后设置 QA_PORT。');
  process.exit(2);
}

async function connect() {
  let targets = [];
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      targets = await res.json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch (e) {}
    await sleep(300);
  }
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error(`连不上调试端口 ${PORT}`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      events.push(((d.exception && d.exception.description) || d.text || '').split('\n')[0]);
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
  const started = Date.now();
  mkdirSync(OUT, { recursive: true });
  const browser = await ensureBrowser();
  if (!browser.external) console.log(`（已自动启动浏览器，profile: ${browser.profile}）`);

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
    fonts: document.fonts ? [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family) : []
  })`));

  console.log(`\n=== 演示稿验收 ===\n文件：${DECK}`);
  console.log(`标题：${setup.title}`);
  console.log(`页数：${setup.slides}　舞台：${setup.stage}　视口：${W}x${H}`);
  console.log(`已加载字体：${setup.fonts.length ? setup.fonts.join(', ') : '（系统字体）'}`);
  if (setup.slides === 0) {
    console.log('\nFAILED: 没有找到 .slide —— 文件可能未加载或结构不符');
    ws.close(); process.exit(1);
  }

  let fails = 0;
  const report = [];

  // ---------- 真实键盘翻页 ----------
  const key = async (k, code, vk) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
    await sleep(220);
  };
  const activeIndex = async () => Number(await evalJS(`(function(){
    const s = [...document.querySelectorAll('.slide')];
    const i = s.findIndex(x => x.classList.contains('active') || x.classList.contains('visible'));
    return i < 0 ? 0 : i;
  })()`));
  await key('ArrowRight', 'ArrowRight', 39);
  const afterRight = await activeIndex();
  await key('ArrowLeft', 'ArrowLeft', 37);
  const afterLeft = await activeIndex();
  await key('End', 'End', 35);
  const afterEnd = await activeIndex();
  await key('Home', 'Home', 36);
  const afterHome = await activeIndex();
  const navOk = afterRight === 1 && afterLeft === 0 && afterEnd === setup.slides - 1 && afterHome === 0;
  if (!navOk) fails++;
  console.log(`\n键盘翻页：→ ${afterRight} ← ${afterLeft} End ${afterEnd} Home ${afterHome}　${navOk ? 'OK' : 'FAIL'}`);

  // ---------- 逐页检查 ----------
  console.log('\n页  元素溢出  垂直平衡  媒体');
  for (let i = 0; i < setup.slides; i++) {
    // 用 deck 自己的导航（键盘）切页：先 Home 复位，再按 i 次 →
    await key('Home', 'Home', 36);
    for (let k = 0; k < i; k++) await key('ArrowRight', 'ArrowRight', 39);
    await sleep(360);
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
      const host = slide.querySelector('.content-mid') || slide;
      const kids = [...host.children].filter(k => k.getBoundingClientRect().height > 0 && !k.matches('${DECOR}'));
      let balance = 'n/a';
      if (kids.length) {
        const box = host.getBoundingClientRect();
        const top = Math.min(...kids.map(k => k.getBoundingClientRect().top));
        const bottom = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
        const gapTop = Math.round(top - box.top);
        const gapBottom = Math.round(box.bottom - bottom);
        const contentH = bottom - top;
        const ratio = contentH / box.height;
        balance = ratio >= 0.96 ? 'tight(' + Math.round(ratio*100) + '%)'
          : ratio >= 0.85 ? 'filled(' + Math.round(ratio*100) + '%)'
          : (Math.min(gapTop, gapBottom) >= 12 ? 'ok(' + gapTop + '/' + gapBottom + ')' : '偏(' + gapTop + '/' + gapBottom + ')');
      }
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
    const tight = d.balance.indexOf('tight') === 0;
    if (d.badCount > 0 || badMedia || offBalance) fails++;
    console.log(String(i + 1).padStart(2) + '  ' + overflow + '  ' + d.balance + (tight ? ' ⚠过挤' : '') + '  ' + media);
    report.push({ slide: i + 1, overflow: d.badCount, balance: d.balance, media: d.media });

    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
    writeFileSync(path.join(OUT, `slide-${String(i + 1).padStart(2, '0')}.png`), Buffer.from(shot.data, 'base64'));
  }

  // ---------- 占位文案残留 ----------
  if (!ALLOW_PH) {
    const ph = JSON.parse(await evalJS(`(function(){
      const root = document.querySelector('.deck-stage') || document.body;
      const text = root.textContent || '';
      const hits = ${JSON.stringify(PLACEHOLDERS)}.filter(p => text.indexOf(p) >= 0);
      return JSON.stringify(hits);
    })()`));
    if (ph.length) {
      console.log('\n⚠ 未替换的模板占位文案（' + ph.length + ' 处）：' + ph.slice(0, 10).join('、'));
      console.log('  → 这些页还是模板演示内容，交付前必须改成真实内容（或设 QA_ALLOW_PLACEHOLDER=1 跳过）');
      fails++;
    } else {
      console.log('\n占位文案：0 处残留');
    }
  }

  // ---------- 外链与 JS 异常 ----------
  const ext = JSON.parse(await evalJS(`JSON.stringify({
    links: [...document.querySelectorAll('link[href],[src]')].map(e => e.getAttribute('href') || e.getAttribute('src')).filter(u => u && !/^(data:|#|file:)/.test(u))
  })`));
  if (ext.links.length) { console.log('\n未内嵌的外部资源：' + ext.links.join(', ')); fails++; }
  if (events.length) {
    console.log('\nJS 异常：');
    events.slice(0, 5).forEach((e) => console.log('  ' + e));
    fails++;
  }

  writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({
    file: DECK, generatedAt: new Date().toISOString(), costMs: Date.now() - started,
    setup, nav: { afterRight, afterLeft, afterEnd, afterHome, ok: navOk }, report, fails,
  }, null, 2));
  console.log(`\n截图与报告：${OUT}（${((Date.now() - started) / 1000).toFixed(1)}s）`);
  console.log(fails === 0 ? '\nALL PASSED' : `\nFAILED: ${fails} item(s)`);

  ws.close();
  if (browser.spawned) {
    try { browser.spawned.kill(); } catch (e) {}
    await sleep(400);
    try { rmSync(browser.profile, { recursive: true, force: true }); } catch (e) {}
  }
  process.exit(fails === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERR', e.message); process.exit(2); });
