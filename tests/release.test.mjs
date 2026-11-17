import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateReleasePaths } from '../scripts/check-release-files.mjs';

test('release excludes accidental source, credential, map and archive files', () => {
  validateReleasePaths(['index.html', '404.html', 'assets/index-Ab123.js', 'assets/index-Ab123.css', 'projects/wordle/signin-mobile.png']);
  for (const path of ['.env', '.git/config', 'backup.zip', 'assets/index.js.map', 'docs/MANUAL-HANDOFF.md', 'src/App.jsx', 'cv/unapproved.pdf']) {
    assert.throws(() => validateReleasePaths([path]), /Unexpected public release file/);
  }
});
test('only manifest-approved CV paths enter a release', () => {
  const documents = { en: { href: '/cv/approved-en.pdf' }, fr: null };
  validateReleasePaths(['cv/approved-en.pdf'], [], documents);
  assert.throws(() => validateReleasePaths(['cv/approved-fr.pdf'], [], documents));
});
