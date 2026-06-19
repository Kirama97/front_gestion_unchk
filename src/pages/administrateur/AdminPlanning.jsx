import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api'
import { FiCalendar, FiPlus, FiClock, FiMapPin, FiUser, FiX, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const AdminPlanning = () => {
  const { showToast } = useToast()
  const { filiereId } = useParams()
  const [classes, setClasses] = useState([])
  const [selectedClasse, setSelectedClasse] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [rawSchedule, setRawSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSched, setLoadingSched] = useState(false)
  const [saving, setSaving] = useState(false)

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('LUNDI')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('10:00')
  const [roomName, setRoomName] = useState('Salle Virtuelle 1')
  const [success, setSuccess] = useState('')

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

  const mapDayToFrench = (dayStr) => {
    const d = dayStr?.toUpperCase()
    if (d === 'LUNDI') return 'Lundi'
    if (d === 'MARDI') return 'Mardi'
    if (d === 'MERCREDI') return 'Mercredi'
    if (d === 'JEUDI') return 'Jeudi'
    if (d === 'VENDREDI') return 'Vendredi'
    if (d === 'SAMEDI') return 'Samedi'
    return dayStr
  }

  // 1. Fetch Classes & Courses
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        const [cls, allCourses] = await Promise.all([
          apiGet('/api/academique/classes'),
          apiGet('/api/cours')
        ])
        
        setClasses(cls)
        setCourses(allCourses)

        // Select default class
        let defClass = cls[0]
        if (filiereId) {
          const matching = cls.find(c => c.filiere?.id === Number(filiereId))
          if (matching) defClass = matching
        }
        
        setSelectedClasse(defClass)
        if (allCourses.length > 0) setSelectedCourseId(allCourses[0].id.toString())
        setLoading(false)
      } catch (err) {
        console.error("Error loading planning config:", err)
        setLoading(false)
      }
    }
    fetchConfig()
  }, [filiereId])

  // 2. Fetch timetable items for selected class
  const loadSchedule = async () => {
    if (!selectedClasse) return
    try {
      setLoadingSched(true)
      const data = await apiGet(`/api/emploi-du-temps/classe/${selectedClasse.id}`)
      setRawSchedule(data)
      
      const formatted = data.map(item => {
        const formatTime = (tStr) => {
          if (!tStr) return ''
          const parts = tStr.split(':')
          if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
          return tStr
        }
        return {
          id: item.id,
          day: mapDayToFrench(item.jourSemaine),
          time: `${formatTime(item.heureDebut)} - ${formatTime(item.heureFin)}`,
          subject: item.cours?.matiere?.nom || item.matiere,
          room: item.salle || 'En ligne',
          teacher: item.cours?.enseignant ? `${item.cours.enseignant.prenom} ${item.cours.enseignant.nom}` : 'Tuteur'
        }
      })
      setSchedule(formatted)
      setLoadingSched(false)
    } catch (err) {
      console.error("Error loading class timetable:", err)
      setLoadingSched(false)
    }
  }

  useEffect(() => {
    loadSchedule()
  }, [selectedClasse])

  const handleEditClick = (slotId) => {
    const raw = rawSchedule.find(item => item.id === slotId)
    if (raw) {
      setEditingSlot(raw)
      setSelectedCourseId(raw.cours?.id?.toString() || '')
      setDayOfWeek(raw.jourSemaine || 'LUNDI')
      
      const formatTime = (tStr) => {
        if (!tStr) return ''
        const parts = tStr.split(':')
        if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
        return tStr
      }
      setStartTime(formatTime(raw.heureDebut) || '08:00')
      setEndTime(formatTime(raw.heureFin) || '10:00')
      setRoomName(raw.salle || 'Salle Virtuelle 1')
      setShowAddModal(true)
    }
  }

  const handleDeleteClick = async (slotId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce créneau horaire ?")) {
      return
    }
    try {
      setLoadingSched(true)
      await apiDelete(`/api/emplois-du-temps/${slotId}`)
      showToast("Le créneau horaire a été supprimé avec succès.", "success")
      loadSchedule()
    } catch (err) {
      console.error("Error deleting schedule slot:", err)
      showToast(err.message || "Erreur lors de la suppression du créneau.", "error")
      setLoadingSched(false)
    }
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    if (!selectedClasse || !selectedCourseId) return

    try {
      setSaving(true)
      const selectedCourse = courses.find(c => c.id === Number(selectedCourseId))
      
      const payload = {
        classe: { id: selectedClasse.id },
        cours: { id: Number(selectedCourseId) },
        jourSemaine: dayOfWeek,
        heureDebut: `${startTime}:00`,
        heureFin: `${endTime}:00`,
        salle: roomName,
        matiere: selectedCourse ? selectedCourse.matiere?.nom : 'Matière'
      }

      if (editingSlot) {
        await apiPut(`/api/emplois-du-temps/${editingSlot.id}`, payload)
        showToast('Le cours a été modifié avec succès !', 'success')
      } else {
        await apiPost('/api/emplois-du-temps', payload)
        showToast('Le cours a été planifié avec succès !', 'success')
      }
      
      setTimeout(() => {
        setShowAddModal(false)
        loadSchedule()
      }, 1500)
    } catch (err) {
      console.error("Error saving timetable slot:", err)
      showToast(err.message || "Erreur lors de la planification du cours.", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de la planification...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Emplois du Temps</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5 font-sans">Visualisation par classe et planification de séances de cours.</p>
        </div>

        <button 
          onClick={() => {
            setEditingSlot(null)
            setSelectedCourseId(courses[0]?.id?.toString() || '')
            setDayOfWeek('LUNDI')
            setStartTime('08:00')
            setEndTime('10:00')
            setRoomName('Salle Virtuelle 1')
            setShowAddModal(true)
          }}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
        >
          <FiPlus />
          <span>Planifier un cours</span>
        </button>
      </div>

      {/* Select class filter */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="flex flex-col gap-1 w-full max-w-xs">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sélectionner une classe</label>
          <select
            value={selectedClasse?.id || ''}
            onChange={e => setSelectedClasse(classes.find(c => c.id === Number(e.target.value)))}
            className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Weekly Grid */}
      {loadingSched ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs animate-pulse">
          Chargement du planning de la classe...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {days.map((day) => {
            const daySlots = schedule.filter(s => s.day === day)

            return (
              <div key={day} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-700 border-b border-slate-100 pb-2 text-center uppercase tracking-wider font-mono">
                  {day}
                </h3>
                
                <div className="flex flex-col gap-2.5">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot, idx) => (
                      <div key={idx} className="relative group bg-slate-50/50 p-3 rounded-xl border border-slate-150/60 flex flex-col gap-1.5 hover:shadow-sm transition">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-orange-500 font-bold tracking-wide flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {slot.time}
                          </span>
                          
                          {/* Actions */}
                          <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 transition duration-155">
                            <button 
                              onClick={() => handleEditClick(slot.id)}
                              title="Modifier"
                              className="text-slate-400 hover:text-orange-500 p-0.5 rounded transition cursor-pointer"
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(slot.id)}
                              title="Supprimer"
                              className="text-slate-400 hover:text-red-500 p-0.5 rounded transition cursor-pointer"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight pr-6">{slot.subject}</h4>
                        <div className="flex flex-col gap-0.5 text-[9px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1"><FiUser className="w-2.5 h-2.5" /> {slot.teacher}</span>
                          <span className="flex items-center gap-1"><FiMapPin className="w-2.5 h-2.5" /> {slot.room}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[9px] text-slate-400 text-center py-6 italic">Aucun cours</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Plan course modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  {editingSlot ? 'Modifier le cours' : 'Planifier un cours'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {editingSlot ? `Modification de la séance pour ${selectedClasse?.nom}` : `Affectation d'une séance pour la classe de ${selectedClasse?.nom}`}
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Success message banner */}
            {success && (
              <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddSchedule} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Matière & Enseignant *</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white focus:border-orange-500"
                >
                  {courses
                    .filter(c => c.classe?.id === selectedClasse?.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.matiere?.nom} ({c.enseignant ? `${c.enseignant.prenom} ${c.enseignant.nom}` : 'Sans prof'})
                      </option>
                    ))
                  }
                  {courses.filter(c => c.classe?.id === selectedClasse?.id).length === 0 && (
                    courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.matiere?.nom} ({c.classe?.nom})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jour de la semaine</label>
                  <select
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="LUNDI">Lundi</option>
                    <option value="MARDI">Mardi</option>
                    <option value="MERCREDI">Mercredi</option>
                    <option value="JEUDI">Jeudi</option>
                    <option value="VENDREDI">Vendredi</option>
                    <option value="SAMEDI">Samedi</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salle de classe</label>
                  <input
                    type="text" required placeholder="Ex: Amphi B"
                    value={roomName} onChange={e => setRoomName(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Heure Début</label>
                  <input
                    type="time" required value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Heure Fin</label>
                  <input
                    type="time" required value={endTime} onChange={e => setEndTime(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !selectedCourseId}
                  className="text-xs font-bold px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-55 cursor-pointer"
                >
                  {saving ? (editingSlot ? 'Modification...' : 'Planification...') : (editingSlot ? 'Enregistrer' : 'Planifier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminPlanning
