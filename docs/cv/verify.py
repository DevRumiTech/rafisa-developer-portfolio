"""Verify the actual bilingual PDFs against editable source text; no network access."""
import json
import re
from pathlib import Path
import fitz
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
source = json.loads(Path(__file__).with_name('content.json').read_text())
normalize = lambda value: re.sub(r'\s+', '', value)

def leaves(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from leaves(item)
    elif isinstance(value, list):
        for item in value:
            yield from leaves(item)

for language in ['en', 'fr']:
    path = ROOT / 'public/cv' / f'michael-leigh-cv-{language}.pdf'
    reader = PdfReader(path)
    assert len(reader.pages) == 2 and not reader.is_encrypted
    text = '\n'.join(page.extract_text() for page in reader.pages)
    for value in leaves(source[language]):
        assert normalize(value) in normalize(text), f'{language}: missing source text {value}'
    assert 'Michael Leigh' in text and 'rumi6864@gmail.com' in text
    assert ('Ongoing internship' if language == 'en' else 'Stage en cours') in text
    for forbidden in ['Alpine ClientFlow', 'VeriLot', 'RumiPay', 'SQL Ops Dashboard']:
        assert forbidden not in text
    links = {annotation.get_object().get('/A', {}).get('/URI') for page in reader.pages for annotation in page.get('/Annots', [])}
    for url in [source['contact']['github'], source['contact']['linkedin'], 'mailto:'+source['contact']['email'], source[language]['project']['url']]:
        assert url in links, f'Missing clickable link: {url}'
    with fitz.open(path) as pdf:
        for page in pdf:
            for x0, y0, x1, y1, *_ in page.get_text('blocks'):
                assert 15 <= x0 < x1 <= page.rect.width-15
                assert 10 <= y0 < y1 <= page.rect.height-10
            assert len(page.get_text()) > 500
    print(f'PASS {language}: two readable pages, all source text, ongoing status, links and bounds.')
for key in ['experience','earlier','education','skills']:
    assert len(source['en'][key]) == len(source['fr'][key])
print('PASS: matching bilingual section counts. Visual inspection is still required after edits.')
