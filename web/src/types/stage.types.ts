import { LucideIcon } from 'lucide-react'

export type StageKey =
  | 'FarmHarvest'
  | 'Processing'
  | 'LabTesting'
  | 'Certified'
  | 'RetailReady'
  | 'Consumer'

export type StageStatus = 'completed' | 'active' | 'pending'

export interface StageConfig {
  key: StageKey
  label: string
  actor: string
  icon: LucideIcon
  color: string
  bgColor: string
  description: string
}
