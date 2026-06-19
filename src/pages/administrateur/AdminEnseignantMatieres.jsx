import React, { useState, useEffect } from 'react'
import { apiGet, apiPost } from '../../utils/api'
import { FiBookOpen, FiPlus, FiUser, FiX, FiCheckCircle } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const AdminEnseignantMatieres = () => {
  const { showToast } = useToast()
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [matieres, setMatieres] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  // Assign Modal state
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [selectedMatiereId, setSelectedMatiereId] = useState('')
  const [selectedClasseId, setSelectedClasseId] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [personnel, allCourses, mats, cls] = await Promise.all([
        apiGet('/api/personnel'),
        apiGet('/api/cours'),
        apiGet('/api/academique/matieres'),
        apiGet('/api/academique/classes')
      ])

      const list = personnel.filter(p => p.role === 'enseignant' || p.role === 'ENSEIGNANT')
      setTeachers(list)
      setCourses(allCourses)
      setMatieres(mats)
      setClasses(cls)

      if (list.length > 0) setSelectedTeacherId(list[0].id.toString())
      if (mats.length > 0) setSelectedMatiereId(mats[0].id.toString())
      if (cls.length > 0) setSelectedClasseId(cls[0].id.toString())
      
      setLoading(false)
    } catch (err) {
      console.error("Error loading teachers courses assignment:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAssignCourse = async (e) => {
    e.preventDefault()
    if (!selectedTeacherId || !selectedMatiereId || !selectedClasseId) return

    try {
      setSaving(true)
      
      const payload = {
        matiere: { id: Number(selectedMatiereId) },
        enseignant: { id: Number(selectedTeacherId) },
        classe: { id: Number(selectedClasseId) }
      }

      await apiPost('/api/cours', payload)
      showToast('Le cours a été assigné avec succès à l\'enseignant !', 'success')
      
      setTimeout(() => {
        setShowAssignModal(false)
        setSaving(false)
        loadData()
      }, 1500)
    } catch (err) {
      console.error(err)
      showToast("Erreur lors de l'assignation de la matière.", "error")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement des matières assignées...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Matières Enseignées</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Visualisez et modifiez les assignations de matières par enseignant.</p>
        </div>

        <button 
          onClick={() => setShowAssignModal(true)}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
        >
          <FiPlus />
          <span>Assigner une matière</span>
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {/* Grid of Teachers Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
        {teachers.map((teacher) => {
          const teacherCourses = courses.filter(c => c.enseignant?.id === teacher.id)

          return (
            <div key={teacher.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {teacher.prenom?.charAt(0)}{teacher.nom?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{teacher.prenom} {teacher.nom}</h3>
                  <p className="text-[9px] text-slate-400 font-semibold">{teacher.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matières assignées ({teacherCourses.length})</p>
                {teacherCourses.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacherCourses.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-100/50">
                        <FiBookOpen className="w-3.5 h-3.5" />
                        {c.matiere?.nom} • <span className="text-slate-500 font-medium">{c.classe?.nom}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic py-2">Aucune matière assignée pour le moment.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Assigner une matière</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Associer un enseignant à une matière et une classe.</p>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Success banner inside form */}
            {success && (
              <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAssignCourse} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enseignant *</label>
                <select
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Matière *</label>
                <select
                  value={selectedMatiereId}
                  onChange={e => setSelectedMatiereId(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {matieres.map(m => (
                    <option key={m.id} value={m.id}>{m.nom} ({m.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classe *</label>
                <select
                  value={selectedClasseId}
                  onChange={e => setSelectedClasseId(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAssignModal(false)}
                  className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !selectedTeacherId || !selectedMatiereId || !selectedClasseId}
                  className="text-xs font-bold px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-55"
                >
                  {saving ? 'Assignation...' : 'Assigner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminEnseignantMatieres
