const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/yonesanraku/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const base = 'http://127.0.0.1:8790';
  const outDir = path.resolve(__dirname, 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const results = [];
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1100 },
    { name: 'mobile', width: 390, height: 1200 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(base + '/', { waitUntil: 'load', timeout: 10000 });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const ids = ['top', 'features', 'usecases', 'scope', 'flow', 'comparison', 'pricing', 'about', 'faq', 'contact'];
      const sectionMap = {};
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
          sectionMap[id] = null;
          return;
        }
        const r = el.getBoundingClientRect();
        sectionMap[id] = {
          width: Math.round(r.width),
          height: Math.round(r.height),
          top: Math.round(r.top),
        };
      });
      return {
        title: document.title,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        navText: Array.from(document.querySelectorAll('.nav-links a')).map(a => a.textContent.trim()).join(' / '),
        heroText: document.querySelector('.hero-hl')?.innerText,
        trustText: Array.from(document.querySelectorAll('.trust-stat')).map(el => el.innerText.replace(/\n/g, ' ')),
        hasFeatureCards: document.querySelectorAll('.feature-card').length,
        hasScopeTimeline: document.querySelectorAll('.scope-step').length,
        hasDeliverables: document.querySelectorAll('.deliverable-card').length,
        hasPricingCards: document.querySelectorAll('.pr-card').length,
        sections: sectionMap,
        formAction: document.querySelector('#contact form.contact-form')?.getAttribute('action'),
      };
    });

    const screenshot = path.join(outDir, `marugoto-front-${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ viewport: viewport.name, ...metrics, errors, screenshot });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
