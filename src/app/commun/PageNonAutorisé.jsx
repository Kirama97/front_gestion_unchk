import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SiSpringsecurity } from "react-icons/si";

const PageNonAutorisé = () => {
  const navigate = useNavigate()
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const handleGoBack = () => {
    if (!user) {
      navigate('/')
      return
    }
    
    switch (user.role) {
      case 'admin':
        navigate('/admin/personnel')
        break
      case 'etudiant':
        navigate('/etudiant/emploi-du-temps')
        break
      case 'enseignant':
        navigate('/enseignant/emploi-du-temps')
        break
      case 'tuteur':
        navigate('/tuteur/emploi-du-temps')
        break
      case 'insertion':
        navigate('/insertion')
        break
      default:
        navigate('/')
    }
  }

  return (
   <div className="w-full h-screen bg-[url('/not_found.png')] bg-cover bg-center flex items-center justify-center font-sans px-4">

  {}
  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative max-w-md w-full bg-white/10 backdrop-blur-md border border-slate-200/70 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center gap-6">

    {}
    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-3xl shadow-sm">
      <SiSpringsecurity />
    </div>

    {}
    <div>
      <h1 className="text-2xl font-bold text-red-500">
        Accès non autorisé
      </h1>

      <p className="text-sm text-slate-400 mt-2 leading-relaxed">
        Désolé, vos privilèges actuels ne vous permettent pas d'accéder à cette page de l'application institutionnelle.
      </p>
    </div>

    {}
    <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-3">

      <button
        onClick={handleGoBack}
        className="w-full text-sm font-semibold py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all duration-200 shadow-md shadow-red-500/10 active:scale-[0.98]"
      >
        {user ? "Retourner à mon Espace" : "Se connecter"}
      </button>

      {user && (
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="w-full text-sm font-semibold py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          Se connecter avec un autre compte
        </button>
      )}

    </div>
  </div>
</div>
  )
}

export default PageNonAutorisé
