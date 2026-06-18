import React, { useState, useEffect } from 'react'
import { apiGet, apiPost } from '../../utils/api'
import { FiFileText, FiSave, FiAlertCircle, FiCheckCircle, FiSearch, FiInfo } from 'react-icons/fi'

const NotesEnseignant = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  const [sequences, setSequences] = useState([])
  const [selectedSequenceId, setSelectedSequenceId] = useState('') // empty string for Exam
  
  const [evalType, setEvalType] = useState('DEVOIR') // 'DEVOIR' or 'EXAMEN'
  const [session, setSession] = useState('Principale') // 'Principale' or 'Rattrapage'
  
  const [students, setStudents] = useState([])
  const [gradesMap, setGradesMap] = useState({}) // studentId -> { noteId, valeur }
  const [inputGrades, setInputGrades] = useState({}) // studentId -> valeur (string input)
  
  const [loading, setLoading] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  // 1. Fetch Teacher's Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) throw new Error("Utilisateur non authentifié.")
        
        const data = await apiGet(`/api/cours/enseignant/${user.id}`)
        setCourses(data)
        
        if (data.length > 0) {
          // Select first course by default
          setSelectedCourse(data[0])
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error("Error loading courses:", err)
        setError("Impossible de charger vos matières.")
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // 2. Fetch Sequences when selected course changes
  useEffect(() => {
    if (!selectedCourse) return

    const fetchSequences = async () => {
      try {
        const data = await apiGet(`/api/cours/${selectedCourse.id}/sequences`)
        setSequences(data)
        // Auto select sequence or reset
        if (data.length > 0) {
          setSelectedSequenceId(data[0].id.toString())
          setEvalType('DEVOIR')
        } else {
          setSelectedSequenceId('')
          setEvalType('EXAMEN')
        }
      } catch (err) {
        console.error("Error fetching sequences:", err)
        setSequences([])
        setSelectedSequenceId('')
        setEvalType('EXAMEN')
      }
    }
    fetchSequences()
  }, [selectedCourse])

  // 3. Load Students and existing grades when course, sequence, evaluation type, or session changes
  useEffect(() => {
    if (!selectedCourse) return

    const loadStudentsAndGrades = async () => {
      try {
        setLoadingStudents(true)
        setStatusMessage({ type: '', text: '' })
        
        const classeId = selectedCourse.classe?.id
        const matiereId = selectedCourse.matiere?.id
        if (!classeId || !matiereId) return

        // Fetch class students
        const studentsList = await apiGet(`/api/etudiants/classe/${classeId}`)
        setStudents(studentsList)

        // Fetch all notes to filter the matching ones
        const allNotes = await apiGet('/api/notes')
        
        // Map existing notes
        const tempGrades = {}
        const tempInputs = {}
        
        studentsList.forEach(student => {
          // Find if there is a note for this student, matiere, type, session and sequence
          const studentNote = allNotes.find(note => 
            note.etudiant?.id === student.id &&
            note.matiere?.id === matiereId &&
            note.type === evalType &&
            note.session === session &&
            (evalType === 'EXAMEN' ? !note.sequence : (note.sequence?.id === Number(selectedSequenceId)))
          )
          
          if (studentNote) {
            tempGrades[student.id] = {
              noteId: studentNote.id,
              valeur: studentNote.valeur
            }
            tempInputs[student.id] = studentNote.valeur.toString()
          } else {
            tempGrades[student.id] = null
            tempInputs[student.id] = ''
          }
        })
        
        setGradesMap(tempGrades)
        setInputGrades(tempInputs)
        setLoading(false)
        setLoadingStudents(false)
      } catch (err) {
        console.error("Error loading student grades:", err)
        setError("Erreur de chargement des élèves et des notes.")
        setLoading(false)
        setLoadingStudents(false)
      }
    }

    loadStudentsAndGrades()
  }, [selectedCourse, selectedSequenceId, evalType, session])

  const handleGradeChange = (studentId, value) => {
    // Validate value to be between 0 and 20 or empty
    if (value === '') {
      setInputGrades(prev => ({ ...prev, [studentId]: '' }))
      return
    }

    const numeric = parseFloat(value)
    if (!isNaN(numeric) && numeric >= 0 && numeric <= 20) {
      setInputGrades(prev => ({ ...prev, [studentId]: value }))
    }
  }

  const saveAllGrades = async () => {
    if (!selectedCourse) return
    
    try {
      setSaving(true)
      setStatusMessage({ type: '', text: '' })
      
      const classeId = selectedCourse.classe?.id
      const matiereId = selectedCourse.matiere?.id
      const promotionId = selectedCourse.classe?.promotion_id || 1 // fallback to promotion 1
      
      if (!classeId || !matiereId) return

      const savePromises = Object.keys(inputGrades).map(async (studentIdStr) => {
        const studentId = Number(studentIdStr)
        const gradeStr = inputGrades[studentId]
        
        if (gradeStr === '') return // skip empty ones

        const gradeValue = parseFloat(gradeStr)
        const existing = gradesMap[studentId]

        // Payload matching Spring Boot Note entity structure
        const payload = {
          id: existing ? existing.noteId : null,
          etudiant: { id: studentId },
          matiere: { id: matiereId },
          classe: { id: classeId },
          promotion: { id: promotionId },
          sequence: evalType === 'DEVOIR' && selectedSequenceId ? { id: Number(selectedSequenceId) } : null,
          valeur: gradeValue,
          type: evalType,
          session: session
        }

        return apiPost('/api/notes', payload)
      })

      await Promise.all(savePromises)
      
      setStatusMessage({ type: 'success', text: 'Toutes les notes ont été enregistrées avec succès.' })
      
      // Reload grades
      const allNotes = await apiGet('/api/notes')
      const tempGrades = {}
      students.forEach(student => {
        const studentNote = allNotes.find(note => 
          note.etudiant?.id === student.id &&
          note.matiere?.id === matiereId &&
          note.type === evalType &&
          note.session === session &&
          (evalType === 'EXAMEN' ? !note.sequence : (note.sequence?.id === Number(selectedSequenceId)))
        )
        if (studentNote) {
          tempGrades[student.id] = {
            noteId: studentNote.id,
            valeur: studentNote.valeur
          }
        }
      })
      setGradesMap(tempGrades)
      
    } catch (err) {
      console.error("Error saving grades:", err)
      setStatusMessage({ type: 'error', text: "Erreur lors de la sauvegarde des notes. Veuillez réessayer." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement des données de saisie...</div>
      </div>
    )
  }

  return (
    <div className="w-full px-[5%] sm:px-[10%] py-10 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Saisie des Notes</h1>
        <p className="text-xs text-slate-500 font-medium">Saisissez et mettez à jour les évaluations des étudiants de vos classes.</p>
      </div>

      {/* Selectors Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-8 max-w-5xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 1. Matière/Cours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Matière & Classe</label>
            <select
              value={selectedCourse?.id || ''}
              onChange={(e) => {
                const c = courses.find(course => course.id === Number(e.target.value))
                setSelectedCourse(c)
              }}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition bg-white"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.matiere?.nom} ({c.classe?.nom})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Type d'évaluation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type d'évaluation</label>
            <select
              value={evalType}
              onChange={(e) => {
                setEvalType(e.target.value)
                if (e.target.value === 'EXAMEN') {
                  setSelectedSequenceId('')
                } else if (sequences.length > 0) {
                  setSelectedSequenceId(sequences[0].id.toString())
                }
              }}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition bg-white"
            >
              <option value="DEVOIR">Devoir / Contrôle Continu</option>
              <option value="EXAMEN">Examen Final</option>
            </select>
          </div>

          {/* 3. Séquence / Séance */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Séquence associée</label>
            <select
              value={selectedSequenceId}
              disabled={evalType === 'EXAMEN'}
              onChange={(e) => setSelectedSequenceId(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition bg-white disabled:bg-slate-50 disabled:text-slate-400"
            >
              {evalType === 'DEVOIR' && sequences.length > 0 ? (
                sequences.map(seq => (
                  <option key={seq.id} value={seq.id}>
                    {seq.titre}
                  </option>
                ))
              ) : (
                <option value="">Examen global (Aucune séquence)</option>
              )}
            </select>
          </div>

          {/* 4. Session */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Session</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition bg-white"
            >
              <option value="Principale">Principale</option>
              <option value="Rattrapage">Rattrapage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Message feedback banner */}
      {statusMessage.text && (
        <div className={`max-w-5xl mx-auto p-4 rounded-xl border mb-6 flex items-center gap-2.5 text-xs font-semibold ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : 'bg-red-50 text-red-800 border-red-100'
        }`}>
          {statusMessage.type === 'success' ? <FiCheckCircle className="w-5 h-5 text-emerald-600" /> : <FiAlertCircle className="w-5 h-5 text-red-600" />}
          {statusMessage.text}
        </div>
      )}

      {/* Grade Entry Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm max-w-5xl mx-auto">
        <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Liste des Étudiants ({students.length})
          </span>
          <button
            onClick={saveAllGrades}
            disabled={saving || students.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/10 transition duration-200 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Sauvegarder les notes'}
          </button>
        </div>

        {loadingStudents ? (
          <div className="py-20 text-center text-slate-400 font-medium text-xs animate-pulse">
            Chargement de la grille d'étudiants...
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/10">
                  <th className="px-6 py-3.5">Nom complet</th>
                  <th className="px-6 py-3.5">Identifiant INE</th>
                  <th className="px-6 py-3.5">Statut de saisie</th>
                  <th className="px-6 py-3.5 text-center">Note / 20</th>
                  <th className="px-6 py-3.5 text-right">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {students.map((student) => {
                  const hasGrade = gradesMap[student.id] !== null
                  const gradeVal = inputGrades[student.id] || ''
                  
                  // Calculate result
                  let resultStr = "En attente"
                  let resultColor = "text-slate-400 bg-slate-50"
                  if (gradeVal !== '') {
                    const parsedVal = parseFloat(gradeVal)
                    if (parsedVal >= 10) {
                      resultStr = "Validé"
                      resultColor = "text-emerald-700 bg-emerald-50 border border-emerald-100"
                    } else {
                      resultStr = "Rattrapage"
                      resultColor = "text-red-700 bg-red-50 border border-red-100"
                    }
                  }

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/30 transition">
                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {student.utilisateur?.prenom} {student.utilisateur?.nom?.toUpperCase()}
                        <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{student.utilisateur?.email}</span>
                      </td>

                      {/* INE */}
                      <td className="px-6 py-4 font-semibold text-slate-500">
                        {student.ine}
                      </td>

                      {/* Input Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          hasGrade ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${hasGrade ? 'bg-slate-400' : 'bg-amber-500 animate-pulse'}`} />
                          {hasGrade ? 'Saisie enregistrée' : 'Non saisie'}
                        </span>
                      </td>

                      {/* Grade Input */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          placeholder="--"
                          value={gradeVal}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          className="w-16 text-center text-xs font-bold px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition"
                        />
                      </td>

                      {/* Result */}
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${resultColor}`}>
                          {resultStr}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 italic text-xs">
            Aucun étudiant inscrit dans cette classe.
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesEnseignant
