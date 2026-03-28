import React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'link'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  fullWidth,
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-ui font-medium transition-all duration-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-forest/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-forest bg-gradient-to-br from-[#012D1D] to-[#1B4332] text-white shadow-ambient",
    secondary: "bg-gold text-white shadow-ambient",
    accent: "bg-surface-container-low text-forest border border-transparent hover:bg-surface-container",
    ghost: "bg-transparent text-forest hover:bg-forest/5",
    danger: "bg-red-50 text-red-700",
    link: "bg-transparent text-forest underline hover:text-forest-light px-0",
  }
  
  const sizes = {
    sm: "h-8 px-4 text-caption",
    md: "h-11 px-6 text-body",
    lg: "h-13 px-8 text-body-lg",
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
})
Button.displayName = 'Button'
