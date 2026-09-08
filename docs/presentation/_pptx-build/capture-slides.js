// Renders every main slide of pitstop-deck.html to a PNG, matching the
// real presentation navigation (arrow-key next()), used as the source
// images for pitstop-deck.pptx. Requires puppeteer-core + a local Chrome.
//
// Usage:
//   npm install puppeteer-core   # in this directory or anywhere on NODE_PATH
//   node capture-slides.js [outDir]
//
// outDir defaults to /tmp/pitstop-pptx-build
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT_DIR = process.argv[2] || '/tmp/pitstop-pptx-build';
const DECK = path.resolve(__dirname, '../pitstop-deck.html');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MAIN_SLIDES = 20; // 20 main slides; backups (b01-b05) are skipped, arrow nav skips them too

fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    // --disable-gpu breaks <video> frame decoding in headless screenshots;
    // ANGLE/Metal keeps GPU compositing on so video frames actually render.
    // --allow-file-access-from-files lets the canvas-overlay frame grab
    // (below) read pixels from same-directory file:// <video> elements.
    args: ['--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files', '--use-gl=angle', '--use-angle=metal']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await page.goto('file://' + DECK + '#1', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  // Play + grab each active slide's video frame onto a canvas overlay so the
  // screenshot shows real footage instead of a black rectangle.
  async function primeVideos() {
    await page.evaluate(async () => {
      const active = document.querySelector('.slide.is-active');
      const vids = active ? [].slice.call(active.querySelectorAll('video')) : [];
      await Promise.all(vids.map(v => new Promise(res => {
        try {
          v.muted = true;
          v.play().then(() => { setTimeout(() => { v.pause(); res(); }, 400); }).catch(() => res());
        } catch (e) { res(); }
      })));
      vids.forEach(v => {
        if (!v.videoWidth) return;
        const r = v.getBoundingClientRect();
        const c = document.createElement('canvas');
        c.width = r.width; c.height = r.height;
        c.className = '__snap_overlay__';
        c.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;z-index:99999;object-fit:cover;';
        const ctx = c.getContext('2d');
        try { ctx.drawImage(v, 0, 0, r.width, r.height); } catch (e) {}
        document.body.appendChild(c);
      });
    });
    await new Promise(r => setTimeout(r, 150));
  }
  async function cleanupOverlays() {
    await page.evaluate(() => { document.querySelectorAll('.__snap_overlay__').forEach(c => c.remove()); });
  }
  async function isFinal() {
    return await page.evaluate(() => {
      var s = document.querySelector('.slide.is-active');
      if (!s) return true;
      var need = +s.dataset.steps || 0;
      if (need === 0) return true;
      var steps = [].slice.call(s.querySelectorAll('.step'));
      if (!steps.length) return true;
      return steps.every(function (el) { return el.classList.contains('shown'); });
    });
  }
  async function currentHuman() {
    return await page.evaluate(() => parseInt(location.hash.replace('#', '') || '1', 10));
  }

  const captured = new Set();
  let guard = 0;
  while (captured.size < MAIN_SLIDES && guard < 400) {
    guard++;
    const human = await currentHuman();
    const final = await isFinal();
    if (final && !captured.has(human) && human <= MAIN_SLIDES) {
      await primeVideos();
      const id = String(human).padStart(2, '0');
      await page.screenshot({ path: path.join(OUT_DIR, `slide-${id}.png`) });
      await cleanupOverlays();
      captured.add(human);
      console.log('captured', human);
    }
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 380));
  }

  await browser.close();
  console.log('done ->', OUT_DIR);
})();
