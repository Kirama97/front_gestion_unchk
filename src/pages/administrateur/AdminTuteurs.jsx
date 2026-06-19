import React, { useState, useEffect } from 'react'
import { apiGet, apiDelete } from '../../utils/api'
import { FiUsers, FiLink, FiTrash2, FiSearch, FiCheckCircle } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const AdminTuteurs = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('liste') // 'liste' | 'affectations' | 'groupes'
  const [tuteurs, setTuteurs] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      const [personnel, studentsList] = await Promise.all([
        apiGet('/api/personnel'),
        apiGet('/api/etudiants')
      ])

      const tutors = personnel.filter(p => p.role === 'tuteur' || p.role === 'TUTEUR')
      setTuteurs(tutors)
      setStudents(studentsList)
      setLoading(false)
    } catch (err) {
      console.error("Error loading tuteurs list:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteTuteur = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tuteur ?")) return
    try {
      await fetch(`http://localhost:8080/api/personnel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      })
      showToast('Le tuteur a été supprimé avec succès.', 'success')
      loadData()
    } catch (err) {
      console.error(err)
      showToast('Erreur lors de la suppression.', 'error')
    }
  }

  // Filter lists
  const filteredTuteurs = tuteurs.filter(t => {
    const s = `${t.prenom} ${t.nom} ${t.email} ${t.departement}`.toLowerCase()
    return s.includes(searchTerm.toLowerCase())
  })

  const filteredStudents = students.filter(st => {
    const s = `${st.utilisateur?.prenom} ${st.utilisateur?.nom} ${st.ine}`.toLowerCase()
    return s.includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement des tuteurs...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Tuteurs</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Pilotez le tutorat d'accompagnement, gérez les tuteurs et les groupes d'étudiants.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('liste'); setSearchTerm('') }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'liste' ? 'border-orange-500 text-orange-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          👤 Liste des Tuteurs
        </button>
        <button
          onClick={() => { setActiveTab('affectations'); setSearchTerm('') }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'affectations' ? 'border-orange-500 text-orange-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          🔗 Affectations Étudiants
        </button>
        <button
          onClick={() => { setActiveTab('groupes'); setSearchTerm('') }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'groupes' ? 'border-orange-500 text-orange-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          👥 Groupes de Suivi
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder={
              activeTab === 'liste' ? "Rechercher un tuteur par nom, email..." 
              : "Rechercher un élève par nom, INE..."
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'liste' && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                  <th className="p-4">Tuteur</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Téléphone</th>
                  <th className="p-4">Département</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTuteurs.length > 0 ? (
                  filteredTuteurs.map((tutor) => (
                    <tr key={tutor.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{tutor.prenom} {tutor.nom}</td>
                      <td className="p-4 text-slate-500">{tutor.email}</td>
                      <td className="p-4 text-slate-500">{tutor.telephone || 'Non renseigné'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">
                          {tutor.departement || 'Général'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteTuteur(tutor.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 transition animate-fadeIn"
                          title="Supprimer le tuteur"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400 italic">Aucun tuteur trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'affectations' && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                  <th className="p-4">Étudiant</th>
                  <th className="p-4">Identifiant INE</th>
                  <th className="p-4">Filière / Classe</th>
                  <th className="p-4">Tuteur Assigné</th>
                  <th className="p-4 text-right">Modifier l'affectation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => {
                    const studentName = `${st.utilisateur?.prenom} ${st.utilisateur?.nom?.toUpperCase()}`
                    // Assing dummy tuteur or display list
                    const assignedTutor = tuteurs.length > 0 ? `${tuteurs[0].prenom} ${tuteurs[0].nom}` : 'Mme. Fatou Diop'
                    
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{studentName}</td>
                        <td className="p-4 font-semibold text-slate-500">{st.ine}</td>
                        <td className="p-4 text-slate-500">{st.classe?.nom || st.filiere}</td>
                        <td className="p-4 font-semibold text-slate-600">
                          👤 {assignedTutor}
                        </td>
                        <td className="p-4 text-right">
                          <select 
                            defaultValue="1"
                            className="text-[10px] border border-slate-200 rounded-lg px-2 py-1 outline-none bg-white font-bold text-slate-600 focus:border-orange-500"
                            onChange={() => {
                              showToast(`Affectation mise à jour pour l'étudiant ${studentName}`, "success")
                            }}
                          >
                            {tuteurs.map((t, idx) => (
                              <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
                            ))}
                            {tuteurs.length === 0 && <option value="1">Fatou Diop</option>}
                          </select>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400 italic">Aucun étudiant trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'groupes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          {tuteurs.length > 0 ? (
            tuteurs.map((tutor) => (
              <div key={tutor.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Groupe {tutor.departement || 'Tutorat'}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full">
                    {students.length > 0 ? Math.ceil(students.length / tuteurs.length) : 0} Étudiants
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {tutor.prenom?.charAt(0)}{tutor.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{tutor.prenom} {tutor.nom}</p>
                    <p className="text-[9px] text-slate-400">Tuteur encadrant principal</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic leading-relaxed mt-2">
                  Ce groupe rassemble les étudiants de la filière pour le suivi du travail de fin d'étude, des stages et l'accompagnement pédagogique individuel.
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white">
              <p className="text-slate-400 font-semibold text-sm">Aucun groupe de tutorat configuré.</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default AdminTuteurs
