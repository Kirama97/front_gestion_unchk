import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../../../utils/api'
import { useToast } from '../../../context/ToastContext'
import { FiDownload, FiDollarSign, FiUploadCloud, FiCheck, FiLoader, FiPercent, FiTrendingUp } from 'react-icons/fi'

const BudgetPage = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  
  const [formData, setFormData] = useState({
    annee: new Date().getFullYear(),
    type: 'PROJET_BUDGET',
    montant: '',
    description: '',
    cheminFichier: ''
  })

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/budgets')
      setBudgets(data)
    } catch (err) {
      console.error(err)
      showToast("Échec du chargement des budgets.", "error")
    } finally {
      setLoading(false)
    }
  }

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
          'Authorization': `Bearer ${user.token}`
        },
        body: data
      })
      if (!res.ok) throw new Error()
      const result = await res.json()
      setFormData(prev => ({ ...prev, cheminFichier: result.url }))
      showToast("Fichier budget téléversé.", "success")
    } catch (err) {
      console.error(err)
      showToast("Échec du téléversement du fichier.", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.montant || isNaN(Number(formData.montant))) {
      showToast("Veuillez saisir un montant valide.", "warning")
      return
    }

    try {
      setSaving(true)
      await apiPost('/api/budgets', {
        ...formData,
        montant: Number(formData.montant)
      })
      showToast("Ligne de budget enregistrée !", "success")
      setFormData({
        annee: new Date().getFullYear(),
        type: 'PROJET_BUDGET',
        montant: '',
        description: '',
        cheminFichier: ''
      })
      fetchBudgets()
    } catch (err) {
      console.error(err)
      showToast("Échec de la sauvegarde.", "error")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  
  const currentYear = new Date().getFullYear()
  const yearBudgets = budgets.filter(b => b.annee === currentYear)
  const projected = yearBudgets.find(b => b.type === 'PROJET_BUDGET')?.montant || 0
  const realized = yearBudgets.find(b => b.type === 'BUDGET_REALISE')?.montant || 0
  const rate = projected > 0 ? Math.round((realized / projected) * 100) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2">
      
      {}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {}
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestion Budgétaire</h2>
          <p className="text-xs text-slate-500 mt-0.5">Suivi financier de l'établissement pour l'exercice en cours.</p>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Budget Projeté ({currentYear})</span>
              <span className="text-base font-black text-slate-800">
                {projected.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Budget Réalisé ({currentYear})</span>
              <span className="text-base font-black text-slate-800">
                {realized.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
              <FiPercent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Taux d'exécution</span>
              <span className="text-base font-black text-slate-800">{rate} %</span>
            </div>
          </div>
        </div>

        {/* Budgets Table */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-3.5">Historique Budgétaire</h3>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Chargement...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">Aucun budget enregistré.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Année</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Montant</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lien</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {budgets.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/20 transition">
                      <td className="p-3 text-xs font-bold text-slate-800">{b.annee}</td>
                      <td className="p-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          b.type === 'PROJET_BUDGET' ? 'bg-blue-50 text-blue-700' : b.type === 'BUDGET_REALISE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {b.type === 'PROJET_BUDGET' ? 'Projet' : b.type === 'BUDGET_REALISE' ? 'Réalisé' : 'Note d\'orientation'}
                        </span>
                      </td>
                      <td className="p-3 text-xs font-semibold text-slate-800">{b.montant.toLocaleString('fr-FR')} FCFA</td>
                      <td className="p-3 text-xs text-slate-500 max-w-[200px] truncate">{b.description}</td>
                      <td className="p-3 text-xs">
                        {b.cheminFichier ? (
                          <a
                            href={`http://localhost:8080${b.cheminFichier}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600 transition flex items-center gap-1 font-semibold"
                          >
                            <FiDownload className="w-3.5 h-3.5" />
                            Fiche
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="lg:col-span-1">
        {isAdmin ? (
          <form onSubmit={handleSubmit} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Ajouter une Ligne de Budget</h3>
              <p className="text-[11px] text-slate-400">Renseignez les montants officiels.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exercice (Année)</label>
              <input
                type="number"
                name="annee"
                value={formData.annee}
                onChange={handleChange}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type de Budget</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition bg-white"
              >
                <option value="PROJET_BUDGET">Projet de Budget</option>
                <option value="NOTE_ORIENTATION">Note d'Orientation</option>
                <option value="BUDGET_REALISE">Budget Réalisé</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Montant (FCFA)</label>
              <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                placeholder="Ex: 50000000"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document justificatif (PDF)</label>
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

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Précisions sur les allocations..."
                rows="3"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 transition text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-orange-500/10 flex items-center justify-center gap-1"
            >
              {saving && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
              <span>Enregistrer</span>
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
            <FiDollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Lecture uniquement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Seuls les administrateurs et responsables financiers peuvent éditer les budgets.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetPage
