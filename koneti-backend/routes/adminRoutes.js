import express from "express";
import { createAdmin, loginAdmin, getAdmins, deleteAdmin } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import { csrfProtection, getCSRFToken } from "../middleware/csrf.js";
import { sanitizeInput } from "../middleware/sanitization.js";
import { validateAdmin, validateLogin, validateId } from "../middleware/validation.js";
import { authLimiter, adminLimiter } from "../middleware/security.js";

const router = express.Router();

// Get CSRF token
router.get("/csrf-token", getCSRFToken);

// Get current logged-in admin information
router.get("/me", protectAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

// Logout - clear the authentication cookie
router.post("/logout", csrfProtection, (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/'
  });
  res.json({ message: "Logged out successfully" });
});

// Create a new admin user
router.post("/create", adminLimiter, sanitizeInput, validateAdmin, csrfProtection, createAdmin);

// Admin login - sets authentication cookie
router.post("/login", authLimiter, sanitizeInput, validateLogin, loginAdmin);

// Get all admin users (protected route)
router.get("/", protectAdmin, adminLimiter, getAdmins);

// Delete admin by ID (protected route)
router.delete("/:id", protectAdmin, adminLimiter, validateId, csrfProtection, deleteAdmin);

export default router;
