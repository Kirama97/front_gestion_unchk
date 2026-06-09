import React from 'react'

const CourseProgressCard = ({ subject, teacher, completedSessions, totalSessions, gradePlaceholder }) => {
  const percentage = Math.min(Math.round((completedSessions / totalSessions) * 100), 100)
  
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Subject & Teacher */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">{subject}</h4>
          <span className="text-[10px] text-slate-400 font-semibold">{teacher}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
          percentage >= 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
        }`}>
          {percentage >= 100 ? 'Terminé' : 'En cours'}
        </span>
      </div>

      {/* Progress Stats */}
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
          <span>Syllabus complété</span>
          <span className="text-slate-800">{percentage}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium mt-0.5">
          <span>{completedSessions} cours terminés</span>
          <span>{totalSessions} sessions au total</span>
        </div>
      </div>

      {/* Action/Details Footer */}
      {gradePlaceholder && (
        <div className="border-t border-slate-100 pt-3 mt-1 flex justify-between items-center text-[9px] font-semibold text-slate-500">
          <span>Dernière note :</span>
          <span className="text-slate-800 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">{gradePlaceholder}</span>
        </div>
      )}

    </div>
  )
}

export default CourseProgressCard
