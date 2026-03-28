import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../types/user.types'

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('ayurchain_token'),
  isAuthenticated: !!localStorage.getItem('ayurchain_token'),
  isLoading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('ayurchain_token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('ayurchain_token')
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions
export default authSlice.reducer
