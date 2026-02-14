import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchBatches } from '../store/slices/batchSlice'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { batches, loading } = useAppSelector((state) => state.batches)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchBatches())
  }, [dispatch])

  const getRoleDashboardPath = (role: string) => {
    const roleMap: Record<string, string> = {
      FARMER: '/farmer',
      PROCESSOR: '/processor',
      LAB: '/lab',
      CERTIFIER: '/certifier',
      BRAND: '/brand',
    }
    return roleMap[role] || '/dashboard'
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {user?.name}</p>
        </div>

        <div className="mb-6">
          <Link
            to={getRoleDashboardPath(user?.role || '')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go to {user?.role} Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Batches</h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : batches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No batches found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Species
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.slice(0, 10).map((batch) => (
                      <tr key={batch._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {batch.shortBatchRef}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.speciesName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.quantity} {batch.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/batches/${batch._id}/history`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View History
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
