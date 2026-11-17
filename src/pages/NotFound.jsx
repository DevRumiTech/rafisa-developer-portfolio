import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAppearance from "../hooks/useAppearance";
import SiteHeader from "../components/SiteHeader";
import "../styles/portfolio.css";

export default function NotFound({ projectMissing = false }) {
  const { t } = useTranslation();
  const { theme } = useAppearance();
  return (
    <div className={`portfolio theme-${theme}`}>
      <Link className="skip-link" to="#top">{t("portfolio.skip")}</Link>
      <SiteHeader />
      <main id="top" tabIndex={-1} className="section-shell">
        <h1>404 — {t(projectMissing ? "portfolio.missingProject" : "portfolio.missingPage")}</h1>
        <Link className="text-link" to="/">{t("portfolio.home")}</Link>
      </main>
    </div>
  );
}
