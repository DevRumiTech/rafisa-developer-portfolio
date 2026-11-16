import { useTranslation } from "react-i18next";

export default function AppearanceControls({ theme, setTheme }) {
  const { i18n } = useTranslation();
  const french = i18n.language === "fr";

  return (
    <div className="appearance-panel">
      <label className="appearance-field">
        <span>{french ? "Apparence" : "Appearance"}</span>
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
        >
          <option value="light">{french ? "Clair" : "Light"}</option>
          <option value="dark">{french ? "Sombre" : "Dark"}</option>
        </select>
      </label>
    </div>
  );
}
