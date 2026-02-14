import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { getCurrentUser } from './store/slices/authSlice'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FarmerDashboard from './pages/FarmerDashboard'
import ProcessorDashboard from './pages/ProcessorDashboard'
import LabDashboard from './pages/LabDashboard'
import CertifierDashboard from './pages/CertifierDashboard'
import BrandDashboard from './pages/BrandDashboard'
import BatchHistory from './pages/BatchHistory'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token, user])

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer"
        element={
          <ProtectedRoute>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/processor"
        element={
          <ProtectedRoute>
            <ProcessorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab"
        element={
          <ProtectedRoute>
            <LabDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certifier"
        element={
          <ProtectedRoute>
            <CertifierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand"
        element={
          <ProtectedRoute>
            <BrandDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batches/:id/history"
        element={
          <ProtectedRoute>
            <BatchHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App
