import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import BarreDeRechercheEtudiant from '../../components/etudant/BarreDeRechercheEtudiant';
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

const DashboardEtudiant = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // UI States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)


  // Refs for click-outside
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const messagesRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsMessagesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouvel emploi du temps", description: "L'emploi du temps du semestre a été mis à jour.", time: "Il y a 10 min", read: false, category: "schedule" },
    { id: 2, title: "Note publiée", description: "Votre note pour le module 'Technologies Web' est disponible.", time: "Il y a 2 h", read: false, category: "exam" },
    { id: 3, title: "Message de votre Tuteur", description: "Dr. Diop a répondu à votre question sur le projet.", time: "Hier", read: true, category: "message" },
  ])

  // Mock messages
  const [messages, setMessages] = useState([
    { id: 1, sender: "Dr. Diop", text: "N'oubliez pas de rendre le rapport final avant vendredi.", time: "09:41", read: false, initial: "D" },
    { id: 2, sender: "Mme. Fall", text: "Le cours de base de données se tiendra exceptionnellement à...", time: "Hier", read: true, initial: "F" },
  ])

  const unreadNotificationsCount = notifications.filter(n => !n.read).length
  const unreadMessagesCount = messages.filter(m => !m.read).length

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAllMessagesAsRead = () => {
    setMessages(messages.map(m => ({ ...m, read: true })))
  }



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="flex h-12 items-center justify-between px-4 sm:px-6">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden transition-colors"
              aria-label="Toggle Sidebar"
            >
              {isMobileSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <Link to="/etudiant/emploi-du-temps" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shadow-md shadow-blue-500/20">
              
                <span className=" text-white font-extrabold text-lg">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight text-slate-900 sm:text-sm">UNCHK Portal</span>
                <span className="text-[8px] font-bold tracking-wider text-blue-600 uppercase">Espace Étudiant</span>
              </div>
            </Link>
          </div>

         
          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-2">
            
            {/* Messages Dropdown */}
            <div className="relative" ref={messagesRef}>
              <button
                onClick={() => {
                  setIsMessagesOpen(!isMessagesOpen)
                  setIsNotificationsOpen(false)
                  setIsProfileDropdownOpen(false)
                }}
                className={`relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all ${isMessagesOpen ? 'bg-slate-100 text-slate-800' : ''}`}
                aria-label="Messages"
              >
                <FiMessageSquare className="w-4 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-lg bg-blue-500 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Messages Panel */}
              {isMessagesOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Messages</span>
                    {unreadMessagesCount > 0 && (
                      <button 
                        onClick={markAllMessagesAsRead} 
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="mt-1 max-h-60 overflow-y-auto space-y-1">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 items-start p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 ${!msg.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {msg.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{msg.sender}</h4>
                            <span className="text-[9px] text-slate-400 font-medium">{msg.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{msg.text}</p>
                        </div>
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-500 self-center"></span>}
                      </div>
                    ))}
                  </div>
                  <div className="p-1 border-t border-slate-100 mt-2">
                    <button className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-700 py-1.5 hover:bg-slate-50 rounded-lg transition">
                      Voir tous les messages
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen)
                  setIsMessagesOpen(false)
                  setIsProfileDropdownOpen(false)
                }}
                className={`relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all ${isNotificationsOpen ? 'bg-slate-100 text-slate-800' : ''}`}
                aria-label="Notifications"
              >
                <FiBell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <button 
                        onClick={markAllNotificationsAsRead} 
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="mt-1 max-h-60 overflow-y-auto space-y-1">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`flex gap-3 items-start p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          notif.category === 'schedule' ? 'bg-amber-100 text-amber-700' : 
                          notif.category === 'exam' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {notif.category === 'schedule' ? '📅' : notif.category === 'exam' ? '📝' : '💬'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{notif.title}</h4>
                            <span className="text-[9px] text-slate-400 font-medium">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{notif.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-1 border-t border-slate-100 mt-2">
                    <button className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-700 py-1.5 hover:bg-slate-50 rounded-lg transition">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="h-6 w-px bg-slate-200" aria-hidden="true" />

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
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Espace Étudiant</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{user.email || 'etudiant@gmail.com'}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                      <FiUser className="w-4 h-4" />
                      Mon Profil
                    </button>
                    <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                      <FiSettings className="w-4 h-4" />
                      Paramètres
                    </button>
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

          </div>

        </div>
        <div className="h-[10vh] bg-neutral-100 px-10 py-1 flex items-center justify-between">
            {/* Search bar (desktop) */}
            <BarreDeRechercheEtudiant/>

          <div className=" flex items-center justify-end gap-5 ">
            <Link to="etudiant/accueil" className='text-black hover:font-semibold text-sm '>Accueil</Link>
            <Link to="etudiant/accueil" className='text-black hover:font-semibold text-sm '>Planning</Link>
            <Link to="etudiant/accueil" className='text-black hover:font-semibold text-sm '>Mes Cours</Link>
            <Link to="etudiant/accueil" className='text-black hover:font-semibold text-sm '>Notes</Link>
        </div>

        </div>
        
      </header>

      {/* Main Container */}
      <div className="">
        
        <Outlet/>

      </div>
    </div>
  )
}

export default DashboardEtudiant
