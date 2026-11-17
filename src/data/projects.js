// Add future verified internship projects here; see docs/ADDING-PROJECTS.md.
export const caseStudies = [
  {
    number: "01",
    slug: "wordle",
    name: "Wordle",
    stack: ["React", "Node.js", "Express", "MySQL"],
    github: "https://github.com/DevRumiTech/wordle-project",
    demo: null,
    evidence: "https://github.com/DevRumiTech/wordle-project/blob/48b414bdb0ad65c892f09fdf3b7b25c6f32f0d5e/README.md",
    screenshots: [
      {
            "src": "/projects/wordle/gameplay-desktop.png",
            "view": "desktop",
            "width": 1440,
            "height": 1335,
            "blob": "0e807eefcc504a486c8d788a3a1bf8426cb958da",
            "label": {
                  "en": "Gameplay · desktop",
                  "fr": "Partie · ordinateur"
            },
            "alt": {
                  "en": "Wordle English game after two accepted guesses, showing letter feedback, four attempts remaining and the on-screen keyboard.",
                  "fr": "Partie Wordle en anglais après deux essais acceptés, avec les indices des lettres, quatre essais restants et le clavier virtuel."
            },
            "note": {
                  "en": "Genuine local test session. Original interface labels are English; profile details are collapsed.",
                  "fr": "Véritable session de test locale. Les libellés de l’interface originale sont en anglais ; les informations du profil sont repliées."
            }
      },
      {
            "src": "/projects/wordle/gameplay-mobile.png",
            "view": "mobile",
            "width": 390,
            "height": 1153,
            "blob": "992dd5d44c05fc79c9d359f390af9a2b300c291c",
            "label": {
                  "en": "Gameplay · mobile",
                  "fr": "Partie · mobile"
            },
            "alt": {
                  "en": "Wordle French game after two accepted guesses, showing letter feedback, four attempts remaining and the on-screen keyboard.",
                  "fr": "Partie Wordle en français après deux essais acceptés, avec les indices des lettres, quatre essais restants et le clavier virtuel."
            },
            "note": {
                  "en": "Genuine local test session. Original interface labels are English; profile details are collapsed.",
                  "fr": "Véritable session de test locale. Les libellés de l’interface originale sont en anglais ; les informations du profil sont repliées."
            }
      },
      {
            "src": "/projects/wordle/signin-desktop.png",
            "view": "desktop",
            "width": 1440,
            "height": 1000,
            "blob": "2fe4cd2a43cfbcf829de734d66605ab6b65f3fcf",
            "alt": {
                  "en": "Wordle sign-in form on desktop.",
                  "fr": "Formulaire de connexion Wordle sur ordinateur."
            },
            "note": {
                  "en": "Original English interface captured locally. No player information is displayed.",
                  "fr": "Interface originale en anglais, capturée localement. Aucune donnée de joueur n’est affichée."
            },
            "label": {
                  "en": "Sign-in · desktop",
                  "fr": "Connexion · ordinateur"
            }
      },
      {
            "src": "/projects/wordle/signin-mobile.png",
            "view": "mobile",
            "width": 390,
            "height": 844,
            "blob": "fe93477b0e8b04080006407d95307f314a54b176",
            "alt": {
                  "en": "Wordle sign-in form on mobile.",
                  "fr": "Formulaire de connexion Wordle sur mobile."
            },
            "note": {
                  "en": "Original English interface captured locally. No player information is displayed.",
                  "fr": "Interface originale en anglais, capturée localement. Aucune donnée de joueur n’est affichée."
            },
            "label": {
                  "en": "Sign-in · mobile",
                  "fr": "Connexion · mobile"
            }
      }
],
    implementation: [
      { title: { en: "Interface", fr: "Interface" }, description: {
        en: "The React interface accepts physical and virtual keyboard input and restores unfinished games.",
        fr: "L’interface React accepte les claviers physique et virtuel et restaure les parties inachevées." } },
      { title: { en: "Game logic", fr: "Logique de jeu" }, description: {
        en: "The Express backend validates five-letter guesses, evaluates repeated letters in two passes and calculates scores for up to six attempts.",
        fr: "Le backend Express valide les mots de cinq lettres, évalue les lettres répétées en deux passes et calcule les scores sur six essais au maximum." } },
      { title: { en: "Persistence", fr: "Persistance" }, description: {
        en: "MySQL stores games and sessions. Authenticated players can review their personal history and statistics.",
        fr: "MySQL conserve les parties et les sessions. Les joueurs authentifiés peuvent consulter leur historique personnel et leurs statistiques." } },
    ],
    summary: {
      en: "A full-stack word game with player accounts, server-side game logic and saved game history.",
      fr: "Un jeu de mots full-stack avec comptes utilisateurs, logique de jeu côté serveur et historique des parties."
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
