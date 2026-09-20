import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const base = 'http://127.0.0.1:4173/';
const outDir = 'artifacts/visual-qa';
await fs.mkdir(outDir, { recursive: true });

const scenarios = [
  { name: 'home-desktop', path: 'index.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'home-tablet', path: 'index.html', viewport: { width: 820, height: 1180 }, mobileMenu: true, rtl: true, axe: true },
  { name: 'home-mobile', path: 'index.html', viewport: { width: 390, height: 844 }, mobileMenu: true, rtl: true, axe: true },
  { name: 'projects-desktop', path: 'projects.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'projects-mobile', path: 'projects.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'certificates-desktop', path: 'certificates.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'certificates-mobile', path: 'certificates.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'qiddiya-desktop', path: 'project.html?id=qiddiya', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'qiddiya-mobile', path: 'project.html?id=qiddiya', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'neom-desktop', path: 'neom.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'neom-mobile', path: 'neom.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'neom-village-mobile', path: 'neom-professional-village.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'nupco-desktop', path: 'nupco.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'nupco-mobile', path: 'nupco.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'nupco-warehouse-mobile', path: 'nupco-warehouse.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'zain-desktop', path: 'zain-industries.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'zain-mobile', path: 'zain-industries.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'sketchup-desktop', path: 'sketchup.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'sketchup-mobile', path: 'sketchup.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'developer-desktop', path: 'developer-portfolio.html', viewport: { width: 1440, height: 1000 }, mobileMenu: false, rtl: true, axe: true },
  { name: 'developer-mobile', path: 'developer-portfolio.html', viewport: { width: 390, height: 844 }, mobileMenu: false, rtl: true, axe: true }
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
      .filter(img => Boolean(img.currentSrc || img.getAttribute('src')) && img.complete && img.naturalWidth === 0)
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
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const points = [...new Set([0, max * .2, max * .4, max * .6, max * .8, max].map(x => Math.round(x)))];
    for (const y of points) {
      scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
}

async function seoAudit(page, scenario) {
  const seo = await page.evaluate(() => ({
    title: document.title.trim(),
    description: document.querySelector('meta[name="description"]')?.content?.trim() || '',
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.content?.trim() || '',
    ogImage: document.querySelector('meta[property="og:image"]')?.content?.trim() || '',
    h1Count: document.querySelectorAll('h1').length,
    mainCount: document.querySelectorAll('main').length
  }));
  if (!seo.title) fail(scenario, 'Missing document title');
  if (!seo.description) fail(scenario, 'Missing meta description');
  if (!seo.canonical) fail(scenario, 'Missing canonical URL');
  if (!seo.ogTitle || !seo.ogImage) fail(scenario, 'Missing Open Graph title or image');
  if (seo.h1Count !== 1) fail(scenario, `Expected exactly one H1, found ${seo.h1Count}`);
  if (seo.mainCount !== 1) fail(scenario, `Expected exactly one main landmark, found ${seo.mainCount}`);
}

async function internalLinkAudit(page, scenario) {
  const urls = await page.evaluate(() => [...new Set(
    [...document.querySelectorAll('a[href]')]
      .map(a => a.href)
      .filter(href => href.startsWith(location.origin) && !href.includes('#'))
  )]);
  for (const url of urls.slice(0, 40)) {
    const response = await page.request.get(url, { failOnStatusCode: false });
    if (response.status() >= 400) fail(scenario, `Broken internal link ${response.status()}: ${url}`);
  }
}

async function axeAudit(page, scenario, phase) {
  const report = await new AxeBuilder({ page })
    .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])
    .analyze();
  if (report.violations.length) {
    const summary = report.violations
      .slice(0, 8)
      .map(v => `${v.id}[${v.impact || 'unknown'}]: ${v.nodes.length}`)
      .join(', ');
    fail(scenario, `WCAG audit (${phase}) found ${report.violations.length} violation types: ${summary}`);
  }
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
    const skip=page.locator('.skip-link').first();
    if(await skip.count()){await page.keyboard.press('Tab');const focused=await skip.evaluate(el=>document.activeElement===el);if(!focused)fail(s.name,'Skip link is not first in keyboard focus order');await page.keyboard.press('Escape')}
    else fail(s.name,'Accessible skip link not found');
    if(s.axe) await axeAudit(page,s.name,'English');
    await seoAudit(page,s.name);
    if(s.path==='index.html'||s.path==='projects.html') await internalLinkAudit(page,s.name);
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
        if(s.axe) await axeAudit(page,s.name,'Arabic');
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

// Text scaling contract: homepage must remain usable at 200% root text size.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(base + 'index.html', { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.waitForTimeout(150);
    const scaled = await metrics(page);
    if (scaled.scrollWidth > scaled.innerWidth + 2 || scaled.bodyScrollWidth > scaled.innerWidth + 2) {
      fail('text-scale-200', `Horizontal overflow at 200% text size: scrollWidth=${scaled.scrollWidth}, viewport=${scaled.innerWidth}`);
    }
  } catch (err) {
    fail('text-scale-200', String(err));
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
  ...(failures.length ? ['', '## Failures', ...failures.map(f => `- ❌ **${f.scenario}** — ${f.message}`)] : ['', '✅ Desktop, tablet, mobile, RTL/LTR, WCAG automated audit, SEO/semantic metadata, internal-link health, skip-navigation, loaded-image, console-error, 200% text-scale, and reduced-motion gates passed.'])
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
