import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base = 'http://127.0.0.1:4173/';
const outDir = 'artifacts/visual-qa';
await fs.mkdir(outDir, { recursive: true });

const scenarios = [
  { name: 'home-desktop', path: 'index.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true },
  { name: 'home-tablet', path: 'index.html', viewport: { width: 820, height: 1180 }, mobileMenu: true, rtl: true },
  { name: 'home-mobile', path: 'index.html', viewport: { width: 390, height: 844 }, mobileMenu: true, rtl: true },
  { name: 'projects-desktop', path: 'projects.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true },
  { name: 'projects-mobile', path: 'projects.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true },
  { name: 'certificates-mobile', path: 'certificates.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true },
  { name: 'qiddiya-desktop', path: 'project.html?id=qiddiya', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true },
  { name: 'qiddiya-mobile', path: 'project.html?id=qiddiya', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true }
];

const failures = [];
const results = [];
const browser = await chromium.launch({ headless: true });

function fail(name, message) {
  failures.push({ scenario: name, message });
}

async function metrics(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const main = document.querySelector('main');
    const brokenLoadedImages = [...document.images]
      .filter(img => img.complete && img.naturalWidth === 0)
      .map(img => img.currentSrc || img.src);
    const visibleFixed = [...document.querySelectorAll('*')]
      .filter(el => {
        const s = getComputedStyle(el);
        if (s.position !== 'fixed') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .map(el => ({ tag: el.tagName, cls: el.className || '', rect: el.getBoundingClientRect().toJSON?.() || {} }));
    return {
      lang: root.lang,
      dir: root.dir,
      scrollWidth: root.scrollWidth,
      innerWidth: innerWidth,
      bodyScrollWidth: body.scrollWidth,
      mainRect: main ? { left: main.getBoundingClientRect().left, right: main.getBoundingClientRect().right, width: main.getBoundingClientRect().width } : null,
      brokenLoadedImages,
      visibleFixedCount: visibleFixed.length
    };
  });
}

async function scrollSample(page) {
  await page.evaluate(async () => {
    const step = Math.max(500, Math.floor(innerHeight * 0.8));
    const max = document.documentElement.scrollHeight - innerHeight;
    for (let y = 0; y <= max; y += step) {
      scrollTo(0, y);
      await new Promise(r => setTimeout(r, 45));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(150);
}

for (const s of scenarios) {
  const context = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => pageErrors.push(String(err)));

  try {
    const response = await page.goto(base + s.path, { waitUntil: 'networkidle', timeout: 30000 });
    if (!response || !response.ok()) fail(s.name, 'Page response was not OK');

    await page.waitForTimeout(200);
    const before = await metrics(page);
    if (before.scrollWidth > before.innerWidth + 2 || before.bodyScrollWidth > before.innerWidth + 2) {
      fail(s.name, `Horizontal overflow in English: scrollWidth=${before.scrollWidth}, viewport=${before.innerWidth}`);
    }
    if (before.mainRect && (before.mainRect.left < -2 || before.mainRect.right > before.innerWidth + 2)) {
      fail(s.name, `Main content exceeds viewport in English: ${JSON.stringify(before.mainRect)}`);
    }

    if (s.path === 'index.html') {
      const projectCount = await page.locator('#projects .project').count();
      const capabilityCount = await page.locator('#capabilities .capability-card').count();
      const experienceCount = await page.locator('#experience .experience-item').count();
      if (projectCount < 6) fail(s.name, `Expected >= 6 featured projects, got ${projectCount}`);
      if (capabilityCount !== 4) fail(s.name, `Expected 4 capability cards, got ${capabilityCount}`);
      if (experienceCount < 3) fail(s.name, `Expected professional experience timeline, got ${experienceCount} items`);

      if (s.mobileMenu) {
        const menu = page.locator('#menuToggle');
        if (await menu.isVisible()) {
          await menu.click();
          const expanded = await menu.getAttribute('aria-expanded');
          const linksVisible = await page.locator('#navLinks').isVisible();
          if (expanded !== 'true' || !linksVisible) fail(s.name, 'Mobile navigation did not open correctly');
          await menu.click();
        }
      }
    }

    if (s.rtl) {
      const langButton = page.locator('#langBtn, [data-pg-lang]').first();
      if (await langButton.count() && await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(120);
        const after = await metrics(page);
        if (after.lang !== 'ar' || after.dir !== 'rtl') fail(s.name, `Arabic switch failed: lang=${after.lang}, dir=${after.dir}`);
        if (after.scrollWidth > after.innerWidth + 2 || after.bodyScrollWidth > after.innerWidth + 2) {
          fail(s.name, `Horizontal overflow in Arabic: scrollWidth=${after.scrollWidth}, viewport=${after.innerWidth}`);
        }
      }
    }

    await scrollSample(page);
    const afterScroll = await metrics(page);
    if (afterScroll.brokenLoadedImages.length) {
      fail(s.name, `Broken loaded images: ${afterScroll.brokenLoadedImages.join(', ')}`);
    }
    if (consoleErrors.length) fail(s.name, `Console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) fail(s.name, `Page errors: ${pageErrors.join(' | ')}`);

    await page.screenshot({ path: `${outDir}/${s.name}.png`, fullPage: true });
    results.push({ scenario: s.name, path: s.path, viewport: s.viewport, status: 'checked' });
  } catch (err) {
    fail(s.name, String(err));
  } finally {
    await context.close();
  }
}

// Reduced-motion contract on the homepage.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(base + 'index.html', { waitUntil: 'networkidle', timeout: 30000 });
    const reduced = await page.evaluate(() => {
      const hero = document.querySelector('.hero-real-image');
      const reveal = document.querySelector('.motion-reveal');
      return {
        heroAnimation: hero ? getComputedStyle(hero).animationName : null,
        revealOpacity: reveal ? getComputedStyle(reveal).opacity : null
      };
    });
    if (reduced.heroAnimation && reduced.heroAnimation !== 'none') fail('reduced-motion', `Hero animation still active: ${reduced.heroAnimation}`);
    if (reduced.revealOpacity === '0') fail('reduced-motion', 'Motion-reveal content remains hidden with reduced motion');
  } catch (err) {
    fail('reduced-motion', String(err));
  } finally {
    await context.close();
  }
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  scenarios: results,
  failures
};
await fs.writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));

const markdown = [
  '# Portfolio Browser Visual QA',
  '',
  `Scenarios checked: **${results.length}**`,
  `Failures: **${failures.length}**`,
  '',
  ...results.map(r => `- ✅ ${r.scenario} — ${r.viewport.width}×${r.viewport.height}`),
  ...(failures.length ? ['', '## Failures', ...failures.map(f => `- ❌ **${f.scenario}** — ${f.message}`)] : ['', '✅ Desktop, tablet, mobile, RTL/LTR, loaded-image, console-error, and reduced-motion gates passed.'])
].join('\n');
await fs.writeFile(`${outDir}/report.md`, markdown);

console.log(markdown);
if (failures.length) {
  const esc = value => String(value).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  for (const failure of failures) {
    console.log(`::error title=Portfolio Visual QA - ${esc(failure.scenario)}::${esc(failure.message)}`);
  }
  process.exit(1);
}
