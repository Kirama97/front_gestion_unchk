import React, { createContext, useContext, useState, useCallback } from 'react'
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/5',
            error: 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-500/5',
            info: 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-500/5',
            warning: 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-500/5'
          }

          const iconStyles = {
            success: <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
            error: <FiXCircle className="w-5 h-5 text-rose-600 shrink-0" />,
            info: <FiInfo className="w-5 h-5 text-blue-600 shrink-0" />,
            warning: <FiInfo className="w-5 h-5 text-amber-600 shrink-0" />
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-4 rounded-2xl border bg-white/95 backdrop-blur-md shadow-lg pointer-events-auto animate-in slide-in-from-bottom-5 duration-200 ${typeStyles[toast.type] || typeStyles.info}`}
            >
              <div className="flex items-start gap-2.5">
                {iconStyles[toast.type] || iconStyles.info}
                <p className="text-xs font-semibold leading-normal">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition shrink-0"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
