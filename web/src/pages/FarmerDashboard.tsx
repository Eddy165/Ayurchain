import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { createBatch, fetchBatches } from '../store/slices/batchSlice'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function FarmerDashboard() {
  const dispatch = useAppDispatch()
  const { batches, loading } = useAppSelector((state) => state.batches)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    speciesName: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    geoLocation: {
      address: '',
      coordinates: { lat: '', lng: '' },
    },
    initialQualityGrade: '',
  })

  useEffect(() => {
    dispatch(fetchBatches())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(createBatch(formData)).unwrap()
      setShowCreateForm(false)
      setFormData({
        speciesName: '',
        quantity: '',
        unit: 'kg',
        harvestDate: '',
        geoLocation: {
          address: '',
          coordinates: { lat: '', lng: '' },
        },
        initialQualityGrade: '',
      })
      dispatch(fetchBatches())
    } catch (error) {
      console.error('Failed to create batch:', error)
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            {showCreateForm ? 'Cancel' : 'Create Batch'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Batch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Species Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.speciesName}
                    onChange={(e) => setFormData({ ...formData, speciesName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="tons">tons</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.geoLocation.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        geoLocation: { ...formData.geoLocation, address: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.geoLocation.coordinates.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        geoLocation: {
                          ...formData.geoLocation,
                          coordinates: {
                            ...formData.geoLocation.coordinates,
                            lat: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.geoLocation.coordinates.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        geoLocation: {
                          ...formData.geoLocation,
                          coordinates: {
                            ...formData.geoLocation.coordinates,
                            lng: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Initial Quality Grade
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.initialQualityGrade}
                    onChange={(e) =>
                      setFormData({ ...formData, initialQualityGrade: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Create Batch
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">My Batches</h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : batches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No batches created yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Batch ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Species
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr key={batch._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {batch.shortBatchRef}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{batch.speciesName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {batch.quantity} {batch.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {batch.status}
                          </span>
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
