import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { homeCopy } from '../data/homeCopy';
import { projectCopy } from '../data/projectCopy';

export default function ProjectCard({ project, language }) {
  const { t } = useTranslation();
  const shot = project.screenshots?.find(image => image.view === 'desktop') ?? project.screenshots?.[0];
  const [failedSource, setFailedSource] = useState(null);
  return <article className="ml-showcase-card" data-animate>
    <Link className="ml-project-link" to={`/projects/${project.slug}`} aria-labelledby={`project-${project.slug}`}>
      {shot && failedSource !== shot.src ? <div className="ml-showcase-visual ml-wordle-preview">
        <div className="ml-wordle-browser-bar" aria-hidden="true"><div className="ml-wordle-browser-dots" /><span>{project.name}</span></div>
        <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt[language]} loading="lazy" decoding="async" onError={() => setFailedSource(shot.src)} />
      </div> : <div className="ml-showcase-visual ml-project-fallback"><strong>{project.name}</strong><span>{projectCopy[language].screenshot}</span></div>}
      <div className="ml-showcase-project-meta"><h3 id={`project-${project.slug}`}>{project.name}</h3><p>{project.summary[language]}</p><span className="ml-showcase-case-link">{homeCopy[language].details} ↗</span></div>
    </Link>
    {project.github && <a className="ml-project-source" href={project.github} target="_blank" rel="noopener noreferrer">{t('portfolio.detail.source')} ↗<span className="sr-only"> ({t('portfolio.newTab')})</span></a>}
    {project.demo && <a className="ml-project-source ml-project-demo" href={project.demo} target="_blank" rel="noopener noreferrer">{t('portfolio.detail.demo')} ↗<span className="sr-only"> ({t('portfolio.newTab')})</span></a>}
  </article>;
}
