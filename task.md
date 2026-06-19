Created At: 2026-06-19T16:16:14Z
Completed At: 2026-06-19T16:25:00Z
File Path: `file:///C:/Users/KIRA%20DEV/.gemini/antigravity/brain/f298e426-d399-40ed-8731-abfcb4e2b60c/task.md`

# Liste des tâches - Modification des Emplois du Temps et Contraintes

- `[x]` **Phase 1 : Modifications Backend (Spring Boot)**
  - `[x]` Injecter `CoursRepository` et ajouter la logique de validation dans `FormationController.java`
  - `[x]` Ajouter l'endpoint de modification `PUT /api/emplois-du-temps/{id}` avec la même validation
  - `[x]` Ajouter l'endpoint de suppression `DELETE /api/emplois-du-temps/{id}`
  - `[x]` Compiler et vérifier le bon fonctionnement du backend
- `[x]` **Phase 2 : Modifications Frontend (Vite React)**
  - `[x]` Ajouter les boutons d'action (Modifier / Supprimer) dans les cartes de planning de `AdminPlanning.jsx`
  - `[x]` Implémenter la logique d'ouverture en mode édition dans le modal de `AdminPlanning.jsx`
  - `[x]` Connecter l'appel `PUT` pour soumettre les modifications
  - `[x]` Connecter l'appel `DELETE` pour supprimer un créneau horaire
  - `[x]` Compiler le frontend
- `[x]` **Phase 3 : Tests de validation**
  - `[x]` Tester manuellement la contrainte de cours unique par enseignant par jour
  - `[x]` Tester l'édition et la suppression d'un créneau
