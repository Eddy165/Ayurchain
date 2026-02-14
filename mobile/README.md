# AyurChain Mobile App

React Native mobile app (Expo) for consumer QR scanning and traceability viewing.

## Setup

```bash
npm install
```

## Run

```bash
# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Features

- QR code scanner for product verification
- Traceability view showing:
  - Product information
  - Origin and farmer details
  - Lab test results
  - Certifications
  - Complete timeline
  - Authenticity verification
- Offline support (caches last scanned result)

## Configuration

Update `API_URL` in `src/screens/QRScannerScreen.tsx` and `src/screens/TraceabilityScreen.tsx` to point to your backend API.

## Permissions

The app requires camera permission for QR scanning.
