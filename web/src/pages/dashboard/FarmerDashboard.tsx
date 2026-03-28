import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { batchService } from '../../services/batch.service'
import { useAuth } from '../../hooks/useAuth'
import { Card } from '../../components/ui'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { PackagePlus, HandCoins, Sprout, ShieldCheck } from 'lucide-react'

export default function FarmerDashboard() {
  const { user } = useAuth()
  
  // Mock data for UI until backend is fully hooked
  const { data: stats } = useQuery({
    queryKey: ['farmerStats'],
    queryFn: () => Promise.resolve({ totalBatches: 24, certified: 18, pending: 4, revenue: '1.2M' })
  })

  // @ts-ignore
  const { data: batchesQuery } = useQuery({
    queryKey: ['myBatches'],
    queryFn: () => batchService.getMyBatches()
  })

  const batches = batchesQuery?.data?.batches || []

  const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
    <Card className="p-6 border border-surface-container-low shadow-ambient">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}><Icon className="w-6 h-6" /></div>
        <p className="font-ui text-body text-gray-500 font-medium">{label}</p>
      </div>
      <h3 className="font-display text-h3 text-forest">{value}</h3>
    </Card>
  )

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 text-forest">Good morning, {user?.fullName} 🌿</h1>
          <p className="font-ui text-body text-gray-500 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link to="/batch/create">
          <Button leftIcon={<PackagePlus className="w-4 h-4"/>}>Create New Batch</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Harvests" value={stats?.totalBatches || 0} icon={Sprout} colorClass="bg-stage-farm-bg text-stage-farm" />
        <StatCard label="Certified Pure" value={stats?.certified || 0} icon={ShieldCheck} colorClass="bg-stage-certify-bg text-stage-certify" />
        <StatCard label="Pending Review" value={stats?.pending || 0} icon={PackagePlus} colorClass="bg-amber-100 text-amber-700" />
        <StatCard label="Est. Revenue Q1" value={`₹${stats?.revenue || '0'}`} icon={HandCoins} colorClass="bg-surface-container-low text-gold" />
      </div>

      <Card className="p-0 overflow-hidden shadow-ambient border border-surface-container-high/40">
        <div className="px-6 py-5 border-b border-surface-container-high/40 bg-surface-container-lowest">
          <h3 className="font-display text-h4 text-forest">Recent Active Batches</h3>
        </div>
        <div className="p-8 text-center bg-surface flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-forest/40" />
          </div>
          <p className="font-ui text-body text-gray-500 max-w-sm mx-auto">
            You don't have any active batches in the traceability pipeline yet. Connect your wallet and create your first batch to register it on Polygon.
          </p>
          <Link to="/batch/create" className="mt-6">
            <Button variant="secondary">Start Traceability Journey</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
