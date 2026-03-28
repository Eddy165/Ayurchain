import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'
import { ArrowRight, Sprout, ShieldCheck, Factory } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface selection:bg-gold/20 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-md z-50 border-b border-surface-container-high flex items-center justify-between px-8 lg:px-24">
        <div className="font-display font-bold text-h4 text-forest">AyurChain</div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-body text-forest hover:text-gold transition-colors font-medium">Log in</Link>
          <Button onClick={() => window.location.href='/register'}>Start Building Heritage</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 lg:pt-52 pb-24 px-8 lg:px-24 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 bg-surface-container-high rounded-full text-forest text-caption font-ui mb-6">
            The Ayurveda Verification Ledger
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-display text-forest mb-6 leading-tight">
            From Ancient Roots to Verified Truth.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-body-lg text-on-surface/80 mb-10 max-w-lg font-ui leading-relaxed">
            Protecting India's $15B Ayurveda legacy through immutable trace-and-trust ledger technology.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
            <Button size="lg" onClick={() => window.location.href='/register'}>Get Started <ArrowRight className="ml-2 w-4 h-4"/></Button>
            <Button variant="secondary" size="lg" onClick={() => window.location.href='/scan/test'}>Try a Scan</Button>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex-1 w-full bg-surface-container-low rounded-3xl h-[600px] border border-surface-container-high shadow-ambient p-8 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #012D1D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[2rem] shadow-ambient h-full border border-surface-container-high relative z-10 p-6 flex flex-col">
            <div className="w-1/2 h-4 bg-surface-container-high rounded-full mx-auto mb-8" />
            <h3 className="font-display text-h3 text-forest mb-4 text-center">Batch #AY-40291</h3>
            <div className="h-64 bg-forest rounded-xl flex items-center justify-center mb-6">
              <span className="text-white font-ui font-medium">Ashwagandha Extract</span>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-surface-container-low rounded-lg" />
              <div className="h-10 bg-surface-container-low rounded-lg" />
              <div className="h-10 bg-surface-container-low rounded-lg" />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
