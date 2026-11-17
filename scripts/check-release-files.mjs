import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { caseStudies } from '../src/data/projects.js';
import { cvDocuments } from '../src/data/cv.js';

// Fail closed if public/ accidentally contributes backups, source maps or private files.
export function validateReleasePaths(paths, projects = caseStudies, documents = cvDocuments) {
  const allowed = new Set(['index.html', '404.html', 'monogram.svg', 'robots.txt', 'logos/rafisa.png', 'logos/gaea21.png', 'images/portfolio-headshot-transparent.webp']);
  for (const project of projects) {
    allowed.add(`projects/${project.slug}/index.html`);
    for (const shot of project.screenshots ?? []) allowed.add(shot.src.slice(1));
  }
  for (const doc of Object.values(documents)) if (doc) allowed.add(doc.href.slice(1));
  for (const path of paths) {
    assert.ok(allowed.has(path) || /^assets\/[\w-]+\.(?:js|css)$/.test(path), `Unexpected public release file: ${path}`);
  }
}
export async function checkReleaseFiles(root = new URL('../dist/', import.meta.url)) {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const { relative } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const base = fileURLToPath(root);
  const paths = [];
  for (const entry of entries) {
    assert.ok(!entry.isSymbolicLink(), 'Release must not contain symbolic links');
    if (entry.isFile()) paths.push(relative(base, `${entry.parentPath}/${entry.name}`).split('\\').join('/'));
  }
  validateReleasePaths(paths);
  console.log(`PASS: ${paths.length} release files match the explicit public asset list.`);
}
