import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuth } from "@hooks/useAuth";
import { Navbar } from "@components/layout/Navbar";
import { ProtectedRoute } from "@components/layout/ProtectedRoute";

import { Login } from "@pages/auth/Login";
import { Register } from "@pages/auth/Register";
import { Dashboard } from "@pages/dashboard/Dashboard";
import { ScanResult } from "@pages/consumer/ScanResult";

const AppContent = () => {
  const { getMe, isAuthenticated } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("ayurchain_token") && !isAuthenticated) {
      getMe();
    }
  }, [getMe, isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
            
            {/* Consumer facing route */}
            <Route path="/scan/:token" element={<ScanResult />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Toast Notifications Provider */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '0.5rem',
            },
            success: { iconTheme: { primary: '#1B4332', secondary: '#fff' } },
          }}
        />
      </div>
    </Router>
  );
};

export default AppContent;
