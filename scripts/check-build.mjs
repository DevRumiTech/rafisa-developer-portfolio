import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { cvDocuments } from '../src/data/cv.js';
import { validateCvDocuments } from './check-cv.mjs';
import { getPageMetadata } from '../src/utils/pageMetadata.js';
import { caseStudies } from '../src/data/projects.js';

// Check generated deliverables, rather than only source templates.
const initialAssets = new Set();
const files = ['index.html', 'projects/index.html', '404.html', ...caseStudies.map(project => `projects/${project.slug}/index.html`)];
for (const file of files) {
  const dom = new JSDOM(await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8'));
  const document = dom.window.document;
  const project = caseStudies.find(item => file === `projects/${item.slug}/index.html`);
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
  assert.equal(document.querySelector('meta[name="robots"]').content, file === '404.html' ? 'noindex, follow' : 'index, follow');
  const expectedMetadata = getPageMetadata(project ? `/projects/${project.slug}` : file === '404.html' ? '/404.html' : file === 'projects/index.html' ? '/projects' : '/', 'en');
  assert.equal(document.title, expectedMetadata.title);
  for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    assert.equal(document.querySelector(selector).content, expectedMetadata.description);
  }
  if (file === '404.html') {
    assert.ok(document.querySelector('noscript a[href="/"]'));
    assert.ok(document.querySelector('noscript').textContent.includes('Page introuvable'));
  }
  if (project) {
    assert.equal(document.title, `${project.name} | Michael Leigh`);
    assert.equal(document.querySelector('meta[name="description"]').content, project.summary.en);
    assert.equal(document.querySelector('meta[property="og:title"]').content, document.title);
    assert.equal(document.querySelector('meta[name="twitter:description"]').content, project.summary.en);
    assert.ok(document.querySelector('noscript').textContent.includes(project.summary.en));
    assert.ok(document.querySelector('noscript').textContent.includes(project.summary.fr));
    for (const href of [project.demo, project.github].filter(Boolean)) assert.ok(document.querySelector(`noscript a[href="${href}"]`));
  }
  for (const element of document.querySelectorAll('script[src], link[href]')) {
    const path = element.getAttribute('src') ?? element.getAttribute('href');
    if (path.startsWith('/')) await access(new URL(`../dist${path}`, import.meta.url));
    if (file === 'index.html' && /^\/assets\/.*\.(js|css)$/.test(path)) initialAssets.add(path);
  }
  assert.ok(document.querySelector('noscript a[href="mailto:rumi6864@gmail.com"]'));
  dom.window.close();
}
let screenshotBytes = 0;
for (const project of caseStudies) {
  for (const screenshot of project.screenshots ?? []) {
    const bytes = await readFile(new URL(`../dist${screenshot.src}`, import.meta.url));
    assert.equal(bytes.readUInt32BE(16), screenshot.width);
    assert.equal(bytes.readUInt32BE(20), screenshot.height);
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), screenshot.blob, 'Built screenshot differs from its verified source');
    screenshotBytes += bytes.length;
  }
}
console.log(`PASS: ${files.length} built HTML files, metadata, bundled references, fallback links and screenshot assets.`);

await validateCvDocuments(cvDocuments, url => readFile(new URL(url.href.replace('/public/', '/dist/'))));
let scriptGzip = 0;
let styleGzip = 0;
for (const asset of initialAssets) {
  const bytes = await readFile(new URL(`../dist${asset}`, import.meta.url));
  if (asset.endsWith('.js')) scriptGzip += gzipSync(bytes).length;
  else styleGzip += gzipSync(bytes).length;
}
// Regression ceilings, not Lighthouse scores or measured transfer speed.
assert.ok(scriptGzip <= 150 * 1024, `Initial JS exceeds 150 KiB gzip: ${scriptGzip}`);
assert.ok(styleGzip <= 8 * 1024, `Initial CSS exceeds 8 KiB gzip: ${styleGzip}`);
assert.ok(screenshotBytes <= 1024 * 1024, `Screenshots exceed 1 MiB: ${screenshotBytes}`);
console.log(`Size checks: JS ${scriptGzip} B gzip; CSS ${styleGzip} B gzip; screenshots ${screenshotBytes} B. Verified copied source hashes and CV assets.`);

// Retired portfolio pages/assets must not leak into a release through stale files.
for (const path of ['design-preview', 'images/michael-leigh-portrait.webp',
  ...['alpine-clientflow', 'verilot', 'rumipay', 'sql-ops-dashboard'].map(slug => `projects/${slug}`)]) {
  await assert.rejects(access(new URL(`../dist/${path}`, import.meta.url)), { code: 'ENOENT' });
}
const bundleText = (await Promise.all([...initialAssets].filter(path => path.endsWith('.js'))
  .map(path => readFile(new URL(`../dist${path}`, import.meta.url), 'utf8')))).join('\n');
for (const text of ['Alpine ClientFlow', 'VeriLot', 'RumiPay', 'SQL Ops Dashboard', 'michael-leigh-portrait', 'GOOD IDEAS DESERVE WORKING CODE']) {
  assert.ok(!bundleText.includes(text), `Retired content in production bundle: ${text}`);
}
assert.ok(bundleText.includes('https://github.com/DevRumiTech/wordle-project'));
console.log('PASS: Wordle source link included; retired project pages, content, preview and portrait excluded.');

const { checkReleaseFiles } = await import('./check-release-files.mjs');
await checkReleaseFiles();

assert.equal(await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8'), 'User-agent: *\nAllow: /\n');
