import React from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardInsertion = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const mockOffers = [
    { id: 1, title: "Développeur Fullstack React/Node.js", company: "Orange Sénégal", type: "Stage", location: "Dakar" },
    { id: 2, title: "Consultant Data Analyst", company: "Wave Mobile Money", type: "CDI", location: "Dakar / Hybride" },
    { id: 3, title: "Administrateur Systèmes & Réseaux", company: "Free Sénégal", type: "CDD", location: "Thiès" }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-600/20">
            U
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">UNCHK Portal</h1>
            <p className="text-[10px] text-teal-600 font-semibold tracking-wider uppercase">Espace Insertion Professionnelle</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">{user.email || 'Insertion'}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user.role || 'Insertion'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-lg font-semibold border border-slate-200 transition-all duration-200"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 max-md:hidden">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Menu Principal</span>
            <button
              className="text-left text-sm font-medium text-teal-700 bg-teal-50/50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2.5"
            >
              💼 Offres d'emploi / Stage
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 min-h-[300px] flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Offres d'Insertion Professionnelle</h2>
              <p className="text-xs text-slate-500 mt-0.5">Suivi des opportunités de stage et d'emploi proposées aux étudiants de l'UNCHK.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockOffers.map((offer) => (
                <div key={offer.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition duration-200 flex flex-col justify-between h-40">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[9px] ${
                        offer.type === "Stage" ? "bg-teal-50 text-teal-700" : offer.type === "CDI" ? "bg-indigo-50 text-indigo-700" : "bg-orange-50 text-orange-700"
                      }`}>
                        {offer.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">📍 {offer.location}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 leading-tight mb-1">{offer.title}</h3>
                    <p className="text-[11px] text-slate-500 font-semibold">{offer.company}</p>
                  </div>
                  <button className="w-full text-center text-[10px] py-1.5 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg font-semibold transition">
                    Consulter les candidatures
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardInsertion
