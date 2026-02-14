import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api' // Change to your backend URL

interface TraceabilityData {
  product: {
    batchId: string
    shortBatchRef: string
    speciesName: string
    quantity: number
    unit: string
    harvestDate: string
    status: string
  }
  origin: {
    farmer: {
      name: string
      email: string
      organization?: string
      location?: any
    }
    location: {
      address: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    harvestDate: string
  }
  timeline: Array<{
    type: string
    timestamp: string
    description: string
    actor?: any
  }>
  labStatus: {
    reports: Array<{
      lab: any
      resultStatus: string
      testParameters: any
      reportFileUrl: string | null
      createdAt: string
    }>
  }
  certifications: Array<{
    type: string
    certifier: any
    expiryDate: string
    certificateFileUrl: string
    createdAt: string
  }>
  authenticity: {
    isAuthentic: boolean
    checks: {
      blockchainVerified: boolean
      hasCertifications: boolean
      allTestsPassed: boolean
      noRevokedCertificates: boolean
    }
    verdict: string
  }
}

export default function TraceabilityScreen({ route }: any) {
  const { token } = route.params || {}
  const [data, setData] = useState<TraceabilityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      fetchTraceabilityData()
    } else {
      setError('No token provided')
      setLoading(false)
    }
  }, [token])

  const fetchTraceabilityData = async () => {
    try {
      const response = await axios.get(`${API_URL}/consumer/verify/${token}`)
      setData(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch traceability data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading traceability data...</Text>
      </View>
    )
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'No data available'}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Authenticity Badge */}
      <View
        style={[
          styles.authenticityBadge,
          data.authenticity.isAuthentic ? styles.authentic : styles.notAuthentic,
        ]}
      >
        <Text style={styles.authenticityText}>
          {data.authenticity.isAuthentic ? '✓ AUTHENTIC' : '⚠ VERIFICATION INCOMPLETE'}
        </Text>
      </View>

      {/* Product Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Batch ID:</Text>
          <Text style={styles.value}>{data.product.shortBatchRef}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Species:</Text>
          <Text style={styles.value}>{data.product.speciesName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>
            {data.product.quantity} {data.product.unit}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{data.product.status}</Text>
        </View>
      </View>

      {/* Origin */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Origin</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Farmer:</Text>
          <Text style={styles.value}>{data.origin.farmer.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{data.origin.location.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Harvest Date:</Text>
          <Text style={styles.value}>
            {new Date(data.origin.harvestDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Lab Status */}
      {data.labStatus.reports.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lab Testing</Text>
          {data.labStatus.reports.map((report, idx) => (
            <View key={idx} style={styles.reportCard}>
              <Text style={styles.reportStatus}>
                Status: {report.resultStatus}
              </Text>
              <Text style={styles.reportLab}>
                Lab: {report.lab?.name || 'Unknown'}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert, idx) => (
            <View key={idx} style={styles.certCard}>
              <Text style={styles.certType}>{cert.type}</Text>
              <Text style={styles.certExpiry}>
                Expires: {new Date(cert.expiryDate).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {data.timeline.map((event, idx) => (
          <View key={idx} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineType}>{event.type}</Text>
              <Text style={styles.timelineDescription}>{event.description}</Text>
              <Text style={styles.timelineDate}>
                {new Date(event.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Verdict */}
      <View style={styles.section}>
        <Text style={styles.verdictText}>{data.authenticity.verdict}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    margin: 20,
  },
  authenticityBadge: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  authentic: {
    backgroundColor: '#d4edda',
  },
  notAuthentic: {
    backgroundColor: '#f8d7da',
  },
  authenticityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#155724',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  reportCard: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reportStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  reportLab: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  certCard: {
    backgroundColor: '#e7f3ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  certType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  certExpiry: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    marginRight: 10,
    marginTop: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  verdictText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
})
