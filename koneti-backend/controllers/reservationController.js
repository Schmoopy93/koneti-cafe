import Reservation from "../models/Reservation.js";

// Kreiranje nove rezervacije
export const createReservation = async (req, res) => {
  try {
    const newRes = new Reservation(req.body);
    await newRes.save();

    res.status(201).json({ message: "Rezervacija uspešno dodata!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom dodavanja rezervacije." });
  }
};

// Dohvatanje svih rezervacija
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška prilikom dohvatanja rezervacija." });
  }
};
