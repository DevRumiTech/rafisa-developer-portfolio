import { projectCopy } from '../data/projectCopy.js';
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
  const listing = /^\/projects\/?$/.test(pathname);
  const missing = pathname !== '/' && !project && !listing;
  const missingTitle = match ? copy.missingProject : copy.missingPage;
  return {
    title: listing ? `${projectCopy[language].more} | Michael Leigh` : project ? `${project.name} | Michael Leigh` :
      missing ? `${missingTitle} | Michael Leigh` : `Michael Leigh | ${copy.role}`,
    description: listing ? projectCopy[language].browse : project ? project.summary[language] : missing ? missingTitle : copy.intro,
    robots: missing ? 'noindex, follow' : 'index, follow',
    locale: language === 'fr' ? 'fr_CH' : 'en_GB',
  };
}
