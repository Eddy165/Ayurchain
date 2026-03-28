import { StageKey } from './stage.types'

export type Role =
  | 'Farmer'
  | 'Processor'
  | 'LabTester'
  | 'Certifier'
  | 'Brand'
  | 'Consumer'

export interface BatchStageEvent {
  stage: StageKey
  actorName: string
  actorOrg: string
  location: string
  timestamp: string          // ISO date string
  txHash: string             // Polygon transaction hash
  ipfsCID?: string           // For lab reports and certificates
  ipfsUrl?: string           // Full IPFS gateway URL
  notes?: string
  labResults?: {
    heavyMetals: 'Pass' | 'Fail'
    pesticideResidue: 'Pass' | 'Fail'
    microbialCount: string
    activeCompounds: 'Pass' | 'Fail'
    overallResult: 'Pass' | 'Fail' | 'Conditional'
  }
}

export interface Batch {
  _id: string
  batchId: string            // e.g. "AY-0021"
  herbName: string
  scientificName: string
  quantity: number
  unit: 'g' | 'kg' | 'tonnes'
  growingMethod: 'Organic' | 'Conventional' | 'Biodynamic' | 'Wild-harvested'
  harvestLocation: { state: string; district: string }
  harvestDate: string
  farmCertificateId?: string
  currentStage: StageKey
  stages: BatchStageEvent[]
  farmerWallet: string
  currentCustodian: string
  ipfsCIDs: string[]
  qrCodeUrl: string
  contractBatchId: string    // On-chain batch ID
  createdAt: string
  updatedAt: string
}

export interface CreateBatchInput {
  herbName: string
  scientificName: string
  quantity: number
  unit: 'g' | 'kg' | 'tonnes'
  growingMethod: string
  harvestLocation: { state: string; district: string }
  harvestDate: string
  farmCertificateId?: string
  ipfsCIDs: string[]         // Uploaded document CIDs
}
