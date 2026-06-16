import React from 'react'
import CardCours from './CardCours';
import { coursesData } from '../../utils/mockData';

const LesCours = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
      {coursesData.map((coursItem) => (
        <CardCours key={coursItem.id} coursItem={coursItem} />
      ))}
    </div>
  )
}

export default LesCours
