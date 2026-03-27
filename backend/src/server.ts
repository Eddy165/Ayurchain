import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

// Route imports
import authRoutes from "./routes/auth";
import batchRoutes from "./routes/batch";
import labRoutes from "./routes/lab";
import consumerRoutes from "./routes/consumer";
import qrRoutes from "./routes/qr";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "AyurChain API is running", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/qr", qrRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
let server: ReturnType<typeof app.listen>;

async function bootstrap() {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`AyurChain backend running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  }
});

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
