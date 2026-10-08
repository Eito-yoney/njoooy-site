const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/yonesanraku/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const outDir = path.resolve(__dirname, 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const results = [];
  for (const shot of [
    { name: 'desktop', width: 1440, height: 1100 },
    { name: 'mobile', width: 390, height: 1200 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('http://127.0.0.1:8787/recruiting/', {
      waitUntil: 'load',
      timeout: 10000,
    });
    await page.waitForTimeout(500);
    const metrics = await page.evaluate(() => {
      const box = el => {
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
          bottom: Math.round(r.bottom),
        };
      };
      return {
        title: document.title,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        hero: box(document.querySelector('.hero')),
        heroInner: box(document.querySelector('.hero-inner')),
        heroTitle: box(document.querySelector('.hero-hl')),
        heroGraphic: box(document.querySelector('.hiring-graphic')),
        trust: box(document.querySelector('.trust')),
        heroText: document.querySelector('.hero-hl')?.innerText,
        badgeText: document.querySelector('.hero-badge')?.innerText,
        hasPhoneMock: !!document.querySelector('.phone-mockup'),
        formulaText: document.querySelector('.formula-line')?.innerText,
      };
    });
    const screenshot = path.join(outDir, `recruiting-${shot.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({
      viewport: shot.name,
      ...metrics,
      errors,
      screenshot,
    });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
