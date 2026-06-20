import React from 'react'

const InfoBoxEtudiant = ({ annonce }) => {
  if (!annonce) {
    return (
      <div className='w-full mt-10 sm:mt-20 text-center border border-slate-200/80 rounded-2xl bg-white p-10 text-slate-400 font-semibold shadow-sm'>
        Aucune annonce importante pour le moment.
      </div>
    );
  }

  const auteur = annonce.auteur || {};
  const datePublication = new Date(annonce.datePublication).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className='w-full mt-10 sm:mt-20'>
        <h1 className='text-xl sm:text-2xl font-bold text-orange-500 my-8'>Annonces du site</h1>
        <div className="w-full border border-slate-200/80 rounded-2xl bg-white p-5 sm:p-6 shadow-sm">
            {}
            <div className="flex gap-3">
                 {}
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 overflow-hidden flex items-center justify-center font-bold text-sm shrink-0">
                  {auteur.prenom ? auteur.prenom.charAt(0).toUpperCase() + auteur.nom.charAt(0).toUpperCase() : "AD"}
                </div>
                 {}
                <div className="w-full">
                    <h1 className='text-orange-500 m-0 p-0 font-semibold text-base sm:text-lg'>{annonce.titre}</h1>
                     <p className='text-xs text-slate-400 mt-0.5'>
                       Par <span className='font-semibold text-slate-600'>{auteur.prenom} {auteur.nom}</span> ({auteur.departement || auteur.role || 'Administration'}), le {datePublication}
                     </p>
                </div>
            </div>
             
             {}
              <div className="w-full mt-5 pt-5 border-t border-slate-100">
                  {}
                  <h2 className='text-center underline font-bold uppercase text-xs sm:text-sm text-slate-700 tracking-wider'>{annonce.type || "Note d'information"}</h2>
                  
                  {}
                  <div className="mt-4 text-start px-2 sm:px-6 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {annonce.contenu}
                  </div>
                  
                  {}
                  <span className='block w-full text-xs sm:text-sm text-right mt-6 font-bold uppercase text-slate-700'>
                    {auteur.prenom} {auteur.nom}
                  </span>
              </div>
        </div>
    </div>
  )
}

export default InfoBoxEtudiant
