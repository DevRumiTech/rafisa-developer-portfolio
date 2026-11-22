import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { caseStudies } from '../src/data/projects.js';
import { getPageMetadata } from '../src/utils/pageMetadata.js';

// Static English head metadata for crawlers that do not run JavaScript.
// The React application still owns interactive content and language switching.
const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function page({ title, description, robots }) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
  for (const [attribute, name, content] of [
    ['name', 'description', description], ['name', 'robots', robots],
    ['property', 'og:title', title], ['property', 'og:description', description],
    ['name', 'twitter:title', title], ['name', 'twitter:description', description],
  ]) {
    const tag = new RegExp(`<meta ${attribute}="${name}" content="[^"]*"\\s*/?>`);
    if (!tag.test(html)) throw new Error(`Missing metadata template: ${name}`);
    html = html.replace(tag, () => `<meta ${attribute}="${name}" content="${escape(content)}" />`);
  }
  return html;
}
await writeFile(new URL('../dist/index.html', import.meta.url), page(getPageMetadata('/', 'en')));
await mkdir(new URL('../dist/projects/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/projects/index.html', import.meta.url), page(getPageMetadata('/projects', 'en')));
for (const project of caseStudies) {
  const directory = new URL(`../dist/projects/${project.slug}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  const fallback = `<section aria-label="${escape(project.name)}"><h2>${escape(project.name)}</h2>` +
    `<p lang="en">${escape(project.summary.en)}</p><p lang="fr">${escape(project.summary.fr)}</p>` +
    `<p>${project.demo ? `<a href="${escape(project.demo)}">Live demo / Démonstration</a> ` : ''}` +
    `${project.github ? `<a href="${escape(project.github)}">GitHub</a>` : ''}</p></section>`;
  await writeFile(new URL('index.html', directory), page(getPageMetadata(`/projects/${project.slug}`, "en")).replace('</noscript>', `${fallback}</noscript>`));
}
await writeFile(new URL('../dist/404.html', import.meta.url), page(getPageMetadata('/404.html', 'en')).replace('</noscript>',
  '<section><h2 lang="en">Page not found</h2><p lang="fr">Page introuvable</p><a href="/">Home / Accueil</a></section></noscript>'));
console.log(`Generated static metadata for ${caseStudies.length} project routes and 404.html.`);
