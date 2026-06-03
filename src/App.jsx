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



function App() {

    const router = createBrowserRouter([

        {path:"/", element:<Login/>},

        // route administration
        {
          element : (
           <ProtectedRoute roleRequired="admin">
              <DashboardAdmin/>
           </ProtectedRoute>
          ),
          children : [
                { path: "personnel", element: <PersonnelList /> },
          ]
        },

        // route etudiant
        {
          element : (
           <ProtectedRoute roleRequired="etudiant">
              <DashboardEtudiant/>
           </ProtectedRoute>
          ),
          children : [
                { path: "emploi_du_temps", element: <EmploiDuTemps /> },
          ]
        },
        // route enseignant
        {
          element : (
           <ProtectedRoute roleRequired="enseignant">
              <DashboardEnseignant/>
           </ProtectedRoute>
          ),
          children : [
                { path: "emploi_du_temps", element: <EmploiDuTemps /> },
          ]
        },
        // route tuteur
        {
          element : (
           <ProtectedRoute roleRequired="tuteur">
              <DashboardTuteur/>
           </ProtectedRoute>
          ),
          children : [
                { path: "emploi_du_temps", element: <EmploiDuTemps /> },
          ]
        }

    ])


  return (
       <RouterProvider  router={router} />
      )
}

export default App
