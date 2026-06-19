import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../../../utils/api'
import { FiDownload, FiUsers, FiTrendingUp, FiLoader, FiPercent, FiBriefcase } from 'react-icons/fi'
import { useToast } from '../../../context/ToastContext'

const SuiviEtudiantList = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAllowedToEdit = user.role === 'admin' || user.role === 'insertion'

  const [suivis, setSuivis] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    etudiantId: '',
    registreContact: '',
    bilanStages: '',
    statutInsertion: 'EN_RECHERCHE',
    salaireInitial: '',
    entreprise: ''
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [suiviData, studentData] = await Promise.all([
        apiGet('/api/insertion/suivi'),
        apiGet('/api/etudiants')
      ])
      setSuivis(suiviData)
      setStudents(studentData)
    } catch (err) {
      console.error(err)
      showToast("Échec du chargement des suivis insertion.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.etudiantId) {
      showToast("Veuillez sélectionner un étudiant.", "warning")
      return
    }

    try {
      setSaving(true)
      
      const selectedStudent = students.find(s => String(s.id) === String(formData.etudiantId))
      
      const payload = {
        etudiant: selectedStudent,
        registreContact: formData.registreContact,
        bilanStages: formData.bilanStages,
        statutInsertion: formData.statutInsertion,
        entreprise: formData.entreprise,
        salaireInitial: formData.salaireInitial ? Number(formData.salaireInitial) : null
      }

      await apiPost('/api/insertion/suivi', payload)
      showToast("Fiche de suivi mise à jour !", "success")
      setFormData({
        etudiantId: '',
        registreContact: '',
        bilanStages: '',
        statutInsertion: 'EN_RECHERCHE',
        salaireInitial: '',
        entreprise: ''
      })
      fetchData()
    } catch (err) {
      console.error(err)
      showToast("Échec de la sauvegarde.", "error")
    } finally {
      setSaving(false)
    }
  }

  const downloadExport = async (format) => {
    try {
      const url = `http://localhost:8080/api/exports/suivi/${format}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!response.ok) throw new Error()
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `suivi_insertion_unchk.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      showToast(`Export ${format.toUpperCase()} téléchargé.`, "success")
    } catch (err) {
      console.error(err)
      showToast("Échec du téléchargement du rapport.", "error")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate statistics
  const total = suivis.length
  const salaried = suivis.filter(s => s.statutInsertion === 'SALARIE').length
  const auto = suivis.filter(s => s.statutInsertion === 'AUTO_EMPLOI').length
  const seeking = suivis.filter(s => s.statutInsertion === 'EN_RECHERCHE' || s.statutInsertion === 'RECHERCHE').length

  const salariedPct = total > 0 ? Math.round((salaried / total) * 100) : 0
  const autoPct = total > 0 ? Math.round((auto / total) * 100) : 0
  const seekingPct = total > 0 ? Math.round((seeking / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2">
      
      {/* Main content column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Suivi d'Insertion Professionnelle</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Bilan des stages et intégration professionnelle des sortants.</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => downloadExport('pdf')}
              className="bg-red-500 hover:bg-red-650 transition text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md shadow-red-500/10"
            >
              <FiDownload className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => downloadExport('excel')}
              className="bg-emerald-500 hover:bg-emerald-600 transition text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md shadow-emerald-500/10"
            >
              <FiDownload className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
              <FiBriefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Emploi Salarié</span>
              <span className="text-base font-black text-slate-800">{salariedPct}% ({salaried})</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-500 rounded-xl">
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Auto-Emploi</span>
              <span className="text-base font-black text-slate-800">{autoPct}% ({auto})</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
              <FiPercent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-medium">Recherche Actuelle</span>
              <span className="text-base font-black text-slate-800">{seekingPct}% ({seeking})</span>
            </div>
          </div>
        </div>

        {/* Table of Follow-ups */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-3.5">Fiches d'Insertion Active</h3>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Chargement des suivis...</div>
          ) : suivis.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">Aucune fiche de suivi active.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etudiant</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">INE</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employeur</th>
                    <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bilan / Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {suivis.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/20 transition">
                      <td className="p-3 text-xs font-semibold text-slate-800">
                        {s.etudiant.utilisateur.prenom} {s.etudiant.utilisateur.nom.toUpperCase()}
                      </td>
                      <td className="p-3 text-xs text-slate-600 font-mono">{s.etudiant.ine}</td>
                      <td className="p-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          s.statutInsertion === 'SALARIE' ? 'bg-indigo-50 text-indigo-700' : s.statutInsertion === 'AUTO_EMPLOI' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {s.statutInsertion}
                        </span>
                      </td>
                      <td className="p-3 text-xs font-medium text-slate-700">
                        {s.entreprise ? s.entreprise : <span className="text-slate-350">-</span>}
                      </td>
                      <td className="p-3 text-xs text-slate-500 max-w-[150px] truncate" title={s.bilanStages}>
                        {s.bilanStages}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Column */}
      <div className="lg:col-span-1">
        {isAllowedToEdit ? (
          <form onSubmit={handleSubmit} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Mettre à Jour un Suivi</h3>
              <p className="text-[11px] text-slate-400">Éditer le statut d'insertion d'un diplômé.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sélectionner l'étudiant</label>
              <select
                name="etudiantId"
                value={formData.etudiantId}
                onChange={handleChange}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition bg-white"
              >
                <option value="">-- Choisir un étudiant --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.utilisateur.prenom} {s.utilisateur.nom.toUpperCase()} ({s.ine})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut professionnel</label>
              <select
                name="statutInsertion"
                value={formData.statutInsertion}
                onChange={handleChange}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition bg-white"
              >
                <option value="SALARIE">Salarié</option>
                <option value="AUTO_EMPLOI">Auto-Emploi (Entrepreneur)</option>
                <option value="EN_RECHERCHE">En recherche d'emploi</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entreprise / Employeur</label>
              <input
                type="text"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleChange}
                placeholder="Ex: Orange Sénégal"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salaire Initial (Mensuel)</label>
              <input
                type="number"
                name="salaireInitial"
                value={formData.salaireInitial}
                onChange={handleChange}
                placeholder="Ex: 450000"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registre de Contact</label>
              <input
                type="text"
                name="registreContact"
                value={formData.registreContact}
                onChange={handleChange}
                placeholder="Téléphone / E-mail de contact"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bilan du Stage / Observations</label>
              <textarea
                name="bilanStages"
                value={formData.bilanStages}
                onChange={handleChange}
                placeholder="Description des retours d'évaluation de stage..."
                rows="2"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 transition text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-orange-500/10 flex items-center justify-center gap-1"
            >
              {saving && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
              <span>Mettre à jour la fiche</span>
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
            <FiUsers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Lecture uniquement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Seuls les conseillers d'insertion peuvent éditer le suivi professionnel.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuiviEtudiantList
