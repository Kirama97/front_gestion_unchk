import React, { useState, useEffect } from 'react'
import { apiGet } from '../../utils/api'
import StatCard from '../../components/etudant/StatCard'
import QuickActionCard from '../../components/etudant/QuickActionCard'
import InfoBoxEtudiant from '../../components/etudant/InfoBoxEtudiant'
import { FiUsers, FiCalendar, FiFileText, FiAward, FiCheckCircle } from 'react-icons/fi'

const TuteurAccueil = () => {
  const [profile, setProfile] = useState(null)
  const [studentsCount, setStudentsCount] = useState(0)
  const [reunionsCount, setReunionsCount] = useState(0)
  const [suiviCount, setSuiviCount] = useState(0)
  const [latestAnnonce, setLatestAnnonce] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        
        
        const [profileData, annoncesData, reunionsData] = await Promise.all([
          apiGet('/api/auth/me').catch(() => user),
          apiGet('/api/annonces').catch(() => []),
          apiGet('/api/reunions').catch(() => [])
        ])

        setProfile(profileData)
        setReunionsCount(reunionsData ? reunionsData.length : 0)
        
        
        setStudentsCount(25) 
        setSuiviCount(12)    

        if (annoncesData && annoncesData.length > 0) {
          setLatestAnnonce(annoncesData[0])
        }

        setLoading(false)
      } catch (err) {
        console.error("Error loading tutor home data:", err)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Chargement de votre portail tuteur...</div>
      </div>
    )
  }

  const displayName = profile?.prenom && profile?.nom ? `${profile.prenom} ${profile.nom}` : "Tuteur"

  return (
    <div className='w-full'>
      {}
      <div className="bg-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Bonjour, {displayName} ! </h1>
          <p className="text-indigo-100 text-sm font-medium max-w-xl">
            Bienvenue sur votre espace de tutorat. Retrouvez ici une vue d'ensemble de vos étudiants, vos prochaines réunions et le suivi de vos activités d'accompagnement.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
      </div>

      {}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Vue d'ensemble</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Statistiques de votre accompagnement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12">
        <StatCard 
          icon={FiUsers} 
          value={`${studentsCount}`} 
          label="Étudiants encadrés" 
          trend="Total des assignations" 
          trendType="positive"
          color="blue" 
        />
        <StatCard 
          icon={FiCalendar} 
          value={`${reunionsCount}`} 
          label="Réunions" 
          trend="Planifiées" 
          trendType="neutral"
          color="purple" 
        />
        <StatCard 
          icon={FiCheckCircle} 
          value={`${suiviCount}`} 
          label="Suivis effectués" 
          trend="Ce mois-ci" 
          trendType="positive"
          color="green" 
        />
      </div>

      {}
      <div className="mb-12">
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Accès Rapide</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Vos outils principaux pour le suivi.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard 
            icon={FiCalendar} 
            title="Emploi du Temps" 
            description="Consulter votre emploi du temps." 
            to="/tuteur/emploi-du-temps" 
          />
          <QuickActionCard 
            icon={FiUsers} 
            title="Suivi Tutorat" 
            description="Notes de session et suivi individuel." 
            to="/tuteur/suivi" 
          />
          <QuickActionCard 
            icon={FiFileText} 
            title="Bilan Étudiants" 
            description="Analyser les performances et moyennes." 
            to="/tuteur/bilan" 
          />
        </div>
      </div>

      {}
      <InfoBoxEtudiant annonce={latestAnnonce} />

    </div>
  )
}

export default TuteurAccueil
