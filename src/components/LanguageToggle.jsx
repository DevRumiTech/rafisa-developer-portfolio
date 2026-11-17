import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  return (
    <div className="language-toggle" role="group" aria-label={t("portfolio.language")}>
      {[["en", "English"], ["fr", "Français"]].map(([language, label]) => (
        <button key={language} type="button" lang={language} aria-label={label}
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => i18n.changeLanguage(language)}>
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
