import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function RoleRouter() {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" replace />

  switch(user.role) {
    case 'Farmer': return <Navigate to="/dashboard/farmer" replace />
    case 'Processor': return <Navigate to="/dashboard/processor" replace />
    case 'LabTester': return <Navigate to="/dashboard/lab" replace />
    case 'Certifier': return <Navigate to="/dashboard/certifier" replace />
    case 'Brand': return <Navigate to="/dashboard/brand" replace />
    default: return <Navigate to="/dashboard/farmer" replace />
  }
}
