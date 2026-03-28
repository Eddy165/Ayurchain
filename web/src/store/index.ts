import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import uiReducer from './uiSlice'
import batchReducer from './batchSlice'
import walletReducer from './walletSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    batch: batchReducer,
    wallet: walletReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
