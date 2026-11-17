import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/data/projects.js';
import { professional } from '../src/data/professional.js';
import { resources } from '../src/data/translations.js';
import { homeCopy } from '../src/data/homeCopy.js';
import { cvDocuments } from '../src/data/cv.js';
import { validateCvDocuments } from './check-cv.mjs';

const text = (value, field) => assert.ok(typeof value === 'string' && value.trim(), `Missing text: ${field}`);
const leaves = (object, prefix = '') => Object.fromEntries(Object.entries(object).flatMap(([key, value]) =>
  typeof value === 'object' && value !== null ? Object.entries(leaves(value, `${prefix}${key}.`)) : [[`${prefix}${key}`, value]]));
export function validateTranslations(copy = resources) {
  const english = leaves(copy.en.translation);
  const french = leaves(copy.fr.translation);
  assert.deepEqual(Object.keys(english).sort(), Object.keys(french).sort(), 'Translation keys must match');
  for (const key of Object.keys(english)) {
    text(english[key], `en.${key}`); text(french[key], `fr.${key}`);
    const tokens = value => [...value.matchAll(/{{\s*(\w+)\s*}}/g)].map(match => match[1]).sort();
    assert.deepEqual(tokens(english[key]), tokens(french[key]), `Interpolation differs: ${key}`);
  }
}
export function validateContent(projects = caseStudies, qualifications = professional, copy = resources) {
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length, 'Duplicate project slug');
  assert.equal(new Set(projects.map(project => project.number)).size, projects.length, 'Duplicate project number');
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(project.number, /^\d{2}$/);
    text(project.name, 'project name');
    assert.ok(project.stack.length > 0, 'Empty technology stack');
    project.stack.forEach(value => text(value, 'technology'));
    for (const href of [project.demo, project.github]) {
      if (href === null) continue;
      assert.equal(new URL(href).protocol, 'https:', 'Project links must use HTTPS');
    }
    assert.equal(project.features.en.length, project.features.fr.length, 'Feature translation count differs');
    for (const language of ['en', 'fr']) {
      text(project.summary[language], `${project.slug} summary`);
      project.features[language].forEach(value => text(value, 'feature'));
      text(copy[language].translation.portfolio.projects[project.number]?.desc, 'project list description');
      text(copy[language].translation.portfolio.projects[project.number]?.category, 'project category');
    }
    if (project.implementation) {
      assert.ok(project.implementation.length > 0, 'Empty implementation notes');
      assert.equal(new URL(project.evidence).protocol, 'https:', 'Implementation evidence required');
      for (const item of project.implementation) for (const language of ['en', 'fr']) {
        text(item.title[language], 'implementation title'); text(item.description[language], 'implementation description');
      }
    }
    for (const language of ['en', 'fr']) {
      const labels = (project.screenshots ?? []).map(shot => shot.label?.[language] ?? shot.view);
      assert.equal(new Set(labels).size, labels.length, 'Screenshot controls must have distinct labels');
    }
    for (const screenshot of project.screenshots ?? []) {
      assert.ok(screenshot.src.startsWith(`/projects/${project.slug}/`), 'Screenshot belongs to another project');
      assert.match(screenshot.src, /^\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.png$/);
      assert.match(screenshot.blob, /^[a-f0-9]{40}$/);
      assert.ok(Number.isSafeInteger(screenshot.width) && screenshot.width > 0);
      assert.ok(Number.isSafeInteger(screenshot.height) && screenshot.height > 0);
      assert.ok(['desktop', 'mobile'].includes(screenshot.view));
      for (const language of ['en', 'fr']) {
        text(screenshot.alt[language], 'screenshot alternative');
        if (screenshot.label) text(screenshot.label[language], 'screenshot selection label');
        if (screenshot.note) text(screenshot.note[language], 'screenshot provenance note');
      }
    }
  }
  for (const section of ['skills', 'education', 'softSkills']) {
    assert.equal(qualifications.en[section].length, qualifications.fr[section].length, `${section} translations differ`);
  }
  qualifications.en.education.forEach((item, index) => {
    assert.equal(item.period, qualifications.fr.education[index].period, 'Education periods differ');
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateTranslations();
  validateTranslations({ en: { translation: homeCopy.en }, fr: { translation: homeCopy.fr } });
  validateContent();
  await validateCvDocuments(cvDocuments);
  console.log('PASS: project/qualification structure, bilingual keys/interpolation and CV manifest. Content truth still requires owner/source review.');
}
