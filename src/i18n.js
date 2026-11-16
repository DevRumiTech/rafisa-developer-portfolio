import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Keep all translations together until the site grows larger.
const resources = {
  en: {
    translation: {
      nav: {
        work: "Work",
        about: "About",
        contact: "Contact"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        work: "Projets",
        about: "À propos",
        contact: "Contact"
      }
    }
  }
};

// Restore the language selected during an earlier visit.
const savedLanguage = localStorage.getItem("portfolio-language");

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage === "fr" ? "fr" : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

// Remember changes and update the document language.
i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;
  localStorage.setItem("portfolio-language", language);
});

document.documentElement.lang = i18n.language;

const portfolioCopy = {
  en: {
    role: "Full-Stack Developer",
    intro: "I develop full-stack web applications, from user interfaces and APIs to database-driven systems. My technical experience includes React, TypeScript, Node.js, Python, PostgreSQL and MySQL.",
    viewWork: "Selected work",
    work: "Selected projects",
    about: "About me",
    contact: "Contact",
    contactMessage: "For employment opportunities and professional enquiries.",
    contactButton: "Contact me",
    aboutLead: "I build functional web applications, from user interfaces to the systems supporting them.",
    hobbies: "Outside programming: Shotokan Karate, guitar and video games.",
    current: "CURRENT EXPERIENCE",
    previous: "PREVIOUS EXPERIENCE",
    rafisaRole: "Full-Stack Developer Intern",
    gaeaRole: "Web Developer Intern",
    rafisaDates: "October 2026 - January 2027",
    rafisaLocation: "St-Légier, Vaud, Switzerland",
    gaeaLocation: "Geneva, Switzerland",
    gaeaDates: "June - September 2025",
    footer: "DESIGNED & DEVELOPED IN SWITZERLAND",
    back: "BACK TO TOP",
    projects: {
      "01": { category: "FRONTEND / CRM", desc: "Client onboarding, role-based workspaces and compliance reviews." },
      "02": { category: "FULL-STACK / INVENTORY", desc: "Inventory management with serialized products and manufacturing batches." },
      "03": { category: "FRONTEND / FINTECH", desc: "Multilingual Swiss digital-wallet interface." },
      "04": { category: "FULL-STACK / ANALYTICS", desc: "Retail revenue, margin and product reporting." },
      "05": { category: "FULL-STACK / WORD GAME", desc: "Word-guessing game with player accounts and game history." }
    }
  },
  fr: {
    role: "Développeur Full-Stack",
    intro: "Je développe des applications web full-stack, des interfaces et API aux systèmes reposant sur des bases de données. Mes compétences techniques comprennent React, TypeScript, Node.js, Python, PostgreSQL et MySQL.",
    viewWork: "Voir les projets",
    work: "Projets sélectionnés",
    about: "À propos de moi",
    contact: "Contact",
    contactMessage: "Pour toute opportunité d'emploi ou prise de contact professionnelle.",
    contactButton: "Me contacter",
    aboutLead: "Je développe des applications web fonctionnelles, des interfaces utilisateur aux systèmes qui les prennent en charge.",
    hobbies: "En dehors du développement : karaté Shotokan, guitare et jeux vidéo.",
    current: "EXPÉRIENCE ACTUELLE",
    previous: "EXPÉRIENCE PRÉCÉDENTE",
    rafisaRole: "Stagiaire développeur Full-Stack",
    gaeaRole: "Stagiaire développeur web",
    rafisaDates: "Octobre 2026 - janvier 2027",
    rafisaLocation: "St-Légier, Vaud, Suisse",
    gaeaLocation: "Genève, Suisse",
    gaeaDates: "Juin - septembre 2025",
    footer: "CONÇU ET DÉVELOPPÉ EN SUISSE",
    back: "RETOUR EN HAUT",
    projects: {
      "01": { category: "FRONTEND / CRM", desc: "Gestion de l'accueil des clients, des espaces par rôle et des contrôles de conformité." },
      "02": { category: "FULL-STACK / INVENTAIRE", desc: "Gestion des stocks avec produits sérialisés et lots de fabrication." },
      "03": { category: "FRONTEND / FINTECH", desc: "Interface multilingue d'un portefeuille numérique suisse." },
      "04": { category: "FULL-STACK / ANALYSE", desc: "Tableau de bord des ventes, marges et performances des produits." },
      "05": { category: "FULL-STACK / JEU DE MOTS", desc: "Jeu de mots avec comptes joueurs et historique des parties." }
    }
  }
};

// Merge homepage translations with existing navigation translations.
for (const [language, portfolio] of Object.entries(portfolioCopy)) {
  i18n.addResourceBundle(language, "translation", { portfolio }, true, true);
}

export default i18n;
