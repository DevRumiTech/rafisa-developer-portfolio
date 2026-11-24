import { Download, FileText, File } from 'lucide-react';

export default function CvDownload({ documents, language, copy }) {
  const available = ['en', 'fr'].filter(code => documents[code]);
  const fr = language === 'fr';
  if (!available.length) return <span className="cv-unavailable">{copy.noCv}</span>;
  return <div id="cv" className="cv-downloads ml-cv-grid">{available.map(code => {
    const document = documents[code];
    const english = code === 'en';
    const title = english ? (fr ? 'CV anglais' : 'English CV') : (fr ? 'CV français' : 'French CV');
    const description = english ? (fr ? 'Version anglaise de mon curriculum vitae.' : 'English version of my curriculum vitae.') : (fr ? 'Version française de mon curriculum vitae.' : 'French version of my curriculum vitae.');
    return <article key={code} className={`ml-cv-card ml-cv-card-${code}`}>
      <span className="ml-cv-icon"><FileText size={25} aria-hidden="true" /></span>
      <h3>{title}</h3><p>{description}</p>
      <span className="cv-file-info"><File size={15} aria-hidden="true" /> PDF · 2 pages · {Math.ceil(document.bytes / 1024)} {fr ? 'Ko' : 'KB'}</span>
      <a className={`ml-cv-language-${code}`} href={document.href} download={document.filename} type="application/pdf" hrefLang={code}><Download className="ml-arrow" aria-hidden="true" />{english ? 'Download CV' : 'Télécharger le CV'}<span className="sr-only"> ({title})</span></a>
    </article>;
  })}</div>;
}
