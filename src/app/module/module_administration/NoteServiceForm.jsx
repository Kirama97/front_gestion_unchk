import React, { useState, useEffect } from 'react'
import { apiPost, apiPut } from '../../../utils/api'
import { useToast } from '../../../context/ToastContext'
import { FiUploadCloud, FiCheck, FiLoader, FiX } from 'react-icons/fi'

const NoteServiceForm = ({ onSave, editingDoc, setEditingDoc }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'NOTE_SERVICE_INTERNE',
    cheminFichier: ''
  })

  useEffect(() => {
    if (editingDoc) {
      setFormData({
        titre: editingDoc.titre || '',
        description: editingDoc.description || '',
        type: editingDoc.type || 'NOTE_SERVICE_INTERNE',
        cheminFichier: editingDoc.cheminFichier || ''
      })
    } else {
      setFormData({ titre: '', description: '', type: 'NOTE_SERVICE_INTERNE', cheminFichier: '' })
    }
  }, [editingDoc])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const data = new FormData()
    data.append('file', file)

    try {
      setUploading(true)
      const res = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        },
        body: data
      })
      if (!res.ok) throw new Error()
      const result = await res.json()
      setFormData(prev => ({ ...prev, cheminFichier: result.url }))
      showToast("Fichier téléversé avec succès !", "success")
    } catch (err) {
      console.error(err)
      showToast("Échec du téléversement du fichier.", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titre) {
      showToast("Le titre est requis.", "warning")
      return
    }

    try {
      setLoading(true)
      if (editingDoc) {
        await apiPut(`/api/documents/${editingDoc.id}`, formData)
        showToast("Note mise à jour avec succès.", "success")
        setEditingDoc(null)
      } else {
        await apiPost('/api/documents', formData)
        showToast("Note enregistrée avec succès.", "success")
      }
      setFormData({ titre: '', description: '', type: 'NOTE_SERVICE_INTERNE', cheminFichier: '' })
      if (onSave) onSave()
    } catch (err) {
      console.error(err)
      showToast("Échec de l'enregistrement.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {editingDoc ? "Modifier la Note / Circulaire" : "Créer une Note / Circulaire"}
          </h3>
          <p className="text-[11px] text-slate-400">Publiez une note de service ou une circulaire centrale.</p>
        </div>
        {editingDoc && (
          <button
            type="button"
            onClick={() => setEditingDoc(null)}
            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Objet / Titre</label>
        <input
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Ex: Note sur la semaine culturelle"
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type de document</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition bg-white"
          >
            <option value="NOTE_SERVICE_INTERNE">Note Service Interne</option>
            <option value="NOTE_SERVICE_EXTERNE">Note Service Externe</option>
            <option value="NOTE_ADMINISTRATIVE">Note Administrative</option>
            <option value="CIRCULAIRE">Circulaire</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fichier joint (PDF)</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 border-dashed text-slate-600 flex items-center justify-center gap-1.5 hover:bg-slate-100 transition">
              {uploading ? (
                <FiLoader className="w-3.5 h-3.5 animate-spin text-orange-500" />
              ) : formData.cheminFichier ? (
                <>
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate max-w-[150px]">Fichier chargé</span>
                </>
              ) : (
                <>
                  <FiUploadCloud className="w-3.5 h-3.5" />
                  <span>Choisir un fichier</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contenu / Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Détails de la note..."
          rows="3"
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 transition text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-orange-500/10 flex items-center justify-center gap-1"
      >
        {loading && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
        <span>{editingDoc ? "Mettre à jour la Note" : "Publier la Note"}</span>
      </button>
    </form>
  )
}

export default NoteServiceForm
