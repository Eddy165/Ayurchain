import React from 'react'
import { SplitLayout } from '../components/layout/SplitLayout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function Login() {
  const { login, isLoading, loginWithWallet } = useAuth()
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  })

  // @ts-ignore
  const onSubmit = (data) => login(data.email, data.password)

  return (
    <SplitLayout quote="From Ancient Roots to Verified Truth" author="AyurChain">
      <div className="mb-10 text-center">
        <h1 className="font-display text-h2 text-forest mb-2">Welcome Back</h1>
        <p className="font-ui text-body text-gray-500">Sign in to the ledger.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input 
          label="Email Address" 
          placeholder="you@company.com" 
          {...register('email')} 
          error={errors.email?.message} 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          {...register('password')} 
          error={errors.password?.message} 
        />
        
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-caption text-gold hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
          Sign In
        </Button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px bg-surface-container-high flex-1" />
        <span className="text-caption text-gray-400 font-ui uppercase tracking-wider">or sign in with</span>
        <div className="h-px bg-surface-container-high flex-1" />
      </div>

      <Button variant="secondary" fullWidth onClick={loginWithWallet} disabled={isLoading}>
        🦊 Connect MetaMask
      </Button>

      <p className="mt-8 text-center text-body text-on-surface font-ui">
        Don't have an account?{' '}
        <Link to="/register" className="text-gold font-medium hover:underline">
          Register →
        </Link>
      </p>
    </SplitLayout>
  )
}
