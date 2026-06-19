import React, { useState, useEffect } from 'react'
import { apiGet, apiPut, apiPost, getProfileImage } from '../../utils/api'
import { FiUser, FiMail, FiPhone, FiActivity, FiMapPin, FiShield, FiEdit } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const ProfilAdmin = () => {
  const { showToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await apiGet('/api/auth/me')
        setProfile(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching admin profile:", err)
        setError("Impossible de charger votre profil.")
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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

      setProfile(prev => ({ ...prev, photoProfil: newPhotoUrl }))
      window.dispatchEvent(new Event('user-profile-updated'))

      showToast("Photo de profil mise à jour avec succès !", "success")
    } catch (err) {
      console.error("Error uploading photo:", err)
      showToast(err.message || "Erreur lors du téléchargement de la photo.", "error")
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de votre profil...</div>
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

  const displayName = profile ? `${profile.prenom} ${profile.nom?.toUpperCase()}` : "Administrateur"

  return (
    <div className="w-full px-[5%] sm:px-[10%] py-10 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mon Profil</h1>
        <p className="text-xs text-slate-500 font-medium">Consultez vos informations personnelles et professionnelles.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner header inside card */}
        <div className="h-32 bg-gradient-to-r from-slate-800 to-indigo-950 relative flex items-end p-6">
          <div className="absolute -bottom-10 left-6">
            <div className="relative group w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-slate-700 font-black text-3xl overflow-hidden">
                {profile?.photoProfil ? (
                  <img src={getProfileImage(profile.photoProfil)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-slate-700" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiEdit className="text-white w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>
        </div>

        {/* Profile info list */}
        <div className="pt-14 p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{displayName}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mt-1 uppercase tracking-wider">
              Administrateur UNCHK
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Professional Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Informations Système</h3>

              <div className="flex items-start gap-3">
                <FiShield className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rôle système</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 uppercase">{profile?.role}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiActivity className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.statut || 'Actif'}</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Coordonnées</h3>

              <div className="flex items-start gap-3">
                <FiMail className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.telephone || '+221 77 123 45 67'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Localisation</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">Dakar, Sénégal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilAdmin
