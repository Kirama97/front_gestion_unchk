import React, { useState } from 'react'
import { apiPost } from '../../../utils/api'
import { useToast } from '../../../context/ToastContext'
import { FiUploadCloud, FiCheck, FiLoader } from 'react-icons/fi'

const CompteRenduForm = ({ onSave }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'REUNION',
    cheminDocument: ''
  })

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
      if (!res.ok) throw new Error("Erreur de téléversement")
      const result = await res.json()
      setFormData(prev => ({ ...prev, cheminDocument: result.url }))
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
      await apiPost('/api/comptes-rendus', formData)
      showToast("Compte rendu enregistré avec succès.", "success")
      setFormData({ titre: '', description: '', type: 'REUNION', cheminDocument: '' })
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
      <div>
        <h3 className="text-sm font-bold text-slate-800">Ajouter un Compte Rendu</h3>
        <p className="text-[11px] text-slate-400">Renseignez les détails de la réunion ou de l'évènement.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Titre de la réunion</label>
        <input
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Ex: Réunion d'orientation semestrielle"
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type d'évènement</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
          >
            <option value="REUNION">Réunion</option>
            <option value="RENCONTRE">Rencontre</option>
            <option value="SEMINAIRE">Séminaire</option>
            <option value="WEBINAIRE">Webinaire</option>
            <option value="CONSEIL">Conseil d'Université</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fichier (Minutes / PV)</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 border-dashed text-slate-600 flex items-center justify-center gap-1.5 hover:bg-slate-100 transition">
              {uploading ? (
                <FiLoader className="w-3.5 h-3.5 animate-spin text-orange-500" />
              ) : formData.cheminDocument ? (
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
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description / Résumé</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Résumé des décisions ou points abordés..."
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
        <span>Enregistrer le compte rendu</span>
      </button>
    </form>
  )
}

export default CompteRenduForm
