import assert from 'node:assert/strict';
import { preview } from 'vite';
import { JSDOM } from 'jsdom';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { cvDocuments } from '../src/data/cv.js';
import { caseStudies } from '../src/data/projects.js';

// Loopback only: checks static serving, not a deployment or browser layout.
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
try {
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const get = async path => {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200, path);
    return response;
  };
  const robots = await get('/robots.txt');
  assert.ok(robots.headers.get('content-type').includes('text/plain'));
  assert.equal(await robots.text(), 'User-agent: *\nAllow: /\n');
  const assets = new Set(['/monogram.svg', '/logos/rafisa.png', '/logos/gaea21.png']);
  for (const path of ['/', '/404.html', ...caseStudies.map(p => `/projects/${p.slug}/`)]) {
    const response = await get(path);
    assert.ok(response.headers.get('content-type').includes('text/html'));
    const dom = new JSDOM(await response.text());
    const doc = dom.window.document;
    const project = caseStudies.find(p => path === `/projects/${p.slug}/`);
    if (project) assert.equal(doc.title, `${project.name} | Michael Leigh`);
    if (path === '/404.html') assert.equal(doc.querySelector('meta[name="robots"]').content, 'noindex, follow');
    for (const item of doc.querySelectorAll('script[src], link[href]')) {
      const url = item.getAttribute('src') ?? item.getAttribute('href');
      if (url.startsWith('/')) assets.add(url);
    }
    dom.window.close();
  }
  for (const asset of assets) {
    const response = await get(asset);
    assert.ok(!response.headers.get('content-type').includes('text/html'), `${asset} incorrectly fell back to HTML`);
    await response.arrayBuffer();
  }
  for (const project of caseStudies) for (const shot of project.screenshots ?? []) {
    const response = await get(shot.src);
    assert.ok(response.headers.get('content-type').includes('image/png'));
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), shot.blob);
  }
  for (const document of Object.values(cvDocuments).filter(Boolean)) {
    const response = await get(document.href);
    assert.ok(response.headers.get('content-type').includes('application/pdf'));
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.length, document.bytes);
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    assert.deepEqual(bytes, await readFile(new URL(`../public${document.href}`, import.meta.url)));
  }
  console.log(`PASS: loopback HTTP serving for ${caseStudies.length + 2} HTML routes, bundled assets, logos and configured screenshots. Hosting 404 status still requires future configuration.`);
} finally { await new Promise(resolve => server.httpServer.close(resolve)); }
