import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'neutral'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    success: "bg-green-50 text-green-700 border-l-4 border-green-600",
    warning: "bg-amber-50 text-amber-700 border-l-4 border-amber-500",
    error: "bg-red-50 text-red-700 border-l-4 border-red-500",
    neutral: "bg-surface-container-low text-on-surface border-l-4 border-surface-container-high",
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium font-ui",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
