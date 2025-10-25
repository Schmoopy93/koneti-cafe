import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  { name: "faCoffee", icon: faCoffee, label: { sr: "Kafa", en: "Coffee" } },
  { name: "faMugHot", icon: faMugHot, label: { sr: "Topli napici", en: "Hot drinks" } },
  { name: "faBeer", icon: faBeer, label: { sr: "Pivo", en: "Beer" } },
  { name: "faWineGlassAlt", icon: faWineGlassAlt, label: { sr: "Vino", en: "Wine" } },
  { name: "faWineBottle", icon: faWineBottle, label: { sr: "Vinska boca", en: "Wine bottle" } },
  { name: "faGlassWhiskey", icon: faGlassWhiskey, label: { sr: "Viski", en: "Whiskey" } },
  { name: "faCocktail", icon: faCocktail, label: { sr: "Koktel", en: "Cocktail" } },
  { name: "faGlassMartiniAlt", icon: faGlassMartiniAlt, label: { sr: "Martini", en: "Martini" } },
  { name: "faGlassCheers", icon: faGlassCheers, label: { sr: "Šampanjac", en: "Champagne" } },
  { name: "faChampagneGlasses", icon: faChampagneGlasses, label: { sr: "Proslava", en: "Celebration" } },
  { name: "faGlassWater", icon: faGlassWater, label: { sr: "Voda", en: "Water" } },
  { name: "faBottleDroplet", icon: faBottleDroplet, label: { sr: "Sok / flaširano", en: "Juice / bottled" } },
  { name: "faBlender", icon: faBlender, label: { sr: "Smoothie", en: "Smoothie" } },
  { name: "faJugDetergent", icon: faJugDetergent, label: { sr: "Sokovi / hladni napici", en: "Juices / cold drinks" } },
  { name: "faIceCream", icon: faIceCream, label: { sr: "Milkšejk / desert", en: "Milkshake / dessert" } },
  { name: "faLemon", icon: faLemon, label: { sr: "Limunada", en: "Lemonade" } },
];

export default function AddCategory({ onClose, onSuccess }) {
  const { t, i18n } = useTranslation();
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
    if (!formData.name.trim()) newErrors.name = t('admin.addCategory.errors.name');
    if (!formData.icon) newErrors.icon = t('admin.addCategory.errors.icon');
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
    const payload = {
      name: { sr: formData.name },
      icon: formData.icon,
      description: { sr: "" },         
    };

    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success("Kategorija uspešno dodata!");
      setFormData({ name: "", icon: "" });
      setErrors({});
      setShakeFields({});
      if (onSuccess) onSuccess(data);
    } else {
      const err = await res.json();
      toast.error(err.message || "Greška pri dodavanju kategorije");
    }
  } catch (err) {
    console.error(err);
    toast.error("Greška na serveru");
  }
};


  return (
    <div className="add-category-form">
      <Toaster position="top-right" reverseOrder={false} />
      <h3>{t('admin.addCategory.title')}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('admin.addCategory.name')}:</label>
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
          <label>{t('admin.addCategory.icon')}:</label>
          <div className={`icon-picker ${shakeFields.icon ? "shake" : ""}`}>
            {iconOptions.map((option) => {
              const lang = i18n.language?.startsWith('en') ? 'en' : 'sr';
              const labelText = option.label?.[lang] || option.label?.sr || '';
              return (
                <div key={option.name} className="icon-wrap">
                  <button
                    type="button"
                    aria-label={labelText}
                    className={`icon-btn ${formData.icon === option.name ? "selected" : ""}`}
                    onClick={() => handleIconSelect(option.name)}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                  </button>
                  <div className="icon-tooltip koneti-tooltip">{labelText}</div>
                </div>
              );
            })}
          </div>
          {errors.icon && <span className="error">{errors.icon}</span>}
        </div>

        <button type="submit" className="gradient-btn">
          {t('admin.addCategory.save')}
        </button>
      </form>
    </div>
  );
}
