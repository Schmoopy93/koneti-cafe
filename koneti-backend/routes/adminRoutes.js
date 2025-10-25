import express from "express";
import { createAdmin, loginAdmin, getAdmins, deleteAdmin } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get current logged-in admin information
router.get("/me", protectAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

// Logout - clear the authentication cookie
router.post("/logout", (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: "Logged out successfully" });
});

// Create a new admin user
router.post("/create", createAdmin);

// Admin login - sets authentication cookie
router.post("/login", loginAdmin);

// Get all admin users (protected route)
router.get("/", protectAdmin, getAdmins);

// Delete admin by ID (protected route)
router.delete("/:id", protectAdmin, deleteAdmin);

export default router;
