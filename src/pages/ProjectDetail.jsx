import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SiteFooter from '../components/SiteFooter';
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { caseStudies } from "../data/projects";
import useAppearance from "../hooks/useAppearance";
import NotFound from "./NotFound";
import ProjectScreenshots from "../components/ProjectScreenshots";
import SiteHeader from "../components/SiteHeader";
import TechnologyLogo from "../components/TechnologyLogo";
import "../styles/portfolio.css";
import "../styles/project-detail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { hash, state } = useLocation();
  const projectQuery = typeof state?.projectQuery === "string" ? state.projectQuery : "";
  const workDestination = projectQuery ? `/?${new URLSearchParams({ q: projectQuery })}#work` : "/#work";
  const { t, i18n } = useTranslation();
  const { theme } = useAppearance();

  const language = i18n.resolvedLanguage === "fr" ? "fr" : "en";

  // Find the project that matches the URL.
  const project = caseStudies.find((item) => item.slug === slug?.toLowerCase());

  if (!project) {
    return <NotFound projectMissing />;
  }

  const index = caseStudies.indexOf(project);
  const adjacent = [["previous", caseStudies[index - 1]], ["next", caseStudies[index + 1]]];

  return (
    <div className={`portfolio theme-${theme} project-detail`}>
      <Link className="skip-link" to="#top">{t("portfolio.skip")}</Link>
      <SiteHeader />

      <main id="top" tabIndex={-1} className="project-detail-main">
        <Link className="project-back" to={workDestination}>
          <ArrowLeft className="ml-arrow" aria-hidden="true" /> {t("portfolio.detail.back")}
        </Link>

        <div className="detail-heading">
          <p className="section-index">
            {t("portfolio.detail.caseStudy")} / {project.number}
          </p>

          <h1>{project.name}</h1>
          <p className="detail-summary">{project.summary[language]}</p>
        </div>

        <nav className="detail-contents" aria-label={t("portfolio.onThisPage")}>
          {project.screenshots?.length > 0 && <Link to="#screenshots" aria-current={hash === "#screenshots" ? "location" : undefined}>{t("portfolio.screenshots")}</Link>}
          <Link to="#technologies" aria-current={hash === "#technologies" ? "location" : undefined}>{t("portfolio.detail.technologies")}</Link>
          <Link to="#features" aria-current={hash === "#features" ? "location" : undefined}>{t("portfolio.detail.features")}</Link>
        </nav>

        <section className="project-facts" aria-labelledby="project-facts-title">
          <h2 id="project-facts-title">{t("portfolio.projectFacts")}</h2>
          <dl>
            <div><dt>{t("portfolio.category")}</dt><dd>{t(`portfolio.projects.${project.number}.category`)}</dd></div>
            <div><dt>{t("portfolio.demoAccess")}</dt><dd>{t(project.demo ? "portfolio.available" : "portfolio.unavailable")}</dd></div>
            <div><dt>{t("portfolio.sourceAccess")}</dt><dd>{t(project.github ? "portfolio.available" : "portfolio.unavailable")}</dd></div>
          </dl>
        </section>

        <div className="detail-actions">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("portfolio.detail.demo")} <ArrowUpRight className="ml-arrow" aria-hidden="true" /><span className="sr-only"> ({t("portfolio.newTab")})</span>
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="ml-brand-icon" aria-hidden="true" /> {t("portfolio.detail.source")} <ArrowUpRight className="ml-arrow" aria-hidden="true" /><span className="sr-only"> ({t("portfolio.newTab")})</span>
            </a>
          )}

          {!project.demo && (
            <p className="detail-notice">
              {t("portfolio.detail.noDemo")}
            </p>
          )}
        </div>

        {project.screenshots?.length > 0 && <ProjectScreenshots key={project.slug} screenshots={project.screenshots} />}

        {project.implementation && <section className="project-implementation" aria-labelledby="implementation-title">
          <h2 id="implementation-title">{t('portfolio.implementation')}</h2>
          <dl>{project.implementation.map(item => <div key={item.title.en}><dt>{item.title[language]}</dt><dd>{item.description[language]}</dd></div>)}</dl>
          <a className="text-link" href={project.evidence} target="_blank" rel="noopener noreferrer">{t('portfolio.implementationSource')}<span className="sr-only"> ({t('portfolio.newTab')})</span></a>
        </section>}

        <div className="detail-columns">
          <section id="technologies" tabIndex={-1}>
            <h2>{t("portfolio.detail.technologies")}</h2>
            <ul className="detail-stack">
              {project.stack.map((item) => (
                <li key={item}><TechnologyLogo name={item} /><span>{item}</span></li>
              ))}
            </ul>
          </section>

          <section id="features" tabIndex={-1}>
            <h2>{t("portfolio.detail.features")}</h2>
            <ul className="detail-features">
              {project.features[language].map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>

        <p className="project-contact"><Link className="text-link" to="/#contact">{t("portfolio.discussProject")} <ArrowUpRight className="ml-arrow" aria-hidden="true" /></Link></p>

        {caseStudies.length > 1 && <nav className="project-pagination" aria-label={t("portfolio.detail.navigation")}>
          {adjacent.filter(([, item]) => item).map(([direction, item]) => (
            <Link key={direction} state={{ projectQuery }} to={`/projects/${item.slug}`} rel={direction === "previous" ? "prev" : "next"}>
              <span className="small-label">{t(`portfolio.detail.${direction}`)}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>}

        <Link className="project-back bottom-back" to={workDestination}>
          <ArrowLeft className="ml-arrow" aria-hidden="true" /> {t("portfolio.detail.all")}
        </Link>
      </main>
    <SiteFooter />
    </div>
  );
}
