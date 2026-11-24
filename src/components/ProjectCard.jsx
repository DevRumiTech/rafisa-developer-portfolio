import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { homeCopy } from '../data/homeCopy';
import { ProjectPlaceholderVisual } from './TemporaryProjectCard';

export default function ProjectCard({ project, language }) {
  const { t } = useTranslation();
  return <article className="ml-showcase-card" data-animate>
    <Link className="ml-project-link ml-card-content" to={`/projects/${project.slug}`} aria-labelledby={`project-${project.slug}`}>
      {project.slug === 'wordle' ? <div className="ml-showcase-visual ml-wordle-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" focusable="false">{Array.from({ length: 9 }, (_, index) => <rect key={index} x={3 + index % 3 * 15} y={3 + Math.floor(index / 3) * 15} width="12" height="12" rx="2" className={`tile-${index}`} />)}</svg>
      </div> : <ProjectPlaceholderVisual number={project.number} />}
      <div className="ml-showcase-project-meta"><h3 id={`project-${project.slug}`}>{project.name}</h3><p>{project.summary[language]}</p><ul className="ml-project-stack" aria-label={t('portfolio.detail.technologies')}>{project.stack.map(item => <li key={item}>{item}</li>)}</ul><span className="ml-showcase-case-link">{homeCopy[language].details} <ArrowUpRight className="ml-arrow" aria-hidden="true" /></span></div>
    </Link>
    <div className="ml-card-actions">
    {project.github && <a className="ml-project-source" href={project.github} target="_blank" rel="noopener noreferrer"><FaGithub className="ml-brand-icon" aria-hidden="true" /> {t('portfolio.detail.source')} <ArrowUpRight className="ml-arrow" aria-hidden="true" /><span className="sr-only"> ({t('portfolio.newTab')})</span></a>}
    {project.demo && <a className="ml-project-source ml-project-demo" href={project.demo} target="_blank" rel="noopener noreferrer">{t('portfolio.detail.demo')} <ArrowUpRight className="ml-arrow" aria-hidden="true" /><span className="sr-only"> ({t('portfolio.newTab')})</span></a>}
    </div>
  </article>;
}
