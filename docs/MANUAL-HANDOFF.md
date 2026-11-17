# Rafisa portfolio — current manual handoff

**216 steps completed. Recommended revised total: 218.** Next: **217 — focused hands-on accessibility/reliability review**, then **218 — owner final acceptance**. The 250 target was unassigned capacity, not a requirement for unnecessary features. Historical progress remains in mini-steps.md.

## Project and current behavior

Project: `/Users/michaelleigh/Projects/rafisa-developer-portfolio`.

Run `npm run dev` and open the printed localhost URL (usually http://127.0.0.1:5173/). Only `/` is the homepage. Wordle details are at `/projects/wordle`; `/design-preview` and retired projects intentionally show the missing-page UI.

The approved bright navy/teal design, optional dark mode, English/French switching, typography, subtle/reduced-motion animations and original professional information remain. No photograph or extra project was added. Wordle has two real gameplay and two sign-in captures with provenance/hashes. Email opens a mail client and never claims delivery.

Both CVs now exist: `public/cv/michael-leigh-cv-en.pdf` and `michael-leigh-cv-fr.pdf`. Each has two A4 pages. Both downloads are independently available in either website language with explicit labels, real filenames and sizes. Their source CVs were found outside the project; original files remain unchanged. Rafisa is marked ongoing from 19 October 2026, scheduled end 14 January 2027. Unfinished HESAV nursing studies are not presented as a degree.

Editable sources: `docs/cv/content.json`, `docs/cv/build.py`, and generated HTML in the same folder. Read docs/cv/README.md before regeneration. The PDF tool environment is separate from the React project. Only final PDFs are public assets; source documents are local documentation.

## Important files

- `src/pages/Home.jsx`, `src/styles/home.css`: approved homepage.
- `src/data/homeCopy.js`, `src/data/translations.js`, `src/data/professional.js`: bilingual content and professional facts.
- `src/data/projects.js`: Wordle catalog; future procedure in ADDING-PROJECTS.md, without placeholder entries.
- `src/components/ProjectScreenshots.jsx`: bilingual selector labels, image handling and retry focus.
- `src/data/cv.js`, `src/components/CvDownload.jsx`: real PDF manifest and independent downloads.
- `src/components/SiteHeader.jsx`, `AppearanceProvider.jsx`, `TypedSentence.jsx`, `RouteEffects.jsx`, `AppRecovery.jsx`: navigation, appearance, motion and recovery.
- `scripts/`: content/CV/build/release/HTTP/browser checks and portable archive tools.
- `tests/`: Node/jsdom interaction/content tests and Python archive tests.
- `.git/`: local history. Existing uncommitted/untracked changes are intentional; do not reset them.

## Commands

Use Node 24 (`.nvmrc` records 24.18.1). React 19, React Router 7, i18next, lucide-react/react-icons, Vite, oxlint and jsdom are locked in package-lock.json. No portfolio backend/database is required.

```sh
npm ci
npm run dev
npm run verify
npm run test:preview
python3 -m unittest discover -s tests -p '*_test.py'
```

`verify` runs tests, lint, content/CV checks, build, generated-output/release checks and git diff --check. Edit source rather than dist. Optional browser commands/prerequisites are in BROWSER-VERIFICATION.md. CV generation/verification requires the isolated Python tools described in docs/cv/README.md, not extra npm dependencies.

## Verification and remaining limits

Node tests: 46 passes; Python archive tests: four passes. Lint/build/content/assets/HTTP/diff checks pass. Both PDFs parse as two-page unencrypted documents, preserve the editable source text, have working embedded contact links and pass text-bound checks. All four pages were visually inspected. No PDF/UA certification is claimed.

Chromium/WebKit production checks include both CV downloads from both UI languages/themes, suggested filenames and exact byte comparisons. See the current browser report for completed counts. Safari automation is disabled; managed Firefox fails during startup. Neither is claimed passed. VoiceOver/NVDA, physical devices/native zoom and Windows execution still require hands-on access. Previous Lighthouse scores apply to earlier builds; no new score is claimed for these PDFs.

The original design/content was already approved. Final acceptance now concerns the newly generated CVs, new gallery and any actual findings from manual checks. Exact reduced scope: FINAL-REMAINING-WORK.md. No hosting/deployment, backend/admin or undeveloped projects remain on the active plan.

## Backup and Windows transfer

Current verified archive: `/Users/michaelleigh/Desktop/Rafisa-Portfolio-CVs-step-216.zip`. Pre-session recovery: `/private/tmp/Rafisa-before-cv-final-review.zip`. Older Desktop ZIPs remain unchanged.

The current ZIP includes source, CV PDFs/editable data, documentation, uncommitted/untracked work and Git history. It excludes dependencies, generated builds, caches and credentials. Archive-only Git configuration strips remotes/hooks; the working configuration is unchanged. CRC/per-file hashes and a separately extracted Git HEAD/history/status are checked.

1. Copy the ZIP by USB/external disk outside cloud-synced folders.
2. Install Node 24, Git, Python 3 and an editor on Windows; extract to `C:\Projects\rafisa-developer-portfolio`, including `.git`.
3. Run `py scripts/verify-portable.py C:\path\Rafisa-Portfolio-CVs-step-216.zip`. This is a corruption/path check, not a digital signature; compare the archive hash separately if needed.
4. Run `git status --short`, `npm ci`, `npm run verify`, `npm run test:preview`, and `py -m unittest discover -s tests -p "*_test.py"`. Never copy Mac node_modules. If npm.ps1 is blocked, use npm.cmd or Command Prompt.
5. Run `npm run dev` and check the printed URL. No commit/push/deployment is authorized.

## Continue with ChatGPT

> Continue my local Rafisa portfolio after step 216. Recommended revised total is 218; only manual accessibility/reliability review and final acceptance remain. Read MANUAL-HANDOFF.md and FINAL-REMAINING-WORK.md. The approved homepage and genuine Wordle gallery must remain. Both real bilingual CV PDFs and editable sources exist under public/cv and docs/cv. Help me review them and fix specific findings. No commits, pushes, uploads, deployment, backend, admin dashboard or invented facts.

Provide relevant files and exact errors in a normal ChatGPT conversation; it cannot automatically inspect your Mac. Do not share credentials.
