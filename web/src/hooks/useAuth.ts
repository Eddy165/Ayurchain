import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCredentials, logout as logoutAction, setLoading } from '../store/authSlice'
import { authService } from '../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useWalletClient, useAccount } from 'wagmi'
import api from '../services/api'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, isLoading } = useAppSelector(s => s.auth)
  const navigate = useNavigate()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const login = async (email: string, password?: string) => {
    dispatch(setLoading(true))
    try {
      const { data } = await authService.login(email, password)
      dispatch(setCredentials(data))
      navigate(`/dashboard`)
    } catch (err) {
      toast.error('Invalid credentials. Please try again.')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const loginWithWallet = async () => {
    if (!walletClient || !address) {
      toast.error('Wallet not connected')
      return
    }
    dispatch(setLoading(true))
    try {
      const message = `AyurChain login: ${Date.now()}`
      const signature = await walletClient.signMessage({ message })
      const { data } = await api.post('/api/auth/wallet-login', {
        walletAddress: address, message, signature
      })
      dispatch(setCredentials(data))
      navigate(`/dashboard`)
    } catch (err) {
      toast.error('Wallet login failed')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const logout = () => {
    dispatch(logoutAction())
    navigate('/login')
  }

  return { user, token, isAuthenticated, isLoading, login, loginWithWallet, logout }
}
