# AyurChain — The Heritage Ledger

AyurChain is a production-grade, blockchain-powered traceability platform for the Ayurvedic herb supply chain. It ensures transparency, authenticity, and quality assurance from farm to consumer using the Polygon blockchain and IPFS.

## 🏗 Project Architecture

The repository is organized into a clean monorepo structure:

- `backend/`: Node.js, Express, and TypeScript API service with MongoDB (Mongoose).
- `contracts/`: Solidity smart contracts using Hardhat.
- `web/`: React frontend built with Vite, Tailwind CSS, and Redux Toolkit.
- `infra/`: Deployment configurations and containerization logic.
- `mobile/`: (Coming Soon) React Native / Expo mobile application for field agents.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+) & npm
- MongoDB (Local or Atlas)
- MetaMask browser extension

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Configure your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd web
npm install
cp .env.example .env # Configure VITE_API_URL
npm run dev
```

### 4. Smart Contracts
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

## 📖 Developer Documentation

Comprehensive documentation resides in the repository root:

- [**API Reference**](./API_REFERENCE.md) — Detailed endpoint specifications and payload shapes.
- [**Contracts Reference**](./CONTRACTS_REFERENCE.md) — Smart contract function signatures and events.
- [**Task Split & Roadmap**](./TASK_SPLIT.md) — Development tracks for the incoming engineering team.
- [**Setup Guide**](./SETUP.md) — Detailed environment and deployment instructions.

## 🛡 Security & Hygiene

We maintain strict coding standards:
- **TypeScript Only**: End-to-end type safety across the stack.
- **RBAC**: Role-based access control enforced at both API and Smart Contract layers.
- **Git Flow**: Use the [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md) for all contributions.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
