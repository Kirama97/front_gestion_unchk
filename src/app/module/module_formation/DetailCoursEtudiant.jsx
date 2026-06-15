import React from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'




const Detailcourstudiant = () => {
    const {id } = useParams()
    const cours = {
        id: 1,
        titre: "Algorithme Avancée",
        tuteur: "Amadou Diop",
        duree: "10h",
        sequences: [
            {
            id: 1,
            titre: "Introduction",
            contenu: "Bienvenue dans le cours d'algorithme avancée.",
            },
            {
            id: 2,
            titre: "Les arbres binaires",
            contenu: "Cette séquence présente les arbres binaires.",
            },
            {
            id: 3,
            titre: "Les graphes",
            contenu: "Cette séquence explique les graphes et leurs parcours.",
            },
        ],
        };



//     if(!cours) {
//     return (
//       <div className="flex flex-col gap-3 items-center justify-center h-screen">
//         <p className="text-gray-500 text-lg">Cours introuvable.</p>
//          <Link
//           to='/etudiant/mes_cours'
//            className='px-10 py-2 bg-black rounded-xl text-white'
//            > Mes Cours</Link>
//       </div>
//     );
//   }

  return (
    <div className='w-full px-[5%] sm:px-[10%]'>
         <div className="w-full h-[10vh] flex px-3  items-center justify-between  border-b mt-3 ">
              <div className="flex flex-col  items-start">
                  <h1 className='text-xl font-bold'>ALgorithme Avancee</h1>
                  <p className='text-xs mt-1 text-neutral-400'>tuteur : <strong className='text-orange-500'> Amadou Diop</strong> </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                 <p className='text-sm text-neutral-600'>Nombre d'heure :</p> <span className=' px-2 py-1 bg-orange-500 text-white rounded-lg'>10h</span>
              </div>
         </div>

         {/* contenue du cour */}
         <div className="flex flex-1 ">
            {/* Sidebar */}
         <aside className="w-64 bg-white border-r p-6 max-md:hidden">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">
                Les séquences
                </span>

                {cours.sequences.map((sequence) => (
                 <NavLink
                    key={sequence.id}
                    to={`sequence/${sequence.id}`}
                    className={({ isActive }) =>
                    `text-xs font-medium px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2.5
                    ${
                        isActive
                        ? "bg-orange-500 text-white shadow"
                        : "text-neutral-600 hover:text-orange-600 hover:bg-orange-50/50"
                    }`
                    }
                >
                    {sequence.titre}
                </NavLink>
                ))}
            </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 min-h-[300px]">
                <Outlet />
            </div>
            </main>
      </div>
    </div>

   
  
    
  )
}

export default Detailcourstudiant
