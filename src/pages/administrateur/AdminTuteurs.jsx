import React, { useState, useEffect } from 'react'
import { apiGet, apiDelete, apiPut } from '../../utils/api'
import { FiUsers, FiLink, FiTrash2, FiSearch, FiCheckCircle, FiEdit, FiInfo } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/common/Modal'

const AdminTuteurs = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('liste') 
  const [tuteurs, setTuteurs] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTuteur, setEditingTuteur] = useState(null)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [departement, setDepartement] = useState('Informatique')
  const [statut, setStatut] = useState('Actif')
  const [motDePasse, setMotDePasse] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [personnel, studentsList, classesList] = await Promise.all([
        apiGet('/api/personnel'),
        apiGet('/api/etudiants'),
        apiGet('/api/academique/classes')
      ])

      const tutors = personnel.filter(p => p.role === 'tuteur' || p.role === 'TUTEUR')
      setTuteurs(tutors)
      setStudents(studentsList)
      setClasses(classesList)
      setLoading(false)
    } catch (err) {
      console.error("Error loading data:", err)
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

  const handleOpenEditModal = (tutor) => {
    setEditingTuteur(tutor)
    setPrenom(tutor.prenom || '')
    setNom(tutor.nom || '')
    setEmail(tutor.email || '')
    setTelephone(tutor.telephone || '')
    setDepartement(tutor.departement || 'Informatique')
    setStatut(tutor.statut || 'Actif')
    setMotDePasse('')
    setShowEditModal(true)
  }

  const handleUpdateTuteur = async (e) => {
    e.preventDefault()
    if (!prenom || !nom || !email) {
      showToast("Veuillez remplir les champs obligatoires (Nom, Prénom, Email).", "warning")
      return
    }

    setSaving(true)
    const payload = {
      nom,
      prenom,
      email,
      telephone,
      departement,
      statut,
      role: 'TUTEUR'
    }

    if (motDePasse) {
      payload.motDePasse = motDePasse
    }

    try {
      await apiPut(`/api/personnel/${editingTuteur.id}`, payload)
      showToast("Les informations du tuteur ont été mises à jour.", "success")
      setShowEditModal(false)
      loadData()
    } catch (err) {
      console.error("Error updating tutor:", err)
      showToast(err.message || "Erreur lors de la mise à jour.", "error")
    } finally {
      setSaving(false)
    }
  }

  
  const filteredTuteurs = tuteurs.filter(t => {
    const s = `${t.prenom} ${t.nom} ${t.email} ${t.departement}`.toLowerCase()
    return s.includes(searchTerm.toLowerCase())
  })

  const filteredClasses = classes.filter(c => {
    const s = `${c.nom} ${c.niveauEtude} ${c.filiere?.nom || ''} ${c.tuteur?.prenom || ''} ${c.tuteur?.nom || ''}`.toLowerCase()
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
      {}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Tuteurs</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Pilotez le tutorat d'accompagnement, gérez les tuteurs et les affectations de classe.</p>
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
          🔗 Affectations Classes
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
              : activeTab === 'affectations' ? "Rechercher une classe, filière, tuteur..."
              : "Rechercher..."
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none"
          />
        </div>
      </div>

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
                          onClick={() => handleOpenEditModal(tutor)}
                          className="text-slate-455 hover:text-orange-500 p-1.5 rounded-lg hover:bg-slate-50 transition mr-1.5"
                          title="Modifier le tuteur"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
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
                  <th className="p-4">Classe</th>
                  <th className="p-4">Niveau d'étude</th>
                  <th className="p-4">Filière</th>
                  <th className="p-4">Promotion</th>
                  <th className="p-4">Tuteur Assigné</th>
                  <th className="p-4 text-right">Affecter un Tuteur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => {
                    const assignedTutorName = cls.tuteur ? `${cls.tuteur.prenom} ${cls.tuteur.nom}` : 'Aucun tuteur'
                    
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{cls.nom}</td>
                        <td className="p-4 font-semibold text-slate-500">{cls.niveauEtude}</td>
                        <td className="p-4 text-slate-550">{cls.filiere?.nom || 'Non spécifié'}</td>
                        <td className="p-4 text-slate-550">{cls.promotion?.nom || 'Non spécifié'}</td>
                        <td className="p-4 font-semibold text-slate-600">
                          👤 {assignedTutorName}
                        </td>
                        <td className="p-4 text-right">
                          <select 
                            value={cls.tuteur?.id || ''}
                            className="text-[10px] border border-slate-200 rounded-lg px-2 py-1 outline-none bg-white font-bold text-slate-600 focus:border-orange-500"
                            onChange={async (e) => {
                              const tutorId = e.target.value
                              try {
                                const selectedTutor = tutorId ? { id: Number(tutorId) } : null
                                const classPayload = {
                                  id: cls.id,
                                  nom: cls.nom,
                                  niveauEtude: cls.niveauEtude,
                                  promotion: cls.promotion ? { id: cls.promotion.id } : null,
                                  filiere: cls.filiere ? { id: cls.filiere.id } : null,
                                  tuteur: selectedTutor
                                }
                                await apiPut(`/api/academique/classes/${cls.id}`, classPayload)
                                showToast(`Affectation du tuteur mise à jour pour la classe ${cls.nom}`, "success")
                                loadData()
                              } catch (err) {
                                console.error(err)
                                showToast("Échec de la mise à jour de l'affectation", "error")
                              }
                            }}
                          >
                            <option value="">-- Aucun --</option>
                            {tuteurs.map((t) => (
                              <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400 italic">Aucune classe trouvée.</td>
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
            tuteurs.map((tutor) => {
              
              const tutorClasses = classes.filter(c => c.tuteur && c.tuteur.id === tutor.id)
              
              const totalStudents = students.filter(s => s.classe && tutorClasses.some(tc => tc.id === s.classe.id)).length
              
              return (
                <div key={tutor.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Groupe de {tutor.prenom} {tutor.nom}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full">
                      {totalStudents} Étudiants
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classes Assignées :</p>
                    {tutorClasses.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {tutorClasses.map(tc => (
                          <span key={tc.id} className="text-[9px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md">
                            {tc.nom}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-450 italic mt-0.5">Aucune classe assignée.</p>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white">
              <p className="text-slate-400 font-semibold text-sm">Aucun groupe de tutorat configuré.</p>
            </div>
          )}
        </div>
      )}

      {}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier le Tuteur"
        subtitle="Modifier les informations de l'enseignant tuteur."
      >
        <form onSubmit={handleUpdateTuteur} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prénom *</label>
              <input 
                type="text" required value={prenom} onChange={e => setPrenom(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nom *</label>
              <input 
                type="text" required value={nom} onChange={e => setNom(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email professionnel *</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Téléphone</label>
              <input 
                type="text" value={telephone} onChange={e => setTelephone(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Département</label>
              <select 
                value={departement} onChange={e => setDepartement(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="Informatique">Informatique</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique">Physique</option>
                <option value="Lettres et SHS">Lettres et SHS</option>
                <option value="Gestion & Management">Gestion & Management</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut professionnel</label>
              <select 
                value={statut} onChange={e => setStatut(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
              >
                <option value="Actif">Actif</option>
                <option value="Congé">Congé</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nouveau Mot de Passe (Optionnel)</label>
            <input 
              type="password" placeholder="Laisser vide pour ne pas modifier"
              value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)}
              className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="text-xs font-bold px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-55"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminTuteurs
