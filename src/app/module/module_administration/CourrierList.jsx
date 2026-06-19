import React, { useEffect, useState } from 'react'
import { apiGet } from '../../../utils/api'
import CourrierForm from './CourrierForm'
import { FiDownload, FiTrash2, FiMail, FiFolder, FiEdit } from 'react-icons/fi'
import { useToast } from '../../../context/ToastContext'

const CourrierList = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')
  const [editingDoc, setEditingDoc] = useState(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/documents')
      // Only keep courriers
      const courriers = data.filter(d => d.type === 'COURRIER_ARRIVE' || d.type === 'COURRIER_DEPART')
      setDocuments(courriers)
    } catch (err) {
      console.error(err)
      showToast("Échec du chargement des courriers.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce courrier ?")) return
    try {
      const res = await fetch(`http://localhost:8080/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!res.ok) throw new Error()
      showToast("Courrier supprimé.", "success")
      fetchDocuments()
      if (editingDoc && editingDoc.id === id) setEditingDoc(null)
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* List Column */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Gestion des Courriers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Suivi des flux de courriers entrants et sortants.</p>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
          >
            <option value="ALL">Tous les courriers</option>
            <option value="COURRIER_ARRIVE">Courriers Arrivés</option>
            <option value="COURRIER_DEPART">Courriers Départs</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs font-medium text-slate-400">Chargement...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-400">
            Aucun courrier enregistré.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-start gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl mt-0.5 ${
                    doc.type === 'COURRIER_ARRIVE' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <FiMail className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        doc.type === 'COURRIER_ARRIVE' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {doc.type === 'COURRIER_ARRIVE' ? 'Arrivé' : 'Départ'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Date : {new Date(doc.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1.5">{doc.titre}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.description}</p>
                    {doc.auteur && (
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        Enregistré par : {doc.auteur.prenom} {doc.auteur.nom}
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
                      title="Télécharger le fichier"
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="p-2 bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-500 border border-slate-150 rounded-xl transition"
                        title="Modifier"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-150 rounded-xl transition"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </>
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
          <CourrierForm onSave={fetchDocuments} editingDoc={editingDoc} setEditingDoc={setEditingDoc} />
        ) : (
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
            <FiFolder className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Lecture uniquement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Seuls les administrateurs peuvent enregistrer des courriers.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourrierList
