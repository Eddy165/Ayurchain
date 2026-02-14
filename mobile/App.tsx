import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import QRScannerScreen from './src/screens/QRScannerScreen'
import TraceabilityScreen from './src/screens/TraceabilityScreen'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QRScanner">
        <Stack.Screen
          name="QRScanner"
          component={QRScannerScreen}
          options={{ title: 'Scan QR Code' }}
        />
        <Stack.Screen
          name="Traceability"
          component={TraceabilityScreen}
          options={{ title: 'Product Traceability' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
