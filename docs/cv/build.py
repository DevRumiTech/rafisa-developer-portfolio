"""Generate both CV PDFs and editable HTML from the existing bilingual source."""
import json
from html import escape
from pathlib import Path
from weasyprint import HTML

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DATA = json.loads((HERE / 'content.json').read_text())
ICONS = json.loads((HERE / 'social-icons.json').read_text())
CSS = '''
@font-face{font-family:Inter;src:url('../../public/fonts/inter-400.ttf');font-weight:400}
@font-face{font-family:Inter;src:url('../../public/fonts/inter-600.ttf');font-weight:600}
@font-face{font-family:Inter;src:url('../../public/fonts/inter-700.ttf');font-weight:700}
@page{size:A4;margin:12mm 15mm 13mm;@bottom-left{content:'Michael Leigh';font:8pt Inter,sans-serif;color:#525966}@bottom-right{content:counter(page) ' / ' counter(pages);font:8pt Inter,sans-serif;color:#525966}}
*{box-sizing:border-box}body{font:10.5pt/1.4 Inter,Arial,sans-serif;color:#111111;margin:0;background:#fff}
header{border-bottom:2px solid #F05032;padding-bottom:7pt;margin-bottom:9pt}h1{font-size:24pt;line-height:1.1;font-weight:600;margin:0 0 4pt;letter-spacing:-.5pt}.role{font-size:12pt;font-weight:600;color:#111111;margin:0 0 5pt}
h2{font-size:12pt;line-height:1.25;font-weight:600;color:#B83B20;margin:11pt 0 4pt;padding-bottom:3pt;border-bottom:1px solid #E5E7EB;break-after:avoid}
h3{font-size:11pt;font-weight:600;line-height:1.3;margin:0 0 2pt}p{margin:0 0 3pt}article{margin-bottom:6pt;break-inside:avoid}.meta{color:#525966;font-size:9.5pt}.contact{font-size:9.5pt;line-height:1.4}.contact svg{vertical-align:-2pt;margin-right:4pt}a{color:#1E40AF;text-decoration:none;overflow-wrap:anywhere}.title{font-weight:600}.bullet{margin:2pt 0 0 8pt}.page-break{break-before:page}.page-two-header{margin-bottom:7pt}.page-two-header h1{font-size:20pt}.skills p{margin:0 0 3pt}
@media screen{body{max-width:760px;margin:28px auto;padding:24px;background:#FAFAFA}.page-break{margin-top:40px}}
'''

def generate(language):
    c, contact = DATA[language], DATA['contact']
    body = []
    def p(text, cls=''):
        body.append(f'<p class="{cls}">{escape(text)}</p>')
    def section(key):
        body.append(f'<h2>{escape(c["labels"][key])}</h2>')
    def link(label, url, icon=None):
        body.append(f'<p class="contact"><a href="{escape(url, quote=True)}">{ICONS.get(icon, "")}{escape(label)}</a></p>')
    def entries(items):
        for item in items:
            body.append('<article><h3>'+escape(item['title'])+'</h3>')
            p(item['org'], 'meta'); p(item['dates'], 'meta')
            for bullet in item.get('bullets', []): p('• '+bullet, 'bullet')
            body.append('</article>')
    body.append('<header><h1>'+escape(contact['name'])+'</h1>')
    p(c['role']+' | '+c['location'], 'role')
    link(contact['email'], 'mailto:'+contact['email'], 'email')
    link('GitHub: github.com/DevRumiTech', contact['github'], 'github')
    link('LinkedIn: linkedin.com/in/michael-leigh-0b73221ab', contact['linkedin'], 'linkedin')
    body.append('</header>')
    section('profile'); p(c['profile']); section('experience'); entries(c['experience'])
    section('project'); p(c['project']['title']+' | '+c['project']['stack'], 'title'); p(c['project']['text']); link(c['project']['url'],c['project']['url'])
    section('skills'); body.append('<div class="skills">')
    for label, description in c['skills']:
        body.append(f'<p><b>{escape(label)}</b> - {escape(description)}</p>')
    body.append('</div><div class="page-break"></div><header class="page-two-header"><h1>'+escape(contact['name'])+'</h1>'); p(c['role'], 'role');body.append('</header>')
    section('earlier'); entries(c['earlier']);section('education');entries(c['education']);section('languages');p(c['languages']);section('interests');p(c['interests'])
    html = f'<!doctype html><html lang="{language}"><meta charset="utf-8"><title>Michael Leigh CV {language.upper()}</title><style>{CSS}</style><body>'+''.join(body)+'</body></html>'
    source = HERE / f'michael-leigh-cv-{language}.html'
    source.write_text(html, encoding='utf-8')
    output = ROOT / 'public' / 'cv' / f'michael-leigh-cv-{language}.pdf'
    output.parent.mkdir(parents=True, exist_ok=True)
    # Existing portfolio fonts are used on the local project. The fallback uses installed Inter.
    css = CSS if (ROOT / 'public/fonts/inter-400.ttf').exists() else CSS[CSS.index('@page'):]
    HTML(string=html.replace(CSS, css), base_url=str(HERE)).write_pdf(str(output))
    return output

if __name__ == '__main__':
    for language in ('en', 'fr'):
        print(generate(language))
