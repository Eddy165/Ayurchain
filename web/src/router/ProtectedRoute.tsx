import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="h-screen w-full flex items-center justify-center"><div className="animate-spin text-gold w-8 h-8 boundary">...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function RoleRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) {
  const { user } = useAuth()
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
