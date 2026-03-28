import axios, { AxiosInstance } from 'axios'
import { store } from '../store'
import { logout } from '../store/authSlice'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, Promise.reject)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default api
