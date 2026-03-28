import React from 'react'
import { cn } from '../../lib/utils'

export const Avatar = ({ src, fallback, className }: { src?: string; fallback: string; className?: string }) => (
  <div className={cn("w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-ui font-medium text-sm overflow-hidden", className)}>
    {src ? <img src={src} alt="avatar" className="w-full h-full object-cover" /> : fallback}
  </div>
)
