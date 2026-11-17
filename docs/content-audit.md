# Content accuracy and CV preparation

Current scope: integrated Wordle-only portfolio. Existing professional facts are preserved; this is not independent certification of employment or qualifications.

| Information | Evidence and treatment |
| --- | --- |
| Michael Leigh, full-stack development, Vaud/Switzerland | Existing portfolio; retained |
| Rafisa, St-Légier; 19 October 2026–14 January 2027 | Exact dates present in the approved preview before integration; centralized in both translations, with no completion/achievement claim |
| Gaea21, Geneva; June–September 2025 | Existing role, location and dates retained |
| HE-Arc, Meta, education periods, skills and soft skills | `src/data/professional.js` unchanged from the pre-integration backup |
| Shotokan karate, guitar, video games | Existing interests retained with decorative icons |
| Wordle stack, summaries and features | Existing catalog information retained; number changed from 05 to 01 |
| Wordle source link | Explicitly supplied by owner: `https://github.com/DevRumiTech/wordle-project`; no new repository facts inferred |
| Wordle demo and screenshots | No public demo; genuine local gameplay and sign-in captures documented in SCREENSHOT-SOURCES.md |
| CV | No approved documents supplied; both manifest entries remain null |

The other project content/assets and portrait are removed from the working website as requested. Their earlier state remains in the pre-integration local backup. No other repository was modified.

## Enable genuine CV downloads

1. Obtain and inspect an owner-approved PDF for each language. Confirm public sharing, correct language, dates, content and document metadata.
2. Put the genuine original under `public/cv/` with a simple filename. Do not make placeholder PDFs.
3. Replace only that language's null in `src/data/cv.js` with `{ href: '/cv/actual-name.pdf', filename: 'actual-name.pdf', bytes: ACTUAL_SIZE }`, using the real name and byte count. Leave missing languages null.
4. Run `npm run check:content`, `npm run verify` and `npm run test:preview`.
5. Verify the actual download and PDF contents in a real browser/viewer. Header/size validation does not establish content truth or PDF accessibility.

`src/pages/Home.jsx` shows a download only for a configured real file. Otherwise it states that the CV is unavailable. Contact uses an email link and never claims delivery. No backend is needed.

## Step 185: exact CV handoff requirements

Provide **one final owner-approved English PDF and one final owner-approved French PDF**, or identify which single language is ready. Confirm each document is intended for public download and that its contact details, qualifications and dates are correct. Supply the actual files, not only text or a link to a document editor. Preferred public filenames can be specified; otherwise simple language-specific names can be chosen during integration.

No extra CV facts, photo or fabricated document is needed. The developer will record actual filenames/byte sizes, enable only the supplied language(s), run validation and verify download/opening with the real PDFs. Both entries remain null today. The isolated component tests use only link metadata, create no PDFs and do not activate the public manifest. A configured real link displays PDF format, size and its language; a missing translation never falls back to the other document.

Wordle's existing technical information was independently compared with its public source in [the evidence review](WORDLE-EVIDENCE.md). The professional skills/qualifications file remains unchanged.
