import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import { apiGet, apiPost } from '../../utils/api'
import { FiBookOpen, FiPlus, FiCalendar, FiFileText, FiChevronDown, FiChevronUp, FiX, FiCheckCircle } from 'react-icons/fi'

const CourEnseignant = () => {
  const { showToast } = useToast()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCourseId, setExpandedCourseId] = useState(null)
  const [sequencesByCourse, setSequencesByCourse] = useState({})
  
  // Modal State for adding sequence
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCourseForSeq, setSelectedCourseForSeq] = useState(null)
  const [newSeqTitle, setNewSeqTitle] = useState('')
  const [newSeqDesc, setNewSeqDesc] = useState('')
  const [newSeqStartDate, setNewSeqStartDate] = useState('')
  const [newSeqEndDate, setNewSeqEndDate] = useState('')
  const [savingSeq, setSavingSeq] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) throw new Error("Utilisateur non authentifié.")
        
        const data = await apiGet(`/api/cours/enseignant/${user.id}`)
        setCourses(data)
        
        // Fetch sequences for each course
        const seqsMap = {}
        const seqPromises = data.map(async (c) => {
          try {
            const seqs = await apiGet(`/api/cours/${c.id}/sequences`)
            seqsMap[c.id] = seqs
          } catch (err) {
            console.error(`Error fetching sequences for course ${c.id}:`, err)
            seqsMap[c.id] = []
          }
        })
        await Promise.all(seqPromises)
        setSequencesByCourse(seqsMap)
        
        setLoading(false)
      } catch (err) {
        console.error("Error loading courses:", err)
        setError(err.message || "Impossible de charger vos enseignements.")
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const toggleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId)
  }

  const openAddSequenceModal = (course, e) => {
    e.stopPropagation() // Prevent card toggle
    setSelectedCourseForSeq(course)
    setShowAddModal(true)
    // reset form
    setNewSeqTitle('')
    setNewSeqDesc('')
    setNewSeqStartDate('')
    setNewSeqEndDate('')
    setSuccessMessage('')
  }

  const handleAddSequence = async (e) => {
    e.preventDefault()
    if (!newSeqTitle) return

    try {
      setSavingSeq(true)
      const payload = {
        titre: newSeqTitle,
        description: newSeqDesc,
        dateDebut: newSeqStartDate || null,
        dateFin: newSeqEndDate || null,
        documentChemin: '/docs/default.pdf',
        exerciceChemin: '/exercises/default.pdf'
      }

      const savedSeq = await apiPost(`/api/cours/${selectedCourseForSeq.id}/sequences`, payload)
      
      // Update local state
      setSequencesByCourse(prev => ({
        ...prev,
        [selectedCourseForSeq.id]: [...(prev[selectedCourseForSeq.id] || []), savedSeq]
      }))

      setSuccessMessage('La séquence pédagogique a été ajoutée avec succès !')
      setNewSeqTitle('')
      setNewSeqDesc('')
      setNewSeqStartDate('')
      setNewSeqEndDate('')
      
      setTimeout(() => {
        setShowAddModal(false)
        setSuccessMessage('')
      }, 1500)
    } catch (err) {
      console.error("Error adding sequence:", err)
      showToast("Erreur lors de l'enregistrement de la séquence.", "error")
    } finally {
      setSavingSeq(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de vos cours...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-[5%] sm:px-[10%] py-10 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mes Enseignements</h1>
          <p className="text-xs text-slate-500 font-medium">Gérez le contenu pédagogique et suivez les chapitres de vos matières.</p>
        </div>
      </div>

      {/* Courses List */}
      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {courses.length > 0 ? (
          courses.map((course) => {
            const isExpanded = expandedCourseId === course.id
            const sequences = sequencesByCourse[course.id] || []
            const classObj = course.classe || {}
            
            return (
              <div 
                key={course.id} 
                className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : 'border-slate-200/80'
                }`}
              >
                {/* Course Header Bar (Clickable) */}
                <div 
                  onClick={() => toggleExpand(course.id)}
                  className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition duration-150"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <FiBookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                        {classObj.nom || "Master 1"}
                      </span>
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight tracking-tight mt-0.5">
                        {course.matiere?.nom || "Matière"}
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        Code: <span className="text-slate-600 font-semibold">{course.matiere?.code}</span> • Promo: <span className="text-slate-600 font-semibold">{classObj.niveauEtude || "M1"}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => openAddSequenceModal(course, e)}
                      className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 rounded-lg transition duration-200"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                      Ajouter une séquence
                    </button>
                    {isExpanded ? <FiChevronUp className="w-5 h-5 text-slate-400" /> : <FiChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Content: Sequences List */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/30 p-5 sm:p-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Séquences Pédagogiques ({sequences.length})
                      </h3>
                      <button
                        onClick={(e) => openAddSequenceModal(course, e)}
                        className="sm:hidden flex items-center gap-1 text-[9px] font-bold px-2 py-1 bg-emerald-600 text-white rounded-lg transition"
                      >
                        <FiPlus className="w-3 h-3" /> Ajouter
                      </button>
                    </div>

                    {sequences.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {sequences.map((seq, idx) => (
                          <div 
                            key={seq.id} 
                            className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition duration-200"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <h4 className="text-xs font-bold text-slate-800">{seq.titre}</h4>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal pl-7">
                                {seq.description || "Aucune description fournie pour cette séquence."}
                              </p>
                              {seq.dateDebut && (
                                <p className="text-[9px] text-slate-400 font-semibold mt-1.5 pl-7 flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3" /> Période: {new Date(seq.dateDebut).toLocaleDateString('fr-FR')} au {new Date(seq.dateFin).toLocaleDateString('fr-FR')}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pl-7 md:pl-0">
                              <a 
                                href={seq.documentChemin || "#"} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
                              >
                                <FiFileText className="w-3 h-3" /> Support Cours
                              </a>
                              <a 
                                href={seq.exerciceChemin || "#"} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
                              >
                                📝 Exercices
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-white">
                        <p className="text-[11px] text-slate-400 italic">Aucune séquence pédagogique enregistrée.</p>
                        <p className="text-[9px] text-slate-400 mt-1">Créez votre première séquence pour y attacher des supports de cours.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-slate-400 font-semibold text-sm">Aucun cours trouvé dans votre espace.</p>
            <p className="text-slate-400 text-xs mt-1">Veuillez contacter l'administration de scolarité si cela est anormal.</p>
          </div>
        )}
      </div>

      {/* Add Sequence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Ajouter une Séquence</h3>
                <p className="text-[10px] text-slate-400 font-medium">Pour le cours de {selectedCourseForSeq?.matiere?.nom}</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddSequence} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Titre de la Séquence *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Chapitre 4 : Routage React"
                  value={newSeqTitle}
                  onChange={(e) => setNewSeqTitle(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/10 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  rows="3"
                  placeholder="Objectifs de la séance et notions abordées..."
                  value={newSeqDesc}
                  onChange={(e) => setNewSeqDesc(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/10 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date de Début</label>
                  <input 
                    type="date"
                    value={newSeqStartDate}
                    onChange={(e) => setNewSeqStartDate(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/10 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date de Fin</label>
                  <input 
                    type="date"
                    value={newSeqEndDate}
                    onChange={(e) => setNewSeqEndDate(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/10 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={savingSeq || !newSeqTitle}
                  className="text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-55"
                >
                  {savingSeq ? 'Enregistrement...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourEnseignant
