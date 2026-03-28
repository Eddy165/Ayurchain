import React from 'react'
import { Card } from '../ui/index'
import { ShieldCheck, User as UserIcon, MapPin, Share2, Download, MessageCircle } from 'lucide-react'
import { Progress, Button } from '../ui'
import { cn } from '../../lib/utils'

export const ProductHeroCard = ({ batch, verified }: { batch: any, verified: boolean }) => (
  <div className="bg-surface-container-lowest rounded-2xl mx-4 shadow-ambient overflow-hidden border border-surface-container-high relative">
    {verified && (
      <div className="absolute top-4 right-4 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold font-ui flex items-center gap-1 border border-green-200 shadow-sm">
        <CheckIcon className="w-3 h-3" /> VERIFIED
      </div>
    )}
    <div className="p-6">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low text-forest rounded-sm text-mono-sm font-mono mb-4 border border-surface-container-high shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-gold" /> AYUSH Certified
      </div>
      <h2 className="font-display text-[28px] font-bold text-forest mb-1 leading-tight">{batch?.herbName || 'Herbal Product'}</h2>
      <p className="font-ui text-body text-gray-500 mb-6">{batch?.scientificName || 'Botanical Name'}</p>
      
      <div className="pt-5 border-t border-surface-container-high/60 mt-2">
        <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1">Batch ID</p>
        <p className="font-mono text-body text-forest">{batch?.batchId || 'AY-0000'}</p>
      </div>
    </div>
  </div>
)

const CheckIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
)

export const FarmerProfileCard = ({ farmer }: { farmer: any }) => (
  <Card className="mx-4 p-5 flex items-start gap-4">
    <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden shrink-0 border border-surface-container-high">
      <UserIcon className="w-8 h-8 text-forest/40" />
    </div>
    <div>
      <p className="text-caption text-gray-500 uppercase tracking-wider mb-1">Grown by</p>
      <h3 className="font-display text-h4 text-forest mb-1">{farmer?.name || 'Local Farmer'}</h3>
      <div className="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-sm text-[11px] text-gray-600 mb-2 border border-surface-container-high w-fit">
        <MapPin className="w-3 h-3" /> {farmer?.location || 'India'}
      </div>
      {/* 5 Filled Gold Stars */}
      <div className="flex gap-0.5 mt-1">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    </div>
  </Card>
)

export const TrustScoreCard = ({ score }: { score: number }) => {
  const color = score > 80 ? 'text-green-600' : score > 60 ? 'text-amber-500' : 'text-red-500'
  
  return (
    <Card className="mx-4 p-6 text-center shadow-ambient">
      <h3 className="font-ui text-body font-medium text-gray-500 mb-6">AyurChain Trust Score</h3>
      <div className="relative w-32 h-32 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#F4EDDD" strokeWidth="8" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${(score/100)*283} 283`} className={cn("transition-all duration-1000", color)} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={cn("font-display text-[32px] font-bold leading-none", color)}>{score}</span>
          <span className="text-caption text-gray-400">/ 100</span>
        </div>
      </div>
      
      <div className="space-y-4 text-left">
        {[
          { label: 'Authenticity', value: 100 },
          { label: 'Lab Compliance', value: 100 },
          { label: 'Chain Completeness', value: 85 },
          { label: 'AYUSH Status', value: 100 }
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-caption mb-1.5 font-medium">
              <span className="text-on-surface">{item.label}</span>
              <span className="text-forest">{item.value}%</span>
            </div>
            <Progress value={item.value} className="h-1.5" indicatorColor={item.value > 80 ? "bg-forest" : "bg-gold"} />
          </div>
        ))}
      </div>
    </Card>
  )
}

export const ShareSection = ({ url }: { url: string }) => {
  const copy = () => navigator.clipboard.writeText(url)
  
  return (
    <div className="mx-4 bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-surface-container-high text-center">
      <h3 className="font-ui text-body text-forest mb-4">Share this verified product</h3>
      <div className="flex gap-2 justify-center">
        <Button variant="ghost" className="px-3" onClick={copy}><Share2 className="w-5 h-5 text-gray-500" /></Button>
        <Button variant="ghost" className="px-3" onClick={() => window.open(`https://wa.me/?text=${url}`)}><MessageCircle className="w-5 h-5 text-green-600" /></Button>
        <Button variant="ghost" className="px-3"><Download className="w-5 h-5 text-forest" /></Button>
      </div>
    </div>
  )
}
