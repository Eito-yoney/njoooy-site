const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/yonesanraku/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const base = 'http://127.0.0.1:8788';
  const outDir = path.resolve(__dirname, 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 1100 },
    { name: 'mobile', width: 390, height: 1200 },
  ];
  const pages = [];

  for (const viewport of viewports) {
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
      const ids = ['top', 'projects', 'flow', 'pricing', 'about', 'faq', 'contact'];
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
        hasGrowthLink: Array.from(document.querySelectorAll('a')).some(a => /growth|集客支援/.test(a.getAttribute('href') || '') || /集客支援/.test(a.textContent)),
        hasAbout: !!document.querySelector('#about'),
        hasContactForm: !!document.querySelector('#contact form.contact-form'),
        formAction: document.querySelector('#contact form.contact-form')?.getAttribute('action'),
        formRequiredFields: Array.from(document.querySelectorAll('#contact [required]')).map(el => el.name || el.id),
        sections: sectionMap,
      };
    });

    const screenshot = path.join(outDir, `home-single-${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    pages.push({ viewport: viewport.name, ...metrics, errors, screenshot });
    await page.close();
  }

  const redirects = [];
  for (const route of ['/about/', '/contact/', '/recruiting/', '/growth/']) {
    const page = await browser.newPage();
    await page.goto(base + route, { waitUntil: 'load', timeout: 10000 });
    await page.waitForTimeout(500);
    redirects.push({
      route,
      finalUrl: page.url(),
      title: await page.title(),
    });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify({ pages, redirects }, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
