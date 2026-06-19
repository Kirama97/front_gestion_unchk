import React, { useState } from 'react'
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiUsers, FiHome,
  FiBook, FiAward, FiMap, FiEdit, FiMessageSquare,
  FiCheckCircle, FiMapPin, FiBookOpen, FiLayout,
  FiSave, FiX,
} from 'react-icons/fi'

/* ─── Composants utilitaires ─── */



const Badge = ({ children, variant = 'orange' }) => {
  const styles = {
    orange: 'bg-orange-50 text-orange-700',
    green:  'bg-green-50 text-green-700',
    blue:   'bg-blue-50 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${styles[variant]}`}>
      {children}
    </span>
  )
}

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
)

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
    <Icon size={17} className="text-orange-500" />
    {children}
  </div>
)

/* Champ en mode lecture */
const FieldRow = ({ label, icon: Icon, value, last = false }) => (
  <div className={`flex justify-between items-center py-2.5 text-sm ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="flex items-center gap-2 text-gray-400 shrink-0">
      <Icon size={14} />
      {label}
    </span>
    <span className="text-gray-800 font-medium text-right ml-4">{value}</span>
  </div>
)

/* Champ en mode édition */
const EditRow = ({ label, icon: Icon, name, value, onChange, type = 'text', readOnly = false, last = false }) => (
  <div className={`flex flex-col gap-1 py-2.5 text-sm ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="flex items-center gap-2 text-gray-400">
      <Icon size={14} />
      {label}
    </span>
    {readOnly ? (
      <span className="font-mono text-xs bg-gray-50 px-2 py-1.5 rounded text-gray-500 select-none">{value}</span>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
      />
    )}
  </div>
)

const BtnOrange = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
  >
    {children}
  </button>
)

const BtnGhost = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-transparent hover:bg-orange-50 text-orange-500 border border-orange-500 text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
  >
    {children}
  </button>
)

import { useEffect } from 'react'
import { apiGet, apiPut, apiPost, getProfileImage } from '../../utils/api'
import { useToast } from '../../context/ToastContext'

/* ─── Composant principal ─── */

