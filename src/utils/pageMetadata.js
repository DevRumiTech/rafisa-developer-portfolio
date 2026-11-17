import { caseStudies } from '../data/projects.js';
import { resources } from '../data/translations.js';
import { normalizeLanguage } from './language.js';

export function getPageMetadata(pathname, requestedLanguage) {
  const language = normalizeLanguage(requestedLanguage);
  const copy = resources[language].translation.portfolio;
  const match = /^\/projects\/([^/]+)\/?$/i.exec(pathname);
  let slug;
  try { slug = decodeURIComponent(match?.[1] ?? '').toLowerCase(); } catch { slug = ''; }
  const project = caseStudies.find(item => item.slug === slug);
  const missing = pathname !== '/' && !project;
  const missingTitle = match ? copy.missingProject : copy.missingPage;
  return {
    title: project ? `${project.name} | Michael Leigh` :
      missing ? `${missingTitle} | Michael Leigh` : `Michael Leigh | ${copy.role}`,
    description: project ? project.summary[language] : missing ? missingTitle : copy.intro,
    robots: missing ? 'noindex, follow' : 'index, follow',
    locale: language === 'fr' ? 'fr_CH' : 'en_GB',
  };
}
