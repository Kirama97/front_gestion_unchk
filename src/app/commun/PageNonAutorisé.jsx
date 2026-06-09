import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center font-sans px-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-3xl shadow-sm">
          🛡️
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-slate-800">Accès non autorisé</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Désolé, vos privilèges actuels ne vous permettent pas d'accéder à cette page de l'application institutionnelle.
          </p>
        </div>

        <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={handleGoBack}
            className="w-full text-xs font-semibold py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition duration-200 shadow-md shadow-red-500/10"
          >
            {user ? "Retourner à mon Espace" : "Se connecter"}
          </button>
          
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem('user')
                navigate('/')
              }}
              className="w-full text-xs font-semibold py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition duration-200"
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
