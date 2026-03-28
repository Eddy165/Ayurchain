import React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full flex-col flex gap-1.5">
      {label && (
        <label className="text-body font-ui text-on-surface">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "h-11 w-full bg-surface-container-low rounded-lg px-4 font-ui text-body text-on-surface transition-all",
          "outline-none ring-1 ring-inset ring-outline-variant/15 placeholder:text-gray-400",
          "focus:ring-2 focus:ring-gold focus:bg-surface-container-lowest",
          error && "ring-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-caption text-red-500">{error}</span>}
    </div>
  )
})
Input.displayName = 'Input'
