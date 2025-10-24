import express from "express";
import { loginAdmin, createAdmin, getAdmins } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/create", createAdmin);
router.get("/", getAdmins);

export default router;
