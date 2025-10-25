import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee, faMugHot, faBeer, faWineGlassAlt, faWineBottle,
  faGlassWhiskey, faCocktail, faGlassMartiniAlt, faGlassCheers,
  faChampagneGlasses, faGlassWater, faBottleDroplet, faBlender,
  faJugDetergent, faIceCream, faLemon
} from "@fortawesome/free-solid-svg-icons";

import toast, { Toaster } from "react-hot-toast";
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

export default function AddCategory({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [errors, setErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleIconSelect = (iconName) => {
    setFormData({ ...formData, icon: iconName });
    if (errors.icon) setErrors({ ...errors, icon: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Naziv kategorije je obavezan.";
    if (!formData.icon) newErrors.icon = "Morate izabrati ikonicu.";
    return newErrors;
  };

  const triggerShake = (fields) => {
    const shakeObj = {};
    fields.forEach(f => shakeObj[f] = true);
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerShake(Object.keys(validationErrors));
      toast.error("Proverite greške u formi!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Kategorija uspešno dodata!");
        setFormData({ name: "", icon: "" });
        setErrors({});
        setShakeFields({});
        if (onSuccess) onSuccess();
      } else {
        toast.error("Greška pri dodavanju kategorije");
      }
    } catch (err) {
      console.error(err);
      toast.error("Greška na serveru");
    }
  };

  return (
    <div className="add-category-form">
      <Toaster position="top-right" reverseOrder={false} />
      <h3>Nova kategorija</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Naziv kategorije:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={shakeFields.name ? "shake" : ""}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Izaberi ikonicu:</label>
          <div className={`icon-picker ${shakeFields.icon ? "shake" : ""}`}>
            {iconOptions.map((option) => (
              <button
                key={option.name}
                type="button"
                title={option.label}
                className={`icon-btn ${formData.icon === option.name ? "selected" : ""}`}
                onClick={() => handleIconSelect(option.name)}
              >
                <FontAwesomeIcon icon={option.icon} />
              </button>
            ))}
          </div>
          {errors.icon && <span className="error">{errors.icon}</span>}
        </div>

        <button type="submit" className="gradient-btn">
          Sačuvaj
        </button>
      </form>
    </div>
  );
}
