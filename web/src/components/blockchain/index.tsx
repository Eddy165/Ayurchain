import React from 'react'
import { CheckCircle2, Copy } from 'lucide-react'
import { cn, formatHash } from '../../lib/utils'
import { toast } from 'react-hot-toast'

export const BlockchainVerifyBadge = ({ txHash, className }: { txHash?: string, className?: string }) => (
  <div className={cn("bg-forest text-white rounded-xl p-4 flex items-center justify-between shadow-ambient", className)}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <CheckCircle2 className="w-6 h-6 text-gold" />
      </div>
      <div>
        <p className="font-display text-body-lg font-bold">Verified on Polygon Blockchain</p>
        {txHash && <p className="font-mono text-mono-sm text-white/60">TX: {formatHash(txHash)}</p>}
      </div>
    </div>
  </div>
)

export const TxHashChip = ({ txHash }: { txHash: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(txHash)
    toast.success('Hash copied to clipboard!')
  }

  return (
    <div className="inline-flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-sm border border-surface-container-high font-mono text-mono-sm group hover:border-gold transition-colors">
      <span className="text-forest cursor-default">{formatHash(txHash)}</span>
      <button onClick={handleCopy} className="text-gray-400 hover:text-gold transition-colors">
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export const NetworkBadge = () => (
  <div className="px-3 py-1.5 bg-[#8247E5]/10 text-[#8247E5] rounded-full text-caption font-medium flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    Polygon Mumbai
  </div>
)
