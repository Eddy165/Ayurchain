import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import batchReducer from './slices/batchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    batches: batchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
