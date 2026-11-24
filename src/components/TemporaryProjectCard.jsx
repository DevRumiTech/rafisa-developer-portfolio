import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { homeCopy } from '../data/homeCopy';
import { projectCopy } from '../data/projectCopy';

export function ProjectPlaceholderVisual({ more = false, number = 2 }) {
  return <div className={`ml-showcase-visual ml-project-fallback ml-icon-${more ? 'folder' : number === 3 ? 'blue' : 'red'}`} aria-hidden="true">
    <svg viewBox="0 0 48 48" focusable="false">
      {more ? <path d="M5 14a3 3 0 0 1 3-3h12l5 5h15a3 3 0 0 1 3 3v18H5Z" /> : <><rect x="9" y="10" width="30" height="23" rx="2" /><path d="M9 33 4 39h40l-5-6M19 39h10" /></>}
    </svg>
  </div>;
}

export default function TemporaryProjectCard({ number, language }) {
  const copy = projectCopy[language];
  const { t } = useTranslation();
  return <article className="ml-showcase-card ml-placeholder" data-animate>
    <div className="ml-card-content">
      <ProjectPlaceholderVisual number={number} />
      <div className="ml-showcase-project-meta">
        <h3>{copy.project} {number}</h3><span className="ml-coming-soon">{copy.comingSoon}</span>
        <p>{language === 'fr' ? 'Les détails seront ajoutés lorsque le projet sera terminé.' : 'Details will be added when the project is completed.'}</p>
        <span className="ml-sample-label">{copy.sampleStack}</span>
        <ul className="ml-project-stack ml-sample-stack" aria-label={copy.sampleStack}>{['React', 'Node.js', 'Express', 'MySQL'].map(item => <li key={item}>{item}</li>)}</ul>
        <span className="ml-showcase-case-link ml-disabled-action" aria-disabled="true">{homeCopy[language].details} <ArrowUpRight className="ml-arrow" aria-hidden="true" /></span>
      </div>
    </div>
    <div className="ml-card-actions"><span className="ml-project-source ml-disabled-action" aria-disabled="true"><FaGithub className="ml-brand-icon" aria-hidden="true" /> {t('portfolio.detail.source')} <ArrowUpRight className="ml-arrow" aria-hidden="true" /></span><span className="ml-project-source ml-project-demo ml-disabled-action" aria-disabled="true">{t('portfolio.detail.demo')} <ArrowUpRight className="ml-arrow" aria-hidden="true" /></span></div>
  </article>;
}
