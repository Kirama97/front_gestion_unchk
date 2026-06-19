import React, { useEffect, useState } from 'react'
import { apiGet } from '../../../utils/api'
import CompteRenduForm from './CompteRenduForm'
import { FiDownload, FiTrash2, FiFileText, FiFolder } from 'react-icons/fi'
import { useToast } from '../../../context/ToastContext'

const CompteRenduList = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/comptes-rendus')
      setReports(data)
    } catch (err) {
      console.error(err)
      showToast("Échec du chargement des comptes rendus.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce compte rendu ?")) return
    try {
      const res = await fetch(`http://localhost:8080/api/comptes-rendus/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!res.ok) throw new Error()
      showToast("Compte rendu supprimé.", "success")
      fetchReports()
    } catch (err) {
      console.error(err)
      showToast("Échec de la suppression.", "error")
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const filteredReports = filterType === 'ALL'
    ? reports
    : reports.filter(r => r.type === filterType)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* List Column */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Comptes Rendus</h2>
            <p className="text-xs text-slate-500 mt-0.5">Procès-verbaux et archives des réunions de l'UNCHK.</p>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
          >
            <option value="ALL">Tous les types</option>
            <option value="REUNION">Réunions</option>
            <option value="RENCONTRE">Rencontres</option>
            <option value="SEMINAIRE">Séminaires</option>
            <option value="WEBINAIRE">Webinaires</option>
            <option value="CONSEIL">Conseil d'Université</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs font-medium text-slate-400">Chargement...</div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-400">
            Aucun compte rendu enregistré.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-start gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-xl mt-0.5">
                    <FiFolder className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        {report.type}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Publié le {new Date(report.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1.5">{report.titre}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.description}</p>
                    {report.auteur && (
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        Rédigé par : {report.auteur.prenom} {report.auteur.nom}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {report.cheminDocument && (
                    <a
                      href={`http://localhost:8080${report.cheminDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-500 border border-slate-150 rounded-xl transition"
                      title="Télécharger les minutes"
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-150 rounded-xl transition"
                      title="Supprimer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Column (For Admin only) */}
      <div className="lg:col-span-1">
        {isAdmin ? (
          <CompteRenduForm onSave={fetchReports} />
        ) : (
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
            <FiFileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Lecture uniquement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Seuls les administrateurs peuvent publier de nouveaux comptes rendus.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompteRenduList
