import React from 'react'

const BanniereEnseignant = ({ user }) => {
  return (
    <div className="section1 h-[70vh] w-full bg-[url(/banniere_etudiant.jpg)] bg-center bg-cover relative">
      {}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-emerald-950/20" />
      
      {}
      <div className="absolute bottom-20 left-0 right-0 p-6 sm:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 mb-3">
          Année Académique 2025 – 2026
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Bienvenue, Dr. {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : (user.email ? user.email.split('@')[0] : 'Moussa Ndiaye')} !
        </h1>
        <p className="text-xs sm:text-sm text-white/80 mt-1.5 max-w-lg leading-relaxed">
          Espace d'enseignement et de gestion. Gérez vos cours, suivez l'évolution de vos étudiants et saisissez les évaluations.
        </p>
      </div>
    </div>
  )
}

export default BanniereEnseignant
