import React, { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api'
import { FiCalendar, FiPlus, FiClock, FiMapPin, FiX, FiCheckCircle, FiInfo, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/common/Modal'

const AdminReunions = () => {
  const { showToast } = useToast()
  const [reunions, setReunions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  
  const [showModal, setShowModal] = useState(false)
  const [editingReunion, setEditingReunion] = useState(null)
  const [titre, setTitre] = useState('')
  const [type, setType] = useState('Préparation des cours')
  const [date, setDate] = useState('')
  const [salle, setSalle] = useState('Virtuelle (Google Meet)')
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

  
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleOpenAddModal = () => {
    setEditingReunion(null)
    setTitre('')
    setType('Préparation des cours')
    setDate('')
    setSalle('Virtuelle (Google Meet)')
    setShowModal(true)
  }

  const handleOpenEditModal = (reunion) => {
    setEditingReunion(reunion)
    setTitre(reunion.titre || '')
    setType(reunion.type || 'Préparation des cours')
    setDate(formatDateForInput(reunion.date))
    setSalle(reunion.salle || 'Virtuelle (Google Meet)')
    setShowModal(true)
  }

  const handleSaveReunion = async (e) => {
    e.preventDefault()
    if (!titre || !date) {
      showToast("Veuillez renseigner le titre et la date.", "warning")
      return
    }

    setSaving(true)
    const payload = {
      titre,
      type,
      date: new Date(date).toISOString(),
      salle,
      statut: editingReunion ? editingReunion.statut : 'Planifiée'
    }

    try {
      if (editingReunion) {
        await apiPut(`/api/reunions/${editingReunion.id}`, payload)
        showToast("La réunion a été modifiée avec succès !", "success")
      } else {
        await apiPost('/api/reunions', payload)
        showToast("La réunion a été planifiée avec succès !", "success")
      }
      setShowModal(false)
      loadReunions()
    } catch (err) {
      console.error(err)
      showToast("Erreur lors de l'enregistrement de la réunion.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteReunion = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette réunion ?")) return
    try {
      await apiDelete(`/api/reunions/${id}`)
      showToast("La réunion a été supprimée.", "success")
      loadReunions()
    } catch (err) {
      console.error(err)
      showToast("Échec de la suppression.", "error")
    }
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
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Réunions & Planifications</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Suivez le calendrier des réunions pédagogiques et de cadrage.</p>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
        >
          <FiPlus />
          <span>Planifier une réunion</span>
        </button>
      </div>

      {}
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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {meeting.statut}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-slate-800 leading-snug">{meeting.titre}</h3>

                <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-semibold mt-2">
                  <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5 text-slate-400" /> Le {dateStr}</span>
                  <span className="flex items-center gap-1.5"><FiMapPin className="w-3.5 h-3.5 text-slate-400" /> Salle: <span className="text-slate-600">{meeting.salle}</span></span>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-50 pt-3 mt-2">
                  <button
                    onClick={() => handleOpenEditModal(meeting)}
                    className="p-1.5 bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-500 border border-slate-150 rounded-lg transition"
                    title="Modifier la réunion"
                  >
                    <FiEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteReunion(meeting.id)}
                    className="p-1.5 bg-slate-50 text-slate-450 hover:bg-red-50 hover:text-red-500 border border-slate-150 rounded-lg transition"
                    title="Supprimer la réunion"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
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

      {}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingReunion ? "Modifier la réunion" : "Planifier une réunion"}
        subtitle={editingReunion ? "Mettez à jour les détails de cette réunion." : "Planifier une visioconférence ou un suivi tutorat."}
      >
        <form onSubmit={handleSaveReunion} className="flex flex-col gap-4">
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

          {editingReunion && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut</label>
              <select
                value={editingReunion.statut}
                onChange={e => setEditingReunion(prev => ({ ...prev, statut: e.target.value }))}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Planifiée">Planifiée</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
            <button 
              type="button" 
              onClick={() => setShowModal(false)}
              className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={saving || !titre || !date}
              className="text-xs font-bold px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-55"
            >
              {saving ? 'Enregistrement...' : editingReunion ? 'Modifier' : 'Planifier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminReunions

