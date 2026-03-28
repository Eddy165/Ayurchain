import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Batch } from '../types/batch.types'

interface BatchState {
  batches: Batch[]
  currentBatch: Batch | null
  isLoading: boolean
}

const initialState: BatchState = {
  batches: [],
  currentBatch: null,
  isLoading: false,
}

export const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {
    setBatches: (state, action: PayloadAction<Batch[]>) => {
      state.batches = action.payload
    },
    setCurrentBatch: (state, action: PayloadAction<Batch>) => {
      state.currentBatch = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setBatches, setCurrentBatch, setLoading } = batchSlice.actions
export default batchSlice.reducer
