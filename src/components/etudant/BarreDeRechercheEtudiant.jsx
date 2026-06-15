import React, { useState } from 'react'
import { 

  FiSearch, 
  FiBell, 
  FiMessageSquare, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiChevronDown, 
  FiUser, 
  FiSettings, 
  FiCalendar, 
  FiBookOpen, 
  FiAward, 
  FiHelpCircle
} from 'react-icons/fi'

const BarreDeRechercheEtudiant = () => {
   const [ searchBarre , setSearchBarre] = useState('')

  return (
   <div className="hidden md:flex max-w-md flex-1 ">
               <div className="relative w-full">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <FiSearch className="h-4 w-4 text-slate-400" />
                 </div>
                 <input
                   type="search"
                   placeholder="Rechercher des cours, notes, planning..."
                   value={searchBarre}
                   onChange={(e) => setSearchBarre(e.target.value)}
                   className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 pl-10 pr-4 text-xs placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                 />
                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                   <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-medium text-slate-400 shadow-sm">
                     <span className='py-1 px-3'>ok</span>
                   </kbd>
                 </div>
               </div>
     </div>
  )
}

export default BarreDeRechercheEtudiant
