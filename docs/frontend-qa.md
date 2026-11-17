# Final integration: real-browser QA

Automated tests, lint, build and local HTTP checks pass. **Chromium and WebKit verification is now recorded in `BROWSER-VERIFICATION.md`: 50 cases per engine passed**, including desktop/tablet/mobile widths, actual themes, keyboard controls and motion. Browser-framework captures were inspected. The checklist below remains the broader manual/cross-browser plan; it is not all certified by those cases or by jsdom.

Open `http://127.0.0.1:5173/` (or the URL printed by `npm run dev`). It is the only homepage. `/design-preview` intentionally shows 404.

## Check both English/French and light/dark

- Widths: 320, 390, 600, 601, 768, 1024 and 1440px; also 200% zoom. Confirm no horizontal page scrolling, overlapping controls or clipped text.
- Default appearance: bright paper background, navy/teal accents, no green glow or portrait. A saved dark choice should survive language changes, navigation and reloads.
- Section order: combined introduction/about, skills, Wordle, experience, education, hobbies, contact. No scrolling slogan or duplicate introduction.
- Skills: all existing groups/logos; hobbies: three animated decorative icons; education: both original qualifications. Hover effects should be subtle and flat.
- Typewriter: a complete sentence, once; the full sentence is immediately available to screen readers. “Show full sentence” finishes it. Change reduced-motion preference while open and confirm content stays visible without motion.
- Scroll entrance: reveal lower sections; tabbing into an off-screen interactive element must make it visible. Check browser back and fragment links too.
- At compact width: open menu, Tab through it, press Escape, check focus returns to Menu; collapsed links must not receive focus. Resize with focus on a menu link and on the language controls.
- Tab from a fresh page: skip link first, then predictable controls; activate skip and all navigation links. Check visible focus and contrast, including forced colors.
- Wordle title panel must not be mistaken for an application screenshot. Open details, verify React/Node.js/Express/MySQL and all five bilingual features, real GitHub URL, truthful no-demo notice and both return links.
- Contact: Email opens the mail application; GitHub opens the profile. CV remains unavailable with no link until real language-specific files exist. No false sent message.
- Screen reader: one h1, sensible headings, labeled controls, accurate language changes, complete typewriter sentence without per-character announcements.
- No JavaScript: check home/Wordle fallback text and contact/source links. Full frontend content is not prerendered.
- Retired project paths and `/design-preview` must show the localized not-found UI. Future hosting must also provide correct HTTP 404 status; Vite's SPA fallback is not proof of that.

## Automated commands

`npm run verify` runs tests, lint, content validation, build, output checks and diff checks. `npm run test:preview` checks actual loopback HTTP serving after building. Size ceilings: 150 KiB initial JS gzip, 8 KiB CSS gzip and 1 MiB configured screenshot originals. Current screenshot bytes: 59278. These limits are not Lighthouse scores.

Document the browser/version and actual results before marking visual QA complete. Genuine CV files, owner-approved future projects and hosting/domain decisions remain separate dependencies. No deployment is authorized.
