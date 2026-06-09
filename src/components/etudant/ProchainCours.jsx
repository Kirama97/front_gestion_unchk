import React from 'react'
import { FiClock, FiUser, FiMapPin } from 'react-icons/fi'

const ProchainCours = ({ prochainCours }) => {
  return (
    <div className="-mt-20 relative z-10 mb-10">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-200/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-orange-500 text-white shadow-md shadow-blue-500/20">
            <FiClock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">Prochain Cours</span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">{prochainCours.subject}</h3>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><FiUser className="w-3 h-3" /> {prochainCours.teacher}</span>
              <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" /> {prochainCours.room}</span>
              <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {prochainCours.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {prochainCours.status}
          </span>
          <a href="/etudiant/emploi-du-temps" className="text-[10px] font-bold bg-orange-400 hover:bg-orange-100 hover:shadow-xl  py-1 px-2 rounded-xl text-white hover:text-orange-500 transition">
            Voir l'emploi du temps →
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProchainCours
