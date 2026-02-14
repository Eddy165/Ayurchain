import Layout from '../components/Layout'

export default function LabDashboard() {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lab Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Batches Awaiting Testing</h2>
          <div className="text-center py-8 text-gray-500">
            Lab dashboard - batches awaiting lab testing
          </div>
        </div>
      </div>
    </Layout>
  )
}
