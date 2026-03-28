import { Role } from './batch.types'

export interface User {
  _id: string
  fullName: string
  email: string
  role: Role
  walletAddress?: string
  organizationName?: string
  phone?: string
  language: 'en' | 'hi' | 'ta'
  avatarUrl?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface RegisterInput {
  fullName: string
  email: string
  password?: string
  role: Role
}
