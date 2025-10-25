import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRoutes from "./routes/categoryRoutes.js";
import drinkRoutes from "./routes/drinkRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, notFound } from "./middleware/simpleErrorHandler.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();

// === ES module __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middlewares ===
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true // Allow credentials (cookies)
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Serviranje fajlova iz uploads foldera
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === API rute ===
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/drinks", drinkRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Koneti backend radi ☕",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// === MongoDB konekcija ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch(err => logger.error("MongoDB connection error:", err));

// === Start server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
