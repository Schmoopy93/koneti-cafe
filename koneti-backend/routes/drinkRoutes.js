import express from "express";
import {
  createDrink,
  getDrinks,
  getDrinkById,
  updateDrink,
  deleteDrink,
} from "../controllers/drinkController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// sada uploaduje sliku i šalje ostale podatke
router.post("/", upload.single("image"), createDrink);
router.put("/:id", upload.single("image"), updateDrink);

router.get("/", getDrinks);
router.get("/:id", getDrinkById);
router.delete("/:id", deleteDrink);

export default router;
