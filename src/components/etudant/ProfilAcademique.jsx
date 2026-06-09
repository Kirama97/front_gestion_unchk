import React from 'react'
import { FiAward, FiBookOpen, FiMapPin, FiUser } from 'react-icons/fi'
import StatCard from './StatCard'

const ProfilAcademique = () => {
  return (
    <>
      {/* Titre de section */}
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Profil Académique</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Vos informations académiques et administratives.</p>
      </div>

      {/* Grille de StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto mb-12">
        <StatCard 
          icon={FiAward} 
          value="Master 1" 
          label="Niveau Académique" 
          trend="Semestres 1 & 2" 
          trendType="positive"
          color="blue" 
        />
        <StatCard 
          icon={FiBookOpen} 
          value="Ingénierie Logiciel" 
          label="Filière / Spécialité" 
          trend="Pole STN" 
          trendType="neutral"
          color="purple" 
        />
        <StatCard 
          icon={FiMapPin} 
          value="ENO de Thies" 
          label="Espace Numérique" 
          trend="Campus de rattachement" 
          trendType="neutral"
          color="green" 
        />
        <StatCard 
          icon={FiUser} 
          value="Inscrit" 
          label="Statut d'Inscription" 
          trend="Année 2025 - 2026" 
          trendType="positive"
          color="amber" 
        />
      </div>
    </>
  )
}

export default ProfilAcademique
