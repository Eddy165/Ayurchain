import api from './api'
import { User, RegisterInput } from '../types/user.types'

export const authService = {
  login: (email: string, password?: string) =>
    api.post<{ user: User; token: string }>('/api/auth/login', { email, password }),

  register: (data: RegisterInput) =>
    api.post<{ user: User; token: string }>('/api/auth/register', data),

  getMe: () =>
    api.get<User>('/api/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/api/auth/profile', data),
}
