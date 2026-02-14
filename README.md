# AyurChain

Blockchain-powered traceability platform for Ayurvedic herbs and products. Provides end-to-end, farm-to-consumer transparency, reduces adulteration, and meets AYUSH and export regulatory requirements.

## Architecture

- **Frontend (Web)**: React + TypeScript + Tailwind CSS + Redux
- **Frontend (Mobile)**: React Native (Expo)
- **Backend**: Node.js + Express + TypeScript
- **Blockchain**: Polygon PoS (Solidity + Hardhat)
- **Database**: MongoDB
- **Storage**: IPFS (Pinata/Infura)
- **Cache**: Redis

## Project Structure

```
/
├── contracts/     # Smart contracts (Hardhat)
├── backend/       # Node.js API
├── web/           # React web app
├── mobile/        # React Native app
└── infra/         # Docker & deployment configs
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB
- Docker (optional)

### 1. Smart Contracts

```bash
cd contracts
npm install
npm run build
npm test
npx hardhat run scripts/deploy.ts --network localhost
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with MongoDB URI, JWT secrets, contract addresses
npm run dev
```

### 3. Web Frontend

```bash
cd web
npm install
npm run dev
```

### 4. Mobile App

```bash
cd mobile
npm install
npm start
```

### 5. Docker (All Services)

```bash
cd infra
docker-compose up -d
```

## Environment Variables

### Backend (.env)

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `POLYGON_RPC_URL`: Polygon RPC endpoint
- `DEPLOYER_PRIVATE_KEY`: Wallet private key for blockchain transactions
- `FARMER_REGISTRY_ADDRESS`: Deployed contract address
- `BATCH_TRACKER_ADDRESS`: Deployed contract address
- `CERTIFICATION_ADDRESS`: Deployed contract address
- `OWNERSHIP_TRANSFER_ADDRESS`: Deployed contract address
- `PINATA_API_KEY`: IPFS Pinata API key (optional)
- `PINATA_SECRET_KEY`: IPFS Pinata secret key (optional)

## Features

### User Roles

- **FARMER**: Create batches, track harvest
- **PROCESSOR**: Process batches, log events
- **LAB**: Test batches, submit reports
- **CERTIFIER**: Issue certifications
- **BRAND**: Generate QR codes
- **CONSUMER**: Scan QR codes, view traceability
- **ADMIN**: Manage users, KYC

### Batch Lifecycle

1. **Harvest** (FARMER): Create batch with location, quantity, species
2. **Transfer** (FARMER → PROCESSOR): Ownership transfer
3. **Processing** (PROCESSOR): Log processing events
4. **Testing** (LAB): Submit lab reports
5. **Certification** (CERTIFIER): Issue certificates
6. **Packaging** (BRAND): Generate QR codes
7. **Consumer** (CONSUMER): Scan QR, view full traceability

### Blockchain Integration

- Batch creation events
- Ownership transfers
- Lab report hashes
- Certificate records
- Immutable audit trail

### IPFS Storage

- Lab reports
- Certificates
- Batch photos
- Metadata

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `POST /api/auth/refresh` - Refresh token

### Batches
- `POST /api/batches` - Create batch (FARMER)
- `PUT /api/batches/:id/transfer` - Transfer batch
- `GET /api/batches/:id/history` - Get history
- `GET /api/batches` - List batches

### Labs
- `POST /api/labs/reports` - Submit report (LAB)
- `GET /api/labs/queue` - Batches awaiting testing

### Certifications
- `POST /api/certifications` - Add certification (CERTIFIER)
- `GET /api/certifications/batch/:batchId` - Get certifications

### Consumer
- `GET /api/consumer/verify/:token` - Verify QR code

## Development

### Running Tests

```bash
# Contracts
cd contracts && npm test

# Backend (when tests are added)
cd backend && npm test
```

### Code Style

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting (recommended)

## Deployment

See `infra/README.md` for Docker and deployment instructions.

## License

Private - AyurChain Platform

## Support

For issues and questions, contact the development team.
