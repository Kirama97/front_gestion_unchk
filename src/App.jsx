import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
                { path: "accueil", element: <HomeAdmin /> },
          ]
        },

        // route etudiant
        {
          path: "/etudiant",
          element : (
           <ProtectedRoute roleRequired="etudiant">
              <DashboardEtudiant/>
           </ProtectedRoute>
          ),
          children : [
                { path: "accueil", element: <HomeEtudiant /> },
                { path: "emploi-du-temps", element: <EmploiDuTemps /> },
          ]
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
                { path: "emploi-du-temps", element: <EmploiDuTemps /> },
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
                { path: "emploi-du-temps", element: <EmploiDuTemps /> },
          ]
        },
        // route insertion
        {
          path: "/insertion",
          element : (
            <ProtectedRoute roleRequired="insertion">
              <DashboardInsertion />
            </ProtectedRoute>
          )
        },
        // wildcards
        {
          path: "*",
          element: <NotFoundPage />
        }

    ])


  return (
       <RouterProvider  router={router} />
      )
}

export default App
