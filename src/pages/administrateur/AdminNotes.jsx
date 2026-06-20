import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiGet, apiPost } from '../../utils/api'
import { FiFileText, FiSave, FiAlertCircle, FiCheckCircle, FiSearch, FiPrinter, FiDownload } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const AdminNotes = () => {
  const { showToast } = useToast()
  const { filiereId } = useParams()
  const [activeTab, setActiveTab] = useState('tableau') 

  
  const [promotions, setPromotions] = useState([])
  const [filieres, setFilieres] = useState([])
  const [classes, setClasses] = useState([])
  const [matieres, setMatieres] = useState([])
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [allNotes, setAllNotes] = useState([])

  
  const [filterPromo, setFilterPromo] = useState('Toutes')
  const [filterFiliere, setFilterFiliere] = useState(filiereId || 'Toutes')
  const [searchStudent, setSearchStudent] = useState('')

  
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedSequenceId, setSelectedSequenceId] = useState('')
  const [evalType, setEvalType] = useState('DEVOIR')
  const [session, setSession] = useState('Principale')
  const [sequences, setSequences] = useState([])
  const [inputGrades, setInputGrades] = useState({}) 
  const [existingGrades, setExistingGrades] = useState({}) 
  
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const [promos, fils, cls, mats, allCourses, notesList] = await Promise.all([
          apiGet('/api/academique/promotions'),
          apiGet('/api/academique/filieres'),
          apiGet('/api/academique/classes'),
          apiGet('/api/academique/matieres'),
          apiGet('/api/cours'),
          apiGet('/api/notes')
        ])

        setPromotions(promos)
        setFilieres(fils)
        setClasses(cls)
        setMatieres(mats)
        setCourses(allCourses)
        setAllNotes(notesList)

        if (allCourses.length > 0) {
          setSelectedCourse(allCourses[0])
        }

        setLoading(false)
      } catch (err) {
        console.error("Error loading notes configuration:", err)
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  
  useEffect(() => {
    if (!selectedCourse) return
    const fetchSequences = async () => {
      try {
        const data = await apiGet(`/api/cours/${selectedCourse.id}/sequences`)
        setSequences(data)
        if (data.length > 0) {
          setSelectedSequenceId(data[0].id.toString())
          setEvalType('DEVOIR')
        } else {
          setSelectedSequenceId('')
          setEvalType('EXAMEN')
        }
      } catch (err) {
        setSequences([])
        setSelectedSequenceId('')
        setEvalType('EXAMEN')
      }
    }
    fetchSequences()
  }, [selectedCourse])

  
  useEffect(() => {
    if (!selectedCourse || activeTab !== 'saisir') return

    const loadSaisieGrid = async () => {
      try {
        const classeId = selectedCourse.classe?.id
        const matiereId = selectedCourse.matiere?.id
        if (!classeId || !matiereId) return

        const studentsList = await apiGet(`/api/etudiants/classe/${classeId}`)
        setStudents(studentsList)

        const notesList = await apiGet('/api/notes')
        setAllNotes(notesList)

        const tempGrades = {}
        const tempInputs = {}

        studentsList.forEach(student => {
          const noteObj = notesList.find(n => 
            n.etudiant?.id === student.id &&
            n.matiere?.id === matiereId &&
            n.type === evalType &&
            n.session === session &&
            (evalType === 'EXAMEN' ? !n.sequence : (n.sequence?.id === Number(selectedSequenceId)))
          )

          if (noteObj) {
            tempGrades[student.id] = { noteId: noteObj.id, valeur: noteObj.valeur }
            tempInputs[student.id] = noteObj.valeur.toString()
          } else {
            tempGrades[student.id] = null
            tempInputs[student.id] = ''
          }
        })

        setExistingGrades(tempGrades)
        setInputGrades(tempInputs)
      } catch (err) {
        console.error("Error loading students for grade entry:", err)
      }
    }
    loadSaisieGrid()
  }, [selectedCourse, selectedSequenceId, evalType, session, activeTab])

  
  useEffect(() => {
    if (activeTab === 'bulletins') {
      const fetchAllStudents = async () => {
        try {
          const list = await apiGet('/api/etudiants')
          setStudents(list)
        } catch (err) {
          console.error("Error loading students directory:", err)
        }
      }
      fetchAllStudents()
    }
  }, [activeTab])

  const handleGradeChange = (studentId, value) => {
    if (value === '') {
      setInputGrades(prev => ({ ...prev, [studentId]: '' }))
      return
    }
    const val = parseFloat(value)
    if (!isNaN(val) && val >= 0 && val <= 20) {
      setInputGrades(prev => ({ ...prev, [studentId]: value }))
    }
  }

  const handleSaveGrades = async () => {
    if (!selectedCourse) return
    try {
      setSaving(true)
      setStatusMessage({ type: '', text: '' })

      const classeId = selectedCourse.classe?.id
      const matiereId = selectedCourse.matiere?.id
      const promotionId = selectedCourse.classe?.promotion_id || 1

      const savePromises = Object.keys(inputGrades).map(async (studentIdStr) => {
        const studentId = Number(studentIdStr)
        const gradeStr = inputGrades[studentId]
        if (gradeStr === '') return

        const gradeVal = parseFloat(gradeStr)
        const existing = existingGrades[studentId]

        const payload = {
          id: existing ? existing.noteId : null,
          etudiant: { id: studentId },
          matiere: { id: matiereId },
          classe: { id: classeId },
          promotion: { id: promotionId },
          sequence: evalType === 'DEVOIR' && selectedSequenceId ? { id: Number(selectedSequenceId) } : null,
          valeur: gradeVal,
          type: evalType,
          session: session
        }
        return apiPost('/api/notes', payload)
      })

      await Promise.all(savePromises)
      setStatusMessage({ type: 'success', text: 'Notes enregistrées avec succès dans la base de données.' })

      
      const notesList = await apiGet('/api/notes')
      setAllNotes(notesList)
    } catch (err) {
      console.error(err)
      setStatusMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'enregistrement.' })
    } finally {
      setSaving(false)
    }
  }

  const handlePrintMockBulletin = (studentName) => {
    showToast(`Génération du bulletin de ${studentName}...\nLe fichier PDF a été enregistré.`, "success");
  }

  // Filter for Tab 1 (Tableau des Notes)
  const filteredNotes = allNotes.filter(n => {
    const matchesPromo = filterPromo === 'Toutes' || n.promotion?.nom === filterPromo
    
    // Find matching filiere name/code
    let matchesFiliere = true
    if (filterFiliere !== 'Toutes') {
      const selectedFil = filieres.find(f => f.id === Number(filterFiliere))
      matchesFiliere = n.classe?.filiere_id === Number(filterFiliere) || (selectedFil && n.etudiant?.filiere === selectedFil.nom)
    }

    const studentName = `${n.etudiant?.utilisateur?.prenom || ''} ${n.etudiant?.utilisateur?.nom || ''}`.toLowerCase()
    const matchesSearch = studentName.includes(searchStudent.toLowerCase()) || (n.etudiant?.ine || '').toLowerCase().includes(searchStudent.toLowerCase())

    return matchesPromo && matchesFiliere && matchesSearch
  })

  // Filter students for Tab 3 (Bulletins)
  const filteredStudents = students.filter(s => {
    const studentName = `${s.utilisateur?.prenom || ''} ${s.utilisateur?.nom || ''}`.toLowerCase()
    return studentName.includes(searchStudent.toLowerCase()) || s.ine.toLowerCase().includes(searchStudent.toLowerCase())
  })

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de la gestion des notes...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Notes & Résultats</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Suivi global, saisie administrative et impression de bulletins de notes.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('tableau'); setStatusMessage({ type: '', text: '' }) }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'tableau' ? 'border-orange-500 text-orange-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          📋 Tableau des notes
        </button>
        <button
          onClick={() => { setActiveTab('saisir'); setStatusMessage({ type: '', text: '' }) }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'saisir' ? 'border-orange-500 text-orange-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          ✍️ Saisie Administrative
        </button>
        <button
          onClick={() => { setActiveTab('bulletins'); setStatusMessage({ type: '', text: '' }) }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'bulletins' ? 'border-orange-500 text-orange-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          🎓 Bulletins de notes
        </button>
      </div>

      {/* Tab 1: Tableau des Notes */}
      {activeTab === 'tableau' && (
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Promotion</label>
              <select 
                value={filterPromo} onChange={e => setFilterPromo(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
              >
                <option value="Toutes">Toutes les promotions</option>
                {promotions.map(p => (
                  <option key={p.id} value={p.nom}>{p.nom}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Filière</label>
              <select 
                value={filterFiliere} onChange={e => setFilterFiliere(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
              >
                <option value="Toutes">Toutes les filières</option>
                {filieres.map(f => (
                  <option key={f.id} value={f.id}>{f.nom} ({f.code})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Recherche</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                <input 
                  type="text" placeholder="Rechercher un élève ou INE..."
                  value={searchStudent} onChange={e => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                    <th className="p-4">Étudiant</th>
                    <th className="p-4">Filière / Classe</th>
                    <th className="p-4">Matière</th>
                    <th className="p-4">Séquence / Session</th>
                    <th className="p-4 text-center">Note / 20</th>
                    <th className="p-4 text-right">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((n) => {
                      const studentName = n.etudiant?.utilisateur ? `${n.etudiant.utilisateur.prenom} ${n.etudiant.utilisateur.nom.toUpperCase()}` : "Etudiant"
                      
                      return (
                        <tr key={n.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-bold text-slate-800">
                            {studentName}
                            <span className="block text-[10px] text-slate-400 font-semibold">{n.etudiant?.ine}</span>
                          </td>
                          <td className="p-4 text-slate-500">
                            {n.classe?.nom || n.etudiant?.filiere}
                          </td>
                          <td className="p-4 font-semibold text-slate-600">
                            {n.matiere?.nom || 'Matière'}
                          </td>
                          <td className="p-4 text-slate-400 font-medium">
                            {n.sequence?.titre || 'Examen Principal'}
                            <span className="block text-[9px] text-slate-400">Session: {n.session || 'Principale'}</span>
                          </td>
                          <td className="p-4 text-center font-black text-slate-700">
                            {n.valeur}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              n.type === 'EXAMEN' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {n.type}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-400 italic">Aucune note ne correspond à vos filtres.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Saisie Administrative */}
      {activeTab === 'saisir' && (
        <div className="flex flex-col gap-4">
          {/* Selectors */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Matière & Classe</label>
              <select
                value={selectedCourse?.id || ''}
                onChange={e => setSelectedCourse(courses.find(c => c.id === Number(e.target.value)))}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.matiere?.nom} ({c.classe?.nom})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Type d'évaluation</label>
              <select
                value={evalType}
                onChange={e => {
                  setEvalType(e.target.value)
                  if (e.target.value === 'EXAMEN') setSelectedSequenceId('')
                  else if (sequences.length > 0) setSelectedSequenceId(sequences[0].id.toString())
                }}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="DEVOIR">Devoir / Contrôle continu</option>
                <option value="EXAMEN">Examen Final</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Séquence</label>
              <select
                value={selectedSequenceId}
                disabled={evalType === 'EXAMEN'}
                onChange={e => setSelectedSequenceId(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white disabled:bg-slate-50 disabled:text-slate-400"
              >
                {evalType === 'DEVOIR' && sequences.length > 0 ? (
                  sequences.map(seq => (
                    <option key={seq.id} value={seq.id}>{seq.titre}</option>
                  ))
                ) : (
                  <option value="">Examen global</option>
                )}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Session</label>
              <select
                value={session}
                onChange={e => setSession(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="Principale">Principale</option>
                <option value="Rattrapage">Rattrapage</option>
              </select>
            </div>
          </div>

          {}
          {statusMessage.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
            }`}>
              {statusMessage.type === 'success' ? <FiCheckCircle className="w-5 h-5 text-emerald-600" /> : <FiAlertCircle className="w-5 h-5 text-red-600" />}
              {statusMessage.text}
            </div>
          )}

          {}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Effectif : {students.length} élèves</span>
              <button
                onClick={handleSaveGrades}
                disabled={saving || students.length === 0}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                <FiSave />
                {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                    <th className="p-4">Élève</th>
                    <th className="p-4">INE</th>
                    <th className="p-4 text-center">Note saisie / 20</th>
                    <th className="p-4 text-right">Résultat indicatif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length > 0 ? (
                    students.map(s => {
                      const grade = inputGrades[s.id] || ''
                      const isRegistered = existingGrades[s.id] !== null
                      
                      let resultText = 'En attente'
                      let resultColor = 'text-slate-400 bg-slate-50'
                      if (grade !== '') {
                        const parsed = parseFloat(grade)
                        if (parsed >= 10) {
                          resultText = 'Validé'
                          resultColor = 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                        } else {
                          resultText = 'Rattrapage'
                          resultColor = 'text-red-700 bg-red-50 border border-red-100'
                        }
                      }

                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-bold text-slate-800">
                            {s.utilisateur?.prenom} {s.utilisateur?.nom?.toUpperCase()}
                            <span className="block text-[9px] text-slate-400 font-semibold">{s.utilisateur?.email}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-500">{s.ine}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                type="number" step="0.25" min="0" max="20" placeholder="--"
                                value={grade} onChange={e => handleGradeChange(s.id, e.target.value)}
                                className="w-16 text-center text-xs font-bold px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100"
                              />
                              {isRegistered && <span className="text-[9px] text-slate-400">💾</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${resultColor}`}>
                              {resultText}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-slate-400 italic">Sélectionnez une classe ou un cours valide.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {}
      {activeTab === 'bulletins' && (
        <div className="flex flex-col gap-4">
          {}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
              <input 
                type="text" placeholder="Rechercher un élève par nom, prénom ou INE..."
                value={searchStudent} onChange={e => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                    <th className="p-4">Étudiant</th>
                    <th className="p-4">Identifiant INE</th>
                    <th className="p-4">Filière / Classe</th>
                    <th className="p-4 text-right">Actions Bulletin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => {
                      const name = `${s.utilisateur?.prenom} ${s.utilisateur?.nom?.toUpperCase()}`
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-bold text-slate-800">{name}</td>
                          <td className="p-4 font-semibold text-slate-500">{s.ine}</td>
                          <td className="p-4 text-slate-500">{s.classe?.nom || s.filiere}</td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            <button
                              onClick={() => handlePrintMockBulletin(name)}
                              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
                            >
                              <FiPrinter /> Imprimer
                            </button>
                            <button
                              onClick={() => handlePrintMockBulletin(name)}
                              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                            >
                              <FiDownload /> Bulletin PDF
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-slate-400 italic">Aucun étudiant ne correspond à votre recherche.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminNotes
