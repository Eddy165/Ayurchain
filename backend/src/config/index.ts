import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  
  // MongoDB
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/ayurchain",
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  
  // Blockchain
  polygonRpcUrl: process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com",
  deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY || "",
  contractAddresses: {
    farmerRegistry: process.env.FARMER_REGISTRY_ADDRESS || "",
    batchTracker: process.env.BATCH_TRACKER_ADDRESS || "",
    certification: process.env.CERTIFICATION_ADDRESS || "",
    ownershipTransfer: process.env.OWNERSHIP_TRANSFER_ADDRESS || "",
  },
  
  // IPFS
  ipfsGateway: process.env.IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/",
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataSecretKey: process.env.PINATA_SECRET_KEY || "",
  
  // Redis (optional)
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  
  // Security
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
