import React from 'react'
import BanniereEtudiant from '../../components/etudant/BanniereEtudiant'
import ProchainCours from '../../components/etudant/ProchainCours'
import ProfilAcademique from '../../components/etudant/ProfilAcademique'
import ActualitesEvenements from '../../components/etudant/ActualitesEvenements'
import AccesRapide from '../../components/etudant/AccesRapide'

const HomeEtudiant = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Prochain cours du jour
  const prochainCours = {
    subject: "Technologies Web",
    teacher: "M. Ndiaye",
    time: "14:00 - 16:00",
    room: "Amphi A",
    status: "Dans 45 min"
  }

  return (
    <div className='w-full'>
         {/* Section 1 : Bannière */}
         <BanniereEtudiant user={user} />

         {/* Section 2 : Aperçu Rapide & Stats */}
         <div className="section2 px-4 sm:px-8 lg:px-12 py-10 bg-slate-50">

            {/* Prochain cours — Card flottante qui remonte sur la bannière */}
            <ProchainCours prochainCours={prochainCours} />

            {/* Profil Académique */}
            <ProfilAcademique />

            {/* Section Actualités & Événements */}
            {/* <ActualitesEvenements /> */}

            {/* Actions Rapides */}
            <AccesRapide />

         </div>
      
    </div>
  )
}

export default HomeEtudiant
