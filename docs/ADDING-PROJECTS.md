# Adding completed projects

`src/data/projects.js` is the source of truth. Keep `caseStudies` for real, completed projects approved for public presentation. Do not add placeholder entries or invented descriptions.

1. Add an object to `caseStudies` using Wordle’s structure: a unique two-digit `number`, URL-safe `slug`, real `name`, `stack`, bilingual `summary` and `features`, and actual HTTPS `github`/`demo` links (or null).
2. Add matching `portfolio.projects.<number>.category` and `desc` in both languages in `src/data/translations.js`. Optional `implementation` notes need bilingual titles/descriptions; `evidence` must point to the real source.
3. Add genuine screenshots under `public/projects/<slug>/`. Each screenshot needs `src`, `view` (`desktop` or `mobile`), positive `width`/`height`, a Git blob hash `blob`, and bilingual `alt`, `label`, and provenance `note`. Record sources in `SCREENSHOT-SOURCES.md` alongside the images. Compute a hash with:

   ```sh
   git hash-object --no-filters public/projects/<slug>/<image>.png
   ```

   Screenshots may be omitted or an empty array. Cards then show the project name and a screenshot-unavailable message. The card uses that project’s first desktop screenshot (or first image); failed images also fall back. Never reuse Wordle screenshots for another project.
4. Keep Wordle first and append completed projects in the intended display order. The homepage always has four cards: the first three catalog entries, with unused slots shown as non-clickable “Project 2 / Coming Soon” and “Project 3 / Coming Soon” cards, followed by “More Projects”. Temporary cards exist only in the UI and are automatically replaced as entries are added.
5. `/projects` lists all completed projects, including entries beyond the first three. With no entries it displays a bilingual empty message. Existing `/projects/<slug>` detail routes, adjacent navigation, and static metadata remain automatic; no router edits are needed.
6. Run `npm run verify`, `npm run test:preview`, and the existing browser checks (`npm run test:browser`, with `RAFISA_PLAYWRIGHT_MODULE` if Playwright is installed elsewhere). Check desktop/mobile, English/French, light/dark, screenshots, links, and clipboard feedback. Update the explicit Wordle-only catalog assertions when adding a real approved project; retain existing route and retired-project safety checks.

The homepage year is computed from the visitor’s current date. Contact keeps the existing mailto address and uses the browser clipboard API; denied/unavailable clipboard access gives manual-copy instructions. No backend, database, or additional dependency is required.
