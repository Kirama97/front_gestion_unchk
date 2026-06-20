import React, { useState, useEffect } from 'react'
import { apiGet } from '../../utils/api'
import { FiUsers, FiCalendar, FiBookOpen, FiFileText, FiPlus, FiClock, FiX, FiCheck } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const TuteurSuivi = () => {
  const { showToast } = useToast()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  
  
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [sessionNotes, setSessionNotes] = useState([])
  const [newNote, setNewNote] = useState({
    date: new Date().toISOString().split('T')[0],
    sujet: '',
    type: 'Renforcement Académique',
    contenu: ''
  })

  
  useEffect(() => {
    const fetchTutorClasses = async () => {
      try {
        setLoadingClasses(true)
        const allClasses = await apiGet('/api/classes')
        
        const tutorClasses = allClasses.filter(c => c.tuteur && c.tuteur.id === user.id)
        setClasses(tutorClasses)
        if (tutorClasses.length > 0) {
          setSelectedClass(tutorClasses[0])
        }
      } catch (err) {
        console.error("Error loading tutor classes:", err)
        showToast("Impossible de charger vos classes assignées.", "error")
      } finally {
        setLoadingClasses(false)
      }
    }
    fetchTutorClasses()
  }, [])

  
  useEffect(() => {
    if (!selectedClass) return
    const fetchClassStudents = async () => {
      try {
        setLoadingStudents(true)
        const classStudents = await apiGet(`/api/etudiants/classe/${selectedClass.id}`)
        setStudents(classStudents)
      } catch (err) {
        console.error("Error loading students for class:", err)
        showToast("Impossible de charger les étudiants de cette classe.", "error")
      } finally {
        setLoadingStudents(false)
      }
    }
    fetchClassStudents()
  }, [selectedClass])

  
  const openFollowUpModal = (student) => {
    setSelectedStudent(student)
    const storedNotes = localStorage.getItem(`tutor_sessions_${student.id}`)
    if (storedNotes) {
      setSessionNotes(JSON.parse(storedNotes))
    } else {
      setSessionNotes([])
    }
    setNewNote({
      date: new Date().toISOString().split('T')[0],
      sujet: '',
      type: 'Renforcement Académique',
      contenu: ''
    })
    setShowNotesModal(true)
  }

  
  const handleSaveNote = (e) => {
    e.preventDefault()
    if (!newNote.sujet || !newNote.contenu) {
      showToast("Veuillez renseigner le sujet et le contenu de la note.", "warning")
      return
    }

    const updatedNotes = [
      {
        ...newNote,
        id: Date.now(),
        tuteurName: `${user.prenom || ''} ${user.nom || ''}`.trim()
      },
      ...sessionNotes
    ]

    localStorage.setItem(`tutor_sessions_${selectedStudent.id}`, JSON.stringify(updatedNotes))
    setSessionNotes(updatedNotes)
    setNewNote({
      date: new Date().toISOString().split('T')[0],
      sujet: '',
      type: 'Renforcement Académique',
      contenu: ''
    })
    showToast("Note de suivi ajoutée avec succès !", "success")
  }

  
  const handleDeleteNote = (noteId) => {
    const updated = sessionNotes.filter(n => n.id !== noteId)
    localStorage.setItem(`tutor_sessions_${selectedStudent.id}`, JSON.stringify(updated))
    setSessionNotes(updated)
    showToast("Note supprimée.", "info")
  }

  if (loadingClasses) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Chargement de votre espace tutorat...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Suivi Tutorat</h1>
        <p className="text-xs text-slate-500 font-medium">Gérez le suivi individuel et collectif des étudiants sous votre encadrement.</p>
      </div>

      {classes.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center bg-slate-50/50">
          <FiUsers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Aucune classe assignée</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            L'administration ne vous a pas encore assigné de classe. Contactez l'administrateur pour l'affectation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Class List Selector Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Mes Classes</h3>
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
                  <div className="text-[10px] text-slate-400 font-normal mt-1 truncate">
                    {cls.filiere?.nom || 'Filière non spécifiée'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Student List Main Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                Classe : <span className="text-indigo-700 font-black">{selectedClass?.nom}</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-white border px-2 py-0.5 rounded-full">
                {students.length} Étudiant{students.length > 1 ? 's' : ''}
              </span>
            </div>

            {loadingStudents ? (
              <div className="py-20 flex items-center justify-center">
                <div className="text-xs font-bold text-indigo-600 animate-pulse">Chargement de la liste des étudiants...</div>
              </div>
            ) : students.length === 0 ? (
              <div className="border border-slate-150 rounded-2xl p-10 text-center bg-white">
                <p className="text-xs text-slate-400 italic">Aucun étudiant inscrit dans cette classe pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map((student) => {
                  const stdUser = student.utilisateur || {}
                  const studentName = `${stdUser.prenom || ''} ${stdUser.nom || ''}`.trim()
                  // Get local notes count
                  const localNotes = localStorage.getItem(`tutor_sessions_${student.id}`)
                  const notesCount = localNotes ? JSON.parse(localNotes).length : 0

                  return (
                    <div key={student.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border flex items-center justify-center font-bold text-indigo-700 uppercase shrink-0">
                          {stdUser.prenom?.charAt(0)}{stdUser.nom?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{studentName || 'Étudiant sans nom'}</h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{stdUser.email}</p>
                          <p className="text-[9px] font-mono text-slate-400 mt-1">INE : {student.ine}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <FiFileText className="w-3.5 h-3.5 text-indigo-500" />
                          {notesCount} note{notesCount > 1 ? 's' : ''} de suivi
                        </span>
                        <button
                          onClick={() => openFollowUpModal(student)}
                          className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                        >
                          Suivi & Notes
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Follow-up Notes Modal */}
      {showNotesModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  Dossier de Suivi : {selectedStudent.utilisateur?.prenom} {selectedStudent.utilisateur?.nom}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">INE : {selectedStudent.ine} — Classe : {selectedClass?.nom}</p>
              </div>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-1 rounded-full hover:bg-slate-200 transition text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form: Add Session Note */}
              <form onSubmit={handleSaveNote} className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b">Nouvelle Session / Incident</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                    <input
                      type="date"
                      value={newNote.date}
                      onChange={(e) => setNewNote(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Type de Suivi</label>
                    <select
                      value={newNote.type}
                      onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    >
                      <option value="Renforcement Académique">Renforcement Académique</option>
                      <option value="Appel de Suivi">Appel de Suivi</option>
                      <option value="Orientation / Conseil">Orientation / Conseil</option>
                      <option value="Aide Sociale / Administrative">Aide Sociale / Administrative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Objet / Sujet</label>
                  <input
                    type="text"
                    placeholder="ex. Difficulté avec le module de programmation Java"
                    value={newNote.sujet}
                    onChange={(e) => setNewNote(prev => ({ ...prev, sujet: e.target.value }))}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Notes détaillées</label>
                  <textarea
                    rows={4}
                    placeholder="Saisissez ici le compte rendu détaillé de l'échange, les difficultés constatées, et les actions convenues."
                    value={newNote.contenu}
                    onChange={(e) => setNewNote(prev => ({ ...prev, contenu: e.target.value }))}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-650 hover:bg-indigo-700 transition text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
                >
                  <FiPlus className="w-4 h-4" /> Enregistrer la note
                </button>
              </form>

              {/* History Timeline */}
              <div className="space-y-4 flex flex-col">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b">Historique des Échanges</h4>
                
                {sessionNotes.length === 0 ? (
                  <div className="flex-1 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-6 text-center bg-slate-50/50">
                    <div>
                      <FiClock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 italic">Aucune note de suivi enregistrée pour le moment.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[50vh]">
                    {sessionNotes.map((note) => (
                      <div key={note.id} className="border border-slate-200/80 rounded-2xl p-3.5 bg-slate-50/30 relative hover:border-slate-300 transition">
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition"
                          title="Supprimer cette note"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {note.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{note.date}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800 mt-2">{note.sujet}</h5>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed whitespace-pre-wrap">{note.contenu}</p>
                        <div className="text-[9px] text-slate-400 font-medium mt-2 border-t pt-1.5 italic">
                          Enregistré par : {note.tuteurName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TuteurSuivi
