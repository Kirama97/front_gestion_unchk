import React from 'react'

const InfoBoxEtudiant = () => {
  return (
    <div className='w-full  mt-10 sm:mt-40 '>
        <h1 className='text-xl sm:text-2xl font-bold text-orange-500 my-10'>Annonces du site </h1>
        <div className="w-full  border p-5">
            {/* entete */}
            <div className="flex  gap-3 ">
                 {/* profil admin */}
                <div className="w-10 h-10 rounded-full bg-slate-500 overflow-hidden" >
                  <img src="/img2.jpg"  className='object-cover' alt="profil admin" srcset="" />
                </div>
                 {/* titre annonce */}
                <div className="w-full ">
                    <h1 className='text-green-600 m-0 p-0 font-semibold text-lg line-clamp-1'>Promo 8/M1 Sem.2 IL - Note d'information relative aux examens du Sem.2 (Session 1)/PSTN</h1>
                     <p className='text-xs -mt-1'><span className='font-semibold'>Niama CISSOKHO</span> Responsable Planification, mardi 16 juin 2026, 14:20</p>
                </div>
            </div>
             
             {/* contenu Annonce */}
              
              <div className="w-full h-full mt-5 py-5">
                  {/* sous titre */}
                 <h2 className='text-center underline font-bold uppercase'>Note d'information</h2>
                 {/* cible */}
                 <p className='text-center font-serif text-xs mt-2 italic line-clamp-2'>(À l’attention des étudiants du Master 1 en I.L/Promo 8)</p>
                 {/* corps du message */}
                 <
                    div className="mt-5 text-star px-10 ">
                    Il est porté à la connaissance des étudiants du Master 1 en Mathématiques Appliquées et Informatique (M.A.I), option Ingénierie Logicielle (I.L), de la promotion 8, que les examens du semestre 2 (session 1) se tiendront le mercredi 24 juin 2026 à partir de 09h00 précises. Le calendrier détaillé des épreuves sera communiqué dans les meilleurs délais.

                        Les épreuves se dérouleront exclusivement en ligne, hors Eno, depuis le domicile ou le lieu de travail de l’étudiant. À cet effet, chaque candidat est tenu de respecter un certain nombre de prérequis : se munir obligatoirement de sa carte d’étudiant ou de son certificat d’inscription, disposer d’un ordinateur en bon état de fonctionnement (portable ou de bureau), s’assurer que l’application Safe Exam Browser (SEB) est correctement installée, bénéficier d’une connexion Internet fiable et stable, tester au préalable Google Meet afin de vérifier le bon fonctionnement du microphone et de la caméra, disposer d’une webcam pour les ordinateurs de bureau ainsi que d’un clavier, et, si possible, d’un casque. Il est également recommandé de s’installer dans une pièce calme, bien éclairée et, dans la mesure du possible, indépendante.

                        Dans le cadre du contrôle d’identité et de la vérification de l’environnement de travail, chaque étudiant devra se connecter trente (30) minutes avant le début de l’épreuve. Le lien d’accès à la salle d’examen sera transmis par l’Eno de rattachement par l’intermédiaire du Chargé de formation ou de son Assistant. Celui-ci, ou un surveillant désigné, assurera la surveillance en ligne des étudiants sous contrôle vidéo. En cas de force majeure, un changement d’Eno chargé de la surveillance pourra exceptionnellement être effectué.

                 </div>
                  {/* signqture  */}
                  <span className='block w-full text-sm text-right mt-5 font-semibold'>NIAMA CISSOKHO</span>

              </div>

        </div>
         
    </div>
  )
}

export default InfoBoxEtudiant
