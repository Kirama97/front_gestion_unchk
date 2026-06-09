import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center font-sans px-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 text-3xl shadow-sm">
          🔍
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-slate-800">Page Introuvable (404)</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full text-xs font-semibold py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition duration-200"
        >
          Retourner à l'accueil
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
