import React, { useEffect, useState } from 'react'
import { apiGet } from '../../../utils/api'
import NoteServiceForm from './NoteServiceForm'
import { FiDownload, FiTrash2, FiFileText, FiBook } from 'react-icons/fi'
import { useToast } from '../../../context/ToastContext'

const NoteServiceList = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/documents')
      // Filter for notes and circulars
      const notes = data.filter(d => 
        d.type === 'NOTE_SERVICE_INTERNE' || 
        d.type === 'NOTE_SERVICE_EXTERNE' || 
        d.type === 'NOTE_ADMINISTRATIVE' || 
        d.type === 'CIRCULAIRE'
      )
      setDocuments(notes)
    } catch (err) {
      console.error(err)
      showToast("Échec du chargement des notes administratives.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce document ?")) return
    try {
      const res = await fetch(`http://localhost:8080/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!res.ok) throw new Error()
      showToast("Document supprimé.", "success")
      fetchDocuments()
    } catch (err) {
      console.error(err)
      showToast("Échec de la suppression.", "error")
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const filteredDocs = filterType === 'ALL'
    ? documents
    : documents.filter(d => d.type === filterType)

  const formatDocTypeLabel = (type) => {
    switch(type) {
      case 'NOTE_SERVICE_INTERNE': return 'Note Interne'
      case 'NOTE_SERVICE_EXTERNE': return 'Note Externe'
      case 'NOTE_ADMINISTRATIVE': return 'Note Administrative'
      case 'CIRCULAIRE': return 'Circulaire'
      default: return 'Document'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* List Column */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Notes & Circulaires</h2>
            <p className="text-xs text-slate-500 mt-0.5">Diffusion et communications officielles de l'université.</p>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
          >
            <option value="ALL">Toutes les notes</option>
            <option value="NOTE_SERVICE_INTERNE">Notes Internes</option>
            <option value="NOTE_SERVICE_EXTERNE">Notes Externes</option>
            <option value="NOTE_ADMINISTRATIVE">Notes Administratives</option>
            <option value="CIRCULAIRE">Circulaires</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs font-medium text-slate-400">Chargement...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-400">
            Aucune note administrative enregistrée.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-start gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl mt-0.5 ${
                    doc.type === 'CIRCULAIRE' ? 'bg-amber-50 text-amber-500' : 'bg-orange-50 text-orange-500'
                  }`}>
                    <FiBook className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        doc.type === 'CIRCULAIRE' ? 'bg-amber-50 text-amber-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {formatDocTypeLabel(doc.type)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Publié le {new Date(doc.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1.5">{doc.titre}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.description}</p>
                    {doc.auteur && (
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        Rédigé par : {doc.auteur.prenom} {doc.auteur.nom}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.cheminFichier && (
                    <a
                      href={`http://localhost:8080${doc.cheminFichier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-500 border border-slate-150 rounded-xl transition"
                      title="Télécharger"
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(doc.id)}
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
          <NoteServiceForm onSave={fetchDocuments} />
        ) : (
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
            <FiFileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Lecture uniquement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Seuls les administrateurs peuvent publier de nouvelles notes de service.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteServiceList
