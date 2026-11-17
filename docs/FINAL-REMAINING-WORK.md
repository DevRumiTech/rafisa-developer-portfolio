# Essential remaining work — CVs completed

**216 mini-steps completed. Recommended revised total: 218**, replacing the previous arbitrary target of 250. The original 213 steps remain preserved in the progress history; steps 214–216 now cover actual CV creation and integration. No incomplete manual review is counted as done.

## Completed in this final session

- **214:** English two-page CV created from existing local CVs and verified portfolio facts, with editable JSON/HTML/layout sources. Rafisa explicitly ongoing, 19 October 2026 to scheduled end 14 January 2027. PDF pages rendered and visually inspected; selectable text, links and page bounds verified.
- **215:** Matching French two-page CV, with equivalent facts and reviewed French spelling/accents/layout. Earlier employment/qualifications retained; HESAV nursing studies explicitly unfinished. Wordle is the only featured project.
- **216:** Both genuine PDFs integrated as independently labelled English/French downloads available in either UI language. Manifest/header/size/MIME/byte checks, actual browser downloads and filename checks pass. Null/missing-file behavior remains covered; no placeholder documents.

The original source CVs are outside the project and unchanged. Provenance: `docs/cv/sources.json`. Editable sources and commands: `docs/cv/README.md`. The portfolio homepage/design/Wordle gallery remain preserved.

## Two essential unfinished steps

| Step | What remains | How to finish |
| --- | --- | --- |
| 217 | Focused hands-on accessibility/reliability review | In both languages, check keyboard navigation, screen-reader output, menu, both PDF links and mobile/native zoom. Use available Safari/Firefox/devices; record unavailable platforms honestly. Automated Chromium/WebKit/axe tests already pass, but do not certify spoken VoiceOver/NVDA output or physical devices. Fix any actual findings. |
| 218 | Owner final acceptance | Review both CVs against your originals, especially qualifications, earlier employment, language levels and the ongoing Rafisa wording. Review the new gallery and any minor visual corrections. After accepted corrections, rerun regressions and create the final accepted backup. |

Safari automation remains disabled; managed Firefox fails before loading the page with sandbox/GPU errors. Do not weaken system security to force a pass. Windows execution can be checked when the internship PC is available; transfer preparation is already complete.

## Removed from the active plan

No portfolio backend/database, admin dashboard, unnecessary features, undeveloped Rafisa projects, hosting/domain/Vercel/deployment or unassigned steps 219–250 are required. Future-project instructions remain reference material, not a requirement to create projects now. The static React portfolio needs no server-side application to run its contact/download features.

## Current delivery and verification

- English PDF: `public/cv/michael-leigh-cv-en.pdf`.
- French PDF: `public/cv/michael-leigh-cv-fr.pdf`.
- Editable source: `docs/cv/content.json`, `build.py` and generated English/French HTML.
- CV verifier: `docs/cv/verify.py`; four rendered pages inspected.
- Standard checks: `npm run verify`, `npm run test:preview`; Python archive tests: `python3 -m unittest discover -s tests -p '*_test.py'`.
- Browser evidence and limitations: `BROWSER-VERIFICATION.md`.
- Verified Desktop archive: `/Users/michaelleigh/Desktop/Rafisa-Portfolio-CVs-step-216.zip`.

All work remains local. No commits, pushes, PRs, deployments or document/portfolio uploads. Tool dependencies were downloaded into an isolated temporary Python environment, not added to the website.
