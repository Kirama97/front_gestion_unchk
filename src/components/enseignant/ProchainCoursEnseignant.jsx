import React from 'react'
import { FiClock, FiUser, FiMapPin } from 'react-icons/fi'

const ProchainCoursEnseignant = ({ prochainCours }) => {
  if (!prochainCours) {
    return (
      <div className="-mt-20 relative z-10 mb-10">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-200/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-md shadow-emerald-500/10">
              <FiClock className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Prochaine Séance</span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-500 tracking-tight">Aucun cours programmé prochainement</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a href="/enseignant/emploi-du-temps" className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 rounded-xl text-white transition">
              Voir l'emploi du temps →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="-mt-20 relative z-10 mb-10">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-200/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <FiClock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Prochaine Séance</span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">{prochainCours.subject}</h3>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><FiUser className="w-3 h-3" /> Classe: {prochainCours.classe}</span>
              <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" /> {prochainCours.room}</span>
              <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {prochainCours.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {prochainCours.status}
          </span>
          <a href="/enseignant/emploi-du-temps" className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 rounded-xl text-white transition">
            Voir l'emploi du temps →
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProchainCoursEnseignant
