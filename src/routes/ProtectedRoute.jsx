import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, roleRequired }) => {
  const userStr = localStorage.getItem('user')
  
  if (!userStr) {
   
    return <Navigate to="/" replace />
  }

  try {
    const user = JSON.parse(userStr)
    
    if (roleRequired && user.role !== roleRequired) {
     
      return <Navigate to="/non-autorise" replace />
    }
    
    return children
  } catch (error) {
    
    localStorage.removeItem('user')
    return <Navigate to="/" replace />
  }
}

export default ProtectedRoute
