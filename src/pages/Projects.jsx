import SiteFooter from '../components/SiteFooter';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAppearance from '../hooks/useAppearance';
import SiteHeader from '../components/SiteHeader';
import ProjectCard from '../components/ProjectCard';
import { selectProjects } from '../data/projectSelection';
import { projectCopy } from '../data/projectCopy';
import '../styles/portfolio.css';
import '../styles/home.css';

export default function Projects() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const { theme } = useAppearance();
  const copy = projectCopy[language];
  const { additional } = selectProjects();
  return <div className={`portfolio theme-${theme} ml-showcase ml-showcase-${theme}`}>
    <Link className="skip-link" to="#top">{t('portfolio.skip')}</Link>
    <SiteHeader />
    <main id="top" tabIndex={-1}><section className="ml-projects-page">
      <h1>{copy.more}</h1><p>{copy.browse}</p>
      {additional.length ? <div className="ml-showcase-project-grid">{additional.map(project => <ProjectCard key={project.slug} project={project} language={language} />)}</div> : <p className="ml-projects-empty">{copy.empty}</p>}
      <Link className="text-link" to="/#work">{t('portfolio.home')}</Link>
    </section></main>
    <SiteFooter />
  </div>;
}
