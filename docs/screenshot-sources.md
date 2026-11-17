# Wordle screenshot provenance

Current gallery: two genuine gameplay captures followed by two preserved sign-in captures. Gameplay source/setup/hash evidence is in the step-210 section below.

## Preserved sign-in captures

Captured locally on 2026-11-16 from the existing application at `/Users/michaelleigh/Desktop/Rafisa-Internship/Rafisa-Project 1/wordle-project-master`.

These are genuine empty English sign-in screens, not gameplay, mockups or generated images. The original React frontend and Express application factory ran unchanged on isolated localhost servers. Sessions used temporary memory storage; no database was connected, no accounts were created and no form was submitted. The real unauthenticated `/api/auth/me` route returned 401. Only local GET requests were permitted. Chromium 151.0.7922.34 captured the original viewport without editing the images. Both captures were visually inspected for private information.

The local source has no `.git` directory; correspondence to a remote commit is not asserted. `wordle-capture-source-manifest.json` records SHA-256 hashes of the actual source used, verified unchanged after capture. The separately reviewed public repository remains https://github.com/DevRumiTech/wordle-project. Its pinned source review is in `WORDLE-EVIDENCE.md`.

| Original/public file | Dimensions | Git blob SHA-1 | SHA-256 |
| --- | --- | --- | --- |
| `public/projects/wordle/signin-desktop.png` | 1440 × 1000 | `2fe4cd2a43cfbcf829de734d66605ab6b65f3fcf` | `3eef28bd0e1d1ae7a08bc7f971832c6688390238ce78564e49bd40edfcaa0312` |
| `public/projects/wordle/signin-mobile.png` | 390 × 844 | `fe93477b0e8b04080006407d95307f314a54b176` | `58614f4aa94c9d0af68c3e92432f2c44dd3cde94fc1a5fc1797cc90068e4ad1b` |

The catalog stores content hashes and bilingual alternative text/provenance notes. Build and HTTP checks verify the published bytes. These hashes identify captured files; they are not claimed to be objects in the remote repository. Captions state that the original interface is English. Portfolio controls remain bilingual.

The homepage Wordle title panel is typography. Portfolio QA captures under `docs/browser-qa*` are not Wordle application evidence. Retired project assets remain in earlier local backups.

Future gameplay captures require the authenticated application with approved non-sensitive data. Record actual source identity, dimensions, hashes and truthful bilingual captions. Do not fabricate gameplay or substitute a reimplementation.

## Genuine gameplay captures — step 210

Captured 2026-11-16 from an unmodified temporary copy of the same local Wordle source. Original and copied source bytes were compared against `wordle-gameplay-source-manifest.json` before/after capture; no original repository file was modified. The public pinned README setup instructions were inspected read-only. The local source is not claimed to match a specific remote commit.

A separate MySQL 8.4.13 data directory was initialized under a private mode-0700 `/private/tmp/rafisa-wordle-gameplay` workspace. It used a private Unix socket with TCP and MySQL X networking disabled. The existing database/service and existing credentials were not used. Setup used the original database.sql, installed English/French dictionary packages and the exact 20 solution candidates in the source activation script. No game rows, feedback or winning results were fabricated.

The original Express app factory and MySQL session store ran against that isolated database. The original React UI registered disposable test accounts, logged in, started games and submitted two real guesses per capture. Browser requests were restricted to the local origin. Credentials were randomly generated, never included in screenshots or evidence. Profile/statistics disclosures stayed collapsed. Both games remain in progress with four attempts remaining; these are demonstration sessions, not player achievements.

`wordle-gameplay-evidence.json` records the real API feedback and browser version. Desktop uses the English dictionary with CRANE/SHOUT; mobile uses the French dictionary with SALUT/ROUES. The original interface labels remain English in both views, which captions explain. Full-page PNGs preserve the application rendering without compositing, image editing or generated UI. Original viewport sizes differ from full-page image heights.

| Public original | Dimensions | Git blob content hash | SHA-256 |
| --- | --- | --- | --- |
| `gameplay-desktop.png` | 1440 × 1335 | `0e807eefcc504a486c8d788a3a1bf8426cb958da` | `465f1cac3fb0531d25a1891c8f92c21b65f64d6b0af2ab00a5921e4b07f58e76` |
| `gameplay-mobile.png` | 390 × 1153 | `992dd5d44c05fc79c9d359f390af9a2b300c291c` | `9e624f71f61e477491b5f69f024f63e5d0acc947c92fa1f50b173d89db239521` |

Both images were visually inspected: board, evaluated guesses and keyboard are visible; no usernames, emails or credentials appear. The capture browser/app servers were closed and the isolated MySQL instance was cleanly shut down. Temporary source/data remain outside the portfolio in the private workspace; they are not part of the portable ZIP. No Wordle runtime/backend dependency was added to the portfolio.

Reproduction: use an isolated source copy, fresh private MySQL instance and original schema/dictionary setup; register disposable local test accounts through the real UI, then play normally. Never point capture setup at a real user's database. Verify source hashes again and keep captions explicit about demonstration data. The existing portfolio image originals and evidence are sufficient for transfer; recipients do not need MySQL to run the portfolio.
