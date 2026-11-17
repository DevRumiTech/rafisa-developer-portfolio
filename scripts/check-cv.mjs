import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { cvDocuments } from '../src/data/cv.js';

export async function validateCvDocuments(documents, read = readFile) {
  assert.deepEqual(Object.keys(documents).sort(), ['en', 'fr']);
  for (const [language, document] of Object.entries(documents)) {
    if (document === null) continue;
    assert.ok(/^\/cv\/[a-zA-Z0-9_-]+\.pdf$/.test(document.href), `${language}: use a local /cv/*.pdf path`);
    assert.equal(document.filename, document.href.split('/').at(-1), `${language}: download filename mismatch`);
    assert.ok(Number.isSafeInteger(document.bytes) && document.bytes > 0, `${language}: actual byte size required`);
    const bytes = await read(new URL(`../public${document.href}`, import.meta.url));
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', `${language}: file is not a PDF`);
    assert.equal(bytes.length, document.bytes, `${language}: recorded size does not match the file`);
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await validateCvDocuments(cvDocuments);
  console.log('CV manifest valid. Available documents:', Object.entries(cvDocuments).filter(([, value]) => value).map(([key]) => key).join(', ') || 'none (awaiting genuine files)');
}
