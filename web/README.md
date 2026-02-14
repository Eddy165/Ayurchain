# AyurChain Web Frontend

React + TypeScript + Tailwind CSS web application for AyurChain platform.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:3001/api
```

## Features

- Authentication (Login/Register)
- Role-based dashboards:
  - Farmer: Create batches, view batch list
  - Processor: View batches in processing
  - Lab: View batches awaiting testing
  - Certifier: View certification queue
  - Brand: Generate QR codes
- Batch history and traceability view
