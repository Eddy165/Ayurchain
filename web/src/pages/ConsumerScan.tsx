import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { JourneyTimeline } from '../components/batch/JourneyTimeline'
import { BlockchainVerifyBadge } from '../components/blockchain'
import { ProductHeroCard, FarmerProfileCard, TrustScoreCard, ShareSection } from '../components/consumer/ConsumerComponents'
import { Spinner } from '../components/ui'

export default function ConsumerScan() {
  const { batchId } = useParams()
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<any>(null)

  useEffect(() => {
    // Mocking consumerService.scan
    setTimeout(() => {
      setData({
        verified: true,
        trustScore: 96,
        batch: {
          herbName: 'Ashwagandha Root Extract',
          scientificName: 'Withania somnifera',
          batchId: batchId || 'AY-94021',
        },
        farmer: {
          name: 'Anil Kumar',
          location: 'Kerala, India',
          rating: 4.8
        },
        stages: [
          { stage: 'FarmHarvest', actorName: 'Anil Kumar', actorOrg: 'Kerala Farms', location: 'Kerala', timestamp: new Date().toISOString(), txHash: '0x123abc' },
          { stage: 'Processing', actorName: 'Ramesh Singh', actorOrg: 'AyurProcessors Ltd', location: 'Mumbai', timestamp: new Date().toISOString(), txHash: '0x456def' },
          { stage: 'LabTesting', actorName: 'Dr. Neha', actorOrg: 'National Herbs Lab', location: 'Delhi', timestamp: new Date().toISOString(), txHash: '0x789ghi', ipfsCID: 'Qma1...', ipfsUrl: '#' },
          { stage: 'Certified', actorName: 'AYUSH Board', actorOrg: 'Ministry of AYUSH', location: 'Delhi', timestamp: new Date().toISOString(), txHash: '0xabc123', ipfsCID: 'Qmd2...', ipfsUrl: '#' },
        ]
      })
      setLoading(false)
    }, 1500)
  }, [batchId])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Spinner className="w-8 h-8 mb-4" />
        <p className="font-ui text-body text-gold animate-pulse">Verifying on Blockchain...</p>
      </div>
    )
  }

  if (!data) return <div className="p-8 text-center text-red-500">Batch not found</div>

  return (
    <div className="min-h-screen bg-surface w-full max-w-[430px] mx-auto pb-12 shadow-2xl relative overflow-x-hidden">
      {/* Botanical Pattern Overlay for Mobile purely aesthetic */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-forest pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px', opacity: 0.1 }} />
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-forest/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 h-16 bg-surface/80 backdrop-blur-md flex flex-col items-center justify-center border-b border-surface-container-high shadow-sm mb-6">
        <h1 className="font-display text-lg text-forest font-bold">AyurChain</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Product Verification</p>
      </header>

      <div className="flex flex-col gap-6 relative z-10 animate-fade-up">
        {/* Core Detail */}
        <ProductHeroCard batch={data.batch} verified={data.verified} />
        
        {/* Blockchain proof */}
        <div className="mx-4">
          <BlockchainVerifyBadge txHash="0xabc1234567890abcdef" />
        </div>

        <TrustScoreCard score={data.trustScore} />

        <FarmerProfileCard farmer={data.farmer} />

        <div className="bg-surface-container-lowest mx-4 p-6 rounded-2xl shadow-ambient border border-surface-container-high">
          <h3 className="font-display text-h4 text-forest mb-6">Verified Journey</h3>
          {/* Mobile adapted timeline */}
          <JourneyTimeline stages={data.stages} currentStage="RetailReady" className="transform scale-[0.85] origin-top-left w-[117%]" />
        </div>

        <ShareSection url={window.location.href} />
      </div>
    </div>
  )
}
