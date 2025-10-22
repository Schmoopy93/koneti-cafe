import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faGlassWhiskey,
  faCocktail,
  faWineGlassAlt,
  faBeer,
  faMugHot,
  faWineBottle,
  faGlassMartiniAlt,
  faGlassCheers,
  faGlassWater,
  faBlender,
  faBottleDroplet,
  faChampagneGlasses,
  faJugDetergent,
  faIceCream,
  faLemon,
} from "@fortawesome/free-solid-svg-icons";

import "./AddCategory.scss";

const API_URL = import.meta.env.VITE_API_URL;

const iconOptions = [
  { name: "faCoffee", icon: faCoffee, label: "Kafa" },
  { name: "faMugHot", icon: faMugHot, label: "Topli napici" },
  { name: "faBeer", icon: faBeer, label: "Pivo" },
  { name: "faWineGlassAlt", icon: faWineGlassAlt, label: "Vino" },
  { name: "faWineBottle", icon: faWineBottle, label: "Vinska boca" },
  { name: "faGlassWhiskey", icon: faGlassWhiskey, label: "Viski" },
  { name: "faCocktail", icon: faCocktail, label: "Koktel" },
  { name: "faGlassMartiniAlt", icon: faGlassMartiniAlt, label: "Martini" },
  { name: "faGlassCheers", icon: faGlassCheers, label: "Šampanjac" },
  { name: "faChampagneGlasses", icon: faChampagneGlasses, label: "Proslava" },
  { name: "faGlassWater", icon: faGlassWater, label: "Voda" },
  { name: "faBottleDroplet", icon: faBottleDroplet, label: "Sok / flaširano" },
  { name: "faBlender", icon: faBlender, label: "Smoothie" },
  { name: "faJugDetergent", icon: faJugDetergent, label: "Sokovi / hladni napici" },
  { name: "faIceCream", icon: faIceCream, label: "Milkšejk / desert" },
  { name: "faLemon", icon: faLemon, label: "Limunada" },
];

export default function AddCategory({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIconSelect = (iconName) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Kategorija uspešno dodata!");
        setFormData({ name: "", icon: "" });
        onClose?.();
      } else {
        alert("Greška pri dodavanju kategorije");
      }
    } catch (err) {
      console.error(err);
      alert("Greška na serveru");
    }
  };

  return (
    <div className="add-category-form">
      <h3>Dodaj novu kategoriju</h3>
      <form onSubmit={handleSubmit}>
        <label>Naziv kategorije:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Izaberi ikonicu:</label>
        <div className="icon-picker">
          {iconOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              title={option.label}
              className={`icon-btn ${
                formData.icon === option.name ? "selected" : ""
              }`}
              onClick={() => handleIconSelect(option.name)}
            >
              <FontAwesomeIcon icon={option.icon} />
            </button>
          ))}
        </div>

        <button type="submit" className="gradient-btn">
          Sačuvaj
        </button>
      </form>
    </div>
  );
}
