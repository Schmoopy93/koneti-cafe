import Reservation from "../models/Reservation.js";
import { logger } from '../utils/logger.js';

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const newRes = new Reservation(req.body);
    await newRes.save();

    logger.info(`New reservation created: ${newRes._id}`);
    res.status(201).json({ message: "Reservation successfully added!" });
  } catch (err) {
    logger.error('Error creating reservation:', err);
    res.status(500).json({ error: "Error adding reservation." });
  }
};

// Get all reservations sorted by date
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    logger.error('Error fetching reservations:', err);
    res.status(500).json({ error: "Error fetching reservations." });
  }
};

// Update reservation status by ID
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    logger.info(`Reservation ${id} status updated to ${status}`);
    res.json(reservation);
  } catch (err) {
    logger.error('Error updating reservation status:', err);
    res.status(500).json({ error: "Error updating status." });
  }
};
