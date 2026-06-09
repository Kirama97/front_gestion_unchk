import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, roleRequired }) => {
  const userStr = localStorage.getItem('user')
  
  if (!userStr) {
    // Not logged in, redirect to login page
    return <Navigate to="/" replace />
  }

  try {
    const user = JSON.parse(userStr)
    
    if (roleRequired && user.role !== roleRequired) {
      // Role doesn't match, redirect to unauthorized page
      return <Navigate to="/non-autorise" replace />
    }
    
    return children
  } catch (error) {
    // Invalid session data, clear and redirect to login
    localStorage.removeItem('user')
    return <Navigate to="/" replace />
  }
}

export default ProtectedRoute
