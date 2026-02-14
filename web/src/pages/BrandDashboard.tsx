import Layout from '../components/Layout'

export default function BrandDashboard() {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Brand Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">QR Code Generation</h2>
          <div className="text-center py-8 text-gray-500">
            Brand dashboard - generate QR codes for certified batches
          </div>
        </div>
      </div>
    </Layout>
  )
}
