import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token } = useAppSelector((state) => state.auth)

  if (!token || !user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}
