import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./data/translations";
import { normalizeLanguage } from "./utils/language";

let savedLanguage;
try { savedLanguage = localStorage.getItem("portfolio-language"); } catch { /* Storage is optional. */ }

i18n.use(initReactI18next).init({
  resources,
  lng: normalizeLanguage(savedLanguage),
  supportedLngs: ["en", "fr"],
  load: "languageOnly",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
i18n.on("languageChanged", language => {
  const normalized = normalizeLanguage(language);
  document.documentElement.lang = normalized;
  try { localStorage.setItem("portfolio-language", normalized); } catch { /* Keep session language. */ }
});
document.documentElement.lang = normalizeLanguage(i18n.language);
export default i18n;
