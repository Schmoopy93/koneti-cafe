"use client";

import React, { useState, useEffect } from "react";
import MenuManagement from "@/components/menu/MenuManagement";
import AddCategory from "@/components/forms/AddCategory";
import AddDrink from "@/components/forms/AddDrink";
import Modal from "../ui/Modal";
import { Drink } from "@/app/types/drink";
import { Category } from "@/app/types/category";

interface MenuManagementPageProps {
  drinks: Drink[];
  categories: Category[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  drinks: initialDrinks,
  categories: initialCategories,
}) => {
  const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  // 🔹 Fetch funkcije
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`, { credentials: "include" });
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchDrinks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/drinks`, { credentials: "include" });
      if (res.ok) setDrinks(await res.json());
    } catch (err) {
      console.error("Error fetching drinks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handleri
  const handleAddDrink = () => setShowAddDrink(true);
  const handleAddCategory = () => setShowAddCategory(true);

  const handleDrinkAdded = async () => {
    await fetchDrinks();
    setShowAddDrink(false);
    setEditingDrink(null);
  };

  const handleCategoryAdded = async () => {
    await fetchCategories();
    setShowAddCategory(false);
  };

  const handleEditDrink = (drink: Drink) => {
    setEditingDrink(drink);
    setShowAddDrink(true);
  };

  const handleDeleteDrink = async (drinkId: string) => {
    try {
      const res = await fetch(`${API_URL}/drinks/${drinkId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setDrinks((prev) => prev.filter((d) => d._id !== drinkId));
      }
    } catch (err) {
      console.error("Error deleting drink:", err);
    }
  };

  return (
    <div className="menu-management-page">
      <MenuManagement
        drinks={drinks}
        categories={categories}
        onAddDrink={handleAddDrink}
        onAddCategory={handleAddCategory}
        onEditDrink={handleEditDrink}
        onDeleteDrink={handleDeleteDrink}
        isLoading={isLoading}
      />

      {/* ✅ Modal za kategorije */}
      <Modal
        show={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        title="Dodaj novu kategoriju"
        emoji="🍸"
      >
        <AddCategory onClose={() => setShowAddCategory(false)} onSuccess={handleCategoryAdded} />
      </Modal>

      {/* ✅ Modal za pića */}
      <Modal
        show={showAddDrink}
        onClose={() => {
          setShowAddDrink(false);
          setEditingDrink(null);
        }}
        title={editingDrink ? "Uredi piće" : "Dodaj novo piće"}
        emoji="🍹"
      >
        <AddDrink
          onClose={() => {
            setShowAddDrink(false);
            setEditingDrink(null);
          }}
          onSuccess={handleDrinkAdded}
          editData={editingDrink || undefined}
        />
      </Modal>
    </div>
  );
};

export default MenuManagementPage;
