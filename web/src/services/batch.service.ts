import api from './api'
import { Batch, CreateBatchInput, BatchStageEvent, Role } from '../types/batch.types'
import { StageKey } from '../types/stage.types'

export const batchService = {
  create: (data: CreateBatchInput) =>
    api.post<Batch>('/api/batch/create', data),

  transfer: (batchId: string, toWallet: string, toRole: Role) =>
    api.post(`/api/batch/${batchId}/transfer`, { toWallet, toRole }),

  getHistory: (batchId: string) =>
    api.get<BatchStageEvent[]>(`/api/batch/${batchId}/history`),

  verify: (batchId: string) =>
    api.get<{ verified: boolean; stages: BatchStageEvent[] }>(`/api/batch/${batchId}/verify`),

  generateQR: (batchId: string) =>
    api.get<{ qrUrl: string; qrDataUrl: string }>(`/api/qr/generate?batchId=${batchId}`),

  getMyBatches: (params?: { stage?: StageKey; page?: number; limit?: number }) =>
    api.get<{ batches: Batch[]; total: number }>('/api/batch/my', { params }),
}
