import "../styles/portfolio.css";
import ProfessionalSections from "../components/ProfessionalSections";
import { useTranslation } from "react-i18next";
import useAppearance from "../hooks/useAppearance";
import AppearanceControls from "../components/AppearanceControls";

// Portfolio projects are kept in one array for easier maintenance.
const projects = [
  ["01", "Alpine ClientFlow", "FRONTEND / CRM", "Client onboarding, role-based workspaces and compliance reviews."],
  ["02", "VeriLot", "FULL-STACK / INVENTORY", "Inventory management with serialized products and manufacturing batches."],
  ["03", "RumiPay", "FRONTEND / FINTECH", "Multilingual Swiss digital-wallet interface."],
  ["04", "SQL Ops Dashboard", "FULL-STACK / ANALYTICS", "Retail revenue, margin and product reporting."],
  ["05", "Wordle", "FULL-STACK / WORD GAME", "Word-guessing game with player accounts and game history."],
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useAppearance();
  return (
    <div className={`portfolio theme-${theme}`}>
      <header className="site-header">
        <a className="wordmark" href="#top">ML<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">{t("nav.work")}</a>
          <a href="#about">{t("nav.about")}</a>
          <a href="#contact">{t("nav.contact")}</a>
          <div className="language-toggle" aria-label="Website language">
            <button type="button" aria-pressed={i18n.language === "en"} onClick={() => i18n.changeLanguage("en")}>EN</button>
            <button type="button" aria-pressed={i18n.language === "fr"} onClick={() => i18n.changeLanguage("fr")}>FR</button>
          </div>
        </nav>
        <span className="location">VAUD, CH / 2026</span>
      </header>
      <AppearanceControls theme={theme} setTheme={setTheme} />

      <main id="top">
        <section className="hero">
          <div className="hero-rail">
            <span>PORTFOLIO / 001</span>
            <span>DEVELOPMENT & ENGINEERING</span>
          </div>
          <div className="hero-content">
            <p className="eyebrow">WEB DEVELOPMENT / VAUD, SWITZERLAND</p>
            <h1>Michael Leigh<span>{t("portfolio.role")}</span></h1>
            <div className="hero-bottom">
              <p>{t("portfolio.intro")}</p>
              <a className="text-link" href="#work">{t("portfolio.viewWork")} ↗</a>
            </div>
          </div>
        </section>

        <section className="work-section section-shell" id="work">
          <div className="section-heading">
            <span className="section-index">01 / WORK</span>
            <h2>{t("portfolio.work")}</h2>
          </div>
          <div className="project-list">
            {projects.map(([number, name, category, description]) => (
              <article className="project-row" key={number}>
                <span className="project-number">{number}</span>
                <div className="project-info">
                  <h3>{name}</h3>
                  <p>{t("portfolio.projects." + number + ".desc")}</p>
                </div>
                <span className="project-category">{t("portfolio.projects." + number + ".category")}</span>
              </article>
            ))}
          </div>
          <a className="text-link external-link" href="https://github.com/DevRumiTech" target="_blank" rel="noopener noreferrer">View GitHub profile ↗</a>
        </section>

        <section className="about-section section-shell" id="about">
          <div className="section-heading">
            <span className="section-index">02 / PROFILE</span>
            <h2>{t("portfolio.about")}</h2>
          </div>
          <div className="about-grid">
            <div>
              <p className="about-lead">{t("portfolio.aboutLead")}</p>
              <p className="about-personal">{t("portfolio.hobbies")}</p>
            </div>
            <div className="experience-list">
              <div>
                <span className="small-label">{t("portfolio.current")}</span>
                <h3>Rafisa</h3><p>{t("portfolio.rafisaLocation")}</p>
                <p>{t("portfolio.rafisaRole")}</p>
                <p>{t("portfolio.rafisaDates")}</p>
              </div>
              <div>
                <span className="small-label">{t("portfolio.previous")}</span>
                <h3>Gaea21 NGO</h3><p>{t("portfolio.gaeaLocation")}</p>
                <p>{t("portfolio.gaeaRole")}</p>
                <p>{t("portfolio.gaeaDates")}</p>
              </div>
            </div>
          </div>
        </section>

        <ProfessionalSections />
        <section className="contact-section section-shell" id="contact">
          <span className="section-index">05 / CONTACT</span>
          <h2>{t("portfolio.contact")}</h2><p className="contact-intro">{t("portfolio.contactMessage")}</p>
          <a className="contact-email" href="mailto:rumi6864@gmail.com">{t("portfolio.contactButton")} ↗</a>
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2026 MICHAEL LEIGH</span>
        <span>{t("portfolio.footer")}</span>
        <a href="#top">{t("portfolio.back")} ↑</a>
      </footer>
    </div>
  );
}
