import { useEffect } from 'react'
import Layout from '../components/Layout'
import { useAppSelector } from '../hooks/redux'
import { fetchBatches } from '../store/slices/batchSlice'

export default function ProcessorDashboard() {
  const { batches, loading } = useAppSelector((state) => state.batches)

  useEffect(() => {
    // Fetch batches assigned to processor
  }, [])

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Processor Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Batches in Processing</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Processor dashboard - batches awaiting processing
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
