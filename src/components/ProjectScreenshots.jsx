import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProjectScreenshots({ screenshots }) {
  if (!screenshots?.length) return null;
  return <Gallery key={screenshots.map(item => item.src).join('|')} screenshots={screenshots} />;
}

function Gallery({ screenshots }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const [selected, setSelected] = useState(0);
  const activeButton = useRef(null);
  const imageLink = useRef(null);
  const screenshot = screenshots[selected];
  return (
    <section id="screenshots" tabIndex={-1} className="project-screenshots" aria-labelledby="screenshots-title">
      <h2 id="screenshots-title">{t('portfolio.screenshots')}</h2>
      {screenshots.length > 1 && <div className="screenshot-options" role="group" aria-label={t('portfolio.screenshotView')}>
        {screenshots.map((item, index) => (
          <button type="button" ref={index === selected ? activeButton : null} key={item.src} aria-pressed={index === selected}
            onClick={() => setSelected(index)}>{item.label?.[language] ?? t(`portfolio.${item.view}`)}</button>
        ))}
      </div>}
      <Screenshot key={screenshot.src} screenshot={screenshot} language={language} restoreFocus={() => (activeButton.current ?? imageLink.current)?.focus()} />
      <a ref={imageLink} className="text-link" href={screenshot.src}>{t('portfolio.fullImage')} ↗</a>
    </section>
  );
}

function Screenshot({ screenshot, language, restoreFocus }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  return (
    <figure>
      {failed ? <div className="screenshot-error">
        <p role="status">{t('portfolio.screenshotFailed')}</p>
        <button type="button" onClick={() => { setFailed(false); restoreFocus(); }}>{t('portfolio.retryImage')}</button>
      </div> : <img src={screenshot.src} alt={screenshot.alt[language]} width={screenshot.width}
        height={screenshot.height} loading="lazy" decoding="async" onError={() => setFailed(true)} />}
      <figcaption>{screenshot.alt[language]} {screenshot.note?.[language]}</figcaption>
    </figure>
  );
}
