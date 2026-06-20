import React, { useEffect, useState } from 'react'
import { apiGet } from '../../../utils/api'
import PartenaireForm from './PartenaireForm'
import { FiBriefcase, FiMail, FiTrash2, FiSearch } from 'react-icons/fi'
import { useToast } from '../../../context/ToastContext'

const PartenaireList = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAllowedToEdit = user.role === 'admin' || user.role === 'insertion'

  const [partenaires, setPartenaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPartenaires = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/partenaires')
      setPartenaires(data)
    } catch (err) {
      console.error(err)
      showToast("Échec du chargement des partenaires.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return
    try {
      const res = await fetch(`http://localhost:8080/api/partenaires/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!res.ok) throw new Error()
      showToast("Partenaire supprimé.", "success")
      fetchPartenaires()
    } catch (err) {
      console.error(err)
      showToast("Échec de la suppression.", "error")
    }
  }

  useEffect(() => {
    fetchPartenaires()
  }, [])

  const filteredPartenaires = partenaires.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Partenaires Académiques</h2>
            <p className="text-xs text-slate-500 mt-0.5">Base de données des entreprises et institutions partenaires.</p>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white w-full sm:w-48"
            />
            <FiSearch className="absolute left-2.5 top-3 text-slate-400 w-3.5 h-3.5" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs font-medium text-slate-400">Chargement...</div>
        ) : filteredPartenaires.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-400">
            Aucun partenaire trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPartenaires.map((partenaire) => (
              <div key={partenaire.id} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4 h-48">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">
                      {partenaire.typePartenariat || 'Stages'}
                    </span>
                    {isAllowedToEdit && (
                      <button
                        onClick={() => handleDelete(partenaire.id)}
                        className="text-slate-400 hover:text-red-500 transition"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-2.5">{partenaire.nom}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{partenaire.description}</p>
                </div>

                {partenaire.contactEmail && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <FiMail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{partenaire.contactEmail}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      <div className="lg:col-span-1">
        {isAllowedToEdit ? (
          <PartenaireForm onSave={fetchPartenaires} />
        ) : (
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
            <FiBriefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Lecture uniquement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Seuls les gestionnaires de l'insertion ou administrateurs peuvent enregistrer de nouveaux partenariats.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartenaireList
