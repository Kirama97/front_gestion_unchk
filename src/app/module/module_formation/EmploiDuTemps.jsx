import React, { useState, useEffect } from 'react'
import { apiGet } from '../../../utils/api'

const EmploiDuTemps = () => {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
  
  const mapDayToFrench = (dayStr) => {
    const d = dayStr.toUpperCase()
    if (d === 'LUNDI') return 'Lundi'
    if (d === 'MARDI') return 'Mardi'
    if (d === 'MERCREDI') return 'Mercredi'
    if (d === 'JEUDI') return 'Jeudi'
    if (d === 'VENDREDI') return 'Vendredi'
    if (d === 'SAMEDI') return 'Samedi'
    return dayStr
  }

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const endpoint = user.role === 'enseignant' 
          ? `/api/emploi-du-temps/enseignant/${user.id}` 
          : '/api/emploi-du-temps/me'
        
        const data = await apiGet(endpoint)
        const formatted = data.map(item => {
          // Format time to HH:MM
          const formatTime = (tStr) => {
            if (!tStr) return ''
            const parts = tStr.split(':')
            if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
            return tStr
          }
          const tStart = formatTime(item.heureDebut)
          const tEnd = formatTime(item.heureFin)

          return {
            id: item.id,
            day: mapDayToFrench(item.jourSemaine),
            time: `${tStart} - ${tEnd}`,
            subject: item.cours && item.cours.matiere ? item.cours.matiere.nom : item.matiere,
            room: item.salle || 'En ligne',
            teacherLabel: user.role === 'enseignant' ? '🏫' : '👤',
            teacher: user.role === 'enseignant'
              ? (item.classe ? item.classe.nom : 'Classe')
              : (item.cours && item.cours.enseignant 
                  ? `${item.cours.enseignant.prenom} ${item.cours.enseignant.nom}` 
                  : 'Tuteur')
          }
        })
        setSchedule(formatted)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching schedule:', err)
        setError(err.message || 'Impossible de charger l\'emploi du temps.')
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  if (loading) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de votre planning...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-[5%] mt-3">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Emploi du Temps</h2>
        <p className="text-xs text-slate-500 mt-0.5">Votre planning de cours pour le semestre en cours.</p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => {
          const dayCourses = schedule.filter(item => item.day === day)
          
          return (
            <div key={day} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2 text-center uppercase tracking-wider">
                {day}
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {dayCourses.length > 0 ? (
                  dayCourses.map((course, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/50 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-1.5">
                      <span className="text-[10px] text-blue-600 font-semibold tracking-wide">{course.time}</span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">{course.subject}</h4>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium mt-1">
                        <span>📍 {course.room}</span>
                        <span>{course.teacherLabel} {course.teacher}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 text-center py-4 italic">Aucun cours</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EmploiDuTemps
