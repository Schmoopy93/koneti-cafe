import fs from "fs";
import path from "path";
import Drink from "../models/Drink.js";
import Category from "../models/Category.js";
import cloudinary from "../middleware/cloudinary.js";

export const createDrink = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let imageUrl = "";
    let cloudinaryId = "";

    if (req.file) {
      // Upload na Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "drinks",
      });
      imageUrl = result.secure_url;    // javni URL slike
      cloudinaryId = result.public_id; // interni ID za brisanje
      fs.unlinkSync(req.file.path);    // obriši privremeni fajl
    }

    // Validacija
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Obavezna polja nedostaju." });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Kategorija ne postoji." });
    }

    // Čuvanje u MongoDB
    const drink = new Drink({
      name,
      price,
      category,
      description,
      image: imageUrl,
      cloudinary_id: cloudinaryId,
    });

    await drink.save();
    res.status(201).json(drink);
  } catch (err) {
    console.error("Greška pri kreiranju pića:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getDrinks = async (req, res) => {
  try {
    const drinks = await Drink.find().populate("category", "name");
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDrinkById = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id).populate("category", "name");
    if (!drink) {
      return res.status(404).json({ message: "Piće nije pronađeno." });
    }
    res.json(drink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
      return res.status(404).json({ message: "Piće nije pronađeno." });
    }

    const { name, price, category, description } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Kategorija ne postoji." });
      }
      drink.category = category;
    }

    if (name) drink.name = name;
    if (price) drink.price = price;
    if (description) drink.description = description;

    if (req.file) {
      if (drink.image) {
        const oldImagePath = path.join("uploads/drinks", drink.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      drink.image = req.file.filename;
    }

    await drink.save();
    res.json(drink);
  } catch (err) {
    console.error("Greška pri ažuriranju pića:", err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
      return res.status(404).json({ message: "Piće nije pronađeno." });
    }

    // Obrisi sliku ako postoji
    if (drink.image) {
      const imagePath = path.join("uploads/drinks", drink.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Drink.deleteOne({ _id: drink._id });

    res.json({ message: "Piće uspešno obrisano." });
  } catch (err) {
    console.error("Greška pri brisanju pića:", err);
    res.status(500).json({ message: err.message });
  }
};
