import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { LayoutDashboard, Package, FileCheck, FlaskConical, Tag, User as UserIcon, LogOut, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const Sidebar: React.FC = () => {
  const { user } = useAppSelector(s => s.auth)
  const { sidebarCollapsed } = useAppSelector(s => s.ui)
  const role = user?.role

  const getNavItems = () => {
    switch(role) {
      case 'Farmer':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/farmer' },
          { label: 'Create Batch', icon: Package, path: '/batch/create' },
        ]
      case 'Processor':
      case 'LabTester':
      case 'Certifier':
      case 'Brand':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: `/dashboard/${role.toLowerCase()}` }
        ]
      default: return []
    }
  }

  const items = getNavItems()

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      className="bg-forest h-full flex flex-col text-white fixed left-0 top-15 z-40 transition-all overflow-hidden border-r border-surface-container-high/10"
    >
      <div className="flex-1 py-8 px-3 flex flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 h-11 px-3 rounded-lg font-ui text-body transition-colors",
              isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "w-1 h-6 rounded-full absolute left-0 transition-transform",
                  isActive ? "bg-gold scale-100" : "scale-0"
                )} />
                <item.icon className="w-5 h-5 shrink-0 ml-1" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.aside>
  )
}
