import React from 'react'

const BanniereEtudiant = ({ user }) => {
  return (
    <div className="section1 h-[70vh] w-full bg-[url(/banniere_etudiant.jpg)] bg-center bg-cover relative">
      {/* Overlay dégradé pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
      
      {/* Contenu flottant sur la bannière */}
      <div className="absolute bottom-20 left-0 right-0 p-6 sm:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-400/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 mb-3">
          Année Académique 2025 – 2026
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Bienvenue, {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : (user.email ? user.email.split('@')[0] : 'Diene Thiam')} !
        </h1>
        <p className="text-xs sm:text-sm text-white/70 mt-1.5 max-w-lg leading-relaxed">
          Suivez vos cours, consultez vos notes et restez informé de l'actualité universitaire.
        </p>
      </div>
    </div>
  )
}

export default BanniereEtudiant
