# Browser verification

## Current gameplay batch 210–213

- Chromium 151.0.7922.34: 74 cases passed, zero failures; 24 axe audits passed with WCAG 2/2.1 A/AA tags.
- WebKit 26.5: 74 cases passed, zero failures. Each Wordle route case selects and loads all four genuine images, including desktop English-dictionary and mobile French-dictionary gameplay.
- Both languages/themes and six widths remain covered. Distinct bilingual selector labels prevent duplicate Desktop/Mobile names; DOM regression checks validate one pressed control, selection, image links, error retry and focus.
- Enlarged-text/forced-colors checks: 36 passed. Representative mobile light and desktop French dark portfolio captures are retained in `browser-qa-210/`; new original gameplay captures were also visually inspected.
- 46 Node tests, four Python tests, lint/build/content/CV/release/HTTP/diff checks pass. Screenshot originals total 181816 bytes; JS 125231 bytes gzip, CSS 5346 bytes gzip, within existing budgets.
- npm audit: zero known vulnerabilities. This query sends package names/versions, not portfolio files; it is not proof against unknown vulnerabilities.
- No Safari, Firefox, VoiceOver or physical-device pass is claimed. Their existing documented blockers were not bypassed or repeatedly retried without a changed condition. Previous Lighthouse reports describe the step-208 build; no new Lighthouse score is claimed for the larger gallery.
- The separate Wordle app ran only temporarily: genuine MySQL-backed UI gameplay, no mocks, no original repository/database changes, and all capture servers shut down. See SCREENSHOT-SOURCES.md and wordle-gameplay-evidence.json.



## Current session 200–208 — 2026-11-16

- Final production checks: 74 Chromium 151.0.7922.34 and 74 WebKit 26.5 cases; the matrix now includes missing pages at every width/language/theme combination, plus motion checks.
- Axe: 24 audits including WCAG 2 A/AA and 2.1 A/AA. Browser accessibility-tree assertions check one main landmark and primary heading; the typewriter's complete sentence is exposed exactly once. Bilingual snapshots are saved in `browser-qa-200/`. These do not certify spoken VoiceOver/NVDA output.
- Enlarged text/forced colors: 36 cases passed. Native browser zoom and physical devices remain distinct checks.
- Safari 27.0.1: driver session creation refused because “Allow remote automation” is disabled. No setting changed. Firefox 153.0: bounded windowed probe also failed with sandbox extension / GPU helper errors before loading any portfolio page. No unsafe workaround attempted; neither browser is claimed passed.
- All three public GitHub destinations returned HTTP 200 on this date: owner profile, Wordle repository and pinned README. Mailto is a local mail-client action, not proof of delivery.
- Local Lighthouse 12.8.2 found an accessible-name mismatch on the ML. wordmark and HTML fallback at robots.txt. Both were fixed and rechecked. The logo keeps its visible design; its name now includes “ML.”. The actual robots file is verified in build and HTTP checks.

Lighthouse results are recorded in `browser-qa-200/lighthouse-summary.json`. Full local reports are retained alongside it. These are localhost mobile lab runs, not field measurements or a promise of a score on another device/host. Rendering/unused-code/image-size suggestions remain optimization opportunities, not suppressed failures. No full accessibility certification is claimed.



Current batch results are below; the earlier Chromium record is retained as history.

## Batch 191–199 — 2026-11-16

- Chromium 151.0.7922.34: **50 passed**, including both genuine screenshot selections.
- WebKit 26.5: **50 passed**, same language/theme/width matrix and reduced-motion checks. macOS WebKit uses Option+Tab to reach links when ordinary Tab selects form controls. The test checks the same skip-link focus and Enter behavior; it does not skip keyboard assertions. This is engine testing, not Safari GUI certification.
- axe: **16 audits**, home/Wordle × 390/1440px × English/French × light/dark; zero WCAG 2 A/AA and 2.1 AA violations and zero incomplete rules. Automated checks cannot certify screen-reader usability or all WCAG criteria.
- Display stress: **36 passed**, home/Wordle/missing page × 320/768/1440px × English/French × forced colors or 200% root text size. Checks no document overflow and keyboard skip access. Text scaling is not native browser-UI zoom.
- Genuine Wordle sign-in screenshots load and switch in both engines. Mobile light and desktop French dark gallery captures were visually inspected.
- Firefox 153.0 was downloaded to the local Playwright cache without changing project dependencies. Startup stalled; a diagnostic retry reported `sandbox_extension_issue_file_to_process ... Operation not permitted` and `RenderCompositorSWGL failed mapping default framebuffer`. **Firefox is blocked, not passed.** No application test failure was hidden.

