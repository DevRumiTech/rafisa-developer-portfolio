// Optional local display/accessibility stress checks; uses existing Playwright and axe installations.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { preview } from 'vite';
const { chromium } = await import(process.env.RAFISA_PLAYWRIGHT_MODULE ? pathToFileURL(process.env.RAFISA_PLAYWRIGHT_MODULE).href : 'playwright');
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
let browser;
const results = [];
try {
  browser = await chromium.launch();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  for (const width of [320, 768, 1440]) for (const language of ['en', 'fr']) for (const mode of ['large-text', 'forced-colors']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', forcedColors: mode === 'forced-colors' ? 'active' : 'none' });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    try {
      await page.goto(origin);
      await page.locator(`button[lang="${language}"]`).click();
      for (const path of ['/', '/projects/wordle', '/missing-page']) {
        await page.goto(origin + path);
        await page.locator('h1').waitFor();
        // Text scaling tests CSS rem behavior; not a claim of browser UI zoom.
        if (mode === 'large-text') await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}/${language}/${mode}${path}: overflow`);
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.activeElement.id === 'top');
        assert.equal(await page.locator('h1').isVisible(), true);
        if (mode === 'forced-colors') assert.ok(await page.evaluate(() => matchMedia('(forced-colors: active)').matches));
        results.push({ width, language, mode, path });
      }
    } finally { await context.close(); }
  }
  const output = join(tmpdir(), 'rafisa-display-results.json');
  await writeFile(output, JSON.stringify({ browser: browser.version(), results }, null, 2));
  console.log(`PASS ${results.length} display stress cases: ${output}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
