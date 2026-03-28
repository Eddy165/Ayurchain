import api from './api'
import { Batch, BatchStageEvent } from '../types/batch.types'

export const labService = {
  uploadReport: (batchId: string, data: any) =>
    api.post('/api/lab/upload-report', { batchId, ...data }),

  getPendingTests: () =>
    api.get<Batch[]>('/api/lab/pending'),
}

export const certificateService = {
  add: (batchId: string, certData: any) =>
    api.post('/api/certificate/add', { batchId, ...certData }),

  getPendingReview: () =>
    api.get<Batch[]>('/api/certificate/pending'),
}

export const consumerService = {
  scan: (batchId: string) =>
    api.get<{
      batch: Batch
      verified: boolean
      trustScore: number
      stages: BatchStageEvent[]
      farmer: { name: string; location: string; rating: number }
    }>(`/api/consumer/scan/${batchId}`),
}
