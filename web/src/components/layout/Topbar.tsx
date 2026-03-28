import React from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleSidebar } from '../../store/uiSlice'
import { useWallet } from '../../hooks/useWallet'
import { Avatar } from '../ui/Avatar'

export const Topbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(s => s.auth)
  const { truncatedAddress } = useWallet()

  return (
    <header className="fixed top-0 left-0 right-0 h-15 bg-surface-container-lowest z-50 flex items-center justify-between px-6 shadow-sm border-b border-surface-container-high">
      <div className="flex items-center gap-6">
        <div className="w-[192px] flex items-center gap-2">
          {/* Logo Placeholder */}
          <span className="font-display font-bold text-h4 text-forest">AyurChain</span>
        </div>
        <button onClick={() => dispatch(toggleSidebar())} className="text-on-surface hover:text-forest">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden md:block w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search batches, herbs, TX hashes..."
            className="w-full h-9 bg-surface-container-low rounded-full pl-9 pr-4 text-body font-ui placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-forest/30"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {truncatedAddress && (
          <div className="px-3 py-1 bg-surface-container rounded-full text-mono-sm font-mono text-forest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Mumbai • {truncatedAddress}
          </div>
        )}
        <button className="relative text-on-surface hover:text-forest">
          <Bell className="w-5 h-5" />
        </button>
        {user && (
          <div className="flex items-center gap-3 p-1 pr-4 bg-surface-container-low rounded-full">
            <Avatar fallback={user.fullName[0]} />
            <div className="flex flex-col">
              <span className="text-caption font-medium">{user.fullName}</span>
              <span className="text-mono-sm text-gold">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
