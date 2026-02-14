import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'http://localhost:3001/api' // Change to your backend URL

export default function QRScannerScreen() {
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return

    setScanned(true)
    setLoading(true)

    try {
      // Extract token from QR URL
      // QR URL format: http://localhost:3000/consumer/verify/{token}
      const tokenMatch = data.match(/\/consumer\/verify\/([^\/]+)/)
      const token = tokenMatch ? tokenMatch[1] : data

      // Cache the last scanned token
      await AsyncStorage.setItem('lastScannedToken', token)

      // Navigate to traceability screen with token
      navigation.navigate('Traceability' as never, { token } as never)
    } catch (error) {
      Alert.alert('Error', 'Failed to process QR code')
      console.error('QR scan error:', error)
    } finally {
      setLoading(false)
      setTimeout(() => setScanned(false), 2000)
    }
  }

  const loadLastScanned = async () => {
    try {
      const lastToken = await AsyncStorage.getItem('lastScannedToken')
      if (lastToken) {
        navigation.navigate('Traceability' as never, { token: lastToken } as never)
      }
    } catch (error) {
      console.error('Failed to load last scanned:', error)
    }
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>
        </View>
      </Camera>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={loadLastScanned}
          disabled={loading}
        >
          <Text style={styles.buttonText}>View Last Scanned</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#22c55e',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#22c55e',
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderRightWidth: 4,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderBottomWidth: 4,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructionText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
})
