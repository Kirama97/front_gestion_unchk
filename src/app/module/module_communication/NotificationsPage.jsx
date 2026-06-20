import React, { useEffect, useState } from 'react'
import { apiGet, apiPut } from '../../../utils/api'
import { useToast } from '../../../context/ToastContext'
import { FiBell, FiCheck, FiMail, FiCalendar, FiBookOpen } from 'react-icons/fi'

const NotificationsPage = () => {
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/notifications')
      setNotifications(data)
    } catch (err) {
      console.error(err)
      showToast("Impossible de charger les notifications.", "error")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      
      const res = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      })
      if (!res.ok) throw new Error()
      
      
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
      showToast("Notification marquée comme lue.", "success")
    } catch (err) {
      console.error(err)
      showToast("Impossible de mettre à jour la notification.", "error")
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'schedule':
        return <FiCalendar className="w-5 h-5 text-indigo-500" />
      case 'exam':
        return <FiBookOpen className="w-5 h-5 text-emerald-500" />
      default:
        return <FiMail className="w-5 h-5 text-orange-500" />
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiBell className="w-5.5 h-5.5 text-orange-500" />
            Centre de Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Retrouvez toutes les alertes et diffusions de l'UNCHK.</p>
        </div>
        <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2.5 py-1 rounded-full">
          {notifications.filter(n => !n.lu).length} non lues
        </span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-xs font-semibold text-slate-400 animate-pulse">Chargement des notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-400">Aucune notification pour le moment.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border rounded-xl flex justify-between items-center gap-4 transition-all duration-200 ${
                notif.lu ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-orange-100 shadow-sm shadow-orange-500/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${notif.lu ? 'bg-slate-100 text-slate-400' : 'bg-orange-50/80 text-orange-500'} mt-0.5`}>
                  {getCategoryIcon(notif.category)}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${notif.lu ? 'text-slate-600' : 'text-slate-800'}`}>
                    {notif.titre}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{notif.description}</p>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">
                    {new Date(notif.dateCreation).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>

              {!notif.lu && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-slate-200 rounded-lg transition"
                  title="Marquer comme lu"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
