import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { caseStudies } from "../data/projects";
import useAppearance from "../hooks/useAppearance";
import AppearanceControls from "../components/AppearanceControls";
import TechnologyLogo from "../components/TechnologyLogo";
import "../styles/portfolio.css";
import "../styles/project-detail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const { theme, setTheme } = useAppearance();

  const french = i18n.language.startsWith("fr");
  const language = french ? "fr" : "en";

  // Find the project that matches the URL.
  const project = caseStudies.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main className="project-missing">
        <h1>404</h1>
        <p>{french ? "Projet introuvable." : "Project not found."}</p>
        <Link to="/">{french ? "Accueil" : "Home"}</Link>
      </main>
    );
  }

  return (
    <div className={`portfolio theme-${theme} project-detail`}>
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Michael Leigh">
          ML<span>.</span>
        </Link>

        <nav aria-label={french ? "Navigation" : "Navigation"}>
          <Link to="/#work">{french ? "Projets" : "Projects"}</Link>
          <Link to="/#about">{french ? "À propos" : "About"}</Link>
          <Link to="/#contact">Contact</Link>

          <div className="language-toggle" aria-label="Website language">
            <button
              type="button"
              aria-pressed={!french}
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              aria-pressed={french}
              onClick={() => i18n.changeLanguage("fr")}
            >
              FR
            </button>
          </div>
        </nav>
      </header>

      <AppearanceControls theme={theme} setTheme={setTheme} />

      <main className="project-detail-main">
        <Link className="project-back" to="/#work">
          ← {french ? "Retour aux projets" : "Back to projects"}
        </Link>

        <div className="detail-heading">
          <p className="section-index">
            {french ? "ÉTUDE DE PROJET" : "PROJECT CASE STUDY"} / {project.number}
          </p>

          <h1>{project.name}</h1>
          <p className="detail-summary">{project.summary[language]}</p>
        </div>

        <div className="detail-actions">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {french ? "Voir la démonstration" : "View live demo"} ↗
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {french ? "Code sur GitHub" : "GitHub repository"} ↗
            </a>
          )}

          {!project.demo && (
            <p className="detail-notice">
              {french
                ? "Démonstration publique non disponible actuellement."
                : "Public live demo is not available yet."}
            </p>
          )}
        </div>

        <div className="detail-columns">
          <section>
            <h2>{french ? "Technologies" : "Technologies"}</h2>
            <ul className="detail-stack">
              {project.stack.map((item) => (
                <li key={item}><TechnologyLogo name={item} /><span>{item}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{french ? "Fonctionnalités" : "Implemented features"}</h2>
            <ul className="detail-features">
              {project.features[language].map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>

        <Link className="project-back bottom-back" to="/#work">
          ← {french ? "Tous les projets" : "All projects"}
        </Link>
      </main>
    </div>
  );
}
