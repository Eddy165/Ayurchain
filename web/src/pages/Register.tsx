import React from 'react'
import { SplitLayout } from '../components/layout/SplitLayout'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { RoleSelector } from '../components/forms/RoleSelector'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { toast } from 'react-hot-toast'

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.enum(['Farmer', 'Processor', 'LabTester', 'Certifier', 'Brand']),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Farmer' }
  })

  // @ts-ignore
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.register(data)
      toast.success("Registration successful!")
      await login(data.email, data.password)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitLayout quote="Create a Legacy of Trust." author="AyurChain">
      <div className="mb-10 text-center">
        <h1 className="font-display text-h2 text-forest mb-2">Create Account</h1>
        <p className="font-ui text-body text-gray-500">Join the verified Ayurveda network.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input label="Full Name" placeholder="Your Name" {...register('fullName')} error={errors.fullName?.message} />
        <Input label="Email Address" placeholder="you@company.com" {...register('email')} error={errors.email?.message} />
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
          <Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        </div>

        <div className="mt-2">
          <label className="text-body font-ui text-on-surface mb-3 block">Select Your Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RoleSelector value={field.value as any} onChange={field.onChange} />
            )}
          />
        </div>

        <Button type="submit" fullWidth isLoading={loading} className="mt-6">
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-body text-on-surface font-ui">
        Already have an account?{' '}
        <Link to="/login" className="text-gold font-medium hover:underline">
          Login →
        </Link>
      </p>
    </SplitLayout>
  )
}
