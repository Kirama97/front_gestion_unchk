import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
  <div className="w-full h-screen bg-[url('/not_found.png')] bg-cover bg-center flex items-center justify-center px-4">
  <div className="max-w-lg w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-center flex flex-col items-center gap-6">

    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
      404
    </div>

    <div>
      <h1 className="text-2xl font-bold text-white">
        Oups ! Page introuvable
      </h1>

      <p className="text-sm text-slate-200 mt-3 leading-relaxed">
        La page que vous recherchez n'existe pas, a été déplacée
        ou l'URL est incorrecte.
      </p>
    </div>

    <button
      onClick={() => navigate("/")}
      className="px-8 py-3 bg-white text-slate-800 font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-slate-100 transition-all duration-300"
    >
      Retour à l'accueil
    </button>
  </div>
</div>
  )
}

export default NotFoundPage
