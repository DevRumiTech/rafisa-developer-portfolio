# Add a future verified Rafisa project

Only Wordle is currently published in this local portfolio. Do not create empty internship project cards or claim unfinished work.

1. Confirm the project can be shown publicly. Get approval for any internship/client information. Record the real name, technologies, implemented features and available source/demo links.
2. Back up the project locally. Add an object to `caseStudies` in `src/data/projects.js`, using Wordle's shape: unique two-digit `number`, unique URL-safe `slug`, `name`, actual `stack`, `github`/`demo` (HTTPS or null), English/French `summary` and equally complete English/French `features`.
3. Add the same number under `portfolio.projects` in both languages in `src/data/translations.js`, with `category` and `desc`. Do not reuse Wordle's number.
4. The homepage, detail routing and static metadata generator discover catalog entries automatically. Adjacent-project navigation appears when more than one project exists. No router edit or second homepage is needed.
5. Screenshots are optional. Only add inspected genuine original PNGs under `public/projects/<slug>/`. Follow the `ProjectScreenshots` data fields: `view`, `src`, `width`, `height`, Git blob content hash `blob`, bilingual `alt`, bilingual `note` for provenance and a distinct bilingual `label` for each selector. Record the actual source identity (pinned commit when available, otherwise a source SHA-256 manifest) and image hash in `SCREENSHOT-SOURCES.md`. The homepage uses an honest typographic project visual; galleries appear on the detail page. Never substitute an AI-generated image for evidence.
6. Run `npm run verify` and `npm run test:preview`. The current Wordle-only regression deliberately asserts one project and excludes the retired projects; revise that explicit product expectation only when a new project is actually approved. Do not delete failing tests wholesale. Update tests to cover both existing Wordle and the new project, including links and translations.
7. Open both pages in both languages/themes on mobile and desktop. Record verification in `mini-steps.md` only after it passes.

No backend, GitHub upload or deployment is needed to add a local catalog entry.

Optional `implementation` notes can be added using bilingual `title` and `description` fields, with an HTTPS `evidence` link to the verified source. Validation checks both languages. Omit `screenshots` or use an empty array until genuine images exist; both states are supported without a gallery or broken section link.

## When the next two internship projects are ready

Add each only after it exists and is approved for public presentation. Use new unique numbers such as 02 and 03, not reserved cards in the live catalog. The actual names/slugs/descriptions must come from that work; there are deliberately no placeholder entries.

The source of truth is `caseStudies`. Home.jsx maps it into project links; ProjectDetail.jsx looks up the slug; build-route-metadata.mjs creates each static detail HTML file; check-release-files.mjs derives allowed pages/screenshots from the same catalog. This means genuine new screenshots do not need a hardcoded release-file exception. Keep the existing Wordle data and images.

For screenshots, put original PNG files in `public/projects/<actual-slug>/`. Supply positive pixel width/height, a 40-character Git blob hash, `view: 'desktop'` or `'mobile'`, and accurate `alt`, `note`, `label` objects containing both `en` and `fr`. Different images sharing a viewport need different labels (for example, the existing Wordle gameplay and sign-in controls). The gallery opens its first image by default; arrange images intentionally. Missing galleries may be omitted or left empty.

Compute the content hash without staging or committing:

```sh
git hash-object --no-filters public/projects/<actual-slug>/<actual-image>.png
```

Use actual PNG dimensions from an image inspector. `npm run test:build` verifies both dimensions and copied bytes. A content hash proves byte identity, not authorship or correspondence to an upstream Git commit.

The current tests intentionally enforce Wordle-only scope. When the owner approves another project, update that exact catalog expectation and add coverage for the new page, bilingual copy and previous/next boundaries; keep removal checks for the four explicitly retired projects. Do not disable the safety checks or remove old Wordle assertions to make a failure disappear.

Verification order: `npm run check:content`, `npm run verify`, `npm run test:preview`, then browser tests plus direct navigation to each new route in both languages/themes. Expand the browser route list in `scripts/check-browser.mjs` when adding projects; it currently checks the approved home, Wordle and missing-page routes. No router rewrite, backend, deployment or GitHub operation is needed.
