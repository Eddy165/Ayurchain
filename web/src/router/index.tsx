import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute, RoleRoute } from './ProtectedRoute'
import { Spinner } from '../components/ui'

const Landing = lazy(() => import('../pages/Landing'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const RoleRouter = lazy(() => import('../pages/dashboard/RoleRouter'))
const FarmerDashboard = lazy(() => import('../pages/dashboard/FarmerDashboard'))
const ConsumerScan = lazy(() => import('../pages/ConsumerScan'))

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-surface text-forest"><Spinner className="w-10 h-10" /></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/scan/:batchId" element={<ConsumerScan />} />

        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<RoleRouter />} />
          <Route path="/dashboard/farmer" element={<RoleRoute allowedRoles={['Farmer']}><FarmerDashboard /></RoleRoute>} />
          
          {/* Placeholders for other routes */}
          <Route path="/dashboard/processor" element={<div className="p-8">Processor Dashboard (TBD)</div>} />
          <Route path="/dashboard/lab" element={<div className="p-8">Lab Dashboard (TBD)</div>} />
          <Route path="/dashboard/certifier" element={<div className="p-8">Certifier Dashboard (TBD)</div>} />
          <Route path="/dashboard/brand" element={<div className="p-8">Brand Dashboard (TBD)</div>} />

          <Route path="/batch/create" element={<div className="p-8">Batch Create Form (TBD)</div>} />
          <Route path="/batch/:id" element={<div className="p-8">Batch Details (TBD)</div>} />
          <Route path="/settings" element={<div className="p-8">Settings (TBD)</div>} />
        </Route>

        <Route path="*" element={<div className="h-screen flex items-center justify-center text-forest font-display text-h3">404: Page Not Found</div>} />
      </Routes>
    </Suspense>
  )
}
