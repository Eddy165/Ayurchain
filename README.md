<div align="center">

<img src="https://img.shields.io/badge/AyurChain-Heritage%20Ledger-2d6a4f?style=for-the-badge&logo=ethereum&logoColor=white" alt="AyurChain Banner"/>

# 🌿 AyurChain — The Heritage Ledger

**Enterprise-grade, Web3-powered farm-to-consumer traceability for the Ayurvedic supply chain.**

[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat-square&logo=solidity)](https://soliditylang.org)
[![Polygon](https://img.shields.io/badge/Polygon-Mumbai%20Testnet-8247e5?style=flat-square&logo=polygon)](https://polygon.technology)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-65c2cb?style=flat-square&logo=ipfs)](https://pinata.cloud)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

> *"From dirt to dosage — every gram verified, every hand accountable."*  
> Built under **Team SmartStrike** for **Smart India Hackathon 2025 (SIH25027)**.  
> Extended for **VIVID 10.0** · SSN College of Engineering · Agriculture (Blockchain) Track

</div>

---

## 📋 Table of Contents

- [Why AyurChain?](#-why-ayurchain)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Smart Contracts](#-smart-contracts)
- [Backend API](#-backend-api)
- [Frontend](#-frontend-web--mobile)
- [Traceability Workflow](#-traceability-workflow)
- [Environment Setup](#-environment-setup)
- [Local Development — Step by Step](#-local-development--step-by-step)
- [API Reference](#-api-reference)
- [Security Model](#-security-model)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Branch Strategy & Git Workflow](#-branch-strategy--git-workflow)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)

---

## 🎯 Why AyurChain?

India's Ayurvedic market is valued at **₹1.9 lakh crore** (~$22B) and growing. The global herbal medicine market is on track to exceed **$85 billion** by 2030. Despite this scale, the industry is riddled with:

| Problem | Impact |
|---|---|
| Adulteration & counterfeiting | Consumer health risk, brand damage |
| Opaque, multi-tier supply chains | No accountability between actors |
| Fake lab reports & certificates | Regulatory fraud, AYUSH non-compliance |
| Zero consumer visibility | Trust deficit, market suppression |
| No farmer provenance record | Price exploitation, no traceability |

**AyurChain solves this** by issuing every herb batch a **tamper-proof digital passport** — a blockchain-anchored record that travels with the product from the farm to the final consumer's QR scan.

---

## 🏗️ System Architecture

AyurChain is a **hybrid on-chain / off-chain system** — designed so that nothing that needs to be trustless is left off-chain, and nothing that needs to be fast is forced on-chain.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│                                                                       │
│   React Web App (Vite)          React Native App (Expo)              │
│   ┌──────────────────┐          ┌──────────────────┐                 │
│   │  Role Dashboards  │          │  QR Scanner + UX  │               │
│   │  MetaMask Wallet  │          │  Consumer Verify  │               │
│   │  Wagmi / ethers  │          │  Push Notifs      │               │
│   └────────┬─────────┘          └─────────┬────────┘                │
└────────────┼────────────────────────────── ┼───────────────────────┘
             │  REST + JWT                   │
┌────────────▼───────────────────────────────▼───────────────────────┐
│                         API LAYER (Node.js / Express / TypeScript)   │
│                                                                       │
│   Auth (JWT + RBAC)   │   Batch APIs   │   QR Generator             │
│   IPFS Gateway        │   Lab APIs     │   Webhook Handler           │
│   Blockchain Bridge   │   Cert APIs    │   Rate Limiter / Redis      │
│                                                                       │
│   MongoDB Atlas ────────────────────────────── Redis (Sessions)     │
└─────────────────────────┬───────────────────────────────────────────┘
                          │  ethers.js v6
┌─────────────────────────▼───────────────────────────────────────────┐
│                     BLOCKCHAIN LAYER (Polygon PoS)                   │
│                                                                       │
│   FarmerRegistry.sol   │   BatchTracker.sol   │   Certification.sol  │
│   OwnershipTransfer.sol                                               │
│                                                                       │
│   OpenZeppelin Contracts   │   Hardhat   │   Mumbai Testnet          │
└─────────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────────┐
│                     STORAGE LAYER                                     │
│                                                                       │
│   IPFS via Pinata — Lab PDFs, Certificates, Batch Metadata           │
│   CID anchored on-chain (tamper-proof content addressing)            │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow Principle

- **On-chain (Polygon)**: Immutable proofs, ownership transfers, CID anchors, certification records — anything that must be independently verifiable.
- **Off-chain (MongoDB)**: User records, fast query indexes, session data, batch metadata mirrors — high-frequency reads that don't need decentralization.
- **IPFS (Pinata)**: Lab reports (PDF), certificates, and batch metadata — content-addressed, immutable, not stored on-chain to avoid gas costs.

---

## ⚙️ Tech Stack

### Blockchain
| Tool | Purpose |
|---|---|
| Solidity `^0.8.20` | Smart contract language |
| Hardhat | Compile, test, deploy, local node |
| OpenZeppelin Contracts | Security-audited base contracts (Ownable, AccessControl) |
| Polygon Mumbai Testnet | EVM-compatible L2 for low-fee deployment |
| ethers.js v6 | Backend ↔ Blockchain communication |
| MetaMask | Wallet connection for all six roles |

### Backend
| Tool | Purpose |
|---|---|
| Node.js `20+` | Runtime |
| Express `5.x` | HTTP framework |
| TypeScript (strict) | Type safety across all layers |
| Mongoose | MongoDB ODM |
| MongoDB Atlas | Operational database |
| Redis | Session store, rate limiter, job queue |
| JWT + RBAC | Auth & role-gated routes |
| Zod | Schema validation on all request bodies |
| Pinata SDK | IPFS upload / retrieve |
| QRCode.js | QR code generation linked to batch token |

### Frontend (Web)
| Tool | Purpose |
|---|---|
| React `18` + Vite | SPA framework |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Wagmi + ethers.js v6 | Wallet + contract interaction |
| Redux Toolkit | Global state management |
| shadcn/ui | Component system |
| Playfair Display + JetBrains Mono | Design system typography |

### Frontend (Mobile)
| Tool | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile |
| Expo Camera | QR scanner |
| React Navigation | Screen routing |

### Infrastructure
| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Service orchestration |
| Vercel | Web frontend deployment |
| Railway / Render | Backend deployment |
| GitHub Actions | CI/CD pipeline |

---

## 📂 Repository Structure

```
ayurchain/
│
├── contracts/                  # 🔗 Solidity Smart Contracts (Hardhat)
│   ├── contracts/
│   │   ├── FarmerRegistry.sol
│   │   ├── BatchTracker.sol
│   │   ├── OwnershipTransfer.sol
│   │   └── Certification.sol
│   ├── scripts/
│   │   └── deploy.ts           # Deployment script (Hardhat)
│   ├── test/                   # Mocha/Chai contract tests
│   ├── hardhat.config.ts
│   └── package.json
│
├── backend/                    # 🛠️ Node.js API (Express + TypeScript)
│   ├── src/
│   │   ├── config/             # DB, Redis, env config
│   │   ├── middleware/         # Auth, RBAC, error handler, rate limiter
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express route modules
│   │   ├── services/
│   │   │   ├── blockchain.ts   # ethers.js contract interactions
│   │   │   ├── ipfs.ts         # Pinata upload/fetch
│   │   │   └── qr.ts           # QR generation
│   │   ├── types/              # Shared TypeScript types
│   │   └── app.ts              # Express app entry
│   ├── .env.example
│   └── package.json
│
├── web/                        # 🌐 React Web Application (Vite)
│   ├── src/
│   │   ├── components/         # Shared UI components (shadcn + custom)
│   │   ├── pages/              # Role-specific dashboards
│   │   │   ├── Farmer/
│   │   │   ├── Processor/
│   │   │   ├── Lab/
│   │   │   ├── Certifier/
│   │   │   ├── Brand/
│   │   │   └── Consumer/
│   │   ├── store/              # Redux Toolkit slices
│   │   ├── hooks/              # Custom hooks (useWallet, useBatch)
│   │   ├── services/           # API call wrappers
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
│
├── mobile/                     # 📱 React Native (Expo)
│   ├── app/
│   ├── components/
│   └── package.json
│
├── infra/                      # 🐳 Infrastructure & Deployment
│   ├── docker-compose.yml
│   ├── nginx/
│   │   └── nginx.conf
│   └── README.md               # Deployment playbook
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Tests + lint on every PR
│       └── deploy.yml          # CD on main merge
│
├── .gitignore
├── README.md                   ← You are here
├── SETUP.md                    # First-time local setup guide
└── package.json                # Root workspace package (monorepo scripts)
```

---

## 🔗 Smart Contracts

All contracts live in `/contracts` and are deployed on **Polygon Mumbai Testnet**. Written in Solidity `^0.8.20` with OpenZeppelin base contracts for security.

### Contract Overview

| Contract | Responsibility |
|---|---|
| `FarmerRegistry.sol` | Whitelist-only farmer registration. Stores wallet address, farm location, crop types. Emits `FarmerRegistered` event. |
| `BatchTracker.sol` | Mints a digital twin for each herb batch. Logs every lifecycle stage (harvest → processing → lab → certify → brand → consumer). Stores IPFS CIDs for stage metadata. |
| `OwnershipTransfer.sol` | Secure, consent-based custody handover between supply chain actors. Prevents unauthorized transfers. Emits `CustodyTransferred`. |
| `Certification.sol` | Issues unforgeable AYUSH-compliant certificates tied to a batch ID. Stores certifier address, CID of the certificate PDF, and expiry timestamp. |

### Deployed Addresses (Mumbai Testnet)

> ⚠️ Update this table after each `npx hardhat run scripts/deploy.ts --network mumbai` run.

| Contract | Address |
|---|---|
| FarmerRegistry | `0x0000...` *(update after deploy)* |
| BatchTracker | `0x0000...` *(update after deploy)* |
| OwnershipTransfer | `0x0000...` *(update after deploy)* |
| Certification | `0x0000...` *(update after deploy)* |

### Working with Contracts

```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npm run build
# or: npx hardhat compile

# Run all contract tests
npm test
# or: npx hardhat test

# Start a local Hardhat node (for local dev)
npx hardhat node

# Deploy to local node
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Mumbai Testnet (requires DEPLOYER_PRIVATE_KEY in .env)
npx hardhat run scripts/deploy.ts --network mumbai
```

---

## 🛠️ Backend API

The backend is a **Node.js + Express + TypeScript** REST API. It acts as the trusted bridge between the React frontend and both the blockchain (via ethers.js) and IPFS (via Pinata).

### Key Design Decisions

- **RBAC via JWT**: Every request is authenticated. Routes are gated by role (`farmer`, `processor`, `lab`, `certifier`, `brand`, `consumer`).
- **Zod validation**: All incoming request bodies are parsed and validated with Zod schemas before hitting any business logic.
- **Blockchain service abstraction**: All `ethers.js` contract calls are in `src/services/blockchain.ts` — never scattered across route handlers.
- **IPFS service abstraction**: All Pinata SDK calls are in `src/services/ipfs.ts`. Returns a CID, which is then stored on-chain.
- **MongoDB as fast read mirror**: On-chain data is event-indexed into MongoDB for fast dashboard queries. The source of truth is always the blockchain.

### Running the Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env

# Start in development mode (hot reload via ts-node-dev)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Run linter
npm run lint
```

---

## 🌐 Frontend — Web & Mobile

### Web (React + Vite)

Six role-specific dashboards, each with protected routing based on the JWT role claim:

| Role | Key Features |
|---|---|
| **Farmer** | Register wallet, log harvest, mint batch, upload GPS + photo |
| **Processor** | Accept custody, update processing stage, attach batch notes |
| **Lab Tester** | Upload PDF lab report → IPFS, anchor CID on-chain |
| **Certifier** | Review lab results, issue AYUSH certificate, set expiry |
| **Brand** | Receive certified batch, generate QR code, package product |
| **Consumer** | Scan QR → full provenance timeline, trust score, certifications |

```bash
cd web
npm install
npm run dev     # Runs at http://localhost:5173
npm run build   # Production build
npm run preview # Preview production build
```

### Mobile (React Native + Expo)

```bash
cd mobile
npm install
npm start
# Scan the QR code with Expo Go on your device
```

---

## 🔄 Traceability Workflow

Every herb batch in AyurChain flows through **six verifiable stages**. Each stage is a blockchain transaction that cannot be altered or deleted.

```
  🌱 FARMER                📦 PROCESSOR              🔬 LAB TESTER
  ─────────────────         ─────────────────         ─────────────────
  Registers wallet          Accepts custody           Uploads PDF report
  Logs harvest data         Processes herbs           → IPFS (CID)
  Mints batch twin          Updates ledger stage      Anchors CID on-chain
  Sets IPFS metadata        Attaches notes            Emits LabResultLogged
         │                        │                          │
         └────────────────────────┴──────────────────────────┘
                                  │
  🏅 CERTIFIER              🏷️ BRAND                  👤 CONSUMER
  ─────────────────         ─────────────────         ─────────────────
  Reviews lab CID           Receives certified batch  Scans QR code
  Issues AYUSH cert         Generates QR → batch ID   Sees full timeline
  Sets expiry               Packages product          Trust score + certs
  Emits CertIssued          Ships to retail           Verifies authenticity
```

---

## 🔧 Environment Setup

### Prerequisites

| Dependency | Version | Install |
|---|---|---|
| Node.js | `20+` | [nodejs.org](https://nodejs.org) |
| npm | `10+` | Bundled with Node |
| MongoDB | Local or Atlas | [mongodb.com](https://mongodb.com/atlas) |
| Redis | `7+` | [redis.io](https://redis.io) or Docker |
| MetaMask | Browser extension | [metamask.io](https://metamask.io) |
| Docker (optional) | Latest | [docker.com](https://docker.com) |

### Backend `.env` Reference

Create `/backend/.env` from the template `/backend/.env.example`:

```env
# ─── Server ───────────────────────────────────────────────
NODE_ENV=development
PORT=3001

# ─── MongoDB ──────────────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ayurchain

# ─── Redis ────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── JWT ──────────────────────────────────────────────────
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── Blockchain ───────────────────────────────────────────
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
DEPLOYER_PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY

# ─── Contract Addresses (update after deploy) ──────────────
FARMER_REGISTRY_ADDRESS=0x...
BATCH_TRACKER_ADDRESS=0x...
CERTIFICATION_ADDRESS=0x...
OWNERSHIP_TRANSFER_ADDRESS=0x...

# ─── IPFS / Pinata ────────────────────────────────────────
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_GATEWAY=https://gateway.pinata.cloud

# ─── Security ─────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AES_ENCRYPTION_KEY=32_char_hex_key_here
```

> ⛔ **NEVER commit `.env` to Git.** It is already in `.gitignore`. If you accidentally push secrets, rotate them immediately.

---

## 🚀 Local Development — Step by Step

### Option A: Run Each Service Manually

```bash
# 1. Clone the repo
git clone https://github.com/Eddy165/Ayurchain.git
cd Ayurchain

# 2. Deploy contracts to local Hardhat node (Terminal 1)
cd contracts
npm install
npx hardhat node

# 3. Deploy contracts (Terminal 2)
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
# Copy the printed contract addresses into backend/.env

# 4. Start the backend (Terminal 3)
cd backend
npm install
cp .env.example .env
# Fill in .env (MongoDB URI, JWT secrets, contract addresses from step 3)
npm run dev
# API running at http://localhost:3001

# 5. Start the web frontend (Terminal 4)
cd web
npm install
npm run dev
# Running at http://localhost:5173
```

### Option B: Docker Compose (Recommended for Full Stack)

```bash
cd infra
docker-compose up -d
```

This starts: MongoDB, Redis, Backend API, Web Frontend — all networked and ready.

Check service health:
```bash
docker-compose ps
docker-compose logs backend
```

---

## 📡 API Reference

Base URL: `http://localhost:3001` (dev) · `https://api.ayurchain.app` (prod)

All protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | — | Register a new user |
| `POST` | `/api/auth/login` | ❌ | — | Login → returns JWT pair |
| `GET` | `/api/auth/me` | ✅ | Any | Get current user profile |
| `POST` | `/api/auth/refresh` | ❌ | — | Refresh access token |

### Batches
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/batches` | ✅ | Farmer | Create a new herb batch |
| `PUT` | `/api/batches/:id/transfer` | ✅ | Any actor | Transfer batch custody |
| `GET` | `/api/batches/:id/history` | ✅ | Any | Full lifecycle history |
| `GET` | `/api/batches` | ✅ | Any | List batches (filtered by role) |

### Labs
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/labs/reports` | ✅ | Lab | Upload report → IPFS → anchor CID |
| `GET` | `/api/labs/queue` | ✅ | Lab | Batches pending lab testing |

### Certifications
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/certifications` | ✅ | Certifier | Issue AYUSH certification |
| `GET` | `/api/certifications/batch/:batchId` | ✅ | Any | Get certs for a batch |

### QR & Consumer
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/qr/generate/:batchId` | ✅ | Brand | Generate print-ready QR |
| `GET` | `/api/consumer/verify/:token` | ❌ | Public | Public QR scan verification |

---

## 🔒 Security Model

| Layer | Mechanism |
|---|---|
| **Transport** | HTTPS enforced in production; Helmet.js security headers |
| **Authentication** | Short-lived JWTs (15 min) + refresh token rotation (7 days) |
| **Authorization** | RBAC middleware — each route checks `req.user.role` |
| **Input Validation** | Zod schema validation on every request body and query param |
| **Smart Contracts** | OpenZeppelin `Ownable` + `AccessControl`; no unprotected state mutations |
| **Data Encryption** | AES-256 for sensitive metadata fields before MongoDB write |
| **Rate Limiting** | Redis-backed sliding window (100 req / 15 min per IP) |
| **IPFS Integrity** | Content hash (CID) anchored on-chain — file tampering is detectable |
| **Private Keys** | Never in source code — only in `.env`, never committed |
| **Secrets Scanning** | GitHub secret scanning enabled on the repository |

---

## 🧪 Testing

### Smart Contract Tests (Hardhat + Mocha/Chai)

```bash
cd contracts
npm test
```

Tests cover: farmer registration, batch minting, custody transfers, lab report anchoring, certification issuance, and access control enforcement.

### Backend Tests (Jest + Supertest)

```bash
cd backend
npm test
npm run test:coverage   # Coverage report
```

Tests cover: all 10 API routes, auth middleware, Zod validation edge cases, and blockchain service mocks.

### Running All Tests from Root

```bash
# From repo root (if workspace scripts are configured)
npm run test:all
```

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd web
npm run build
# Push to main branch — Vercel auto-deploys via GitHub integration
```

### Backend → Railway / Render

```bash
cd backend
npm run build
# Set all env variables in Railway/Render dashboard
# Deploy via GitHub integration or:
railway up
```

### Contracts → Polygon Mumbai / Mainnet

```bash
cd contracts

# Mumbai testnet
npx hardhat run scripts/deploy.ts --network mumbai

# Mainnet (production — use with extreme caution)
npx hardhat run scripts/deploy.ts --network polygon
```

> ⚠️ After every contract deployment, update the `*_ADDRESS` variables in your backend `.env` and redeploy the backend.

---

## 🌿 Branch Strategy & Git Workflow

We follow **GitHub Flow** — simple, fast, and PR-based.

```
main              ← Production-ready, protected. No direct pushes.
├── dev           ← Integration branch. All features merge here first.
├── feature/*     ← One branch per feature or task.
├── fix/*         ← Bug fixes.
├── contracts/*   ← Smart contract work.
└── docs/*        ← Documentation updates.
```

### Naming Convention

```
feature/farmer-dashboard-ui
feature/batch-qr-generation
fix/jwt-refresh-token-bug
contracts/certification-expiry
docs/update-api-reference
```

### PR Process

1. Branch off `dev` — never off `main`.
2. Make your changes. Keep commits small and descriptive.
3. Push and open a PR → `dev`.
4. CI must pass (tests + lint) before review.
5. Get at least **1 team review** before merge.
6. Squash-merge into `dev`.
7. `dev` → `main` merges are done by the lead after QA sign-off.

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(batch): add IPFS upload for batch metadata
fix(auth): resolve JWT expiry race condition
contracts(certification): add expiry timestamp to cert struct
docs(api): update consumer verify endpoint description
chore(deps): upgrade ethers.js to v6.8.0
```

---

## 🤝 Contributing

1. Check the [Issues tab](https://github.com/Eddy165/Ayurchain/issues) for open tasks.
2. Comment on the issue to claim it before starting work.
3. Follow the branch naming convention above.
4. Open a PR with a clear description of what was changed and why.
5. Ensure your code passes all tests and the linter before requesting review.
6. Do not commit `.env` files, private keys, or build artifacts.

---

## 🗺️ Roadmap

### Phase 1 — MVP + Testnet ✅ *(Current)*
- [x] Smart contracts (Solidity + Hardhat)
- [x] Backend API (Node + Express + TypeScript)
- [x] MongoDB models + IPFS + QR services
- [x] JWT auth + RBAC middleware
- [ ] React web frontend (role dashboards)
- [ ] MetaMask wallet integration (Wagmi)
- [ ] Consumer QR scan page
- [ ] Redux state setup

### Phase 2 — Beta + Lab Integrations
- [ ] Docker deployment (all services)
- [ ] Railway + Vercel production deploy
- [ ] Polygon Mumbai testnet live
- [ ] AYUSH government portal integration (Phase 1 API)
- [ ] Admin panel + analytics dashboard
- [ ] Onboard ~20 pilot brands

### Phase 3 — Scale + AI + IoT
- [ ] AI fraud detection layer (anomaly scoring on batch data)
- [ ] IoT sensor integration (Arduino / ESP32 — temp, humidity during transit)
- [ ] React Native mobile app (Expo) — full QR scanner
- [ ] Tokenized farmer incentive mechanism
- [ ] Global compliance module (EU, US herbal regs)
- [ ] Multi-language consumer interface

---

<div align="center">

**Built with 🌿 to protect India's Ayurvedic heritage.**

*AyurChain — Where every herb has a story, and every story is on-chain.*

</div>
