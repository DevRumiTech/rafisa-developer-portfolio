import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { normalizeLanguage } from '../src/utils/language.js';
import { subscribeMedia } from '../src/utils/mediaQuery.js';
import { getPageMetadata } from '../src/utils/pageMetadata.js';
import { resources } from '../src/data/translations.js';
import { caseStudies } from '../src/data/projects.js';
import { professional } from '../src/data/professional.js';
import { validateCvDocuments } from '../scripts/check-cv.mjs';
import { validateContent, validateTranslations } from '../scripts/check-content.mjs';

test('language variants normalize to the two supported languages', () => {
  for (const value of ['fr', 'fr-CH', 'fr-FR', ' FR-ch ']) assert.equal(normalizeLanguage(value), 'fr');
  for (const value of ['en', 'en-US', 'de', 'french', null, undefined, '']) assert.equal(normalizeLanguage(value), 'en');
});
test('modern and legacy media subscriptions release the original callback', () => {
  for (const legacy of [false, true]) {
    let registered;
    let removed;
    const callback = () => {};
    const media = legacy ? { addListener: fn => { registered = fn; }, removeListener: fn => { removed = fn; } } :
      { addEventListener: (type, fn) => { assert.equal(type, 'change'); registered = fn; }, removeEventListener: (_, fn) => { removed = fn; } };
    subscribeMedia(media, callback)();
    assert.equal(registered, callback); assert.equal(removed, callback);
  }
  assert.doesNotThrow(() => subscribeMedia({}, () => {})());
});
test('CV guards accept unavailable entries and reject missing, remote and mislabeled files', async () => {
  await validateCvDocuments({ en: null, fr: null }, () => assert.fail('No file should be read'));
  await assert.rejects(validateCvDocuments({ en: { href: 'https://example.invalid/cv.pdf' }, fr: null }));
  await assert.rejects(validateCvDocuments({ en: { href: '/cv/../cv.pdf' }, fr: null }));
  const entry = { href: '/cv/owner-reviewed.pdf', filename: 'owner-reviewed.pdf', bytes: 20 };
  await assert.rejects(validateCvDocuments({ en: entry, fr: null }, async () => { throw new Error('Missing owner file'); }), /Missing owner file/);
  // A rejected text buffer is used; no PDF or fixture file is generated.
  await assert.rejects(validateCvDocuments({ en: entry, fr: null }, async () => Buffer.from('This is not a PDF.')), /not a PDF/);
});
test('content and translation checks reject broken catalog entries', () => {
  validateContent(); validateTranslations();
  const duplicate = structuredClone(caseStudies); duplicate.push(structuredClone(duplicate[0]));
  assert.throws(() => validateContent(duplicate), /Duplicate project slug/);
  const features = structuredClone(caseStudies); features[0].features.fr.pop();
  assert.throws(() => validateContent(features), /Feature translation count/);
  const periods = structuredClone(professional); periods.fr.education[0].period = 'changed';
  assert.throws(() => validateContent(caseStudies, periods), /periods differ/);
  const copy = structuredClone(resources); copy.fr.translation.portfolio.projectCount_one = 'Un projet';
  assert.throws(() => validateTranslations(copy), /Interpolation differs/);
});
test('multi-view galleries reject ambiguous or untranslated selection labels', () => {
  const duplicate = structuredClone(caseStudies);
  duplicate[0].screenshots[1].label.en = duplicate[0].screenshots[0].label.en;
  assert.throws(() => validateContent(duplicate), /distinct labels/);
  const untranslated = structuredClone(caseStudies);
  delete untranslated[0].screenshots[0].label.fr;
  assert.throws(() => validateContent(untranslated), /selection label/);
});
test('metadata distinguishes missing projects and pages in both languages', () => {
  assert.equal(getPageMetadata('/projects/no-such-project', 'fr-CH').title, 'Projet introuvable | Michael Leigh');
  assert.equal(getPageMetadata('/missing', 'en').title, 'Page not found | Michael Leigh');
  assert.equal(getPageMetadata('/projects/wordle/', 'fr').description, caseStudies.at(-1).summary.fr);
  assert.equal(getPageMetadata('/404.html', 'fr').robots, 'noindex, follow');
});
test('appearance initialization executes before the app with dark, invalid and blocked storage', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const saved of ['dark', 'light', 'invalid', 'blocked']) {
    const dom = new JSDOM(html, {
      url: 'http://localhost/', runScripts: 'dangerously',
      beforeParse(window) {
        window.Storage.prototype.getItem = () => { if (saved === 'blocked') throw Error('blocked'); return saved; };
      },
    });
    const theme = saved === 'dark' ? 'dark' : 'light';
    assert.equal(dom.window.document.documentElement.dataset.theme, theme);
    assert.equal(dom.window.document.documentElement.style.colorScheme, theme);
    assert.equal(dom.window.document.querySelector('meta[name="theme-color"]').content, theme === 'dark' ? '#151515' : '#FAFAFA');
    dom.window.close();
  }
});

test('homepage bilingual strings remain complete', async () => {
  const { homeCopy } = await import('../src/data/homeCopy.js');
  validateTranslations({ en: { translation: homeCopy.en }, fr: { translation: homeCopy.fr } });
});
