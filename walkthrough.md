# Compte-Rendu des Travaux (Walkthrough)

Toutes les spécifications du projet pour l'Université Cheikh Hamidou KANE ont été complétées. Dans cette dernière phase, nous avons implémenté la gestion des tuteurs par classe et rendu les navbars de tous les dashboards (Étudiants, Enseignants, Tuteurs) dynamiques avec des notifications et messages en temps réel. De plus, nous avons ajouté la gestion et la modification des emplois du temps avec des contraintes pour les enseignants.

---

## 1. Composants Réutilisables & Système de Notifications

*   **Modal Réutilisable** : Création d'un composant générique [Modal.jsx](file:///c:/Users/KIRA%20DEV/Downloads/Documents/Cour%20M1%20S2%20ingenierie%20Logiciel/Technologies%20d'application web/Projet/projet_exam_s2/full_remote_gestion/front_gestion_unchk/src/components/common/Modal.jsx). Il unifie l'esthétique et le comportement (animation d'entrée, arrière-plan flouté semi-transparent, fermeture au clic extérieur et bouton X) et est utilisé pour l'ensemble des formulaires de modification.
*   **Notifications Toast** : Les popups `alert()` du navigateur et les bannières statiques locales ont été retirés au profit du service global de notification `showToast` issu du `ToastContext` pour toutes les actions administratives.

---

## 2. Affectation des Tuteurs aux Classes Entières (au lieu d'étudiants individuels)

*   **Migration DB & Modèle** : Création de la migration SQL [V5__add_tuteur_to_classe.sql](file:///c:/Users/KIRA%20DEV/Downloads/Documents/Cour%20M1%20S2%20ingenierie%20Logiciel/Technologies%20d'application%20web/Projet/projet_exam_s2/full_remote_gestion/_test_back_gestion_unchk/src/main/resources/db/migration/V5__add_tuteur_to_classe.sql) ajoutant `tuteur_id` à la table `classes`. Ajout de la relation ManyToOne dans [Classe.java](file:///c:/Users/KIRA%20DEV/Downloads/Documents/Cour%20M1%20S2%20ingenierie%20Logiciel/Technologies%20d'application%20web/Projet/projet_exam_s2/full_remote_gestion/_test_back_gestion_unchk/src/main/java/com/gestion_unchk/gestion_unchk/model/Classe.java).
*   **Interface Administrateur** : Mise à jour de [AdminTuteurs.jsx](file:///c:/Users/KIRA%20DEV/Downloads/Documents/Cour%20M1%20S2%20ingenierie%20Logiciel/Technologies%20d'application%20web/Projet/projet_exam_s2/full_remote_gestion/front_gestion_unchk/src/pages/administrateur/AdminTuteurs.jsx). L'onglet des affectations affiche maintenant les **classes** au lieu des étudiants individuels. L'admin peut assigner un tuteur par classe.
*   **Groupes de Suivi Dynamiques** : L'onglet "Groupes de Suivi" calcule dynamiquement les effectifs d'étudiants sous la responsabilité de chaque tuteur en sommant les effectifs réels des classes affectées.

---

## 3. Dynamisation des Navbars / Headers (Étudiants, Enseignants, Tuteurs)

*   **Récupération de Données Réelles** : Les données simulées ou obsolètes des navbars ont été remplacées par des requêtes à l'API `/api/notifications`.
*   **Séparation Notification / Message** :
    *   Les **notifications académiques** (cloche) filtrent les éléments où `category !== 'message'` (notifications de planning, de devoirs ou de notes).
    *   Les **messages** (bulle) filtrent les éléments où `category === 'message'` (messages envoyés par les enseignants ou la scolarité).
*   **Polling en Temps Réel** : Un mécanisme de rafraîchissement périodique (toutes les 10 secondes) a été mis en place sur les trois dashboards pour charger les nouvelles notifications sans rechargement de page.
*   **Alerte par Toast** : À chaque réception d'une nouvelle notification ou d'un nouveau message non lu, un Toast dynamique s'affiche instantanément au bas de l'écran pour alerter l'utilisateur en temps réel.
*   **Actions de Lecture** : Les boutons "Tout marquer comme lu" et les clics sur chaque notification/message individuel déclenchent un appel `PUT /api/notifications/{id}/read` au backend et mettent à jour le compteur d'éléments non lus.

---

## 4. Gestion des Emplois du Temps & Contraintes Enseignants

*   **Contrainte Enseignant** : Le backend (`createEmploiDuTemps` et `updateEmploiDuTemps`) valide désormais que pour un même enseignant, le même cours (`Cours` comprenant le prof, la matière et la classe) ne peut être planifié qu'une seule fois dans la journée (`jourSemaine`). Si la contrainte est violée, une erreur 400 Bad Request est renvoyée avec un message structuré affiché sous forme de Toast.
*   **Notification Automatique de la Classe** : Lors de la création (`POST`) ou de la modification (`PUT`) d'un cours planifié dans l'emploi du temps d'une classe, le backend recherche automatiquement tous les étudiants de cette classe et génère pour chacun d'eux une notification (catégorie `schedule`) détaillant la matière, le jour, l'horaire et la salle.
*   **Modification & Suppression de Créneaux** :
    *   Création des endpoints `PUT /api/emplois-du-temps/{id}` et `DELETE /api/emplois-du-temps/{id}` sur le backend (`FormationController.java`).
    *   Dans l'interface [AdminPlanning.jsx](file:///c:/Users/KIRA%20DEV/Downloads/Documents/Cour%20M1%20S2%20ingenierie%20Logiciel/Technologies%20d'application%20web/Projet/projet_exam_s2/full_remote_gestion/front_gestion_unchk/src/pages/administrateur/AdminPlanning.jsx), chaque créneau horaire possède des icônes d'action Modifier/Supprimer qui s'affichent au survol de la carte de cours.
    *   Cliquer sur l'icône de suppression effectue un appel `DELETE` et recharge instantanément la grille du planning.
    *   Cliquer sur l'icône de modification ouvre le formulaire pré-rempli dans un modal réutilisable, permettant de sauvegarder les modifications en base via `PUT`.

---

## 5. Guide de Vérification et Compilation

1.  **Vérification de la Compilation** :
    *   **Frontend** : `npm run build` termine avec succès (`built in 3.25s`).
    *   **Backend** : `mvn clean compile` termine avec succès (`BUILD SUCCESS`).
2.  **Lancement local** :
    *   Démarrez MySQL.
    *   Lancez le backend : `mvn spring-boot:run` (la migration Flyway V5 s'exécute automatiquement).
    *   Lancez le frontend : `npm run dev`.
3.  **Scénarios de test manuels** :
    *   **Affectation de Classe** : Connectez-vous en tant qu'admin et affectez une classe à un tuteur. Connectez-vous en tant que ce tuteur : une notification "Nouvelle classe affectée" apparaît dans sa cloche.
    *   **Planification de Cours** : 
        *   Tentez de planifier le même cours deux fois le même jour (par exemple le Lundi) pour la même classe et le même prof. L'application bloque la demande et affiche un Toast d'erreur.
        *   Modifiez un créneau planifié en cliquant sur l'icône Modifier, puis validez. Les nouvelles valeurs sont immédiatement appliquées.
        *   Supprimez un créneau en cliquant sur l'icône de suppression.
        *   Planifiez un cours pour une classe. Connectez-vous avec le compte d'un étudiant de cette classe : un toast et une notification cloche l'informent instantanément qu'un nouveau cours a été planifié.
