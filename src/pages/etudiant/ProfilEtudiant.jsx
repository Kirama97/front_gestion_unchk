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

/* ─── Données initiales ─── */

const initial = {
  nom: 'Diene Thiam',
  image:"/img2.jpg",
  initiales: 'AD',
  identifiant: 'ETU-2024-00342',
  email: 'diene.thiam@unchk.edu.sn',
  telephone: '+221 77 234 56 78',
  dateNaissance: '14 mars 2001',
  genre: 'Masculin',
  adresse: 'Parcelles Assainies, Dakar',
  etablissement: 'Université Cheikh Anta Diop',
  filiere: 'Informatique',
  niveau: 'Licence 3',
  anneeEntree: '2022 – 2023',
  statut: 'Inscrit',
  localisation: 'Dakar, Sénégal',
}

/* ─── Composant principal ─── */

const ProfilEtudiant = () => {
  const [editMode, setEditMode]   = useState(false)
  const [etudiant, setEtudiant]   = useState(initial)
  const [draft, setDraft]         = useState(initial)
  const [saved, setSaved]         = useState(false)

  const e = etudiant

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setDraft(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setEtudiant(draft)
    setEditMode(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCancel = () => {
    setDraft(etudiant)
    setEditMode(false)
  }

  const openEdit = () => {
    setDraft(etudiant)
    setEditMode(true)
  }

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
          <div className="-mt-10 mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden  flex items-center justify-center text-3xl font-medium text-white shrink-0 border-4 border-white ring-2 ring-orange-500">
                <img src={e.image} alt="" srcset="" className='w-full h-full object-cover' />
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
              <EditRow icon={FiLayout}   label="Identifiant"       name="identifiant"   value={draft.identifiant}   onChange={handleChange} readOnly />
              <EditRow icon={FiMail}     label="Email"             name="email"         value={draft.email}         onChange={handleChange} type="email" />
              <EditRow icon={FiPhone}    label="Téléphone"         name="telephone"     value={draft.telephone}     onChange={handleChange} />
              <EditRow icon={FiCalendar} label="Date de naissance" name="dateNaissance" value={draft.dateNaissance} onChange={handleChange} />
              <EditRow icon={FiUsers}    label="Genre"             name="genre"         value={draft.genre}         onChange={handleChange} />
              <EditRow icon={FiHome}     label="Adresse"           name="adresse"       value={draft.adresse}       onChange={handleChange} last />
            </>
          ) : (
            <>
              <FieldRow icon={FiLayout}   label="Identifiant"       value={<span className="font-mono text-xs bg-gray-50 px-2 py-0.5 rounded">{e.identifiant}</span>} />
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
              <EditRow icon={FiMap}         label="Établissement"  name="etablissement" value={draft.etablissement} onChange={handleChange} />
              <EditRow icon={FiBookOpen}    label="Filière"        name="filiere"       value={draft.filiere}       onChange={handleChange} />
              <EditRow icon={FiAward}       label="Niveau"         name="niveau"        value={draft.niveau}        onChange={handleChange} />
              <EditRow icon={FiCalendar}    label="Année d'entrée" name="anneeEntree"   value={draft.anneeEntree}   onChange={handleChange} />
              <EditRow icon={FiCheckCircle} label="Statut"         name="statut"        value={draft.statut}        onChange={handleChange} last />
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