Evidence: `browser-qa-191/chromium-results.json`, `webkit-results.json`, `display-results.json` and two representative gallery PNGs. Original 188–190 evidence remains in `browser-qa/`.

### Current local commands

Build first. These optional tools use installations already on this Mac:

```sh
npm run build
RAFISA_PLAYWRIGHT_MODULE=/Users/michaelleigh/Developer/verilot/node_modules/playwright/index.mjs npm run test:browser
RAFISA_BROWSER_ENGINE=webkit RAFISA_PLAYWRIGHT_MODULE=/Users/michaelleigh/Developer/verilot/node_modules/playwright/index.mjs npm run test:browser
RAFISA_PLAYWRIGHT_MODULE=/Users/michaelleigh/Developer/verilot/node_modules/playwright/index.mjs RAFISA_AXE_MODULE=/Users/michaelleigh/Developer/alpine-clientflow/node_modules/axe-core/axe.min.js npm run test:browser
RAFISA_PLAYWRIGHT_MODULE=/Users/michaelleigh/Developer/verilot/node_modules/playwright/index.mjs node scripts/check-display.mjs
```

The browser engine may also be `firefox` once its runtime works. Default output is the OS temporary directory under `rafisa-browser-qa-<engine>`. No portfolio request may leave localhost. No new project dependency was added.

Still required: Safari GUI, working Firefox runtime, physical devices, VoiceOver/NVDA, native browser zoom, real CV download/opening, and field performance.

## Historical steps 188–190

Verified locally using **Chromium 149.0.7827.55**, headless Playwright already present in the Mac's npm cache. No portfolio dependency was installed. The connected in-app browser remained unavailable; the user explicitly permitted a browser automation framework, so an isolated local browser was used. All test browser requests were restricted to the local production preview origin.

## Passed

- **48 cases:** home and Wordle × widths 320, 390, 600, 601, 768, 1440px × English/French × light/dark.
- No document-level horizontal overflow, one h1, no detected broken images, correct language and persisted theme after navigation.
- Real Tab to the skip link and Enter to focus main; compact-menu open, Escape, hidden navigation and returned button focus.
- Actual computed homepage background in light and dark mode. This caught and led to repair of a specificity bug that DOM tests could not detect.
- Sampled small-label/body text contrast on home and Wordle. The pale-panel label ratio was initially 4.47:1; after a narrowly scoped color correction, the minimum sampled ratio is **4.85:1**. This is not a complete WCAG audit.
- **Two motion cases:** 390 and 1440px with normal motion, finite typewriter completion and stable reserved height, then live reduced-motion switching. Running animations stop, hovered skill transforms reset and education content remains visible.
- No captured JavaScript page errors in the route matrix.
- Representative full-page desktop/tablet/mobile captures inspected for typography, section spacing, wrapping, theme and Wordle presentation. No 3D project effect, portrait or scrolling slogan is present.

The initial browser harness asserted focus before React's navigation effect ran. It now waits for the expected focus state rather than making an immediate timing-dependent assertion; the focus requirement was not removed. Actual dark-mode and contrast failures were corrected in source before the successful run.

## Evidence

`docs/browser-qa/results.json` records all 50 successful cases and zero failures. Representative PNGs in that folder are screenshots of **this portfolio**, not screenshots of the Wordle application. They are documentation assets and are not shipped in `public/` or `dist/`.

## Re-run

Build first. Use an existing Playwright installation with its browser binaries:

```sh
npm run build
RAFISA_PLAYWRIGHT_MODULE=/Users/michaelleigh/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs npm run test:browser
```

That path is specific to this Mac's existing cache. On another machine, point `RAFISA_PLAYWRIGHT_MODULE` to an already installed Playwright `index.mjs`, or run in an environment where `playwright` resolves normally. The command does not install it automatically. `RAFISA_BROWSER_OUTPUT` optionally selects the artifact directory; by default artifacts go to a `rafisa-browser-qa` folder under the operating system's temporary directory. Local socket/browser permissions may be required.

The optional browser suite is separate from `npm run verify` so ordinary development does not acquire an unrequested browser dependency. Run it explicitly for visual/interactive changes when its prerequisites exist.

## Not certified

Physical devices, Safari/WebKit, Firefox, VoiceOver/NVDA, forced-colors mode, 200% browser zoom, all possible contrast pairs, real CV download/PDF opening and field performance metrics remain unverified. Headless width emulation is not a physical phone/tablet test. No deployment or external link uptime guarantee is implied.