const ProfilEtudiant = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode]   = useState(false)
  const [etudiant, setEtudiant]   = useState(null)
  const [draft, setDraft]         = useState(null)
  const [saved, setSaved]         = useState(false)

  const mapBackendToState = (data) => {
    const userObj = data.utilisateur || {};
    return {
      id: data.id,
      nom: `${userObj.prenom || ''} ${userObj.nom || ''}`,
      prenom: userObj.prenom || '',
      nomSeul: userObj.nom || '',
      image: userObj.photoProfil || '',
      identifiant: data.ine || '',
      email: userObj.email || '',
      telephone: userObj.telephone || '',
      dateNaissance: data.dateNaissance || '',
      genre: data.genre || '',
      adresse: data.adresse || '',
      etablissement: 'Université Numérique Cheikh Hamidou Kane (UN-CHK)',
      filiere: data.filiere || '',
      niveau: data.niveauEtude || '',
      anneeEntree: data.anneeDebut ? `${data.anneeDebut} – ${data.anneeSortie || ''}` : '',
      anneeDebut: data.anneeDebut || '',
      anneeSortie: data.anneeSortie || '',
      statut: userObj.statut || 'Actif',
      localisation: data.adresse || 'Sénégal',
    };
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/api/etudiant/me');
        const stateObj = mapBackendToState(data);
        setEtudiant(stateObj);
        setDraft(stateObj);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError(err.message || 'Impossible de charger les données du profil.');
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setDraft(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const payload = {
        nom: draft.nomSeul,
        prenom: draft.prenom,
        email: draft.email,
        telephone: draft.telephone,
        dateNaissance: draft.dateNaissance,
        adresse: draft.adresse,
        genre: draft.genre,
        filiere: draft.filiere,
        niveauEtude: draft.niveau,
        anneeDebut: draft.anneeDebut,
        anneeSortie: draft.anneeSortie,
      };

      const response = await apiPut(`/api/etudiants/${draft.id}`, payload);
      const updatedState = mapBackendToState(response);
      setEtudiant(updatedState);
      setDraft(updatedState);
      setEditMode(false);
      setSaved(true);
      showToast("Profil mis à jour avec succès !", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast(err.message || "Erreur lors de la mise à jour du profil.", "error");
    }
  }

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      showToast("Téléchargement de la photo...", "info")
      const uploadRes = await apiPost('/api/files/upload', formData)
      const newPhotoUrl = uploadRes.url

      await apiPut('/api/auth/photo', { photoProfil: newPhotoUrl })

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      storedUser.photoProfil = newPhotoUrl
      localStorage.setItem('user', JSON.stringify(storedUser))

      setEtudiant(prev => ({ ...prev, image: newPhotoUrl }))
      setDraft(prev => ({ ...prev, image: newPhotoUrl }))
      window.dispatchEvent(new Event('user-profile-updated'))

      showToast("Photo de profil mise à jour avec succès !", "success")
    } catch (err) {
      console.error("Error uploading photo:", err)
      showToast(err.message || "Erreur lors du téléchargement de la photo.", "error")
    }
  }

  const handleCancel = () => {
    setDraft(etudiant)
    setEditMode(false)
  }

  const openEdit = () => {
    setDraft(etudiant)
    setEditMode(true)
  }

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de votre profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  const e = etudiant

  return (
    <div className="w-full  mx-auto p-5 sm:px-[10%] py-6 font-sans">

      {/* ── Toast succès ── */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
          <FiCheckCircle size={16} />
          Profil mis à jour avec succès !
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-6">
        <div className=" h-24" />
        <div className="px-5 pb-5">
          <div className="-mt-10 mb-3 flex items-center justify-start">
            <div className="relative group w-20 h-20">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-4 border-white ring-2 ring-orange-500 bg-orange-100 font-bold text-orange-700 text-2xl shadow-md">
                {e.image ? (
                  <img src={getProfileImage(e.image)} alt="Profil" className='w-full h-full object-cover' />
                ) : (
                  <FiUser className="w-10 h-10 text-orange-500" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiEdit className="text-white w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">{e.nom}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="orange"><FiAward size={11} /> {e.niveau} — {e.filiere}</Badge>
                <Badge variant="green"><FiCheckCircle size={11} /> {e.statut}</Badge>
                <Badge variant="blue"><FiMapPin size={11} /> {e.localisation}</Badge>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <BtnGhost><FiMessageSquare size={14} /> Message</BtnGhost>
              {!editMode
                ? <BtnOrange onClick={openEdit}><FiEdit size={14} /> Modifier</BtnOrange>
                : (
                  <>
                    <BtnGhost onClick={handleCancel}><FiX size={14} /> Annuler</BtnGhost>
                    <BtnOrange onClick={handleSave}><FiSave size={14} /> Enregistrer</BtnOrange>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── Cartes ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Informations personnelles */}
        <Card>
          <SectionTitle icon={FiUser}>Informations personnelles</SectionTitle>

          {editMode ? (
            <>
              <EditRow icon={FiLayout}   label="Identifiant (INE)"   name="identifiant"   value={draft.identifiant}   onChange={handleChange} readOnly />
              <EditRow icon={FiUser}     label="Prénom"            name="prenom"        value={draft.prenom}        onChange={handleChange} />
              <EditRow icon={FiUser}     label="Nom"               name="nomSeul"       value={draft.nomSeul}       onChange={handleChange} />
              <EditRow icon={FiMail}     label="Email"             name="email"         value={draft.email}         onChange={handleChange} type="email" />
              <EditRow icon={FiPhone}    label="Téléphone"         name="telephone"     value={draft.telephone}     onChange={handleChange} />
              <EditRow icon={FiCalendar} label="Date de naissance" name="dateNaissance" value={draft.dateNaissance} onChange={handleChange} type="date" />
              <EditRow icon={FiUsers}    label="Genre"             name="genre"         value={draft.genre}         onChange={handleChange} />
              <EditRow icon={FiHome}     label="Adresse"           name="adresse"       value={draft.adresse}       onChange={handleChange} last />
            </>
          ) : (
            <>
              <FieldRow icon={FiLayout}   label="Identifiant (INE)" value={<span className="font-mono text-xs bg-gray-50 px-2 py-0.5 rounded">{e.identifiant}</span>} />
              <FieldRow icon={FiMail}     label="Email"             value={<span className="text-orange-500 text-xs">{e.email}</span>} />
              <FieldRow icon={FiPhone}    label="Téléphone"         value={e.telephone} />
              <FieldRow icon={FiCalendar} label="Date de naissance" value={e.dateNaissance} />
              <FieldRow icon={FiUsers}    label="Genre"             value={e.genre} />
              <FieldRow icon={FiHome}     label="Adresse"           value={e.adresse} last />
            </>
          )}
        </Card>

        {/* Informations académiques */}
        <Card>
          <SectionTitle icon={FiBook}>Informations académiques</SectionTitle>

          {editMode ? (
            <>
              <EditRow icon={FiMap}         label="Établissement"  name="etablissement" value={draft.etablissement} onChange={handleChange} readOnly />
              <EditRow icon={FiBookOpen}    label="Filière"        name="filiere"       value={draft.filiere}       onChange={handleChange} readOnly />
              <EditRow icon={FiAward}       label="Niveau"         name="niveau"        value={draft.niveau}        onChange={handleChange} readOnly />
              <EditRow icon={FiCalendar}    label="Année d'entrée" name="anneeEntree"   value={draft.anneeEntree}   onChange={handleChange} readOnly last />
            </>
          ) : (
            <>
              <FieldRow icon={FiMap}         label="Établissement"  value={e.etablissement} />
              <FieldRow icon={FiBookOpen}    label="Filière"        value={e.filiere} />
              <FieldRow icon={FiAward}       label="Niveau"         value={<Badge variant="orange">{e.niveau}</Badge>} />
              <FieldRow icon={FiCalendar}    label="Année d'entrée" value={e.anneeEntree} />
              <FieldRow icon={FiCheckCircle} label="Statut"         value={<Badge variant="green">{e.statut}</Badge>} last />
            </>
          )}
        </Card>

      </div>
    </div>
  )
}

export default ProfilEtudiant