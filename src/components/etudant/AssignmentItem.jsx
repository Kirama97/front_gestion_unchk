import React from 'react'
import { FiCalendar, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi'

const AssignmentItem = ({ title, course, dueDate, status = 'pending', daysRemaining }) => {
  const getStatusDetails = () => {
    if (status === 'submitted') {
      return {
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        text: 'Soumis',
        icon: <FiCheckCircle className="w-3.5 h-3.5" />
      }
    }
    
    if (daysRemaining <= 1) {
      return {
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse',
        text: 'Rendu demain',
        icon: <FiAlertTriangle className="w-3.5 h-3.5" />
      }
    }
    
    if (daysRemaining <= 3) {
      return {
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
        text: 'Urgente (Proche)',
        icon: <FiClock className="w-3.5 h-3.5" />
      }
    }
    
    return {
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-100',
      text: `${daysRemaining} jours restants`,
      icon: <FiCalendar className="w-3.5 h-3.5" />
    }
  }

  const { badgeClass, text, icon } = getStatusDetails()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors duration-200">
      
      {}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50/50 px-1.5 py-0.5 rounded">
            {course}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Limite : {dueDate}</span>
        </div>
      </div>

      {}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${badgeClass}`}>
          {icon}
          {text}
        </span>
        
        <button className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition ${
          status === 'submitted'
            ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
            : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/10'
        }`}
        disabled={status === 'submitted'}
        >
          {status === 'submitted' ? 'Soumis' : 'Soumettre'}
        </button>
      </div>

    </div>
  )
}

export default AssignmentItem
