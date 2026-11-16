// Information is based on the existing GitHub projects.
// Live demonstrations and source links are kept separately.
export const caseStudies = [
  {
    number: "01",
    slug: "alpine-clientflow",
    name: "Alpine ClientFlow",
    stack: ["React", "TypeScript", "TanStack Query", "Zod", "IndexedDB"],
    github: "https://github.com/DevRumiTech/alpine-clientflow",
    demo: "https://alpine-clientflow.vercel.app",
    summary: {
      en: "A browser-based client onboarding application for a Swiss financial-services setting.",
      fr: "Une application de gestion de l'intégration des clients dans un contexte de services financiers suisses."
    },
    features: {
      en: [
        "Role-based workspaces",
        "Six-step client onboarding",
        "Compliance reviews",
        "Browser data persistence",
        "English and French interface"
      ],
      fr: [
        "Espaces de travail selon les rôles",
        "Intégration des clients en six étapes",
        "Contrôles de conformité",
        "Sauvegarde des données dans le navigateur",
        "Interface en anglais et en français"
      ]
    }
  },
  {
    number: "02",
    slug: "verilot",
    name: "VeriLot",
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Prisma"],
    github: "https://github.com/DevRumiTech/verilot",
    demo: "https://verilot-seven.vercel.app",
    summary: {
      en: "A full-stack inventory system for serialized products, manufacturing batches and custody records.",
      fr: "Un système full-stack de gestion des stocks, des produits sérialisés, des lots de fabrication et de leur suivi."
    },
    features: {
      en: [
        "Serialized product records",
        "Manufacturing batch management",
        "Custody history",
        "Alerts and recalls",
        "Read-only public demonstration"
      ],
      fr: [
        "Gestion des produits sérialisés",
        "Gestion des lots de fabrication",
        "Historique des mouvements",
        "Alertes et rappels de produits",
        "Démonstration publique en lecture seule"
      ]
    }
  },
  {
    number: "03",
    slug: "rumipay",
    name: "RumiPay",
    stack: ["JavaScript", "HTML5", "CSS3", "Vite"],
    github: "https://github.com/DevRumiTech/swiss-wallet-frontend",
    demo: "https://swiss-wallet-frontend.vercel.app",
    summary: {
      en: "A multilingual Swiss digital-wallet interface with account, payment and transaction features.",
      fr: "Une interface multilingue de portefeuille numérique suisse avec gestion des comptes, paiements et transactions."
    },
    features: {
      en: [
        "Account dashboard",
        "Payment simulations",
        "Transaction history",
        "Rewards management",
        "Four interface languages"
      ],
      fr: [
        "Tableau de bord des comptes",
        "Simulation de paiements",
        "Historique des transactions",
        "Gestion des récompenses",
        "Interface en quatre langues"
      ]
    }
  },
  {
    number: "04",
    slug: "sql-ops-dashboard",
    name: "SQL Ops Dashboard",
    stack: ["Python", "Flask", "SQLite", "JavaScript"],
    github: "https://github.com/DevRumiTech/sql-ops-dashboard",
    demo: "https://sql-ops-dashboard.vercel.app",
    summary: {
      en: "A retail analytics dashboard using a Python backend, relational database and interactive reporting.",
      fr: "Un tableau de bord d'analyse commerciale utilisant Python, une base de données relationnelle et des rapports interactifs."
    },
    features: {
      en: [
        "Revenue and margin reporting",
        "SQL-based analytics",
        "Interactive filters",
        "Product performance tables",
        "CSV export"
      ],
      fr: [
        "Analyse du chiffre d'affaires et des marges",
        "Analyses reposant sur SQL",
        "Filtres interactifs",
        "Tableaux de performance des produits",
        "Export CSV"
      ]
    }
  },
  {
    number: "05",
    slug: "wordle",
    name: "Wordle",
    stack: ["React", "Node.js", "Express", "MySQL"],
    github: null,
    demo: null,
    summary: {
      en: "A full-stack word game developed during my Rafisa internship, with player accounts and persistent game history.",
      fr: "Un jeu de mots full-stack développé durant mon stage chez Rafisa, avec comptes utilisateurs et historique des parties."
    },
    features: {
      en: [
        "Registration and authentication",
        "English and French dictionaries",
        "Server-side game logic",
        "Saved game history",
        "Player statistics"
      ],
      fr: [
        "Inscription et authentification",
        "Dictionnaires anglais et français",
        "Logique de jeu côté serveur",
        "Historique des parties",
        "Statistiques des joueurs"
      ]
    }
  }
];

export const projectSlugByName = Object.fromEntries(
  caseStudies.map((project) => [project.name, project.slug])
);
