"use client";

import React, { useState, useEffect } from "react";
import MenuManagement from "@/components/menu/MenuManagement";
import AddCategory from "@/components/forms/AddCategory";
import Modal from "../ui/Modal";
import AddDrink from "@/components/forms/AddDrink";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

import { Drink } from "../../app/types/drink";
import { Category } from "../../app/types/category";

export default function MenuManagementPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        credentials: "include",
      });
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch drinks
  const fetchDrinks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/drinks`, { credentials: "include" });
      const data: Drink[] = await res.json();
      setDrinks(data);
    } catch (err) {
      console.error("Error fetching drinks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDrinks();
  }, []);

  // 🔹 Event handlers
  const handleAddDrink = () => {
    setShowAddDrink(true);
  };

  const handleDrinkAdded = async () => {
    await fetchDrinks();
    setShowAddDrink(false);
    setEditingDrink(null);
  };

  const handleAddCategory = () => {
    setShowAddCategory(true);
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

      <Modal
        show={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        title="Dodaj novu kategoriju"
        emoji="🍸"
      >
        <AddCategory
          onClose={() => setShowAddCategory(false)}
          onSuccess={handleCategoryAdded}
        />
      </Modal>

      {/* ✅ MODAL ZA DODAVANJE PIĆA */}
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
}
