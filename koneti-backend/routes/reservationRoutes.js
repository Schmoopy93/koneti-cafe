import express from "express";
import { createReservation, getReservations, updateReservationStatus } from "../controllers/reservationController.js";
import { validateReservation, validateId } from '../middleware/validation.js';
import { sanitizeInput } from "../middleware/sanitization.js";
import { reservationLimiter, generalLimiter } from "../middleware/security.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import { csrfProtection } from "../middleware/csrf.js";

const router = express.Router();

// Create a new reservation
router.post("/", reservationLimiter, sanitizeInput, validateReservation, createReservation);

// Get all reservations (admin only)
router.get("/", protectAdmin, generalLimiter, getReservations);

// Update reservation status by ID (admin only)
router.patch("/:id", protectAdmin, generalLimiter, validateId, csrfProtection, updateReservationStatus);

export default router;
