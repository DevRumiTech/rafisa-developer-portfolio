import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";

export default function AppearanceControls({ theme, setTheme }) {
  const { t } = useTranslation();
  return <div className="appearance-panel" role="group" aria-label={t("portfolio.appearance")}>
    <div className="ml-theme-switch">
      <button type="button" aria-label={t("portfolio.light")} title={t("portfolio.light")} aria-pressed={theme === "light"} onClick={() => setTheme("light")}><Sun size={19} aria-hidden="true" /></button>
      <button type="button" aria-label={t("portfolio.dark")} title={t("portfolio.dark")} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><Moon size={18} aria-hidden="true" /></button>
    </div>
  </div>;
}
