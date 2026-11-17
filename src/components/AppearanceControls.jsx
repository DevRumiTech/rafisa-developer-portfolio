import { useTranslation } from "react-i18next";

export default function AppearanceControls({ theme, setTheme }) {
  const { t } = useTranslation();

  return (
    <div className="appearance-panel">
      <label className="appearance-field">
        <span>{t("portfolio.appearance")}</span>
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
        >
          <option value="light">{t("portfolio.light")}</option>
          <option value="dark">{t("portfolio.dark")}</option>
        </select>
      </label>
    </div>
  );
}
