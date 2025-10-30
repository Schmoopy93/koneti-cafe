import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Create a new admin user
export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Plain password, Mongoose pre-save hook will hash it
    const admin = await Admin.create({ name, email, password, role: "admin" });

    return res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin login - authenticates and sets httpOnly cookie
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all admin users
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    return res.json(admins);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get current authenticated admin info
export const getMe = async (req, res) => {
  res.json({ admin: req.admin });
};

// Logout - clears the authentication cookie
export const logout = (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out successfully" });
};

// Delete admin by ID
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await Admin.findByIdAndDelete(id);

    return res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
