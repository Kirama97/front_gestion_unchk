import React from 'react'

const ActualitesEvenements = () => {
  return (
    <div className="max-w-5xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">📢 Actualités & Événements UN-CHK</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Restez informé de la vie universitaire et des opportunités.</p>
        </div>
        <a 
          href="https://www.unchk.sn/actualites" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          Tout voir sur unchk.sn
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="h-44 w-full bg-blue-900 relative">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400" 
              alt="Ndaje Créatif" 
              className="w-full h-full object-cover opacity-90"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Événement
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mb-2">
                <span>📅 Mai 2026</span>
                <span>•</span>
                <span>Cellule Numérique</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug hover:text-blue-600 transition duration-200">
                Ndaje Créatif 2026 : Pleins feux sur l'IA et les métiers numériques
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                La première édition s'est tenue avec succès, connectant nos étudiants aux professionnels autour de l'IA, du motion design et de la photographie numérique.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Partenariat ENAMC</span>
              <a href="https://www.unchk.sn/actualites" target="_blank" rel="noopener noreferrer" className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                Lire l'article →
              </a>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="h-44 w-full bg-emerald-900 relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400" 
              alt="Projet S@JEF" 
              className="w-full h-full object-cover opacity-90"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Projet
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mb-2">
                <span>📅 Mai 2026</span>
                <span>•</span>
                <span>Entrepreneuriat</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug hover:text-blue-600 transition duration-200">
                Projet S@JEF : Clôture et bilan du soutien au numérique
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                L'atelier final a dressé un bilan encourageant de l'accompagnement à la digitalisation des startups et groupements de femmes menés par l'UN-CHK.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Jeunes & Femmes</span>
              <a href="https://www.unchk.sn/actualites" target="_blank" rel="noopener noreferrer" className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                Lire l'article →
              </a>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="h-44 w-full bg-purple-900 relative">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400" 
              alt="Cycle Weccoo" 
              className="w-full h-full object-cover opacity-90"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Réflexion
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mb-2">
                <span>📅 Mai 2026</span>
                <span>•</span>
                <span>URDFS & Innovation</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug hover:text-blue-600 transition duration-200">
                Cycle « Weccoo » 2026-2027 : Innover pour l'avenir
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                Lancement du cycle de réflexions avec l'Université Rose Dieng France-Sénégal autour de l'innovation et la transformation numérique nationale 2050.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Stratégie 2050</span>
              <a href="https://www.unchk.sn/actualites" target="_blank" rel="noopener noreferrer" className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                Lire l'article →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActualitesEvenements
