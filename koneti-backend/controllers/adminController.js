import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Kreiranje admin-a
export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Sva polja su obavezna" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Korisnik sa tim email-om već postoji" });
    }

    // plain password, Mongoose pre-save hook hash-uje
    const admin = await Admin.create({ name, email, password, role: "admin" });

    return res.status(201).json({ message: "Admin kreiran", admin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login admin-a
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Pogrešan email ili lozinka" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Pogrešan email ili lozinka" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Dohvati sve admin-e
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password"); // ne vraćaj password
    return res.json(admins);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Obriši admin-a po id
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin ne postoji" });

    await admin.remove();
    return res.json({ message: "Admin obrisan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
