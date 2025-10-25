import express from "express";
import { createReservation, getReservations, updateReservationStatus } from "../controllers/reservationController.js";
import { validateReservation } from '../middleware/simpleValidation.js';

const router = express.Router();

// Create a new reservation
router.post("/", validateReservation, createReservation);

// Get all reservations
router.get("/", getReservations);

// Update reservation status by ID
router.patch("/:id", updateReservationStatus);

export default router;
