import React from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'

const DashboardTuteur = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/20">
            U
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">UNCHK Portal</h1>
            <p className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">Espace Tuteur</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">{user.email || 'Tuteur'}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user.role || 'Tuteur'}</p>
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
            <Link
              to="/tuteur/emploi-du-temps"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2.5"
            >
              📅 Emploi du Temps
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 min-h-[300px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardTuteur
