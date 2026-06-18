import React from 'react'
import { FiSliders, FiBell, FiLock, FiGlobe, FiInfo } from 'react-icons/fi'

const ParametreEnseignant = () => {
  return (
    <div className="w-full px-[5%] sm:px-[10%] py-10 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Paramètres</h1>
        <p className="text-xs text-slate-500 font-medium">Gérez vos options de notification et de sécurité de compte.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
        {/* Section 1: Notifications */}
        <div className="flex gap-4 items-start pb-5 border-b border-slate-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <FiBell className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Configurez vos alertes par email et sur l'application.</p>
            <div className="flex flex-col gap-2 mt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                M'alerter lors de la publication d'une nouvelle annonce
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                M'envoyer un rappel de mes cours programmés par mail
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="flex gap-4 items-start pb-5 border-b border-slate-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <FiLock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Sécurité du compte</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Modifiez votre mot de passe et activez la double authentification.</p>
            <div className="flex flex-col gap-3 mt-4 max-w-sm">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: App info */}
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <FiInfo className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">À propos de l'application</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Informations de version de UNCHK Portal.</p>
            <p className="text-xs text-slate-600 font-semibold mt-3">
              Version : <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-[10px]">v1.0.0-stable</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParametreEnseignant
