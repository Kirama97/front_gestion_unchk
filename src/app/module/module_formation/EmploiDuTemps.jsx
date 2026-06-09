import React from 'react'

const EmploiDuTemps = () => {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
  
  const schedule = [
    { day: "Lundi", time: "08:00 - 10:00", subject: "Technologies Web", room: "Amphi A", teacher: "M. Ndiaye" },
    { day: "Lundi", time: "10:30 - 12:30", subject: "Base de Données", room: "Salle 102", teacher: "Mme. Fall" },
    { day: "Mardi", time: "14:00 - 16:00", subject: "Génie Logiciel", room: "Salle 204", teacher: "Dr. Diop" },
    { day: "Mercredi", time: "09:00 - 12:00", subject: "Réseaux Globaux", room: "Labo Info", teacher: "M. Faye" },
    { day: "Jeudi", time: "10:30 - 12:30", subject: "Sécurité Informatique", room: "Amphi B", teacher: "M. Sow" },
    { day: "Jeudi", time: "14:00 - 16:00", subject: "Anglais Professionnel", room: "Salle 101", teacher: "Mme. Sarr" },
    { day: "Vendredi", time: "08:30 - 11:30", subject: "Projet Transversal", room: "Labo 2", teacher: "Dr. Diop" },
  ]

  return (
    <div className="flex flex-col gap-6">
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
                        <span>👤 {course.teacher}</span>
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
