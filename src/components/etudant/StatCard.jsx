import React from 'react'

const StatCard = ({ icon: Icon, value, label, trend, trendType = 'neutral', color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      iconBg: 'bg-blue-600 text-white',
      shadow: 'shadow-blue-500/10'
    },
    green: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
      shadow: 'shadow-emerald-500/10'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      iconBg: 'bg-amber-600 text-white',
      shadow: 'shadow-amber-500/10'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      iconBg: 'bg-purple-600 text-white',
      shadow: 'shadow-purple-500/10'
    }
  }

  const activeColor = colorClasses[color] || colorClasses.blue

  const trendColorClass = 
    trendType === 'positive' ? 'text-emerald-600 bg-emerald-50' :
    trendType === 'negative' ? 'text-rose-600 bg-rose-50' : 
    'text-slate-500 bg-slate-50'

  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group`}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-xl font-bold text-slate-900 tracking-tight">{value}</span>
        
        {trend && (
          <span className={`inline-flex items-center self-start gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 ${trendColorClass}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className={`p-3.5 rounded-xl transition-all duration-300 ${activeColor.bg} group-hover:scale-105 shadow-sm ${activeColor.shadow}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}

export default StatCard
