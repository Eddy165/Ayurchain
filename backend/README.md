# AyurChain Backend

Node.js/Express backend API for AyurChain blockchain traceability platform.

## Features

- JWT-based authentication with role-based access control
- Batch lifecycle management with blockchain integration
- Laboratory testing and certification workflows
- QR code generation and consumer verification
- IPFS integration for document storage
- MongoDB for operational data
- Polygon blockchain integration

## Setup

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- MongoDB connection string
- JWT secrets
- Polygon RPC URL and contract addresses
- IPFS/Pinata credentials (optional)

## Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Batches
- `POST /api/batches` - Create batch (FARMER)
- `PUT /api/batches/:id/transfer` - Transfer batch
- `GET /api/batches/:id/history` - Get batch history
- `GET /api/batches` - List batches

### Labs
- `POST /api/labs/reports` - Submit lab report (LAB)
- `GET /api/labs/queue` - Get batches awaiting testing
- `GET /api/labs/reports` - Get lab reports

### Certifications
- `POST /api/certifications` - Add certification (CERTIFIER)
- `GET /api/certifications/batch/:batchId` - Get certifications for batch
- `POST /api/certifications/:id/revoke` - Revoke certification

### Processing
- `POST /api/processing/events` - Add processing event (PROCESSOR)
- `GET /api/processing/events/batch/:batchId` - Get processing events

### QR & Consumer
- `POST /api/qr/batches/:id/qr` - Generate QR code (BRAND)
- `GET /api/consumer/verify/:token` - Verify QR and get traceability info

### Analytics
- `GET /api/analytics` - Get role-based KPIs

## Testing

```bash
npm test
```
