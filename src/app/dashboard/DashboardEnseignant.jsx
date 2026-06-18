import React, { useState, useEffect, useRef } from 'react'
import { apiGet } from '../../utils/api'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import Footer from '../commun/Footer'
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
  FiHelpCircle,
  FiFileText
} from 'react-icons/fi'

const DashboardEnseignant = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const displayName = user.prenom && user.nom ? `${user.prenom} ${user.nom}` : "Moussa Ndiaye"

  // UI States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  // Fetch announcements for notifications
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const annoncesList = await apiGet('/api/annonces')
        const formattedNotifications = annoncesList.slice(0, 5).map(ann => ({
          id: ann.id,
          title: ann.titre,
          description: ann.contenu,
          time: new Date(ann.datePublication).toLocaleDateString('fr-FR'),
          read: false,
          category: ann.type === 'ACADEMIQUE' ? 'exam' : 'message'
        }))
        setNotifications(formattedNotifications)
      } catch (err) {
        console.error('Error fetching announcements for teacher:', err)
      }
    }
    fetchAnnonces()
  }, [])

  // Mock messages
  const [messages, setMessages] = useState([
    { id: 1, sender: "Scolarité UNCHK", text: "Veuillez saisir les notes du devoir 1 avant le 20 juin.", time: "10:15", read: false, initial: "S" },
    { id: 2, sender: "Dr. Diop", text: "Avez-vous finalisé le planning pour la semaine prochaine ?", time: "Hier", read: true, initial: "D" },
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
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-755 md:hidden transition-colors"
              aria-label="Toggle Sidebar"
            >
              {isMobileSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <Link to="/enseignant/accueil" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 shadow-md shadow-emerald-500/20">
                <span className="text-white font-extrabold text-lg">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight text-slate-900 sm:text-sm">UNCHK Portal</span>
                <span className="text-[8px] font-bold tracking-wider text-emerald-600 uppercase">Espace Enseignant</span>
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
                  <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-sm bg-neutral-600 text-[9px] font-bold text-white ring-2 ring-white">
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
                        className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="mt-1 max-h-60 overflow-y-auto space-y-1">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 items-start p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 ${!msg.read ? 'bg-emerald-50/40' : ''}`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {msg.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{msg.sender}</h4>
                            <span className="text-[9px] text-slate-400 font-medium">{msg.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{msg.text}</p>
                        </div>
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-emerald-500 self-center"></span>}
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
                  <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-sm bg-red-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
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
                        className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="mt-1 max-h-60 overflow-y-auto space-y-1">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`flex gap-3 items-start p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 ${!notif.read ? 'bg-emerald-50/40' : ''}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs bg-emerald-100 text-emerald-700`}>
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
                  <div className="h-full w-full rounded-full bg-emerald-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-emerald-700 shadow-sm">
                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 block h-1 w-1 rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {displayName}
                  </span>
                </div>
                <FiChevronDown className="hidden lg:block w-4 h-4 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Espace Enseignant</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{user.email || 'enseignant@gmail.com'}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Link to="/enseignant/profil" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                      <FiUser className="w-4 h-4" />
                      Mon Profil
                    </Link>
                    <Link to="/enseignant/parametre" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
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

          </div>
        </div>

        {/* Sub Header for search & Desktop Nav */}
        <div className="bg-slate-100 px-4 sm:px-8 py-2 flex items-center justify-between border-t border-slate-200/50 shadow-inner">
          {/* Search bar */}
          <div className="hidden md:flex max-w-md flex-1">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="search"
                placeholder="Rechercher des cours, étudiants, devoirs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 pl-10 pr-4 text-xs placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-end gap-6">
            <Link 
              to="/enseignant/accueil" 
              className={`text-xs font-bold transition duration-200 ${
                location.pathname === '/enseignant/accueil' 
                  ? 'text-emerald-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/enseignant/emploi-du-temps" 
              className={`text-xs font-bold transition duration-200 ${
                location.pathname === '/enseignant/emploi-du-temps' 
                  ? 'text-emerald-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Planning
            </Link>
            <Link 
              to="/enseignant/mes_cours" 
              className={`text-xs font-bold transition duration-200 ${
                location.pathname === '/enseignant/mes_cours' 
                  ? 'text-emerald-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mes Cours
            </Link>
            <Link 
              to="/enseignant/notes" 
              className={`text-xs font-bold transition duration-200 ${
                location.pathname === '/enseignant/notes' 
                  ? 'text-emerald-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Saisie Notes
            </Link>
          </div>
        </div>
        
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl transition-transform duration-300 transform md:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 shadow-md shadow-emerald-500/20">
              <span className="text-white font-extrabold text-lg">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-slate-900">UNCHK Portal</span>
              <span className="text-[8px] font-bold tracking-wider text-emerald-600 uppercase">Espace Enseignant</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links inside Mobile Sidebar */}
        <nav className="space-y-1">
          <Link 
            to="/enseignant/accueil" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/enseignant/accueil' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiBookOpen className="w-4 h-4" />
            Accueil
          </Link>
          <Link 
            to="/enseignant/emploi-du-temps" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/enseignant/emploi-du-temps' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiCalendar className="w-4 h-4" />
            Planning
          </Link>
          <Link 
            to="/enseignant/mes_cours" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/enseignant/mes_cours' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiBookOpen className="w-4 h-4" />
            Mes Cours
          </Link>
          <Link 
            to="/enseignant/notes" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/enseignant/notes' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiFileText className="w-4 h-4" />
            Saisie Notes
          </Link>
        </nav>

        {/* User profile footer inside mobile sidebar */}
        <div className="absolute bottom-6 left-6 right-6 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-emerald-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-emerald-700">
              {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">{displayName}</span>
              <span className="text-[9px] text-slate-400 font-semibold truncate">{user.email || 'enseignant@gmail.com'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* footer */}
      <Footer />

    </div>
  )
}

export default DashboardEnseignant
