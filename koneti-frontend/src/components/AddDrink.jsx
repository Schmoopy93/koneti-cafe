import { useState, useEffect } from "react";
import "./AddDrink.scss";

export default function AddDrink() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/categories") // prilagodi svoj URL
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Drink created:", data);
      alert("Drink uspešno dodat!");
      setFormData({ name: "", price: "", category: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške prilikom dodavanja.");
    }
  };

  return (
    <div className="add-drink-form">
      <h2>Dodaj novi drink</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Naziv:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Cena:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Kategorija:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Izaberi kategoriju</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Opis:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Dodaj drink</button>
      </form>
    </div>
  );
}
