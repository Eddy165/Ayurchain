import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./db/connection";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";

dotenv.config();

// Route imports
import authRoutes from "./routes/auth";
import batchRoutes from "./routes/batches";
import labRoutes from "./routes/labs";
import certificationRoutes from "./routes/certifications";
import qrRoutes from "./routes/qr";
import consumerRoutes from "./routes/consumer";
import processingRoutes from "./routes/processing";
import analyticsRoutes from "./routes/analytics";
import farmerRoutes from "./routes/farmer";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ─── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use("/api/", globalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "AyurChain API running ✅" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "AyurChain API running ✅" });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/processing", processingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/farmers", farmerRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`AyurChain backend running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  }
});

startServer();

export default app;
