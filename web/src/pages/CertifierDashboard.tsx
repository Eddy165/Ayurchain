import Layout from '../components/Layout'

export default function CertifierDashboard() {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Certifier Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Certification Queue</h2>
          <div className="text-center py-8 text-gray-500">
            Certifier dashboard - batches awaiting certification
          </div>
        </div>
      </div>
    </Layout>
  )
}
