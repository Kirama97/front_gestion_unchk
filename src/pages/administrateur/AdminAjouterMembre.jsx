import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { apiGet, apiPost } from '../../utils/api'
import { FiUserPlus, FiArrowLeft, FiCheckCircle, FiInfo } from 'react-icons/fi'

const AdminAjouterMembre = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { filiereId } = useParams()

  // Determine role/type based on route URL
  let memberType = 'etudiant'
  if (location.pathname.includes('enseignants')) {
    memberType = 'enseignant'
  } else if (location.pathname.includes('tuteurs')) {
    memberType = 'tuteur'
  }

  // Common form fields
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('Passer123')
  const [telephone, setTelephone] = useState('')
  
  // Student-specific fields
  const [ine, setIne] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [niveauEtude, setNiveauEtude] = useState('Licence 1')
  const [adresse, setAdresse] = useState('')
  const [genre, setGenre] = useState('Masculin')
  const [anneeDebut, setAnneeDebut] = useState(new Date().getFullYear())
  const [anneeSortie, setAnneeSortie] = useState(new Date().getFullYear() + 3)
  const [selectedClasseId, setSelectedClasseId] = useState('')
  const [selectedFiliereId, setSelectedFiliereId] = useState(filiereId || '')
  const [selectedPromotionId, setSelectedPromotionId] = useState('')

  // Teacher/Tutor specific fields
  const [departement, setDepartement] = useState('Informatique')
  const [statut, setStatut] = useState('Actif')

  // Dropdown lists
  const [promotions, setPromotions] = useState([])
  const [filieres, setFilieres] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (memberType === 'etudiant') {
      const fetchAcademicData = async () => {
        try {
          const [promos, fils, cls] = await Promise.all([
            apiGet('/api/academique/promotions'),
            apiGet('/api/academique/filieres'),
            apiGet('/api/academique/classes')
          ])
          setPromotions(promos)
          setFilieres(fils)
          setClasses(cls)

          if (promos.length > 0) setSelectedPromotionId(promos[0].id.toString())
          if (fils.length > 0 && !filiereId) setSelectedFiliereId(fils[0].id.toString())
          if (cls.length > 0) setSelectedClasseId(cls[0].id.toString())
        } catch (err) {
          console.error("Error loading academic select lists:", err)
        }
      }
      fetchAcademicData()
    }
  }, [memberType, filiereId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nom || !prenom || !email) {
      alert("Veuillez remplir les champs obligatoires (Nom, Prénom, Email).")
      return
    }

    try {
      setLoading(true)
      setSuccess('')

      if (memberType === 'etudiant') {
        if (!ine) {
          alert("Le champ INE est obligatoire pour les étudiants.")
          setLoading(false)
          return
        }

        const selectedFiliereObj = filieres.find(f => f.id === Number(selectedFiliereId))
        const selectedPromoObj = promotions.find(p => p.id === Number(selectedPromotionId))

        const payload = {
          nom,
          prenom,
          email,
          motDePasse,
          ine,
          dateNaissance: dateNaissance || '2000-01-01',
          filiere: selectedFiliereObj ? selectedFiliereObj.nom : 'Génie Logiciel',
          promo: selectedPromoObj ? selectedPromoObj.nom : 'Promotion 8',
          niveauEtude,
          adresse: adresse || 'Dakar, Sénégal',
          genre,
          telephone,
          anneeDebut: Number(anneeDebut),
          anneeSortie: Number(anneeSortie),
          classeId: selectedClasseId ? Number(selectedClasseId) : null,
          filiereId: selectedFiliereId ? Number(selectedFiliereId) : null,
          promotionId: selectedPromotionId ? Number(selectedPromotionId) : null
        }

        await apiPost('/api/etudiants', payload)
        setSuccess('L\'étudiant a été inscrit avec succès !')
      } else {
        const payload = {
          nom,
          prenom,
          email,
          motDePasse,
          role: memberType === 'enseignant' ? 'ENSEIGNANT' : 'TUTEUR',
          telephone,
          departement,
          statut
        }

        await apiPost('/api/personnel', payload)
        setSuccess(`${memberType === 'enseignant' ? 'L\'enseignant' : 'Le tuteur'} a été créé avec succès !`)
      }

      // Reset form
      setNom('')
      setPrenom('')
      setEmail('')
      setTelephone('')
      setIne('')
      setDateNaissance('')
      setAdresse('')

      setTimeout(() => {
        setSuccess('')
        // Go back
        navigate(-1)
      }, 1500)
    } catch (err) {
      console.error("Error creating member:", err)
      alert(err.message || "Erreur lors de la création du compte.")
    } finally {
      setLoading(false)
    }
  }

  const title = memberType === 'etudiant' ? 'Inscrire un Étudiant'
              : memberType === 'enseignant' ? 'Créer un Compte Enseignant'
              : 'Créer un Compte Tuteur'

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Enregistrement d'un nouveau membre sur le portail UNCHK.</p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 max-w-2xl mx-auto w-full">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
            <FiUserPlus className="text-orange-500 w-5 h-5" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Informations d'identité</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prénom *</label>
              <input 
                type="text" required placeholder="Ex: Fatou" value={prenom} onChange={e => setPrenom(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nom *</label>
              <input 
                type="text" required placeholder="Ex: Diop" value={nom} onChange={e => setNom(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email professionnel *</label>
              <input 
                type="email" required placeholder="Ex: fatou.diop@unchk.edu.sn" value={email} onChange={e => setEmail(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
              <input 
                type="text" placeholder="Ex: +221 77 123 45 67" value={telephone} onChange={e => setTelephone(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Student Fields */}
          {memberType === 'etudiant' && (
            <>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mt-4 mb-2">
                <FiInfo className="text-orange-500 w-5 h-5" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Détails Étudiant</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identifiant INE *</label>
                  <input 
                    type="text" required placeholder="Ex: INE-2026-9988" value={ine} onChange={e => setIne(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date de naissance</label>
                  <input 
                    type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filière</label>
                  <select 
                    value={selectedFiliereId} onChange={e => setSelectedFiliereId(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    {filieres.map(f => (
                      <option key={f.id} value={f.id}>{f.nom} ({f.code})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promotion</label>
                  <select 
                    value={selectedPromotionId} onChange={e => setSelectedPromotionId(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    {promotions.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classe académique</label>
                  <select 
                    value={selectedClasseId} onChange={e => setSelectedClasseId(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    {classes
                      .filter(c => c.filiere?.id === Number(selectedFiliereId) && c.promotion?.id === Number(selectedPromotionId))
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))
                    }
                    {classes.filter(c => c.filiere?.id === Number(selectedFiliereId) && c.promotion?.id === Number(selectedPromotionId)).length === 0 && (
                      classes.map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Niveau d'étude</label>
                  <select 
                    value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="Licence 1">Licence 1</option>
                    <option value="Licence 2">Licence 2</option>
                    <option value="Licence 3">Licence 3</option>
                    <option value="Master 1">Master 1</option>
                    <option value="Master 2">Master 2</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Genre</label>
                  <select 
                    value={genre} onChange={e => setGenre(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adresse</label>
                  <input 
                    type="text" placeholder="Dakar, Sénégal" value={adresse} onChange={e => setAdresse(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Teacher/Tutor Fields */}
          {(memberType === 'enseignant' || memberType === 'tuteur') && (
            <>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mt-4 mb-2">
                <FiInfo className="text-orange-500 w-5 h-5" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Rattachement Professionnel</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Département d'enseignement</label>
                  <select 
                    value={departement} onChange={e => setDepartement(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Lettres et SHS">Lettres et Sciences Humaines</option>
                    <option value="Gestion & Management">Gestion & Management</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut professionnel</label>
                  <select 
                    value={statut} onChange={e => setStatut(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Congé">Congé</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-5">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="text-xs font-bold px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition disabled:opacity-55"
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AdminAjouterMembre
