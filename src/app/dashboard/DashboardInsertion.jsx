import React from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'

const DashboardInsertion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const menuItems = [
    { label: " Suivi des Étudiants", path: "/insertion/suivi" },
    { label: " Partenaires", path: "/insertion/partenaires" },
    { label: " Notifications", path: "/insertion/notifications" }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {}
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
        {}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 max-md:hidden">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Menu Principal</span>
            {menuItems.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    active ? "text-teal-700 bg-teal-50" : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </aside>

        {}
        <main className="flex-1 p-6 md:p-8 max-h-[92vh] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardInsertion
