import React from 'react'
import { motion } from 'framer-motion'
import { Check, MapPin } from 'lucide-react'
import { BatchStageEvent } from '../../types/batch.types'
import { StageKey } from '../../types/stage.types'
import { STAGE_CONFIG } from '../../lib/constants'
import { cn, formatDate, formatHash } from '../../lib/utils'

interface JourneyTimelineProps {
  stages: BatchStageEvent[]
  currentStage: StageKey
  className?: string
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ stages, currentStage, className }) => {
  const allStageKeys = Object.keys(STAGE_CONFIG) as StageKey[]
  const currentIndex = allStageKeys.indexOf(currentStage)

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {allStageKeys.map((key, index) => {
        const config = STAGE_CONFIG[key]
        const stepEvent = stages.find(s => s.stage === key)
        const isCompleted = !!stepEvent
        const isActive = index === currentIndex
        const isPending = !isCompleted && !isActive

        return (
          <div key={key} className="relative flex gap-6 pb-12 last:pb-0">
            {/* Connecting Line */}
            {index !== allStageKeys.length - 1 && (
              <div
                className={cn(
                  "absolute left-6 top-12 bottom-0 w-[2px] -translate-x-1/2",
                  isCompleted ? "bg-gold" : "border-l-2 border-dashed border-surface-container-high"
                )}
              />
            )}

            {/* Circle */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-ui shadow-sm font-medium",
                  isCompleted && "bg-forest text-white shadow-ambient",
                  isActive && "bg-surface-container-highest border-2 border-gold text-gold shadow-[0_0_0_4px_rgba(121,89,0,0.1)]",
                  isPending && "bg-surface-container-low text-gray-400 border border-surface-container-high"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 text-gold" /> : (isActive ? <config.icon className="w-5 h-5" /> : index + 1)}
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-2">
              <h4 className={cn(
                "font-display text-h4 mb-1",
                isPending ? "text-gray-400" : "text-forest"
              )}>
                {config.label}
              </h4>
              
              {stepEvent ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-ambient mt-2 border border-surface-container-high/20"
                >
                  <p className="font-ui text-body text-on-surface font-medium">{stepEvent.actorName} • {stepEvent.actorOrg}</p>
                  <div className="flex items-center gap-4 mt-2 text-caption text-gray-500 font-ui">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {stepEvent.location}</span>
                    <span>{formatDate(stepEvent.timestamp)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="bg-surface-container-low px-2.5 py-1 rounded-sm text-mono-sm font-mono text-gray-600 border border-surface-container-high">
                      TX: {formatHash(stepEvent.txHash)}
                    </div>
                    {stepEvent.ipfsCID && (
                      <a href={stepEvent.ipfsUrl} target="_blank" rel="noreferrer" className="text-caption text-gold hover:underline">
                        View IPFS Document →
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <p className="text-caption text-gray-500 font-ui mt-1 max-w-sm leading-relaxed">
                  {config.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
