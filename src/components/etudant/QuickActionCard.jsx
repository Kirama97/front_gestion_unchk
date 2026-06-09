import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const QuickActionCard = ({ icon: Icon, title, description, to = '#', onClick }) => {
  const CardContent = (
    <div className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200/60 hover:border-blue-200 rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:shadow-md cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-slate-100">
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-900 transition-colors leading-snug">{title}</h4>
          <p className="text-[10px] text-slate-400 font-medium leading-normal">{description}</p>
        </div>
      </div>
      
      <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/40 transition-all duration-300 group-hover:translate-x-1">
        <FiArrowRight className="w-4 h-4" />
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left block focus:outline-none">
        {CardContent}
      </button>
    )
  }

  return (
    <Link to={to} className="w-full block">
      {CardContent}
    </Link>
  )
}

export default QuickActionCard
