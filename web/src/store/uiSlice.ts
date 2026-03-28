import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface UIState {
  sidebarCollapsed: boolean
  activeModal: string | null
  notifications: Notification[]
  uploadProgress: number
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activeModal: null,
  notifications: [],
  uploadProgress: 0,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, setModal, addNotification, clearNotification, setUploadProgress } = uiSlice.actions
export default uiSlice.reducer
