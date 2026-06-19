import React from 'react'
import { FiSliders, FiBell, FiShield, FiDatabase, FiInfo } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const AdminParametres = () => {
  const { showToast } = useToast()

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Paramètres du Portail</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Configurez les options système et gérez la base de données.</p>
      </div>

      <div className="max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
        {/* Section 1: System Settings */}
        <div className="flex gap-4 items-start pb-5 border-b border-slate-100">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <FiSliders className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Paramètres Généraux</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Activer ou désactiver des fonctionnalités globales du portail.</p>
            <div className="flex flex-col gap-2.5 mt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                Autoriser l'inscription autonome des étudiants
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                Autoriser les tuteurs à modifier les affectations
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                Activer le mode maintenance du portail UNCHK
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="flex gap-4 items-start pb-5 border-b border-slate-100">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <FiShield className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Sécurité & Stratégies</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Gérer les règles de mot de passe et l'authentification système.</p>
            <div className="flex flex-col gap-2 mt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                Exiger des mots de passe complexes pour le personnel
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                Activer la journalisation des accès sensibles
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Backup */}
        <div className="flex gap-4 items-start pb-5 border-b border-slate-100">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <FiDatabase className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Sauvegarde & Maintenance BDD</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Effectuez des sauvegardes de la base MySQL et nettoyez les caches.</p>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => showToast("Sauvegarde démarrée...", "info")}
                className="text-[10px] font-bold px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
              >
                Sauvegarder la BDD
              </button>
              <button 
                onClick={() => showToast("Cache système vidé.", "success")}
                className="text-[10px] font-bold px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                Vider le cache
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: App Info */}
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <FiInfo className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Version Système</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Informations logicielles du portail UNCHK.</p>
            <p className="text-xs text-slate-600 font-semibold mt-3">
              Version : <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-[10px]">v1.0.0-stable</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminParametres
