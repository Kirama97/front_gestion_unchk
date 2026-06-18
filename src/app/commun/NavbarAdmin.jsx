import React, { useRef , useState} from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { CiMenuBurger } from "react-icons/ci";

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
  FiHelpCircle,
  FiFileText
} from 'react-icons/fi'

const NavbarAdmin = () => {
      const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  
    // Refs for click-outside
    const profileRef = useRef(null)
    const notificationsRef = useRef(null)
    const messagesRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div>
        <header className="bg-white border-b h-[8vh] border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-black flex items-center justify-center rounded-md shadow-xl">
              <CiMenuBurger className='text-white' />
           </div>
           <div className="text-dark">
             <p className='font-bold '>Dashbord </p>
           </div>
           
        </div>
     
         
         {/* Profile Dropdown */}
         <div className="relative" ref={profileRef}>
           <button
             onClick={() => {
               setIsProfileDropdownOpen(!isProfileDropdownOpen)
               setIsNotificationsOpen(false)
               setIsMessagesOpen(false)
             }}
             className="flex items-center gap-2 rounded-xl p-1.5 text-left hover:bg-slate-100 transition duration-200"
           >
             <div className="relative h-7 w-7">
               <img
                 src="/img2.jpg"
                 alt="Photo de profil"
                 className="h-full w-full rounded-full object-cover border border-slate-200 shadow-sm"
                 onError={(e) => {
                   e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100";
                 }}
               />
               <span className="absolute bottom-0 right-0 block h-1 w-1 rounded-full bg-green-500 ring-2 ring-white" />
             </div>
             <div className="hidden lg:flex flex-col text-left">
               <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                 Diene thiam
               </span>
               
             </div>
             <FiChevronDown className="hidden lg:block w-4 h-4 text-slate-400" />
           </button>
         
            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Espace Admin</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{user.email || 'etudiant@gmail.com'}</p>
                </div>
                <div className="mt-1 space-y-0.5">
                  <Link to="/admin/profil" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                    <FiUser className="w-4 h-4" />
                    Mon Profil
                  </Link>
                  <Link to="/admin/parametre" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                    <FiSettings className="w-4 h-4" />
                    Paramètres
                  </Link>
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                    <FiHelpCircle className="w-4 h-4" />
                    Support & FAQ
                  </button>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
         </div>

      </header>
    </div>
  )
}

export default NavbarAdmin
