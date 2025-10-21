import Drink from "../models/Drink.js";
import Category from "../models/Category.js";

export const createDrink = async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Kategorija ne postoji." });
    }

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

    const { name, price, category, description, image } = req.body;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(400).json({ message: "Kategorija ne postoji" });
      drink.category = category;
    }

    if (name) drink.name = name;
    if (price) drink.price = price;
    if (description) drink.description = description;
    if (image) drink.image = image;

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
