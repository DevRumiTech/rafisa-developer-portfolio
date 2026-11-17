# Wordle evidence review

Read-only review: 16 November 2026. Repository: [DevRumiTech/wordle-project](https://github.com/DevRumiTech/wordle-project), public and reachable. Default branch: `master`. Pinned reviewed commit: **48b414bdb0ad65c892f09fdf3b7b25c6f32f0d5e**.

| Portfolio information | Reviewed evidence |
| --- | --- |
| React, Node.js/Express, MySQL; accounts; English/French dictionaries; saved history/statistics | [README](https://github.com/DevRumiTech/wordle-project/blob/48b414bdb0ad65c892f09fdf3b7b25c6f32f0d5e/README.md) |
| Five-letter guesses, six attempts, two-pass repeated-letter feedback and backend scoring | [backend/services/wordle.js](https://github.com/DevRumiTech/wordle-project/blob/48b414bdb0ad65c892f09fdf3b7b25c6f32f0d5e/backend/services/wordle.js) |
| Personal game history and statistics displayed through API calls | [frontend/src/game/GameHistory.jsx](https://github.com/DevRumiTech/wordle-project/blob/48b414bdb0ad65c892f09fdf3b7b25c6f32f0d5e/frontend/src/game/GameHistory.jsx) |

The implementation notes summarize these sources in English/French. This review did not run the Wordle backend, inspect private databases or certify its security. No repository files were changed, and no portfolio files were uploaded.

The complete repository tree contained no genuine application screenshots. Its `hero.png`, React/Vite SVGs and icons are starter/interface assets, not evidence of the running Wordle application. No screenshots were imported and no demo URL was invented. Supply original screenshots from the running project, with confirmation they show non-sensitive data, if visual case-study evidence is desired.

## Local capture follow-up, 2026-11-16

Two genuine sign-in captures are now integrated. They came from the existing local application, not the pinned repository tree above. See `SCREENSHOT-SOURCES.md` and `wordle-capture-source-manifest.json` for provenance and limitations. No gameplay or database operation is claimed verified by these images.

## Gameplay follow-up

Step 210 adds genuine desktop English-dictionary and mobile French-dictionary gameplay from an unmodified temporary source copy backed by isolated MySQL. Actual guesses were submitted through the UI; feedback was not mocked. See SCREENSHOT-SOURCES.md and wordle-gameplay-evidence.json. These test sessions do not create a public demo or establish production readiness of the separate Wordle application.
