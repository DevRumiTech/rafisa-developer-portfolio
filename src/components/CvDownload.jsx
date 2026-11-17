// Each available language is explicit; missing files never become download links.
export default function CvDownload({ documents, language, copy }) {
  const available = ['en', 'fr'].filter(code => documents[code]);
  return <span id="cv" className="cv-downloads">{available.length ? available.map(code => {
    const document = documents[code];
    return <a key={code} href={document.href} download={document.filename} type="application/pdf" hrefLang={code}>
      {copy.cv} · {code === 'en' ? 'English' : 'Français'} <span className="cv-file-info">(PDF · {Math.ceil(document.bytes / 1024)} {language === 'fr' ? 'Ko' : 'KB'})</span>
    </a>;
  }) : <span className="cv-unavailable">{copy.noCv}</span>}</span>;
}
