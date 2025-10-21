import express from "express";
import { createReservation, getReservations } from "../controllers/reservationController.js";

const router = express.Router();

// POST /api/reservations → kreiranje rezervacije
router.post("/", createReservation);

// GET /api/reservations → dohvatanje svih rezervacija
router.get("/", getReservations);

export default router;
