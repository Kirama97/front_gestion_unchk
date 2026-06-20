import React, { useState, useEffect, useRef } from 'react'
import { apiGet, apiPut, getProfileImage } from '../../utils/api';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import BarreDeRechercheEtudiant from '../../components/etudant/BarreDeRechercheEtudiant';
import Footer from './../commun/Footer';
import { useToast } from '../../context/ToastContext';
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

const DashboardEtudiant = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const displayName = user.prenom && user.nom ? `${user.prenom} ${user.nom}` : "Diene thiam"
  const { showToast } = useToast()

  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])

  
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const messagesRef = useRef(null)
  
  const previousNotificationsRef = useRef([])
  const previousMessagesRef = useRef([])
  const isFirstLoad = useRef(true)

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'))
    }
    window.addEventListener('user-profile-updated', handleUserUpdate)
    return () => window.removeEventListener('user-profile-updated', handleUserUpdate)
  }, [])

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

  const fetchNotifications = async () => {
    try {
      const list = await apiGet('/api/notifications')
      const notifs = list.filter(n => n.category !== 'message')
      const msgs = list.filter(n => n.category === 'message')

      if (!isFirstLoad.current) {
        notifs.forEach(n => {
          if (!n.lu && !previousNotificationsRef.current.some(prev => prev.id === n.id)) {
            showToast(`Notification : ${n.titre} - ${n.description}`, 'info')
          }
        })
        msgs.forEach(m => {
          if (!m.lu && !previousMessagesRef.current.some(prev => prev.id === m.id)) {
            showToast(`Nouveau message de ${m.titre || 'Enseignant'} : ${m.description}`, 'success')
          }
        })
      } else {
        isFirstLoad.current = false
      }

      previousNotificationsRef.current = notifs
      previousMessagesRef.current = msgs

      setNotifications(notifs)
      setMessages(msgs)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  const unreadNotificationsCount = notifications.filter(n => !n.lu).length
  const unreadMessagesCount = messages.filter(m => !m.lu).length

  const markAllNotificationsAsRead = async () => {
    const unread = notifications.filter(n => !n.lu)
    try {
      await Promise.all(unread.map(n => apiPut(`/api/notifications/${n.id}/read`)))
      setNotifications(prev => prev.map(n => ({ ...n, lu: true })))
      showToast('Toutes les notifications ont été marquées comme lues.', 'success')
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      showToast('Erreur lors du marquage des notifications.', 'error')
    }
  }

  const markAllMessagesAsRead = async () => {
    const unread = messages.filter(m => !m.lu)
    try {
      await Promise.all(unread.map(m => apiPut(`/api/notifications/${m.id}/read`)))
      setMessages(prev => prev.map(m => ({ ...m, lu: true })))
      showToast('Tous les messages ont été marqués comme lus.', 'success')
    } catch (err) {
      console.error('Error marking all messages as read:', err)
      showToast('Erreur lors du marquage des messages.', 'error')
    }
  }

  const handleNotificationClick = async (notif) => {
    if (!notif.lu) {
      try {
        await apiPut(`/api/notifications/${notif.id}/read`)
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, lu: true } : n))
      } catch (err) {
        console.error('Error marking notification as read:', err)
      }
    }
  }

  const handleMessageClick = async (msg) => {
    if (!msg.lu) {
      try {
        await apiPut(`/api/notifications/${msg.id}/read`)
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, lu: true } : m))
      } catch (err) {
        console.error('Error marking message as read:', err)
      }
    }
  }



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="flex h-12 items-center justify-between px-4 sm:px-6">
          
          {}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden transition-colors"
              aria-label="Toggle Sidebar"
            >
              {isMobileSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <Link to="/etudiant/accueil" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-orange-400 shadow-md shadow-blue-500/20">
              
                <span className=" text-white font-extrabold text-lg">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight text-slate-900 sm:text-sm">UNCHK Portal</span>
                <span className="text-[8px] font-bold tracking-wider text-blue-600 uppercase">Espace Étudiant</span>
              </div>
            </Link>
          </div>

         
          {}
          <div className="flex items-center gap-2 sm:gap-2">
            
            {}
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

              {}
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
                        onClick={() => handleMessageClick(msg)}
                        className={`flex gap-3 items-start p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 ${!msg.lu ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {msg.titre ? msg.titre.charAt(0) : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{msg.titre}</h4>
                            <span className="text-[9px] text-slate-400 font-medium">
                              {new Date(msg.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{msg.description}</p>
                        </div>
                        {!msg.lu && <span className="w-2 h-2 rounded-full bg-blue-500 self-center"></span>}
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

            {}
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

              {}
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
                        onClick={() => handleNotificationClick(notif)}
                        className={`flex gap-3 items-start p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 ${!notif.lu ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          notif.category === 'schedule' ? 'bg-amber-100 text-amber-700' : 
                          notif.category === 'exam' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {notif.category === 'schedule' ? <FiCalendar className="w-4 h-4" /> : notif.category === 'exam' ? <FiFileText className="w-4 h-4" /> : <FiMessageSquare className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{notif.titre}</h4>
                            <span className="text-[9px] text-slate-400 font-medium">
                              {new Date(notif.dateCreation).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{notif.description}</p>
                        </div>
                        {!notif.lu && <span className="w-2 h-2 rounded-full bg-blue-500 self-center"></span>}
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

            {}
            <span className="h-6 w-px bg-slate-200" aria-hidden="true" />

            {}
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
                  {user.photoProfil ? (
                    <img
                      src={getProfileImage(user.photoProfil)}
                      alt="Photo de profil"
                      className="h-full w-full rounded-full object-cover border border-slate-200 shadow-sm"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                      <FiUser className="w-4 h-4" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 block h-1 w-1 rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {displayName}
                  </span>
                  
                </div>
                <FiChevronDown className="hidden lg:block w-4 h-4 text-slate-400" />
              </button>

              {}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Espace Étudiant</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{user.email || 'etudiant@gmail.com'}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Link to="/etudiant/profil" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                      <FiUser className="w-4 h-4" />
                      Mon Profil
                    </Link>
                    <Link to="/etudiant/parametre" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
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
        <div className="bg-slate-100 px-4 sm:px-8 py-2 flex items-center justify-between border-t border-slate-200/50 shadow-inner">
            {}
            <BarreDeRechercheEtudiant />

            <div className="hidden md:flex items-center justify-end gap-6">
              <Link 
                to="/etudiant/accueil" 
                className={`text-xs font-bold transition duration-200 ${
                  location.pathname === '/etudiant/accueil' 
                    ? 'text-orange-500' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Accueil
              </Link>
              <Link 
                to="/etudiant/emploi-du-temps" 
                className={`text-xs font-bold transition duration-200 ${
                  location.pathname === '/etudiant/emploi-du-temps' 
                    ? 'text-orange-500' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Planning
              </Link>
              <Link to="/etudiant/mes_cours" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition duration-200">
                Mes Cours
              </Link>
              <Link 
                to="/etudiant/notes" 
                className={`text-xs font-bold transition duration-200 ${
                  location.pathname === '/etudiant/notes' 
                    ? 'text-orange-500' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Notes
              </Link>
            </div>
        </div>
        
      </header>

      {}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl transition-transform duration-300 transform md:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shadow-md shadow-blue-500/20">
              <span className="text-white font-extrabold text-lg">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-slate-900">UNCHK Portal</span>
              <span className="text-[8px] font-bold tracking-wider text-blue-600 uppercase">Espace Étudiant</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {}
        <nav className="space-y-1">
          <Link 
            to="/etudiant/accueil" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/etudiant/accueil' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiBookOpen className="w-4 h-4" />
            Accueil
          </Link>
          <Link 
            to="/etudiant/emploi-du-temps" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/etudiant/emploi-du-temps' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiCalendar className="w-4 h-4" />
            Planning
          </Link>
          <Link 
            to="/etudiant/mes_cours" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <FiAward className="w-4 h-4" />
            Mes Cours
          </Link>
          <Link 
            to="/etudiant/notes" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
              location.pathname === '/etudiant/notes' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiFileText className="w-4 h-4" />
            Notes
          </Link>
        </nav>

        {}
        <div className="absolute bottom-6 left-6 right-6 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3 mb-4">
            {user.photoProfil ? (
              <img
                src={getProfileImage(user.photoProfil)}
                alt="Photo de profil"
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100";
                }}
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <FiUser className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">{displayName}</span>
              <span className="text-[9px] text-slate-400 font-semibold truncate">{user.email || 'etudiant@gmail.com'}</span>
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

      {}
      <div className="flex-1">
        
        <Outlet/>

      </div>


        {}
        <Footer></Footer>

    </div>
  )
}

export default DashboardEtudiant
