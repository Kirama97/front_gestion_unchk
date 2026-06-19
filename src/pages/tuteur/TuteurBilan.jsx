import React, { useState, useEffect } from 'react'
import { apiGet } from '../../utils/api'
import { FiTrendingUp, FiAward, FiAlertTriangle, FiBookOpen, FiFileText, FiPlus, FiX, FiCheck, FiBarChart2 } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/common/Modal'

const TuteurBilan = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [studentGrades, setStudentGrades] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  
  // Bilan modal state
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showBilanModal, setShowBilanModal] = useState(false)
  const [bilanReport, setBilanReport] = useState('')
  const [savingBilan, setSavingBilan] = useState(false)

  // Load tutor's classes
  useEffect(() => {
    const fetchTutorClasses = async () => {
      try {
        setLoading(true)
        const allClasses = await apiGet('/api/classes')
        const tutorClasses = allClasses.filter(c => c.tuteur && c.tuteur.id === user.id)
        setClasses(tutorClasses)
        if (tutorClasses.length > 0) {
          setSelectedClass(tutorClasses[0])
        }
      } catch (err) {
        console.error("Error loading tutor classes:", err)
        showToast("Impossible de charger vos classes.", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchTutorClasses()
  }, [])

  // Load students and their grades when selectedClass changes
  useEffect(() => {
    if (!selectedClass) return
    const fetchClassData = async () => {
      try {
        setLoadingDetails(true)
        const classStudents = await apiGet(`/api/etudiants/classe/${selectedClass.id}`)
        setStudents(classStudents)
        
        // Fetch grades for each student to calculate averages
        const gradesMap = {}
        await Promise.all(
          classStudents.map(async (student) => {
            try {
              const notes = await apiGet(`/api/notes/etudiant/${student.id}`)
              gradesMap[student.id] = notes
            } catch (err) {
              console.error(`Error loading notes for student ${student.id}:`, err)
              gradesMap[student.id] = []
            }
          })
        )
        setStudentGrades(gradesMap)
      } catch (err) {
        console.error("Error loading class students/grades:", err)
        showToast("Impossible de charger les résultats de la classe.", "error")
      } finally {
        setLoadingDetails(false)
      }
    }
    fetchClassData()
  }, [selectedClass])

  // Helper to calculate student average grade
  const getStudentAverage = (studentId) => {
    const notes = studentGrades[studentId] || []
    if (notes.length === 0) return null
    const sum = notes.reduce((acc, note) => acc + (note.valeur || 0), 0)
    return Number((sum / notes.length).toFixed(2))
  }

  // Helper to determine academic status based on average
  const getStatusByAverage = (avg) => {
    if (avg === null) return { label: 'Aucune note', color: 'bg-slate-100 text-slate-500 border-slate-200' }
    if (avg >= 16) return { label: 'Excellent', color: 'bg-green-100 text-green-700 border-green-200' }
    if (avg >= 12) return { label: 'Satisfaisant', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
    if (avg >= 10) return { label: 'Moyen', color: 'bg-orange-100 text-orange-700 border-orange-200' }
    return { label: 'En difficulté', color: 'bg-red-100 text-red-700 border-red-200' }
  }

  // Open the Bilan evaluation modal
  const openBilanModal = (student) => {
    setSelectedStudent(student)
    const storedBilan = localStorage.getItem(`tutor_bilan_${student.id}`)
    setBilanReport(storedBilan || '')
    setShowBilanModal(true)
  }

  // Save Bilan Evaluation Report
  const handleSaveBilan = async (e) => {
    e.preventDefault()
    setSavingBilan(true)
    try {
      localStorage.setItem(`tutor_bilan_${selectedStudent.id}`, bilanReport)
      showToast("Rapport de bilan mis à jour avec succès !", "success")
      setShowBilanModal(false)
    } catch (err) {
      showToast("Erreur lors de la sauvegarde du bilan.", "error")
    } finally {
      setSavingBilan(false)
    }
  }

  // Calculate statistics for the class
  const getClassStats = () => {
    if (students.length === 0) return { avg: 0, passRate: 0, difficulties: 0 }
    
    let sum = 0
    let countWithGrades = 0
    let passCount = 0
    let difficultyCount = 0

    students.forEach(student => {
      const avg = getStudentAverage(student.id)
      if (avg !== null) {
        sum += avg
        countWithGrades++
        if (avg >= 10) passCount++
        if (avg < 10) difficultyCount++
      }
    })

    const classAverage = countWithGrades > 0 ? (sum / countWithGrades).toFixed(2) : 0
    const passRate = countWithGrades > 0 ? Math.round((passCount / countWithGrades) * 100) : 0

    return {
      avg: classAverage,
      passRate,
      difficulties: difficultyCount
    }
  }

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Chargement de l'espace bilans...</div>
      </div>
    )
  }

  const stats = getClassStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Bilan des Étudiants</h1>
        <p className="text-xs text-slate-500 font-medium">Analysez les performances scolaires et rédigez les fiches d'évaluation périodiques.</p>
      </div>

      {classes.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center bg-slate-50/50">
          <FiBarChart2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aucune classe à analyser</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Vous n'avez pas de classe assignée pour effectuer des bilans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Class selector */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Classes encadrées</h3>
            <div className="space-y-2">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedClass?.id === cls.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                      : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{cls.nom}</span>
                    <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-slate-400 uppercase">
                      {cls.niveauEtude}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Moyenne de classe</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{stats.avg} / 20</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-50 text-green-700">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Taux de réussite (Moy &ge; 10)</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{stats.passRate}%</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700">
                  <FiAlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Éléments en difficulté</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{stats.difficulties} Étudiant{stats.difficulties > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Students List Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Résultats Individuels - {selectedClass?.nom}</h3>
              </div>

              {loadingDetails ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="text-xs font-bold text-indigo-600 animate-pulse">Chargement des données académiques...</div>
                </div>
              ) : students.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic text-xs">
                  Aucun étudiant dans cette classe.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[9px]">
                        <th className="p-4">Étudiant</th>
                        <th className="p-4">INE</th>
                        <th className="p-4">Moyenne Générale</th>
                        <th className="p-4">Observation</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((student) => {
                        const stdUser = student.utilisateur || {}
                        const avg = getStudentAverage(student.id)
                        const status = getStatusByAverage(avg)
                        
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 font-semibold text-slate-800">
                              {stdUser.prenom} {stdUser.nom}
                            </td>
                            <td className="p-4 font-mono text-slate-550 text-[10px]">
                              {student.ine}
                            </td>
                            <td className="p-4 font-extrabold text-slate-700">
                              {avg !== null ? `${avg} / 20` : '—'}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => openBilanModal(student)}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
                              >
                                Évaluer / Bilan
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bilan / Evaluation Modal */}
      {showBilanModal && selectedStudent && (
        <Modal
          isOpen={showBilanModal}
          onClose={() => setShowBilanModal(false)}
          title={`Fiche d'Évaluation : ${selectedStudent.utilisateur?.prenom} ${selectedStudent.utilisateur?.nom}`}
          subtitle={`Classe : ${selectedClass?.nom} — INE : ${selectedStudent.ine}`}
        >
          <div className="space-y-5">
            {/* Academic Notes Summary */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relevé de notes récent</h4>
              {(!studentGrades[selectedStudent.id] || studentGrades[selectedStudent.id].length === 0) ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Aucune note enregistrée pour cet étudiant.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1">
                  {studentGrades[selectedStudent.id].map((note) => (
                    <div key={note.id} className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-600 truncate mr-2">{note.matiere?.nom || 'Matière'}</span>
                      <span className="font-black text-indigo-700 shrink-0">{note.valeur} / 20</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bilan Report form */}
            <form onSubmit={handleSaveBilan} className="space-y-4 pt-3 border-t">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Appréciation et Bilan du Tuteur</label>
                <textarea
                  rows={5}
                  value={bilanReport}
                  onChange={(e) => setBilanReport(e.target.value)}
                  placeholder="Rédigez l'évaluation globale de l'étudiant (points forts, difficultés identifiées, plan de tutorat conseillé...)"
                  className="w-full mt-1.5 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-150 focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowBilanModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingBilan}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
                >
                  {savingBilan ? 'Enregistrement...' : 'Enregistrer le Bilan'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default TuteurBilan
