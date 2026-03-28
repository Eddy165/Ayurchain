import React from 'react'
import { StageKey } from '../../types/stage.types'
import { STAGE_CONFIG } from '../../lib/constants'
import { cn } from '../../lib/utils'

interface StagePillProps {
  stage: StageKey
  className?: string
}

export const StagePill: React.FC<StagePillProps> = ({ stage, className }) => {
  const config = STAGE_CONFIG[stage]
  // Using the Heritage Ledger rule: subtle glow/border rather than solid fill
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-ui bg-surface-container-highest",
        className
      )}
      style={{
        borderLeft: `4px solid ${config.color}`
      }}
    >
      <span className="font-medium text-on-surface">{config.label}</span>
    </div>
  )
}
