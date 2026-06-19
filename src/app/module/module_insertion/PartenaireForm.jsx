import React, { useState } from 'react'
import { apiPost } from '../../../utils/api'
import { useToast } from '../../../context/ToastContext'
import { FiLoader } from 'react-icons/fi'

const PartenaireForm = ({ onSave }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    typePartenariat: 'Stages et Insertion',
    contactEmail: '',
    description: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nom) {
      showToast("Le nom du partenaire est requis.", "warning")
      return
    }

    try {
      setLoading(true)
      await apiPost('/api/partenaires', formData)
      showToast("Partenaire enregistré !", "success")
      setFormData({ nom: '', typePartenariat: 'Stages et Insertion', contactEmail: '', description: '' })
      if (onSave) onSave()
    } catch (err) {
      console.error(err)
      showToast("Impossible d'enregistrer le partenaire.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Ajouter un Partenaire</h3>
        <p className="text-[11px] text-slate-400">Enregistrer une nouvelle entreprise ou institution.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Raison Sociale / Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Ex: Wave Mobile Money"
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type de Partenariat</label>
        <select
          name="typePartenariat"
          value={formData.typePartenariat}
          onChange={handleChange}
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition bg-white"
        >
          <option value="Stages et Insertion">Stages et Insertion</option>
          <option value="Recherche et Développement">Recherche et Développement</option>
          <option value="Financement d'Équipements">Financement d'Équipements</option>
          <option value="Parrainage de Promotion">Parrainage de Promotion</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adresse Email Contact</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="Ex: contact@wave.com"
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Détails du partenariat, contact de référence..."
          rows="3"
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 transition text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-orange-500/10 flex items-center justify-center gap-1"
      >
        {loading && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
        <span>Enregistrer</span>
      </button>
    </form>
  )
}

export default PartenaireForm
