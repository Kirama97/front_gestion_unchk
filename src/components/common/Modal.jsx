import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-md' }) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>
      
      {}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}>
        
        {}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-150 text-slate-400 hover:text-slate-600 transition duration-150"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
        
      </div>
    </div>
  )
}

export default Modal
