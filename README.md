# 🌿 AyurChain: The Heritage Ledger  

AyurChain is an enterprise-grade, Web3-enabled **farm-to-consumer traceability platform** designed for the Ayurvedic supply chain. It ensures provenance, quality, and certification lifecycle of medicinal herbs (e.g., Ashwagandha, Tulsi, Turmeric) from **dirt to dosage**.  

By unifying **Polygon Blockchain**, **IPFS**, and a modern **React/Node.js stack**, AyurChain creates a tamper-proof **Digital Archive** that safeguards India’s $15B Ayurveda legacy against counterfeiting and substandard sourcing.  

---

## 🏗️ System Architecture & Engineering Stack  

AyurChain uses a **hybrid on-chain/off-chain architecture**:  
- **On-chain (Polygon)**: Immutable proofs, ownership transfers, certification records.  
- **Off-chain (MongoDB, Redis)**: High-frequency reads, relational data, user sessions.  
- **IPFS (Pinata/Infura)**: Decentralized storage for lab reports, certificates, and batch metadata.  

### 1. Smart Contracts (Solidity / Hardhat)  
Deployed on **Polygon Mumbai Testnet**:  
- `FarmerRegistry.sol` → Whitelists verified agricultural producers.  
- `BatchTracker.sol` → Creates digital twins of herb batches; logs lifecycle stages.  
- `OwnershipTransfer.sol` → Secure custody handover between supply chain actors.  
- `Certification.sol` → Issues unforgeable compliance certificates (AYUSH-certified).  

### 2. Backend API (Node.js / Express / TypeScript / Mongoose)  
- **Authentication**: Role-Based Access Control (RBAC) via JWTs + Wallet Signatures.  
- **Database**: MongoDB for fast queries (e.g., active batches per farmer).  
- **IPFS Gateway**: Pinata integration for lab reports/certificates.  
- **QR Generator**: Links physical products to their blockchain twin.  

### 3. Frontend (Web & Mobile)  
- **Web (React / Vite / Tailwind / Wagmi)**: Dashboard + consumer scan interface.  
- **Mobile (React Native / Expo)**: QR scanning and consumer verification.  
- **Design System**: Heritage Ledger aesthetic (Playfair Display + JetBrains Mono).  

---

## 🔄 Traceability Workflow  

Herbal batches traverse **six stages**:  

1. **Farmer (Genesis)** → Registers wallet, logs harvest, mints batch twin.  
2. **Processor (Transformation)** → Transfers custody, processes herbs, updates ledger.  
3. **Lab Tester (Quality Assurance)** → Uploads PDF reports to IPFS, anchors CID on-chain.  
4. **Certifier (Compliance)** → Issues blockchain-bound AYUSH certification.  
5. **Brand (Retail Preparation)** → Packages product, generates QR linked to batch ID.  
6. **Consumer (Verification)** → Scans QR, views trust score, farm origin, certification proofs.  

---

## 📂 Project Structure  

```
/
├── contracts/     # Smart contracts (Hardhat)
├── backend/       # Node.js API
├── web/           # React web app
├── mobile/        # React Native app
└── infra/         # Docker & deployment configs
```

---

## 🚀 Quick Start  

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
# Runs on http://localhost:5173
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

---

## ⚙️ Environment Variables  

Backend `.env`:  
- `MONGO_URI` → MongoDB connection string  
- `JWT_SECRET` → JWT signing secret  
- `POLYGON_RPC_URL` → Polygon RPC endpoint  
- `DEPLOYER_PRIVATE_KEY` → Wallet private key  
- `FARMER_REGISTRY_ADDRESS` → Contract address  
- `BATCH_TRACKER_ADDRESS` → Contract address  
- `CERTIFICATION_ADDRESS` → Contract address  
- `OWNERSHIP_TRANSFER_ADDRESS` → Contract address  
- `PINATA_API_KEY` / `PINATA_SECRET_KEY` → IPFS Pinata keys  

---

## 📡 API Endpoints  

### Auth  
- `POST /api/auth/register` → Register  
- `POST /api/auth/login` → Login  
- `GET /api/auth/me` → Current user  
- `POST /api/auth/refresh` → Refresh token  

### Batches  
- `POST /api/batches` → Create batch (Farmer)  
- `PUT /api/batches/:id/transfer` → Transfer batch  
- `GET /api/batches/:id/history` → Get batch history  
- `GET /api/batches` → List batches  

### Labs  
- `POST /api/labs/reports` → Submit lab report  
- `GET /api/labs/queue` → Batches awaiting testing  

### Certifications  
- `POST /api/certifications` → Add certification  
- `GET /api/certifications/batch/:batchId` → Get certifications  

### Consumer  
- `GET /api/consumer/verify/:token` → Verify QR code  

---

## 🧪 Development  

### Running Tests  
```bash
# Contracts
cd contracts && npm test

# Backend
cd backend && npm test
```

### Code Style  
- TypeScript strict mode  
- ESLint for linting  
- Prettier for formatting  

---

## 📦 Deployment  

See `infra/README.md` for Docker and deployment instructions.  

---

## 📜 License  

Private – AyurChain Platform  

---

## 🤝 Support  

For issues and questions, contact the development team.  

