import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, notFound } from "./middleware/simpleErrorHandler.js";
import { logger } from "./utils/logger.js";

import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRoutes from "./routes/categoryRoutes.js";
import drinkRoutes from "./routes/drinkRoutes.js";

// === Init ===
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// === Middleware ===
app.set("trust proxy", 1); // 🔥 Neophodno za Render (HTTPS proxy)
app.use(helmet());
app.use(compression());

// ✅ Dozvoli samo tvoj frontend domen
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  'https://koneti-cafe-frontend.onrender.com',
  'https://koneti.netlify.app/'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// === Request logging ===
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// === Static ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// === Routes ===
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/drinks", drinkRoutes);

// === Health check ===
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Koneti backend radi ☕",
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// === Error Handling ===
app.use(notFound);
app.use(errorHandler);

// === MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("✅ MongoDB connected successfully"))
  .catch(err => logger.error("❌ MongoDB connection error:", err));

// === Start ===
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
});
