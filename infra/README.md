# AyurChain Infrastructure

Docker and deployment configuration for AyurChain platform.

## Prerequisites

- Docker and Docker Compose installed
- Environment variables configured

## Setup

1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Configure environment variables in `backend/.env`

3. Start services:
   ```bash
   docker-compose up -d
   ```

## Services

- **MongoDB**: Database on port 27017
- **Redis**: Cache on port 6379
- **Backend**: API on port 3001
- **Web**: Frontend on port 3000

## Development

For local development without Docker:

```bash
# Start MongoDB and Redis
docker-compose up -d mongodb redis

# Run backend locally
cd backend && npm run dev

# Run web locally
cd web && npm run dev
```

## Production Deployment

1. Update environment variables
2. Build and push images to container registry
3. Deploy using docker-compose or Kubernetes
4. Configure reverse proxy (nginx/traefik) for HTTPS

## Monitoring

- Health check: `http://localhost:3001/health`
- MongoDB: Connect to `mongodb://localhost:27017/ayurchain`
- Redis: Connect to `redis://localhost:6379`
