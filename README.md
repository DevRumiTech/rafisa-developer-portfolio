# Michael Leigh — Rafisa developer portfolio

One integrated homepage at `/`, based on the approved design, with English/French content, a bright default theme, dark mode and responsive navigation. **Wordle is the only featured project**, at `/projects/wordle`. `/design-preview` is retired and shows the not-found page.

## Run locally

Use Node **24.18.1** (see `.nvmrc`), then:

```sh
npm ci
npm run dev
```

Use the address printed by Vite. The current local server is `http://127.0.0.1:5173/`; do not append `/design-preview`. No backend or credentials are required.

## Verify

```sh
npm run verify
npm run test:preview
```

`verify` runs `npm test`, `npm run lint`, content validation, `npm run build`, generated-output checks and `git diff --check`. The preview test opens a loopback-only server and checks HTTP assets. Individual commands remain available. To inspect a production build, run `npm run preview` after building.

Tests cover bilingual themes/routes, navigation/focus, the Wordle catalog and source link, missing/retired routes, complete typewriter text, live reduced motion, professional information, CV availability and metadata. jsdom does not verify actual layout, paint, contrast or screen-reader behavior. Follow [frontend QA](docs/frontend-qa.md) in a real browser.

## Edit

- `src/pages/Home.jsx` and `src/styles/home.css`: integrated homepage and approved visual language.
- `src/data/homeCopy.js`: homepage English/French wording.
- `src/data/projects.js`: project catalog; [adding projects](docs/ADDING-PROJECTS.md) explains future internship additions.
- `src/data/professional.js`: existing skills and qualifications.
- `src/data/translations.js`: shared navigation, experience, project categories and interface copy.
- `src/components/SiteHeader.jsx`: shared accessible menu, language and saved appearance controls.
- `src/data/cv.js`: real-file manifest; verified English and French CV PDFs are available in public/cv/.

Contact opens the visitor's email application. The site does not send messages. No CV or screenshot is fabricated. The homepage Wordle visual is a typographic title; its detail page includes genuine local gameplay and sign-in screenshots with source hashes in docs/SCREENSHOT-SOURCES.md.

Build output has three HTML files: home, Wordle and 404. Project metadata is statically English, with bilingual no-JavaScript summaries; the application switches language at runtime. Hosting/domain decisions remain separate. Nothing here commits, pushes, uploads or deploys the project.

Read [manual handoff](docs/MANUAL-HANDOFF.md), [progress](docs/mini-steps.md), [content audit](docs/content-audit.md) and [deployment preparation](docs/DEPLOYMENT.md).

## Completed browser verification

An existing local Playwright installation ran 50 Chromium checks, including six viewport widths, English/French, light/dark, real keyboard controls and normal/reduced motion. See [browser evidence and rerun instructions](docs/BROWSER-VERIFICATION.md). `npm run test:browser` is optional and requires an existing Playwright installation; it does not download dependencies. Safari/Firefox and screen-reader checks remain outstanding. [Wordle source evidence](docs/WORDLE-EVIDENCE.md) supports the new bilingual implementation notes.

Current local acceptance plan and exact remaining steps: [FINAL-REMAINING-WORK.md](docs/FINAL-REMAINING-WORK.md). Portable archives can be checked without extraction using `python3 scripts/verify-portable.py /path/to/archive.zip` (Windows: `py`).
