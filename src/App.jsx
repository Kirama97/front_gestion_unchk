import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Login from './app/commun/Login'
import DashboardAdmin from './app/dashboard/DashboardAdmin'
import ProtectedRoute from './routes/ProtectedRoute'
import PersonnelList from './app/module/module_administration/PersonnelList';
import DashboardEtudiant from './app/dashboard/DashboardEtudiant';
import DashboardInsertion from './app/dashboard/DashboardInsertion';
import DashboardEnseignant from './app/dashboard/DashboardEnseignant';
import EmploiDuTemps from './app/module/module_formation/EmploiDuTemps';
import DashboardTuteur from './app/dashboard/DashboardTuteur';
import PageNonAutorisé from './app/commun/PageNonAutorisé';
import NotFoundPage from './app/commun/NotFoundPage';
import HomeEtudiant from './pages/etudiant/HomeEtudiant';
import HomeAdmin from './pages/administrateur/HomeAdmin';
import CourEtudiant from './pages/etudiant/CourEtudiant';
import DetailCoursEtudiant from './app/module/module_formation/DetailCoursEtudiant';
import DetailSequence from './app/module/module_formation/DetailSequence';
import NotesEtudiant from './pages/etudiant/NotesEtudiant';
import ProfilEtudiant from './pages/etudiant/ProfilEtudiant';
import ParametreEtudiant from './pages/etudiant/ParametreEtudiant';
import ProfilAdmin from './pages/administrateur/ProfilAdmin';
import NouvellePromo from './pages/administrateur/NouvellePromo';
import Etudiants from './pages/administrateur/Etudiants';
import Enseignants from './pages/administrateur/Enseignants';
import AdminAjouterMembre from './pages/administrateur/AdminAjouterMembre';
import AdminNotes from './pages/administrateur/AdminNotes';
import AdminPlanning from './pages/administrateur/AdminPlanning';
import AdminReunions from './pages/administrateur/AdminReunions';
import AdminTuteurs from './pages/administrateur/AdminTuteurs';
import AdminEnseignantMatieres from './pages/administrateur/AdminEnseignantMatieres';
import AdminParametres from './pages/administrateur/AdminParametres';
import HomeEnseignant from './pages/enseignant/HomeEnseignant';
import CourEnseignant from './pages/enseignant/CourEnseignant';
import NotesEnseignant from './pages/enseignant/NotesEnseignant';
import ProfilEnseignant from './pages/enseignant/ProfilEnseignant';
import ParametreEnseignant from './pages/enseignant/ParametreEnseignant';
import TuteurSuivi from './pages/tuteur/TuteurSuivi';
import TuteurReunions from './pages/tuteur/TuteurReunions';
import TuteurBilan from './pages/tuteur/TuteurBilan';
import ProfilTuteur from './pages/tuteur/ProfilTuteur';
import TuteurAccueil from './pages/tuteur/TuteurAccueil';

import CourrierList from './app/module/module_administration/CourrierList';
import NoteServiceList from './app/module/module_administration/NoteServiceList';
import BudgetPage from './app/module/module_administration/BudgetPage';
import CompteRenduList from './app/module/module_communication/CompteRenduList';
import NotificationsPage from './app/module/module_communication/NotificationsPage';
import SuiviEtudiantList from './app/module/module_insertion/SuiviEtudiantList';
import PartenaireList from './app/module/module_insertion/PartenaireList';




