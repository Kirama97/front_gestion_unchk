import React, { useState, useEffect } from 'react'
import { apiGet } from '../../utils/api'
import { FiUser, FiMail, FiPhone, FiBookOpen, FiActivity, FiMapPin, FiShield } from 'react-icons/fi'

const ProfilEnseignant = () => {
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
        console.error("Error fetching teacher profile:", err)
        setError("Impossible de charger votre profil.")
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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

  const displayName = profile ? `${profile.prenom} ${profile.nom?.toUpperCase()}` : "Moussa NDIAYE"

  return (
    <div className="w-full px-[5%] sm:px-[10%] py-10 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mon Profil</h1>
        <p className="text-xs text-slate-500 font-medium">Consultez vos informations personnelles et professionnelles.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner header inside card */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative flex items-end p-6">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-emerald-700 font-black text-3xl">
              {profile?.prenom?.charAt(0)}{profile?.nom?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Profile info list */}
        <div className="pt-14 p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{displayName}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 mt-1 uppercase tracking-wider">
              Enseignant UNCHK
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Professional Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Informations Académiques</h3>
              
              <div className="flex items-start gap-3">
                <FiBookOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Département</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.departement || 'Informatique'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiActivity className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.statut || 'Actif'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiShield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rôle système</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 uppercase">{profile?.role}</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Coordonnées</h3>

              <div className="flex items-start gap-3">
                <FiMail className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{profile?.telephone || '+221 77 123 45 67'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
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

export default ProfilEnseignant
