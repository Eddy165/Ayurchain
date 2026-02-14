import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function BatchHistory() {
  const { id } = useParams<{ id: string }>()
  const [history, setHistory] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/batches/${id}/history`)
        .then((res) => {
          setHistory(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch batch history:', err)
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    )
  }

  if (!history) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-500">Batch history not found</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Batch History: {history.batch.shortBatchRef}
        </h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-4">
            {history.history.transfers.map((transfer: any, idx: number) => (
              <div key={idx} className="border-l-4 border-primary-500 pl-4">
                <div className="font-semibold">Transfer</div>
                <div className="text-sm text-gray-600">
                  From: {(transfer.fromUserId as any)?.name} → To: {(transfer.toUserId as any)?.name}
                </div>
                <div className="text-xs text-gray-500">{new Date(transfer.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