function App() {

    const router = createBrowserRouter([

        {
          path: "/", 
          element: <Login />
        },
        {
          path: "/non-autorise",
          element: <PageNonAutorisé />
        },

        // route administration
        {
          path: "/admin",
          element : (
           <ProtectedRoute roleRequired="admin">
              <DashboardAdmin/>
           </ProtectedRoute>
          ),
          children : [
                { index: true, element: <Navigate to="accueil" replace /> },
                { path: "accueil", element: <HomeAdmin /> },
                { path: "profil", element: <ProfilAdmin /> },
                { path: "promotions", element: <NouvellePromo /> },
                { path: "etudiants/promo/nouvelle", element: <NouvellePromo /> },
                { path: "etudiants", element: <Etudiants /> },
                { path: "etudiants/filiere/:filiereId", element: <Etudiants /> },
                { path: "etudiants/filiere/:filiereId/ajouter", element: <AdminAjouterMembre /> },
                { path: "etudiants/filiere/:filiereId/notes", element: <AdminNotes /> },
                { path: "etudiants/filiere/:filiereId/planning", element: <AdminPlanning /> },
                { path: "enseignants", element: <Enseignants /> },
                { path: "enseignants/ajouter", element: <AdminAjouterMembre /> },
                { path: "enseignants/matieres", element: <AdminEnseignantMatieres /> },
                { path: "tuteurs", element: <AdminTuteurs /> },
                { path: "tuteurs/ajouter", element: <AdminAjouterMembre /> },
                { path: "tuteurs/affectations", element: <AdminTuteurs /> },
                { path: "tuteurs/groupes", element: <AdminTuteurs /> },
                { path: "reunions", element: <AdminReunions /> },
                { path: "reunions/nouvelle", element: <AdminReunions /> },
                { path: "planning", element: <AdminPlanning /> },
                { path: "notes", element: <AdminNotes /> },
                { path: "notes/saisir", element: <AdminNotes /> },
                { path: "notes/bulletins", element: <AdminNotes /> },
                { path: "parametres", element: <AdminParametres /> },
                { path: "courriers", element: <CourrierList /> },
                { path: "notes-service", element: <NoteServiceList /> },
                { path: "budget", element: <BudgetPage /> },
                { path: "comptes-rendus", element: <CompteRenduList /> },
                { path: "notifications", element: <NotificationsPage /> }
          ]
        },

        // route etudiant
       {
          path: "/etudiant",
          element: (
            <ProtectedRoute roleRequired="etudiant">
              <DashboardEtudiant />
            </ProtectedRoute>
          ),
          children: [
            { path: "accueil", element: <HomeEtudiant /> },
            { path: "emploi-du-temps", element: <EmploiDuTemps /> },
            { path: "mes_cours", element: <CourEtudiant /> },
            { path: "notes", element: <NotesEtudiant /> },
            { path: "profil", element: <ProfilEtudiant /> },
            { path: "parametre", element: <ParametreEtudiant /> },

            {
              path: "detail_cours/:id",
              element: <DetailCoursEtudiant />,
              children: [
                  {
                  index: true,
                  element: <Navigate to="sequence/1" replace />,
                },
                {
                  path: "sequence/:sequenceId",
                  element: <DetailSequence />,
                },
              ],
            },
          ],
        },
        // route enseignant
        {
          path: "/enseignant",
          element : (
           <ProtectedRoute roleRequired="enseignant">
              <DashboardEnseignant/>
           </ProtectedRoute>
          ),
          children : [
                { index: true, element: <Navigate to="accueil" replace /> },
                { path: "accueil", element: <HomeEnseignant /> },
                { path: "emploi-du-temps", element: <EmploiDuTemps /> },
                { path: "mes_cours", element: <CourEnseignant /> },
                { path: "notes", element: <NotesEnseignant /> },
                { path: "profil", element: <ProfilEnseignant /> },
                { path: "parametre", element: <ParametreEnseignant /> },
          ]
        },
        // route tuteur
        {
          path: "/tuteur",
          element : (
           <ProtectedRoute roleRequired="tuteur">
              <DashboardTuteur/>
           </ProtectedRoute>
          ),
          children : [
                { index: true, element: <Navigate to="accueil" replace /> },
                { path: "accueil", element: <TuteurAccueil /> },
                { path: "emploi-du-temps", element: <EmploiDuTemps /> },
                { path: "suivi", element: <TuteurSuivi /> },
                { path: "reunions", element: <TuteurReunions /> },
                { path: "bilan", element: <TuteurBilan /> },
                { path: "profil", element: <ProfilTuteur /> },
          ]
        },
        // route insertion
        {
          path: "/insertion",
          element : (
            <ProtectedRoute roleRequired="insertion">
              <DashboardInsertion />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="suivi" replace /> },
            { path: "suivi", element: <SuiviEtudiantList /> },
            { path: "partenaires", element: <PartenaireList /> },
            { path: "notifications", element: <NotificationsPage /> }
          ]
        },
        // wildcards
        {
          path: "*",
          element: <NotFoundPage />
        }

    ])


  return (
    <ToastProvider>
       <RouterProvider  router={router} />
    </ToastProvider>
  )
}

export default App
