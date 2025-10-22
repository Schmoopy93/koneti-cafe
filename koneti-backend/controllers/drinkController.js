import Drink from "../models/Drink.js";
import Category from "../models/Category.js";

export const createDrink = async (req, res) => {
  try {
    // req.body => name, price, category, description
    // req.file => uploadovana slika
    const { name, price, category, description } = req.body;
    const image = req.file ? req.file.path : "";

    if (!name || !price || !category)
      return res.status(400).json({ message: "Obavezna polja nedostaju" });

    const categoryExists = await Category.findById(category);
    if (!categoryExists)
      return res.status(400).json({ message: "Kategorija ne postoji." });

    const drink = new Drink({ name, price, category, description, image });
    await drink.save();

    res.status(201).json(drink);
  } catch (err) {
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
    if (!drink) return res.status(404).json({ message: "Drink nije pronađen" });
    res.json(drink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) return res.status(404).json({ message: "Drink nije pronađen" });

    const { name, price, category, description } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(400).json({ message: "Kategorija ne postoji" });
      drink.category = category;
    }

    if (name) drink.name = name;
    if (price) drink.price = price;
    if (description) drink.description = description;

    // Ako je poslata nova slika
    if (req.file) {
      // opcionalno: obriši staru sliku sa servera
      if (drink.image) {
        const oldImagePath = path.join("uploads/drinks", drink.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      drink.image = req.file.filename; // sačuvaj ime fajla u bazi
    }

    await drink.save();
    res.json(drink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) return res.status(404).json({ message: "Drink nije pronađen" });

    await drink.remove();
    res.json({ message: "Drink obrisan" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
