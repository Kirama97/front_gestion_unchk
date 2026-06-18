import React, { useState, useEffect } from 'react'
import { apiGet } from '../../utils/api'
import { FiCalendar, FiPlus, FiClock, FiMapPin, FiX, FiCheckCircle, FiInfo } from 'react-icons/fi'

const AdminReunions = () => {
  const [reunions, setReunions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [titre, setTitre] = useState('')
  const [type, setType] = useState('Préparation des cours')
  const [date, setDate] = useState('')
  const [salle, setSalle] = useState('Virtuelle (Google Meet)')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const loadReunions = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/reunions')
      setReunions(data)
      setLoading(false)
    } catch (err) {
      console.error("Error loading meetings:", err)
      setError("Impossible de charger les réunions.")
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReunions()
  }, [])

  const handleCreateReunion = (e) => {
    e.preventDefault()
    if (!titre || !date) return

    setSaving(true)
    const newMeeting = {
      id: Date.now(),
      titre,
      type,
      date: new Date(date).toISOString(),
      salle,
      statut: 'Planifiée'
    }

    // Add to local state (since backend is read-only mock for /api/reunions)
    setReunions(prev => [...prev, newMeeting])
    setSuccess('La réunion a été planifiée avec succès !')
    
    setTimeout(() => {
      setSuccess('')
      setShowAddModal(false)
      setTitre('')
      setDate('')
      setSaving(false)
    }, 1200)
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement du calendrier...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Réunions & Planifications</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Suivez le calendrier des réunions pédagogiques et de cadrage.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
        >
          <FiPlus />
          <span>Planifier une réunion</span>
        </button>
      </div>

      {/* List of Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
        {reunions.length > 0 ? (
          reunions.map((meeting) => {
            const dateStr = new Date(meeting.date).toLocaleDateString('fr-FR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })

            return (
              <div key={meeting.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                    meeting.type?.includes('tutorat') ? 'bg-blue-50 text-blue-700' :
                    meeting.type?.includes('évaluation') ? 'bg-rose-50 text-rose-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {meeting.type}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {meeting.statut}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-800 leading-snug">{meeting.titre}</h3>

                <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-semibold mt-2">
                  <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5 text-slate-400" /> Le {dateStr}</span>
                  <span className="flex items-center gap-1.5"><FiMapPin className="w-3.5 h-3.5 text-slate-400" /> Salle: <span className="text-slate-600">{meeting.salle}</span></span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-slate-400 font-semibold text-sm">Aucune réunion programmée.</p>
          </div>
        )}
      </div>

      {/* Plan modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Planifier une réunion</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Planifier une visioconférence ou un suivi tutorat.</p>
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
            <form onSubmit={handleCreateReunion} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Titre de la réunion *</label>
                <input 
                  type="text" required placeholder="Ex: Cadrage de l'examen final"
                  value={titre} onChange={e => setTitre(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type de réunion</label>
                <select
                  value={type} onChange={e => setType(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Préparation des cours">Préparation des cours</option>
                  <option value="Suivi tutorat">Suivi tutorat</option>
                  <option value="Préparation des évaluations">Préparation des évaluations</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date & Heure *</label>
                  <input 
                    type="datetime-local" required
                    value={date} onChange={e => setDate(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salle virtuelle / physique</label>
                  <input 
                    type="text" required
                    value={salle} onChange={e => setSalle(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !titre || !date}
                  className="text-xs font-bold px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-55"
                >
                  {saving ? 'Planification...' : 'Planifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminReunions
