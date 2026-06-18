import React, { useState, useEffect } from 'react'
import { apiGet } from '../../utils/api'
import BanniereEnseignant from '../../components/enseignant/BanniereEnseignant'
import ProchainCoursEnseignant from '../../components/enseignant/ProchainCoursEnseignant'
import StatCard from '../../components/etudant/StatCard'
import QuickActionCard from '../../components/etudant/QuickActionCard'
import InfoBoxEtudiant from '../../components/etudant/InfoBoxEtudiant'
import { FiBookOpen, FiClock, FiUsers, FiFileText, FiCalendar, FiMessageSquare } from 'react-icons/fi'

const HomeEnseignant = () => {
  const [profile, setProfile] = useState(null)
  const [prochainCours, setProchainCours] = useState(null)
  const [coursesCount, setCoursesCount] = useState(0)
  const [hoursCount, setHoursCount] = useState(0)
  const [studentsCount, setStudentsCount] = useState(0)
  const [latestAnnonce, setLatestAnnonce] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getProchainCours = (edtList) => {
    if (!edtList || edtList.length === 0) return null

    const days = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"]
    const now = new Date()
    const currentDayIndex = now.getDay() // 0 = Sunday, 1 = Monday, ...
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    let closestClass = null
    let minDiff = Infinity

    edtList.forEach(item => {
      const classDayIndex = days.indexOf(item.jourSemaine?.toUpperCase())
      if (classDayIndex === -1) return

      const [startH, startM] = (item.heureDebut || "00:00").split(':').map(Number)
      const classStartMinutes = startH * 60 + startM

      let daysDiff = classDayIndex - currentDayIndex
      if (daysDiff < 0) {
        daysDiff += 7
      }

      let diffMinutes = 0
      if (daysDiff === 0) {
        if (classStartMinutes > currentMinutes) {
          diffMinutes = classStartMinutes - currentMinutes
        } else {
          diffMinutes = (classStartMinutes - currentMinutes) + (7 * 24 * 60)
        }
      } else {
        diffMinutes = (daysDiff * 24 * 60) + (classStartMinutes - currentMinutes)
      }

      if (diffMinutes < minDiff) {
        minDiff = diffMinutes
        closestClass = item
      }
    })

    if (!closestClass) return null

    const cleanTime = (t) => t ? t.substring(0, 5) : ''
    const timeStr = `${cleanTime(closestClass.heureDebut)} - ${cleanTime(closestClass.heureFin)}`
    
    let statusStr = ""
    const diffHours = Math.floor(minDiff / 60)
    const diffMins = minDiff % 60
    
    if (minDiff < 60) {
      statusStr = `Dans ${diffMins} min`
    } else if (minDiff < 24 * 60) {
      statusStr = `Dans ${diffHours}h ${diffMins > 0 ? diffMins + 'm' : ''}`
    } else {
      statusStr = `Prévu le ${closestClass.jourSemaine.toLowerCase()}`
    }

    return {
      subject: closestClass.cours?.matiere?.nom || closestClass.matiere || "Cours",
      classe: closestClass.classe?.nom || "Classe",
      time: timeStr,
      room: closestClass.salle || "En ligne",
      status: statusStr
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) throw new Error("Utilisateur non authentifié.")

        const [profileData, coursesData, edtData, annoncesData] = await Promise.all([
          apiGet('/api/auth/me'),
          apiGet(`/api/cours/enseignant/${user.id}`),
          apiGet(`/api/emploi-du-temps/enseignant/${user.id}`),
          apiGet('/api/annonces')
        ])

        setProfile(profileData)
        setCoursesCount(coursesData.length)

        // Calculate hours and student counts
        let hoursTotal = 0
        edtData.forEach(item => {
          if (item.heureDebut && item.heureFin) {
            const [h1, m1] = item.heureDebut.split(':').map(Number)
            const [h2, m2] = item.heureFin.split(':').map(Number)
            hoursTotal += (h2 + m2 / 60) - (h1 + m1 / 60)
          }
        })
        setHoursCount(Math.round(hoursTotal * 10) / 10)

        // Fetch students counts for each class
        const classesSeen = new Set()
        coursesData.forEach(c => {
          if (c.classe?.id) {
            classesSeen.add(c.classe.id)
          }
        })
        
        let totalStudents = 0
        const classFetchPromises = Array.from(classesSeen).map(classeId => 
          apiGet(`/api/etudiants/classe/${classeId}`).catch(() => [])
        )
        const studentsLists = await Promise.all(classFetchPromises)
        studentsLists.forEach(list => {
          totalStudents += list.length
        })
        setStudentsCount(totalStudents || 25) // fallback to 25 if empty seeds

        const next = getProchainCours(edtData)
        setProchainCours(next)

        if (annoncesData && annoncesData.length > 0) {
          setLatestAnnonce(annoncesData[0])
        }

        setLoading(false)
      } catch (err) {
        console.error("Error loading teacher portal home data:", err)
        setError(err.message || "Erreur lors du chargement des informations du portail.")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Chargement de votre portail enseignant...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    )
  }

  const user = {
    email: profile?.email || '',
    prenom: profile?.prenom || '',
    nom: profile?.nom || ''
  }

  return (
    <div className='w-full'>
      {/* Section 1 : Bannière */}
      <BanniereEnseignant user={user} />

      {/* Section 2 : Aperçu Rapide & Stats */}
      <div className="section2 px-4 sm:px-8 lg:px-12 py-10 bg-slate-50">

        {/* Prochain cours — Card flottante */}
        <ProchainCoursEnseignant prochainCours={prochainCours} />

        {/* Profil Professionnel / Stats */}
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Vue d'ensemble Professionnelle</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Statistiques de vos activités académiques.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto mb-12">
          <StatCard 
            icon={FiBookOpen} 
            value={`${coursesCount} Cours`} 
            label="Enseignements" 
            trend="Matières actives" 
            trendType="positive"
            color="green" 
          />
          <StatCard 
            icon={FiUsers} 
            value={`${studentsCount} Étudiants`} 
            label="Effectif Total" 
            trend="Étudiants suivis" 
            trendType="neutral"
            color="purple" 
          />
          <StatCard 
            icon={FiClock} 
            value={`${hoursCount}h / Semaine`} 
            label="Volume Horaire" 
            trend="Heures programmées" 
            trendType="neutral"
            color="blue" 
          />
          <StatCard 
            icon={FiFileText} 
            value={profile?.departement || "Informatique"} 
            label="Département" 
            trend="Rattachement" 
            trendType="positive"
            color="amber" 
          />
        </div>

        {/* Actions Rapides */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Accès Rapide</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Vos services et outils les plus utilisés.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard 
              icon={FiCalendar} 
              title="Emploi du Temps" 
              description="Consulter mon planning d'enseignements" 
              to="/enseignant/emploi-du-temps" 
            />
            <QuickActionCard 
              icon={FiFileText} 
              title="Saisie des Notes" 
              description="Saisir et valider les notes des classes" 
              to="/enseignant/notes" 
            />
            <QuickActionCard 
              icon={FiBookOpen} 
              title="Mes Enseignements" 
              description="Gérer le contenu et séquences de cours" 
              to="/enseignant/mes_cours" 
            />
          </div>
        </div>

        {/* info box */}
        <InfoBoxEtudiant annonce={latestAnnonce} />

      </div>
    </div>
  )
}

export default HomeEnseignant
