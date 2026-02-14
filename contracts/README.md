# AyurChain Smart Contracts

Smart contracts for blockchain-powered traceability platform.

## Contracts

- **FarmerRegistry.sol**: Farmer KYC and profile management
- **BatchTracker.sol**: Batch lifecycle event tracking
- **Certification.sol**: Lab and certifier approvals
- **OwnershipTransfer.sol**: Custody and logistics handovers

## Setup

```bash
npm install
```

## Compile

```bash
npm run build
```

## Test

```bash
npm test
```

## Deploy

### Local Network

```bash
npx hardhat node
# In another terminal
npx hardhat run scripts/deploy.ts --network localhost
```

### Polygon Mumbai Testnet

```bash
npx hardhat run scripts/deploy.ts --network polygonMumbai
```

### Polygon Mainnet

```bash
npx hardhat run scripts/deploy.ts --network polygon
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.
