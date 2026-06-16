export const coursesData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    titre: "Introduction à HTML & CSS",
    description:
      "Apprenez à créer des pages web modernes avec HTML5 et CSS3.",
    tuteur: "Mouhamed Ndiaye",
    duree: "20h",
    progress: 75,
    sequences: [
      {
        id: 1,
        titre: "Introduction au Web et HTML5",
        contenu: "Cette séquence aborde l'histoire du web, le fonctionnement d'un navigateur, la structure de base d'un document HTML5, et les balises sémantiques indispensables. Le HTML (HyperText Markup Language) structure le contenu tandis que le CSS (Cascading Style Sheets) gère la présentation.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duree: "2h 30m",
        objectifs: [
          "Comprendre le protocole HTTP et le rôle du navigateur web",
          "Créer un fichier HTML5 structurellement valide avec son DOCTYPE",
          "Utiliser correctement les balises sémantiques (header, nav, article, footer)"
        ],
        ressources: [
          { titre: "Support de cours HTML5 PDF", lien: "#" },
          { titre: "Guide de sémantique W3C", lien: "#" }
        ]
      },
      {
        id: 2,
        titre: "Styliser avec CSS3 et Modèle de boîte",
        contenu: "Introduction aux sélecteurs CSS, aux règles de cascade et d'héritage, aux propriétés de couleur et de texte, ainsi qu'au modèle de boîte (Margin, Border, Padding, Content). Le box model est crucial pour comprendre comment les éléments s'espacent dans la page.",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        duree: "3h 15m",
        objectifs: [
          "Maîtriser les différents types de sélecteurs (balise, classe, ID, attributs)",
          "Appliquer le modèle de boîte (Box Model) et la propriété box-sizing",
          "Manipuler la typographie et les couleurs"
        ],
        ressources: [
          { titre: "Cheat Sheet CSS Modèle de boîte", lien: "#" },
          { titre: "Outil interactif de Box Model CSS", lien: "#" }
        ]
      },
      {
        id: 3,
        titre: "Mise en page moderne : Flexbox et Grid",
        contenu: "Apprenez à concevoir des layouts flexibles et des grilles bidimensionnelles complexes grâce à CSS Flexbox et CSS Grid. Vous verrez comment aligner et répartir l'espace entre des items dans un conteneur, même lorsque leur taille est inconnue ou dynamique.",
        duree: "4h 00m",
        objectifs: [
          "Construire une interface complexe à une dimension avec Flexbox",
          "Concevoir une structure en grille à deux dimensions avec Grid",
          "Créer des designs adaptatifs à l'aide des Media Queries"
        ],
        ressources: [
          { titre: "Guide complet CSS-Tricks Flexbox", lien: "#" },
          { titre: "Guide complet CSS-Tricks Grid", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Ma première page web sémantique",
        description: "Dans ce TD, vous devez structurer votre CV personnel en ligne en utilisant uniquement du HTML5 sémantique. Aucun style CSS n'est requis à ce stade. L'accent est mis sur le bon choix des balises et le respect de la hiérarchie des titres (h1 à h6).",
        deadline: "2026-06-20",
        fichierNom: "TD1_Structure_HTML5.pdf",
        statut: "Corrigé",
        note: "18/20",
        feedback: "Excellente structure sémantique. Attention à ne pas sauter de niveau de titre (ne pas passer de h2 à h4 sans h3)."
      },
      {
        id: 2,
        titre: "TD 2 : Mise en page responsive d'un portfolio",
        description: "Intégrez une maquette de portfolio d'artiste en utilisant CSS Flexbox et CSS Grid pour assurer un rendu parfait sur mobile (max-width: 640px), tablette (max-width: 1024px) et écran d'ordinateur.",
        deadline: "2026-06-28",
        fichierNom: "TD2_CSS_Responsive.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Intégration complète d'un site vitrine d'agence",
        description: "Intégrez la maquette d'un site vitrine d'une agence de voyage d'au moins 3 pages (Accueil, Destinations, Contact) liées entre elles. Le site doit inclure un menu de navigation responsive, un formulaire de contact structuré, et respecter les critères d'accessibilité RGAA/WCAG de base.",
        deadline: "2026-07-05",
        coefficient: 2,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    titre: "JavaScript pour débutants",
    description:
      "Découvrez les bases de JavaScript et rendez vos sites web interactifs.",
    tuteur: "Aminata Sow",
    duree: "30h",
    progress: 40,
    sequences: [
      {
        id: 1,
        titre: "Introduction à JavaScript et Variables",
        contenu: "Qu'est-ce que JavaScript et comment s'intègre-t-il avec HTML/CSS ? Cette séquence introduit les types de données fondamentaux (nombres, chaînes, booléens), la déclaration des variables avec let/const, et les opérateurs arithmétiques et logiques.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        duree: "3h 00m",
        objectifs: [
          "Lier un script JavaScript externe à une page HTML",
          "Déclarer des variables et comprendre la différence entre var, let et const",
          "Effectuer des calculs et des comparaisons"
        ],
        ressources: [
          { titre: "MDN Guide de démarrage JavaScript", lien: "#" }
        ]
      },
      {
        id: 2,
        titre: "Structures de contrôle et Fonctions",
        contenu: "Apprenez à orienter le flux d'exécution de votre programme avec les conditions (if, else if, else, switch) et les boucles (for, while). Nous étudierons également la définition des fonctions, les paramètres et les valeurs de retour.",
        duree: "4h 00m",
        objectifs: [
          "Écrire des structures conditionnelles complexes",
          "Utiliser des boucles pour parcourir des listes",
          "Déclarer et invoquer des fonctions (y compris les fonctions fléchées)"
        ],
        ressources: [
          { titre: "Fiche récapitulative : Fonctions JS", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Calculatrice en console",
        description: "Écrire un script JavaScript demandant deux nombres et un opérateur (+, -, *, /) à l'utilisateur à l'aide de prompts, puis affichant le résultat de l'opération dans la console avec une gestion robuste des erreurs (division par zéro, entrées invalides).",
        deadline: "2026-06-22",
        fichierNom: "TD1_Calculatrice_JS.pdf",
        statut: "Corrigé",
        note: "16/20",
        feedback: "Très bon script, la gestion des erreurs est propre. Essayez d'utiliser un switch à la place de multiples structures if/else imbriquées."
      },
      {
        id: 2,
        titre: "TD 2 : Manipulation du DOM",
        description: "Créez une page avec une liste de tâches (To-Do List) interactive. L'utilisateur doit pouvoir ajouter une tâche via un champ de texte et un bouton, marquer une tâche comme terminée au clic (barrer le texte), et supprimer une tâche.",
        deadline: "2026-06-30",
        fichierNom: "TD2_Manipulation_DOM.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Jeu du Juste Prix Interactif",
        description: "Développez le jeu du Juste Prix en HTML/CSS/JS. L'ordinateur choisit un nombre aléatoire entre 1 et 100. L'étudiant dispose de 10 essais pour le deviner. À chaque essai, l'interface indique 'Plus grand' ou 'Plus petit'. Le jeu doit enregistrer le meilleur score de l'étudiant dans le localStorage.",
        deadline: "2026-07-10",
        coefficient: 2,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    titre: "Développement React",
    description:
      "Créez des interfaces utilisateur modernes avec React et les Hooks.",
    tuteur: "Cheikh Fall",
    duree: "40h",
    progress: 10,
    sequences: [
      {
        id: 1,
        titre: "Les concepts clés de React & JSX",
        contenu: "Découvrez le DOM virtuel de React, le langage JSX, la structure d'un projet React généré par Vite, et comment concevoir vos premiers composants fonctionnels réutilisables.",
        duree: "4h",
        objectifs: [
          "Comprendre le fonctionnement et les avantages du Virtual DOM",
          "Écrire du code JSX valide (balises fermées, className, accolades)",
          "Créer et imbriquer des composants React simples"
        ],
        ressources: [
          { titre: "Documentation officielle de React (fr)", lien: "#" }
        ]
      },
      {
        id: 2,
        titre: "Props et State avec useState",
        contenu: "Comprenez la transmission de données via les Props (en lecture seule) et la gestion de l'état local dynamique au sein d'un composant grâce au Hook useState. Vous apprendrez à mettre à jour l'interface utilisateur en réponse aux actions de l'utilisateur.",
        duree: "5h",
        objectifs: [
          "Passer des données d'un composant parent à un composant enfant via les props",
          "Initialiser et mettre à jour un état avec useState",
          "Gérer les événements (onClick, onChange, onSubmit)"
        ],
        ressources: [
          { titre: "Guide interactif sur le Hook useState", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Liste de cartes produits interactive",
        description: "Créez un catalogue de produits interactif en React. Créez un composant ProductCard réutilisable acceptant des props (nom, prix, image, stock) et un bouton 'Ajouter au panier'. Affichez le nombre total d'articles dans le panier au sommet de la page.",
        deadline: "2026-06-25",
        fichierNom: "TD1_React_Components.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Dashboard de gestion de bibliothèque",
        description: "Réalisez une application de gestion de livres. L'application doit permettre d'ajouter, éditer, supprimer et filtrer des livres par catégorie. Utilisez des états complexes et séparez le code en composants atomiques et réutilisables.",
        deadline: "2026-07-15",
        coefficient: 3,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    titre: "Node.js & Express",
    description:
      "Développez des API REST performantes avec Node.js et Express.",
    tuteur: "Fatou Diop",
    duree: "35h",
    progress: 0,
    sequences: [
      {
        id: 1,
        titre: "Introduction à Node.js et NPM",
        contenu: "Qu'est-ce que Node.js ? Découvrez l'architecture asynchrone guidée par les événements, l'utilisation de NPM (Node Package Manager), l'installation de dépendances et l'exécution de scripts.",
        duree: "3h",
        objectifs: [
          "Installer Node.js et configurer un projet avec package.json",
          "Utiliser des modules internes comme fs (File System) et path",
          "Gérer les paquets tiers avec npm install"
        ],
        ressources: [
          { titre: "Introduction à Node.js par OpenClassrooms", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Premier serveur HTTP natif",
        description: "Créez un serveur HTTP simple avec le module 'http' de Node.js. Le serveur doit renvoyer du contenu HTML différent selon l'URL appelée (/, /about, /contact) et renvoyer une erreur 404 pour les autres routes.",
        deadline: "2026-06-26",
        fichierNom: "TD1_Serveur_HTTP.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : API REST de gestion de tâches",
        description: "Construisez une API REST complète avec Express.js pour gérer des tâches (CRUD). L'API doit supporter la création, la lecture, la modification et la suppression de tâches persistées dans un fichier JSON. Utilisez des codes de statut HTTP appropriés.",
        deadline: "2026-07-20",
        coefficient: 2,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800",
    titre: "Bases de données MySQL",
    description:
      "Maîtrisez les requêtes SQL et la conception de bases de données relationnelles.",
    tuteur: "Ibrahima Ba",
    duree: "25h",
    progress: 90,
    sequences: [
      {
        id: 1,
        titre: "Introduction aux SGBDR et Modèle Relationnel",
        contenu: "Cette séquence aborde les concepts de bases de données relationnelles, de clés primaires et étrangères, ainsi que l'installation et la configuration de MySQL.",
        duree: "2h",
        objectifs: [
          "Comprendre le modèle entité-association",
          "Identifier les contraintes de clés primaires et étrangères",
          "Installer MySQL et utiliser une interface comme phpMyAdmin ou DBeaver"
        ],
        ressources: [
          { titre: "Guide de conception Merise PDF", lien: "#" }
        ]
      },
      {
        id: 2,
        titre: "Requêtes SQL de base (SELECT, WHERE, ORDER BY)",
        contenu: "Apprenez à interroger une table MySQL : sélection de colonnes, filtrage de lignes avec WHERE et opérateurs de comparaison, et tri de résultats.",
        duree: "3h",
        objectifs: [
          "Écrire des requêtes d'extraction avec SELECT",
          "Filtrer les données avec des conditions logiques (AND, OR, NOT, IN, LIKE)",
          "Trier les résultats avec ORDER BY (ASC, DESC)"
        ],
        ressources: [
          { titre: "Mémo requêtes SQL de base", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Création de tables et insertion de données",
        description: "Rédigez un script SQL pour créer une base de données d'école comportant trois tables (Etudiants, Classes, Notes) et insérer au moins 5 lignes par table.",
        deadline: "2026-06-15",
        fichierNom: "TD1_Creation_BDD.pdf",
        statut: "Corrigé",
        note: "19/20",
        feedback: "Excellent travail. Les contraintes d'intégrité référentielle (ON DELETE CASCADE) sont bien implémentées."
      },
      {
        id: 2,
        titre: "TD 2 : Requêtes avec Jointures (JOIN)",
        description: "Rédiger des requêtes complexes nécessitant des jointures internes (INNER JOIN) et externes (LEFT/RIGHT JOIN) afin de consolider les informations des tables Etudiants et Classes pour afficher les moyennes.",
        deadline: "2026-06-25",
        fichierNom: "TD2_Jointures_SQL.pdf",
        statut: "Corrigé",
        note: "17/20",
        feedback: "Bien joué. Pensez à utiliser des alias de tables pour rendre vos requêtes de jointure plus lisibles."
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Conception complète d'un Schéma de BDD E-commerce",
        description: "Concevez le schéma relationnel complet d'une base de données E-commerce. Vous devez rendre le dictionnaire des données, le modèle conceptuel des données (MCD) et le script SQL de création des tables comportant toutes les clés, index et contraintes nécessaires.",
        deadline: "2026-07-02",
        coefficient: 2,
        statut: "Soumis",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    titre: "Spring Boot avec Java",
    description:
      "Développez des applications backend robustes avec Spring Boot.",
    tuteur: "Khadija Fall",
    duree: "45h",
    progress: 5,
    sequences: [
      {
        id: 1,
        titre: "Introduction à l'écosystème Spring et Java",
        contenu: "Présentation du framework Spring, de l'inversion de contrôle (IoC), de l'injection de dépendances (DI) et de la création d'un projet Spring Boot avec Spring Initializr.",
        duree: "4h",
        objectifs: [
          "Comprendre l'architecture globale de Spring",
          "Générer un projet via Spring Initializr avec Maven",
          "Comprendre le rôle de l'annotation @SpringBootApplication"
        ],
        ressources: [
          { titre: "Documentation Spring Boot officielle", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Mon premier contrôleur REST",
        description: "Créez une application Spring Boot simple avec un contrôleur REST (@RestController) exposant une route GET '/hello' qui renvoie un message d'accueil personnalisé en fonction d'un paramètre d'URL.",
        deadline: "2026-06-29",
        fichierNom: "TD1_Spring_Controller.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : API de Gestion d'Employés avec Spring Data JPA",
        description: "Développez une API REST de gestion des employés dans une entreprise. Utilisez Spring Data JPA et Hibernate pour persister les données dans une base de données H2 (en mémoire). L'API doit supporter les requêtes de base (CRUD) et inclure des validations d'attributs.",
        deadline: "2026-07-22",
        coefficient: 3,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    titre: "Git & GitHub",
    description:
      "Apprenez à gérer les versions de vos projets et collaborer efficacement.",
    tuteur: "Ousmane Diallo",
    duree: "15h",
    progress: 100,
    sequences: [
      {
        id: 1,
        titre: "Introduction au Contrôle de Version",
        contenu: "Qu'est-ce qu'un système de contrôle de version distribué (DVCS) ? Installez Git, initialisez votre premier dépôt local, et maîtrisez le cycle de vie des fichiers (Staged, Commited, Modified).",
        duree: "2h",
        objectifs: [
          "Installer et configurer Git (nom, email)",
          "Initialiser un dépôt local avec 'git init'",
          "Faire des commits propres à l'aide de 'git add' et 'git commit'"
        ],
        ressources: [
          { titre: "Git Cheat Sheet officiel GitHub", lien: "#" }
        ]
      },
      {
        id: 2,
        titre: "Gestion des branches et fusions",
        contenu: "Comprenez le concept de branche dans Git. Apprenez à isoler de nouvelles fonctionnalités dans des branches dédiées, à fusionner vos modifications et à résoudre les conflits de fusion (merge conflicts).",
        duree: "3h",
        objectifs: [
          "Créer et naviguer entre des branches (git branch, git checkout/switch)",
          "Fusionner des branches avec git merge",
          "Identifier et résoudre manuellement un conflit de fusion"
        ],
        ressources: [
          { titre: "Interactive Git Branching Tutorial", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Premier commit et poussée sur GitHub",
        description: "Créez un dépôt local, ajoutez-y un fichier README.md rédigé en markdown décrivant un projet fictif, créez un dépôt public sur GitHub et poussez vos modifications locales (git push).",
        deadline: "2026-06-10",
        fichierNom: "TD1_Git_Introduction.pdf",
        statut: "Corrigé",
        note: "20/20",
        feedback: "Parfait. Les messages de commit respectent bien les conventions et le README est bien formaté."
      },
      {
        id: 2,
        titre: "TD 2 : Résolution de Conflits en équipe",
        description: "Simulez un conflit de fusion localement en modifiant la même ligne d'un fichier sur deux branches différentes. Résolvez le conflit manuellement et commitez le résultat.",
        deadline: "2026-06-18",
        fichierNom: "TD2_Git_Conflicts.pdf",
        statut: "Soumis",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Collaboration en équipe via Pull Request",
        description: "Par groupes de 3, créez un dépôt partagé. Chaque membre doit créer une branche pour ajouter sa page web personnelle, puis proposer ses modifications au reste du groupe via une Pull Request (PR) sur GitHub. Toutes les PR doivent être revues et fusionnées sur la branche principale.",
        deadline: "2026-06-25",
        coefficient: 1,
        statut: "Soumis",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    titre: "Cybersécurité : les fondamentaux",
    description:
      "Comprenez les bonnes pratiques pour sécuriser vos applications et vos données.",
    tuteur: "Mariama Cissé",
    duree: "20h",
    progress: 0,
    sequences: [
      {
        id: 1,
        titre: "Principes généraux de la Sécurité Informatique",
        contenu: "Introduction aux piliers de la sécurité de l'information (Confidentialité, Intégrité, Disponibilité - CIA Triad). Analyse des menaces courantes et notion de surface d'attaque.",
        duree: "2h 30m",
        objectifs: [
          "Définir la triade de sécurité (CIA)",
          "Distinguer les types d'attaques (phishing, ransomware, brute-force)",
          "Appliquer le principe du moindre privilège"
        ],
        ressources: [
          { titre: "Guide d'hygiène informatique de l'ANSSI", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Analyse d'un email de phishing",
        description: "Analysez plusieurs exemples de courriels et identifiez les indices révélant une tentative d'hameçonnage (phishing) : URL maquillée, fautes, urgence feinte, etc.",
        deadline: "2026-06-27",
        fichierNom: "TD1_Phishing_Analysis.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Audit de Sécurité d'une Application Web simple",
        description: "À partir d'une application web vulnérable fournie, identifiez au moins 3 failles de sécurité majeures du Top 10 OWASP (ex: Injection SQL, XSS, mauvaise configuration de sécurité) et proposez des correctifs de code.",
        deadline: "2026-07-12",
        coefficient: 2,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    titre: "Python pour la Data Science",
    description:
      "Manipulez des données et créez vos premiers scripts d'analyse avec Python.",
    tuteur: "Abdoulaye Sy",
    duree: "35h",
    progress: 0,
    sequences: [
      {
        id: 1,
        titre: "Rappels Python et structures de données",
        contenu: "Cette séquence passe en revue les syntaxes fondamentales de Python ainsi que les structures de données natives indispensables pour la Data Science : listes, tuples, dictionnaires, ensembles.",
        duree: "3h",
        objectifs: [
          "Manipuler les listes et les compréhensions de listes",
          "Structurer des données avec des dictionnaires",
          "Écrire des fonctions avec des arguments nommés et optionnels"
        ],
        ressources: [
          { titre: "Python Cheat Sheet pour la Data Science", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Nettoyage d'une liste de données",
        description: "Écrire un script Python pour nettoyer un fichier contenant des adresses emails mal formées, des doublons et des lignes vides. Exportez le résultat dans un fichier propre.",
        deadline: "2026-06-29",
        fichierNom: "TD1_Python_Cleaning.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Analyse exploratoire d'un jeu de données avec Pandas",
        description: "Chargez un fichier CSV de ventes en utilisant la bibliothèque Pandas. Calculez des statistiques descriptives (moyenne, médiane par catégorie), gérez les valeurs manquantes, et créez 3 graphiques pertinents avec Matplotlib ou Seaborn.",
        deadline: "2026-07-18",
        coefficient: 3,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800",
    titre: "Docker et la conteneurisation",
    description:
      "Déployez et exécutez vos applications dans des conteneurs Docker.",
    tuteur: "Sokhna Mbengue",
    duree: "20h",
    progress: 0,
    sequences: [
      {
        id: 1,
        titre: "Concepts de base : Machine Virtuelle vs Conteneur",
        contenu: "Comprenez la différence fondamentale entre la virtualisation matérielle et la conteneurisation au niveau du système d'exploitation. Présentation de l'architecture Docker (Daemon, Client, Hub).",
        duree: "2h 30m",
        objectifs: [
          "Comprendre les avantages de Docker pour la cohérence des environnements",
          "Installer Docker et tester son installation avec 'docker run hello-world'",
          "Comprendre le concept d'image et de conteneur"
        ],
        ressources: [
          { titre: "Guide visuel de l'architecture Docker", lien: "#" }
        ]
      }
    ],
    tds: [
      {
        id: 1,
        titre: "TD 1 : Premier conteneur Web Nginx",
        description: "Lancez un conteneur Nginx en mappant le port 80 de votre machine locale sur le port 80 du conteneur. Personnalisez la page d'accueil par défaut en montant un dossier HTML local.",
        deadline: "2026-06-30",
        fichierNom: "TD1_Docker_Nginx.pdf",
        statut: "À faire",
        note: null,
        feedback: null
      }
    ],
    devoirs: [
      {
        id: 1,
        titre: "Devoir 1 : Conteneurisation d'une application Node.js",
        description: "Rédigez un Dockerfile optimisé pour conteneuriser une application web Node.js/Express. L'image doit exclure les node_modules locaux via un .dockerignore, exécuter l'application en tant qu'utilisateur non-root pour des raisons de sécurité, et utiliser une image de base alpine légère.",
        deadline: "2026-07-25",
        coefficient: 2,
        statut: "À faire",
        note: null,
        feedback: null
      }
    ]
  }
];
