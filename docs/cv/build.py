"""Generate both CV PDFs and editable HTML from content.json. No network access."""
import json
from html import escape
from pathlib import Path
import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, HRFlowable

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads(Path(__file__).with_name('content.json').read_text())
FONT_DIR = Path(reportlab.__file__).parent / 'fonts'
for name, filename in [('CV', 'Vera.ttf'), ('CV-Bold', 'VeraBd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV', boldItalic='CV-Bold')
NAVY, TEAL, MUTED = '#20333f', '#28666b', '#52616a'
styles = {
    'name': ParagraphStyle('name', fontName='CV-Bold', fontSize=25, leading=29, textColor=colors.HexColor(NAVY), spaceAfter=5),
    'role': ParagraphStyle('role', fontName='CV', fontSize=12, leading=16, textColor=colors.HexColor(TEAL), spaceAfter=6),
    'body': ParagraphStyle('body', fontName='CV', fontSize=9.5, leading=13.5, textColor=colors.HexColor(NAVY), spaceAfter=4),
    'small': ParagraphStyle('small', fontName='CV', fontSize=8.3, leading=12, textColor=colors.HexColor(MUTED), spaceAfter=4),
    'title': ParagraphStyle('title', fontName='CV-Bold', fontSize=10, leading=14, textColor=colors.HexColor(NAVY), spaceAfter=2),
    'section': ParagraphStyle('section', fontName='CV-Bold', fontSize=10.5, leading=15, textColor=colors.HexColor(TEAL), spaceBefore=13, spaceAfter=6, keepWithNext=True),
}

def p(text, style='body'):
    return Paragraph(escape(text), styles[style])


def generate(language):
    c, contact = DATA[language], DATA['contact']
    output = ROOT / 'public' / 'cv' / f'michael-leigh-cv-{language}.pdf'
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=43, leftMargin=43, topMargin=35, bottomMargin=35,
                            title=f"Michael Leigh - {'Curriculum vitae' if language == 'fr' else 'CV'} ({language.upper()})",
                            author=contact['name'], subject=c['role'], pageCompression=1)
    story = []
    html = []
    def paragraph(text, style='body'):
        story.append(p(text, style)); html.append(f'<p class="{style}">{escape(text)}</p>')
    def section(key):
        paragraph(c['labels'][key], 'section')
    def entries(items):
        for item in items:
            block = [p(item['title'], 'title'), p(item['org'], 'small'), p(item['dates'], 'small')]
            for bullet in item.get('bullets', []): block.append(p('• ' + bullet))
            block.append(Spacer(1, 5)); story.append(KeepTogether(block))
            html.append('<article><h3>'+escape(item['title'])+'</h3><p>'+escape(item['org'])+'</p><p>'+escape(item['dates'])+'</p>')
            html.extend('<p>'+escape(b)+'</p>' for b in item.get('bullets', [])); html.append('</article>')
    def link(label, url):
        story.append(Paragraph(f'<link href="{escape(url, quote=True)}" color="{TEAL}">{escape(label)}</link>', styles['small']))
        html.append(f'<p><a href="{escape(url, quote=True)}">{escape(label)}</a></p>')
    paragraph(contact['name'], 'name'); paragraph(c['role']+' | '+c['location'], 'role')
    link(contact['email'], 'mailto:'+contact['email'])
    link('GitHub: github.com/DevRumiTech', contact['github'])
    link('LinkedIn: linkedin.com/in/michael-leigh-0b73221ab', contact['linkedin'])
    story.append(HRFlowable(width='100%', thickness=0.7, color=colors.HexColor(TEAL), spaceBefore=4, spaceAfter=4))
    section('profile'); paragraph(c['profile'])
    section('experience'); entries(c['experience'])
    section('project'); paragraph(c['project']['title']+' | '+c['project']['stack'], 'title'); paragraph(c['project']['text']); link(c['project']['url'],c['project']['url'])
    section('skills')
    for label, description in c['skills']:
        story.append(Paragraph(f'<b>{escape(label)}</b> - {escape(description)}', styles['body']))
        html.append(f'<p><b>{escape(label)}</b> - {escape(description)}</p>')
    story.append(PageBreak());html.append('<div class="page-break"></div>')
    paragraph(contact['name'], 'name');paragraph(c['role'], 'role')
    section('earlier');entries(c['earlier'])
    section('education');entries(c['education'])
    section('languages');paragraph(c['languages'])
    section('interests');paragraph(c['interests'])
    def footer(canvas, document):
        canvas.setTitle(doc.title);canvas.setAuthor(contact['name'])
        canvas.setFont('CV',7.5);canvas.setFillColor(colors.HexColor(MUTED))
        canvas.drawString(43,20,contact['name']+' | '+language.upper())
        canvas.drawRightString(A4[0]-43,20,f'{document.page} / 2')
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    css='body{max-width:720px;margin:2rem auto;font:14px/1.5 Arial,sans-serif;color:#20333f}h3,p{margin:0 0 6px}.name{font-size:30px;font-weight:bold}.role,.section{color:#28666b}.section{font-weight:bold;margin-top:20px}article{margin-bottom:12px;break-inside:avoid}.small{font-size:12px;color:#52616a}a{color:#28666b}.page-break{break-before:page;margin-top:30px}@page{size:A4;margin:16mm}@media print{body{margin:0}.page-break{margin-top:0}}'
    Path(__file__).with_name(f'michael-leigh-cv-{language}.html').write_text(f'<!doctype html><html lang="{language}"><meta charset="utf-8"><title>Michael Leigh CV {language.upper()}</title><style>{css}</style><body>'+''.join(html)+'</body></html>')
    print(output)

if __name__ == '__main__':
    for language in ['en','fr']: generate(language)
