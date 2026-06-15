import React from 'react'
import { Link } from 'react-router-dom'


const CardCours = ({coursItem}) => {
  return (
     <Link to={`/etudiant/detail_cours/${coursItem.id}`} key={coursItem.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
                src={coursItem.image}
                alt={coursItem.titre}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h2 className="text-md font-bold line-clamp-1">{coursItem.titre}</h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{coursItem.description}</p>
                <p className="mt-4 text-sm font-medium text-blue-600">
                  <span className='text-neutral-800'>Tuteur : </span> {coursItem.tuteur}
                </p>
            </div>
            </Link>
  )
}

export default CardCours
