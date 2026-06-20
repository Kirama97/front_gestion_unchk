import React from 'react'
import { FiAward, FiBookOpen, FiMapPin, FiUser } from 'react-icons/fi'
import StatCard from './StatCard'

const ProfilAcademique = ({ profile }) => {
  const level = profile?.niveauEtude || "Master 1";
  const filiere = profile?.filiere || "Ingénierie Logiciel";
  const eno = profile?.adresse || "ENO de Thiès";
  const status = profile?.utilisateur?.statut || "Inscrit";
  const promo = profile?.promo || "Promotion 8";

  return (
    <>
      {}
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Profil Académique</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Vos informations académiques et administratives.</p>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto mb-12">
        <StatCard 
          icon={FiAward} 
          value={level} 
          label="Niveau Académique" 
          trend="Semestres 1 & 2" 
          trendType="positive"
          color="blue" 
        />
        <StatCard 
          icon={FiBookOpen} 
          value={filiere} 
          label="Filière / Spécialité" 
          trend={promo} 
          trendType="neutral"
          color="purple" 
        />
        <StatCard 
          icon={FiMapPin} 
          value={eno} 
          label="Espace Numérique" 
          trend="Campus de rattachement" 
          trendType="neutral"
          color="green" 
        />
        <StatCard 
          icon={FiUser} 
          value={status} 
          label="Statut d'Inscription" 
          trend={profile?.anneeDebut ? `Année ${profile.anneeDebut} - ${profile.anneeSortie || ''}` : "Année 2025 - 2026"} 
          trendType="positive"
          color="amber" 
        />
      </div>
    </>
  )
}

export default ProfilAcademique
