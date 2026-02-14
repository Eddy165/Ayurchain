# AyurChain Setup Guide

Complete setup instructions for the AyurChain blockchain traceability platform.

## Prerequisites

- Node.js 20+ and npm
- MongoDB (local or cloud)
- Docker and Docker Compose (optional, for containerized setup)
- Git

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (if using workspaces)
npm install

# Install contracts dependencies
cd contracts
npm install

# Install backend dependencies
cd ../backend
npm install

# Install web dependencies
cd ../web
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### 2. Smart Contracts Setup

```bash
cd contracts

# Compile contracts
npm run build

# Run tests
npm test

# Start local Hardhat node (in one terminal)
npx hardhat node

# Deploy contracts (in another terminal)
npx hardhat run scripts/deploy.ts --network localhost

# Copy the contract addresses from the output
```

### 3. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and configure:
# - MONGO_URI (e.g., mongodb://localhost:27017/ayurchain)
# - JWT_SECRET (generate a secure random string)
# - JWT_REFRESH_SECRET (generate another secure random string)
# - POLYGON_RPC_URL (for testnet: https://rpc-mumbai.maticvigil.com)
# - DEPLOYER_PRIVATE_KEY (wallet private key with testnet MATIC)
# - Contract addresses from step 2
# - PINATA_API_KEY and PINATA_SECRET_KEY (optional, for IPFS)

# Start MongoDB (if not using Docker)
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod
# On Windows: Start MongoDB service

# Start backend
npm run dev
```

### 4. Web Frontend Setup

```bash
cd web

# Create .env file (optional, defaults work for local dev)
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start development server
npm run dev

# Open http://localhost:3000
```

### 5. Mobile App Setup

```bash
cd mobile

# Install Expo CLI globally (if not installed)
npm install -g expo-cli

# Start Expo
npm start

# Scan QR code with Expo Go app on your phone
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

### 6. Docker Setup (Alternative)

```bash
cd infra

# Copy backend .env first
cp ../backend/.env.example ../backend/.env
# Edit ../backend/.env with your configuration

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Testing the Platform

### 1. Create Test Users

1. Open http://localhost:3000/register
2. Register users with different roles:
   - FARMER
   - PROCESSOR
   - LAB
   - CERTIFIER
   - BRAND

### 2. Test Batch Lifecycle

1. **Login as FARMER**
   - Create a new batch
   - Fill in species, quantity, location, etc.
   - Submit

2. **Transfer to PROCESSOR**
   - As FARMER, transfer batch to PROCESSOR
   - Login as PROCESSOR
   - View received batch
   - Add processing events (cleaning, drying, etc.)

3. **Send to LAB**
   - As PROCESSOR, transfer batch to LAB
   - Login as LAB
   - View batch in queue
   - Submit lab report with test results

4. **Certify**
   - As CERTIFIER, view lab results
   - Issue certification (AYUSH, FSSAI, etc.)

5. **Generate QR Code**
   - As BRAND, generate QR code for certified batch
   - Copy QR URL or image

6. **Consumer Verification**
   - Use mobile app to scan QR code
   - View full traceability information

## Environment Variables Reference

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/ayurchain

# JWT (generate secure random strings)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Blockchain
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
DEPLOYER_PRIVATE_KEY=your_private_key_here
FARMER_REGISTRY_ADDRESS=0x...
BATCH_TRACKER_ADDRESS=0x...
CERTIFICATION_ADDRESS=0x...
OWNERSHIP_TRANSFER_ADDRESS=0x...

# IPFS (optional)
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
PINATA_API_KEY=
PINATA_SECRET_KEY=

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongosh` or `mongo`
- Check connection string format
- Verify MongoDB is accessible on port 27017

### Blockchain Transaction Failures

- Ensure wallet has testnet MATIC (for Polygon Mumbai)
- Check RPC URL is correct
- Verify contract addresses are correct
- Check gas prices and limits

### IPFS Upload Failures

- IPFS is optional - system works without it
- If using Pinata, verify API keys
- Check network connectivity

### CORS Issues

- Ensure CORS_ORIGIN matches frontend URL
- Check backend is running on correct port
- Verify proxy configuration in vite.config.ts

## Next Steps

1. Deploy contracts to Polygon Mumbai testnet
2. Set up production MongoDB instance
3. Configure production environment variables
4. Deploy backend to cloud (AWS, GCP, Azure)
5. Deploy web frontend (Vercel, Netlify)
6. Build and publish mobile app (App Store, Play Store)

## Support

For issues, check:
- Backend logs: `cd backend && npm run dev`
- Contract tests: `cd contracts && npm test`
- Docker logs: `docker-compose logs`
