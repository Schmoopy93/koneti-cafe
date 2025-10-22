import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRoutes from "./routes/categoryRoutes.js";
import drinkRoutes from "./routes/drinkRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// === ES module __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middlewares ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logovanje svakog zahteva radi debug-a
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serviranje fajlova iz uploads foldera
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === API rute ===
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/drinks", drinkRoutes);

// Test ruta
app.get("/", (req, res) => res.send("Koneti backend radi ☕"));

// === MongoDB konekcija ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

// === Start server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
