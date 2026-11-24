// Optional real-browser QA using an already installed Playwright; no package downloads.
// RAFISA_PLAYWRIGHT_MODULE may point to its existing index.mjs outside this project.
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { preview } from 'vite';
import { cvDocuments } from '../src/data/cv.js';
import { homeCopy } from '../src/data/homeCopy.js';
const engines = await import(process.env.RAFISA_PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.RAFISA_PLAYWRIGHT_MODULE).href : 'playwright');
const engineName = process.env.RAFISA_BROWSER_ENGINE || 'chromium';
assert.ok(['chromium','webkit','firefox'].includes(engineName), 'Unsupported browser engine');
const output = process.env.RAFISA_BROWSER_OUTPUT || join(tmpdir(), `rafisa-browser-qa-${engineName}`);
await mkdir(output, { recursive: true });
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
let browser;
const results = [];
const errors = [];
try {
  console.log(`Launching ${engineName} for local production checks…`);
  browser = await engines[engineName].launch({ headless: true, timeout: 30000 });
  console.log(`Connected to ${engineName} ${browser.version()}`);
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  for (const width of [320, 390, 600, 601, 768, 1440]) for (const language of ['en', 'fr']) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const runtimeErrors = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    // Keep QA local, even if an accidental external asset is introduced.
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    try {
      // A fresh session must permit direct project links before showing the homepage welcome.
      await page.goto(origin + '/projects/wordle');
      assert.equal(await page.locator('.ml-welcome').count(), 0);
      await page.goto(origin);
      assert.equal(await page.locator('.ml-welcome').count(), 1);
      assert.equal(await page.locator('nav').count(), 0);
      if ([320, 1440].includes(width) && language === 'en' && theme === 'light') {
        await page.screenshot({ path: `${output}/welcome-${width}.png`, fullPage: true });
      }
      await page.locator('.ml-enter').click();
      assert.equal(await page.locator('#top').evaluate(el => el === document.activeElement), true);
      await page.reload();
      assert.equal(await page.locator('.ml-welcome').count(), 0);
      await page.locator(`button[lang="${language}"]`).click();
      await page.locator('.ml-theme-switch button').nth(theme === 'light' ? 0 : 1).click();
      for (const path of ['/', '/#about', '/#skills', '/#education', '/#experience', '/#hobbies', '/#cv', '/#contact', '/projects', '/projects/wordle', '/missing-page']) {
        await page.goto(origin + path);
        await page.getByRole('heading', { level: 1 }).waitFor();
        const layout = await page.evaluate(() => ({
          width: innerWidth, scroll: document.documentElement.scrollWidth,
          lang: document.documentElement.lang, theme: document.documentElement.dataset.theme,
          h1: document.querySelectorAll('h1, h2[aria-level="1"]').length,
          surface: getComputedStyle(document.querySelector('.portfolio')).backgroundColor,
          brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
        }));
        assert.ok(layout.scroll <= layout.width + 1, `${width}/${language}/${theme}${path}: horizontal overflow ${layout.scroll}`);
        assert.equal(layout.lang, language); assert.equal(layout.theme, theme); assert.equal(layout.h1, 1);
        assert.deepEqual(layout.brokenImages, []);
        if (path === '/') {
          const cards = await page.locator('#work .ml-showcase-card').evaluateAll(elements => elements.map(el => {
            const box = el.getBoundingClientRect();
            const visual = el.querySelector('.ml-showcase-visual').getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height, visualHeight: visual.height };
          }));
          assert.equal(cards.length, 4);
          for (const card of cards) {
            assert.ok(Math.abs(card.width - cards[0].width) <= 1, 'Equal card widths');
            assert.ok(Math.abs(card.height - cards[0].height) <= 1, 'Equal card heights');
            assert.ok(Math.abs(card.visualHeight - cards[0].visualHeight) <= 1, 'Equal image heights');
          }
          assert.equal(new Set(cards.map(card => Math.round(card.x))).size, width <= 600 ? 1 : width <= 1000 ? 2 : 4);
          assert.equal(new Set(cards.map(card => Math.round(card.y))).size, width <= 600 ? 4 : width <= 1000 ? 2 : 1);
          assert.equal(await page.locator('.ml-placeholder a, a[href=""]').count(), 0);
        }
        if (path === '/projects') {
          assert.equal(await page.locator('.ml-project-link').count(), 0);
          assert.equal(await page.locator('.ml-projects-empty').textContent(), language === 'en' ? 'More projects coming soon' : 'D’autres projets arrivent bientôt');
        }
        if (path === '/') assert.equal(layout.surface, theme === 'dark' ? 'rgb(21, 21, 21)' : 'rgb(250, 250, 250)', 'Theme must change the rendered surface');
        const contrasts = await page.locator('.ml-dashboard-description, .ml-page-intro, .ml-showcase-kicker, .ml-background, .cv-unavailable, .detail-summary, .project-implementation dd, main.section-shell h1').evaluateAll(elements => {
          const rgb = value => value.match(/[\d.]+/g)?.map(Number);
          const luminance = c => c.slice(0,3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i], 0);
          return elements.map(el => {
            let parent = el, background;
            while (parent) {
              const candidate = rgb(getComputedStyle(parent).backgroundColor);
              if (candidate && (candidate.length === 3 || candidate[3] === 1)) { background = candidate; break; }
              parent = parent.parentElement;
            }
            const foreground = luminance(rgb(getComputedStyle(el).color));
            const back = luminance(background ?? [255,255,255]);
            return { text: el.textContent.trim().slice(0,50), ratio: (Math.max(foreground,back)+.05)/(Math.min(foreground,back)+.05) };
          });
        });
        for (const contrast of contrasts) assert.ok(contrast.ratio >= 4.5, `Low text contrast ${contrast.ratio.toFixed(2)}: ${contrast.text}`);
        if (['/', '/projects', '/projects/wordle'].includes(path) && [320, 768, 1440].includes(width) && ((language === 'en' && theme === 'light') || (language === 'fr' && theme === 'dark'))) {
          // Reveal scroll-driven sections before full-page capture (reduced motion is already enabled).
          await page.screenshot({ path: `${output}/${path === "/" ? "home" : path === "/projects" ? "projects" : "wordle"}-${width}-${language}-${theme}.png`, fullPage: true });
        }
        if (path === '/projects/wordle') {
          for (const button of await page.locator('.screenshot-options button').all()) {
            await button.click();
            await page.locator('.project-screenshots img').scrollIntoViewIfNeeded();
            await page.waitForFunction(() => {
              const img = document.querySelector('.project-screenshots img');
              return img?.complete && img.naturalWidth > 0;
            });
          }
          await page.goto(origin + path);
        }
        assert.equal(await page.getByRole('main').count(), 1, 'One exposed main landmark');
        assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1, 'One exposed primary heading');
        if (width === 390 && theme === 'light') {
          const snapshot = await page.getByRole('main').ariaSnapshot();
          if (path === '/') assert.equal(snapshot.split(homeCopy[language].introduction).length - 1, 1, 'Complete introduction must be exposed exactly once');
          await writeFile(`${output}/accessibility-${path === '/' ? 'home' : path === '/projects/wordle' ? 'wordle' : path === '/projects' ? 'projects' : '404'}-${language}.txt`, snapshot);
        }
        if (process.env.RAFISA_AXE_MODULE && [390, 1440].includes(width)) {
          await page.addScriptTag({ path: process.env.RAFISA_AXE_MODULE });
          const audit = await page.evaluate(async () => {
            const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
            return { violations: result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), incomplete: result.incomplete.map(v => v.id) };
          });
          assert.deepEqual(audit.violations, [], `Accessibility ${JSON.stringify(audit.violations)}`);
          layout.accessibility = audit;
        }
        if (!path.includes('#')) {
        await page.keyboard.press(engineName === 'webkit' ? 'Alt+Tab' : 'Tab');
        assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true, 'First link traversal must reach skip link');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.activeElement.id === 'top', undefined, { timeout: 3000 });
        } else {
          assert.equal(await page.evaluate(() => document.activeElement.id), path === '/#education' ? 'top' : path.split('#')[1]);
        }
        if (width <= 600) {
          await page.locator('.menu-toggle').click();
          assert.equal(await page.locator('#primary-navigation').isVisible(), true);
          await page.locator('#primary-navigation a').first().focus();
          await page.keyboard.press('Escape');
          await page.locator('#primary-navigation').waitFor({ state: 'hidden' });
          assert.equal(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement), true);
        }
        if (path === '/#cv' && width === 390) {
          layout.downloads = [];
          for (const [code, file] of Object.entries(cvDocuments)) {
            if (!file) continue;
            const [download] = await Promise.all([
              page.waitForEvent('download'), page.locator(`#cv a[hreflang="${code}"]`).click(),
            ]);
            assert.equal(download.suggestedFilename(), file.filename);
            assert.equal(await download.failure(), null);
            const bytes = await readFile(await download.path());
            assert.equal(bytes.length, file.bytes);
            assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
            assert.deepEqual(bytes, await readFile(new URL(`../public${file.href}`, import.meta.url)));
            layout.downloads.push({ language: code, filename: file.filename, bytes: bytes.length });
          }
        }
        results.push({ width, language, theme, path, ...layout, minimumSampledContrast: Math.min(...contrasts.map(item => item.ratio)) });
      }
      assert.deepEqual(runtimeErrors, []);
    } catch (error) {
      errors.push({ width, language, theme, message: error.message });
      await page.screenshot({ path: `${output}/failure-${width}-${language}-${theme}.png`, fullPage: true });
    } finally { await context.close(); }
  }
  // Approved intro: real timed stages, repeat entry, keyboard focus and scroll reset.
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    try {
      await page.goto(origin);
      for (let entry = 0; entry < 2; entry++) {
        await page.locator('.ml-enter').click();
        assert.equal(await page.locator('.ml-intro-phase-orbit').count(), 1);
        await page.locator('.ml-enter').dispatchEvent('click');
        assert.equal(await page.locator('.ml-enter').getAttribute('aria-disabled'), 'true');
        await page.locator('.ml-intro-phase-transition').waitFor();
        assert.equal(await page.locator('.ml-intro-grid').evaluate(el => el.inert), true);
        await page.locator('.ml-dashboard').waitFor();
        assert.equal(await page.evaluate(() => document.activeElement.id), 'top');
        assert.equal(await page.evaluate(() => scrollY), 0);
        assert.ok(await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().top >= 0));
        await page.locator('footer').scrollIntoViewIfNeeded();
        // Activate the actual Home link from a scrolled view.
        await page.locator('#primary-navigation a[href="/#top"]').evaluate(el => el.click());
        await page.waitForFunction(() => scrollY === 0);
        await page.locator('.ml-return-intro').click();
        await page.locator('.ml-intro-phase-ready').waitFor();
        assert.equal(await page.evaluate(() => document.activeElement.id), 'intro');
        assert.equal(await page.evaluate(() => scrollY), 0);
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.locator('.ml-enter').click();
      await page.locator('.ml-dashboard').waitFor();
      assert.equal(await page.locator('.ml-welcome').count(), 0);
      assert.equal(await page.evaluate(() => scrollY), 0);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'top');
      await page.goto(origin + '/#skills');
      await page.locator('.ml-showcase-skill-group li').first().hover();
      assert.equal(await page.locator('.ml-showcase-skill-group li').first().evaluate(el => getComputedStyle(el).transform), 'none');
      await page.goto(origin + '/#education');
      assert.equal(await page.locator('#education h2').evaluate(el => getComputedStyle(el).opacity), '1');
      assert.equal(await page.evaluate(() => scrollY), 0);
      results.push({ width, motion: 'normal-to-reduced', repeatEntry: true, homeScrollTop: true });
    } catch (error) { errors.push({ width, motion: true, message: error.message }); }
    finally { await context.close(); }
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ engine: engineName, browser: browser.version(), results, errors }, null, 2));
  console.log(`${engineName} ${browser.version()}: ${results.length} browser cases passed; ${errors.length} failures. Artifacts: ${output}`);
  assert.deepEqual(errors, []);
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
