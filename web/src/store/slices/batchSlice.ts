import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface Batch {
  _id: string
  batchId: string
  shortBatchRef: string
  speciesName: string
  quantity: number
  unit: string
  harvestDate: string
  status: string
  geoLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
}

interface BatchState {
  batches: Batch[]
  currentBatch: Batch | null
  loading: boolean
  error: string | null
}

const initialState: BatchState = {
  batches: [],
  currentBatch: null,
  loading: false,
  error: null,
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const fetchBatches = createAsyncThunk('batches/fetchAll', async () => {
  const response = await axios.get(`${API_URL}/batches`, getAuthHeaders())
  return response.data
})

export const createBatch = createAsyncThunk(
  'batches/create',
  async (batchData: any) => {
    const response = await axios.post(`${API_URL}/batches`, batchData, getAuthHeaders())
    return response.data
  }
)

export const fetchBatchHistory = createAsyncThunk(
  'batches/fetchHistory',
  async (batchId: string) => {
    const response = await axios.get(`${API_URL}/batches/${batchId}/history`)
    return response.data
  }
)

const batchSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false
        state.batches = action.payload
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch batches'
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.batches.unshift(action.payload as any)
      })
      .addCase(fetchBatchHistory.fulfilled, (state, action) => {
        state.currentBatch = action.payload.batch as any
      })
  },
})

export const { clearError } = batchSlice.actions
export default batchSlice.reducer
