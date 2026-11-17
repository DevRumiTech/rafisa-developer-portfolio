export const resources = {
  en: {
    translation: {
      nav: {
        work: "Projects",
        skills: "Skills", education: "Education",
        cv: "CV",
        about: "About",
        contact: "Contact"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        work: "Projets",
        skills: "Compétences", education: "Formation",
        cv: "CV",
        about: "À propos",
        contact: "Contact"
      }
    }
  }
};

const portfolioCopy = {
  en: {
    implementation: "How it works", implementationSource: "Read the project documentation",
    cvTitle: "Curriculum vitae", cvUnavailable: "No CV is currently available to download.",
    cvRequest: "Ask about my CV", cvSubject: "CV enquiry", cvDownload: "Download CV (PDF)",
    recoveryTitle: "This page could not be displayed", recoveryText: "Please reload the page to try again.", recoveryAction: "Reload page",
    gaeaName: "Gaea21 NGO",
    navigation: "Main navigation", language: "Website language", skip: "Skip to content",
    engineering: "DEVELOPMENT & ENGINEERING", eyebrow: "WEB DEVELOPMENT / VAUD, SWITZERLAND",
    workIndex: "WORK", profileIndex: "PROFILE", skillsIndex: "SKILLS", educationIndex: "EDUCATION",
    github: "View GitHub profile", newTab: "opens in a new tab", home: "Home",
    missingPage: "Page not found", missingProject: "Project not found",
    searchProjects: "Find a project", searchHelp: "Search by name, technology or description.", clearSearch: "Clear search",
    projectCount_one: "{{count}} project", projectCount_other: "{{count}} projects",
    noProjects: "No matching projects. Try another term or clear the search.",
    screenshotFailed: "This screenshot could not load. You can retry or open the original image below.", retryImage: "Retry image",
    onThisPage: "On this project page",
    screenshots: "Project screenshots", screenshotView: "Screenshot view", desktop: "Desktop", mobile: "Mobile",
    screenshotNote: "Original English interface with demonstration data.", fullImage: "View full-size image",
    openMenu: "Menu", closeMenu: "Close menu",
    emailHelp: "Opens your email application. You review and send the message there.",
    copyEmail: "Copy email address", copying: "Copying…", copied: "Email address copied.",
    copyFailed: "Copy unavailable. Select the email address above and copy it manually.",
    projectFacts: "Project at a glance", category: "Category", demoAccess: "Live demo", sourceAccess: "Source code",
    available: "Linked below", unavailable: "No public link provided", discussProject: "Discuss this project",
    appearance: "Appearance", light: "Light", dark: "Dark",
    detail: {
      back: "Back to projects", caseStudy: "PROJECT CASE STUDY", demo: "View live demo",
      source: "GitHub repository", noDemo: "Public live demo is not available yet.",
      technologies: "Technologies", features: "Implemented features", all: "All projects",
      navigation: "Browse projects", previous: "Previous project", next: "Next project"
    },
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
    rafisaDates: "19 October 2026 – 14 January 2027",
    rafisaLocation: "St-Légier, Vaud, Switzerland",
    gaeaLocation: "Geneva, Switzerland",
    gaeaDates: "June - September 2025",
    footer: "DESIGNED & DEVELOPED IN SWITZERLAND",
    back: "BACK TO TOP",
    projects: {
      "01": { category: "FULL-STACK / WORD GAME", desc: "Word-guessing game with player accounts and game history." }
    }
  },
  fr: {
    implementation: "Fonctionnement", implementationSource: "Lire la documentation du projet",
    cvTitle: "Curriculum vitæ", cvUnavailable: "Aucun CV n’est actuellement disponible au téléchargement.",
    cvRequest: "Me contacter au sujet de mon CV", cvSubject: "Demande de CV", cvDownload: "Télécharger le CV (PDF)",
    recoveryTitle: "Cette page n’a pas pu être affichée", recoveryText: "Rechargez la page pour réessayer.", recoveryAction: "Recharger la page",
    gaeaName: "ONG Gaea21",
    navigation: "Navigation principale", language: "Langue du site", skip: "Aller au contenu",
    engineering: "DÉVELOPPEMENT ET INGÉNIERIE", eyebrow: "DÉVELOPPEMENT WEB / VAUD, SUISSE",
    workIndex: "PROJETS", profileIndex: "PROFIL", skillsIndex: "COMPÉTENCES", educationIndex: "FORMATION",
    github: "Voir le profil GitHub", newTab: "s’ouvre dans un nouvel onglet", home: "Accueil",
    missingPage: "Page introuvable", missingProject: "Projet introuvable",
    searchProjects: "Trouver un projet", searchHelp: "Recherchez par nom, technologie ou description.", clearSearch: "Effacer la recherche",
    projectCount_one: "{{count}} projet", projectCount_other: "{{count}} projets",
    noProjects: "Aucun projet correspondant. Essayez un autre terme ou effacez la recherche.",
    screenshotFailed: "Cette capture n’a pas pu être chargée. Réessayez ou ouvrez l’image originale ci-dessous.", retryImage: "Réessayer",
    onThisPage: "Sur cette page de projet",
    screenshots: "Captures du projet", screenshotView: "Vue de la capture", desktop: "Ordinateur", mobile: "Mobile",
    screenshotNote: "Interface originale en anglais avec données de démonstration.", fullImage: "Voir l’image en taille réelle",
    openMenu: "Menu", closeMenu: "Fermer le menu",
    emailHelp: "Ouvre votre application de messagerie. Vous y vérifiez et envoyez le message.",
    copyEmail: "Copier l’adresse e-mail", copying: "Copie en cours…", copied: "Adresse e-mail copiée.",
    copyFailed: "Copie indisponible. Sélectionnez l’adresse e-mail ci-dessus et copiez-la manuellement.",
    projectFacts: "Le projet en bref", category: "Catégorie", demoAccess: "Démonstration", sourceAccess: "Code source",
    available: "Lien ci-dessous", unavailable: "Aucun lien public fourni", discussProject: "Discuter de ce projet",
    appearance: "Apparence", light: "Clair", dark: "Sombre",
    detail: {
      back: "Retour aux projets", caseStudy: "ÉTUDE DE PROJET", demo: "Voir la démonstration",
      source: "Code sur GitHub", noDemo: "Démonstration publique non disponible actuellement.",
      technologies: "Technologies", features: "Fonctionnalités", all: "Tous les projets",
      navigation: "Parcourir les projets", previous: "Projet précédent", next: "Projet suivant"
    },
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
    rafisaDates: "19 octobre 2026 – 14 janvier 2027",
    rafisaLocation: "St-Légier, Vaud, Suisse",
    gaeaLocation: "Genève, Suisse",
    gaeaDates: "Juin - septembre 2025",
    footer: "CONÇU ET DÉVELOPPÉ EN SUISSE",
    back: "RETOUR EN HAUT",
    projects: {
      "01": { category: "FULL-STACK / JEU DE MOTS", desc: "Jeu de mots avec comptes joueurs et historique des parties." }
    }
  }
};

for (const [language, portfolio] of Object.entries(portfolioCopy)) {
  resources[language].translation.portfolio = portfolio;
}
