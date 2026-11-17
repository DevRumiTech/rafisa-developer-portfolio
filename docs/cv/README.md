# Editable bilingual CV sources

The final PDFs are `public/cv/michael-leigh-cv-en.pdf` and `public/cv/michael-leigh-cv-fr.pdf`. Each has two A4 pages, selectable text, embedded fonts and clickable email/GitHub/LinkedIn/Wordle links. All four pages were rendered and visually reviewed. They are not claimed to be certified tagged PDF/UA documents.

## Sources and decisions

`sources.json` records original local CV paths and SHA-256 hashes. English/French developer CVs supplied contact links, language levels and Gaea21 responsibilities. The existing Atelier Informatique CV supplied earlier care employment/education. The current portfolio supplied skills/interests and verified Wordle information. The owner specified Rafisa's exact dates and ongoing status.

- Rafisa is ongoing from 19 October 2026, scheduled to end 14 January 2027.
- HESAV nursing studies are explicitly not completed; no nursing degree is claimed.
- Wordle is the only featured project, consistent with the approved portfolio scope. Retired project descriptions from the original CVs were not republished.
- No telephone number, address, nationality, age, photograph, employment duty or achievement was invented.
- Original CV files remain unchanged outside this project. Existing facts were transcribed/translated; this does not independently certify qualifications. The owner should review the new versions before using them in applications.

## Edit and regenerate

1. Edit `content.json` in a text editor. `contact` is shared; `en` and `fr` contain the same sections and facts. Update both languages together. Do not change unfinished education into an awarded degree.
2. `build.py` controls the layout. The generated `.html` files are editable, readable alternatives you can open in a browser. Their text can be copied into a word processor. Regeneration overwrites these HTML files; edit JSON for lasting changes.
3. Use Python 3.9 or newer with an isolated environment. On macOS:

```sh
python3 -m venv /private/tmp/rafisa-cv-tools
/private/tmp/rafisa-cv-tools/bin/pip install -r docs/cv/requirements.txt
/private/tmp/rafisa-cv-tools/bin/python docs/cv/build.py
/private/tmp/rafisa-cv-tools/bin/python docs/cv/verify.py
```

On Windows, create a venv outside the project, for example `py -m venv C:\Temp\rafisa-cv-tools`, then use `C:\Temp\rafisa-cv-tools\Scripts\python.exe` and `pip.exe` for those commands. Dependencies are PDF authoring tools, not required to run the React portfolio. Package installation downloads tools; no document is uploaded.

4. Render each PDF with a PDF viewer or PyMuPDF and inspect every page after an edit. `verify.py` checks extracted source text, two-page length, bounds, ongoing status, links and excluded projects; it cannot replace visual/spelling review.
5. Recalculate each actual PDF byte size and update `src/data/cv.js`. Run `npm run verify` and `npm run test:preview`, then browser tests. Each download is exposed by language independently of the website language. Missing documents must not become working-looking links.

Do not publish source JSON/HTML or old CVs as website assets. Only the final PDFs belong under public/cv. The portable local ZIP includes editable sources for further work, but no Python environment.
