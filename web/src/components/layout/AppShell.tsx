import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAppSelector } from '../../store/hooks'
import { cn } from '../../lib/utils'

export const AppShell: React.FC = () => {
  const { sidebarCollapsed } = useAppSelector(s => s.ui)
  const { isAuthenticated } = useAppSelector(s => s.auth)

  // If not authenticated (e.g., Scan page or Landing), just render Outlet without shell
  if (!isAuthenticated) return <Outlet />

  return (
    <div className="min-h-screen bg-surface">
      <Topbar />
      <div className="flex pt-15">
        <Sidebar />
        <main
          className={cn(
            "flex-1 transition-all duration-300 min-h-[calc(100vh-60px)] p-8",
            sidebarCollapsed ? "ml-[64px]" : "ml-[240px]"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
