import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
}

const initialState: WalletState = {
  address: null,
  chainId: null,
  isConnected: false,
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletData: (state, action: PayloadAction<{ address: string; chainId: number }>) => {
      state.address = action.payload.address
      state.chainId = action.payload.chainId
      state.isConnected = true
    },
    clearWallet: (state) => {
      state.address = null
      state.chainId = null
      state.isConnected = false
    },
  },
})

export const { setWalletData, clearWallet } = walletSlice.actions
export default walletSlice.reducer
