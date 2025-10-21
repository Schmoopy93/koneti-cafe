import express from "express";
import {
  createDrink,
  getDrinks,
  getDrinkById,
  updateDrink,
  deleteDrink,
} from "../controllers/drinkController.js";

const router = express.Router();

router.post("/", createDrink);
router.get("/", getDrinks);           
router.get("/:id", getDrinkById);   
router.put("/:id", updateDrink);      
router.delete("/:id", deleteDrink);   

export default router;
