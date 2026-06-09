import React from 'react'
import { FiCalendar, FiFileText, FiMessageSquare } from 'react-icons/fi'
import QuickActionCard from './QuickActionCard'

const AccesRapide = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Accès Rapide</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Vos services et outils les plus utilisés.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard 
          icon={FiCalendar} 
          title="Emploi du Temps" 
          description="Consulter votre planning de cours" 
          to="/etudiant/emploi-du-temps" 
        />
        <QuickActionCard 
          icon={FiFileText} 
          title="Notes & Bulletins" 
          description="Voir vos résultats et relevés de notes" 
          to="/etudiant/notes" 
        />
        <QuickActionCard 
          icon={FiMessageSquare} 
          title="Contacter mon Tuteur" 
          description="Envoyer un message à votre encadrant" 
          to="/etudiant/contacter" 
        />
      </div>
    </div>
  )
}

export default AccesRapide
