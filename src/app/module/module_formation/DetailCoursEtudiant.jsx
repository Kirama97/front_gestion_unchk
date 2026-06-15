import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";

const Detailcourstudiant = () => {
  const [open, setOpen] = useState(false);

  const cours = {
    id: 1,
    titre: "Algorithme Avancée",
    tuteur: "Amadou Diop",
    duree: "10h",
    sequences: [
      { id: 1, titre: "Introduction", contenu: "Bienvenue dans le cours." },
      { id: 2, titre: "Les arbres binaires", contenu: "Les arbres..." },
      { id: 3, titre: "Les graphes", contenu: "Les graphes..." },
    ],
  };

  return (
    <div className="w-full px-[3%] sm:px-[10%] relative">

      {/* HEADER */}
      <div className="w-full h-[10vh] flex items-center justify-between sm:border-b sm:mt-3 px-3">

        {/* MENU MOBILE */}
        <button
          className="sm:hidden text-4xl"
          onClick={() => setOpen(true)}
        >
          <IoMdArrowDropright className="text-orange-500" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold">
            {cours.titre}
          </h1>
          <p className="text-xs text-neutral-400">
            tuteur :{" "}
            <strong className="text-orange-500">{cours.tuteur}</strong>
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <p className="text-sm text-neutral-600">Nombre d'heure :</p>
          <span className="px-2 py-1 bg-orange-500 text-white rounded-lg">
            {cours.duree}
          </span>
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 sm:hidden z-40"
        />
      )}

      {/* LAYOUT */}
      <div className="flex">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed sm:static top-0 left-0 h-full sm:h-auto z-50
            w-64 bg-white border-r p-6
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
          `}
        >
          {/* CLOSE MOBILE */}
          <div className="flex justify-between items-center sm:hidden mb-4">
            <h2 className="font-bold">Séquences</h2>
            <button onClick={() => setOpen(false)}>
              <FiX />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Les séquences
            </span>

            {cours.sequences.map((sequence) => (
              <NavLink
                key={sequence.id}
                to={`sequence/${sequence.id}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-xs font-medium px-3 py-2.5 rounded-lg transition-all flex items-center gap-2.5
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

        {/* MAIN */}
        <main className="flex-1 p-3 md:p-8 ">
          <div className=" bg-white rounded-2xl border shadow-sm p-6 min-h-[400px]">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Detailcourstudiant;