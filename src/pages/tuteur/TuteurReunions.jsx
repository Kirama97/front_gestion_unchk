import React, { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api'
import { FiCalendar, FiPlus, FiClock, FiMapPin, FiX, FiCheckCircle, FiInfo, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/common/Modal'

const TuteurReunions = () => {
  const { showToast } = useToast()
  const [reunions, setReunions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingReunion, setEditingReunion] = useState(null)
  const [titre, setTitre] = useState('')
  const [type, setType] = useState('Suivi tutorat')
  const [date, setDate] = useState('')
  const [salle, setSalle] = useState('Virtuelle (Google Meet)')
  const [saving, setSaving] = useState(false)

  const loadReunions = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/reunions')
      // Show all meetings, or highlight tutor-related ones
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

  // Helper to format date for datetime-local input (YYYY-MM-DDThh:mm)
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
    setType('Suivi tutorat')
    setDate('')
    setSalle('Virtuelle (Google Meet)')
    setShowModal(true)
  }

  const handleOpenEditModal = (reunion) => {
    setEditingReunion(reunion)
    setTitre(reunion.titre || '')
    setType(reunion.type || 'Suivi tutorat')
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
      showToast("Réunion supprimée avec succès.", "success")
      loadReunions()
    } catch (err) {
      console.error(err)
      showToast("Impossible de supprimer la réunion.", "error")
    }
  }

  const formatFrenchDate = (dateStr) => {
    if (!dateStr) return ''
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateStr).toLocaleDateString('fr-FR', options)
  }

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Chargement des réunions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Réunions</h1>
          <p className="text-xs text-slate-500 font-medium">Consultez et planifiez vos sessions de tutorat collectives et points de suivi.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-650 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
        >
          <FiPlus className="w-4 h-4" /> Planifier une réunion
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {reunions.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-3xl p-12 text-center bg-slate-50/50">
          <FiCalendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aucune réunion programmée</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Vous n'avez pas encore planifié de réunion. Utilisez le bouton ci-dessus pour planifier votre premier point de suivi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reunions.map((reunion) => {
            const isTutorType = reunion.type === 'Suivi tutorat'
            
            return (
              <div 
                key={reunion.id} 
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition duration-200 ${
                  isTutorType ? 'border-indigo-100 ring-2 ring-indigo-50/20' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                      isTutorType 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {reunion.type}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      reunion.statut === 'Terminée' 
                        ? 'bg-slate-100 text-slate-500' 
                        : 'bg-green-50 text-green-700 border border-green-150'
                    }`}>
                      {reunion.statut}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 leading-snug mb-4 line-clamp-2">
                    {reunion.titre}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-550 text-[10px]">
                      <FiClock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="font-semibold">{formatFrenchDate(reunion.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-550 text-[10px]">
                      <FiMapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="font-semibold truncate">{reunion.salle}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center gap-2">
                  <a 
                    href={reunion.salle.startsWith('http') ? reunion.salle : '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition ${
                      reunion.salle.startsWith('http') 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Rejoindre
                  </a>
                  
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(reunion)}
                      className="p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-slate-50 rounded-lg transition"
                      title="Modifier la réunion"
                    >
                      <FiEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReunion(reunion.id)}
                      className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-slate-50 rounded-lg transition"
                      title="Supprimer la réunion"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Reunion Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingReunion ? "Modifier la Réunion" : "Planifier une Réunion"}
        subtitle="Configurez les détails du point de suivi de tutorat."
      >
        <form onSubmit={handleSaveReunion} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Sujet de la réunion</label>
            <input
              type="text"
              placeholder="ex. Session de tutorat collective - Mathématiques"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-150 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-150"
              >
                <option value="Suivi tutorat">Suivi tutorat</option>
                <option value="Préparation des cours">Préparation des cours</option>
                <option value="Préparation des évaluations">Préparation des évaluations</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Salle / Lien</label>
              <input
                type="text"
                placeholder="ex. Google Meet, Zoom, Salle 102"
                value={salle}
                onChange={(e) => setSalle(e.target.value)}
                className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-150"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Date & Heure</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-150"
            />
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
            >
              {saving ? 'Enregistrement...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TuteurReunions
