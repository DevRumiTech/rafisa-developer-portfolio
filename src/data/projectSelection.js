import { caseStudies } from './projects.js';

// One boundary keeps completed cards exclusive to their listing, without duplicating detail routes.
export function selectProjects(projects = caseStudies) {
  return { featured: projects.slice(0, 3), additional: projects.slice(3) };
}

// TODO: Replace these UI-only samples by appending real completed entries to caseStudies
// in projects.js: bilingual descriptions, actual stack, original screenshots and valid URLs.
// Empty link fields are intentional; samples never receive links or detail routes.
export const temporaryProject = {
  github: '', demo: '',
  // TODO: Replace sample technology labels with the verified stack in the completed entry.
  stack: ['React', 'Node.js'],
  // TODO: Replace the temporary description with what the completed project actually does.
  summary: {
    en: 'Sample project preview. The real description and features will be added when this project is ready.',
    fr: 'Aperçu de projet provisoire. La description et les fonctionnalités réelles seront ajoutées lorsque le projet sera prêt.',
  },
};
