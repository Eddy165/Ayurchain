import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface SplitLayoutProps {
  children: React.ReactNode
  quote?: string
  author?: string
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ children, quote, author }) => {
  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:flex lg:w-1/2 bg-forest relative overflow-hidden items-center justify-center p-12">
        {/* Subtle Botanical Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-xl text-center"
        >
          {quote ? (
            <>
              <h2 className="text-display text-white italic mb-6 leading-tight">"{quote}"</h2>
              {author && <p className="text-gold font-ui tracking-widest uppercase text-sm mt-8">— {author}</p>}
            </>
          ) : (
            <h2 className="text-display text-white leading-tight">The Heritage Ledger.</h2>
          )}
        </motion.div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
