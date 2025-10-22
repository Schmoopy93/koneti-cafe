import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./AddDrink.scss";

export default function AddDrink() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // <--- ref za fajl input

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) setErrors({ ...errors, image: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Naziv je obavezan.";
    if (!formData.price.trim()) newErrors.price = "Cena je obavezna.";
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = "Cena mora biti pozitivan broj.";
    if (!formData.category) newErrors.category = "Morate izabrati kategoriju.";
    if (formData.description.length > 250)
      newErrors.description = "Opis ne sme biti duži od 250 karaktera.";
    if (!formData.image) newErrors.image = "Morate dodati sliku.";
    else if (!["image/jpeg", "image/png"].includes(formData.image.type))
      newErrors.image = "Dozvoljeni formati: JPG, PNG.";
    else if (formData.image.size > 2 * 1024 * 1024)
      newErrors.image = "Maksimalna veličina slike: 2MB.";
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
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("image", formData.image);

      const res = await fetch("http://localhost:5000/api/drinks", {
        method: "POST",
        body: payload,
      });

      if (res.ok) {
        toast.success("Drink uspešno dodat!");
        setFormData({ name: "", price: "", category: "", description: "", image: null });
        setImagePreview(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = ""; // reset fajl input
      } else {
        toast.error("Greška pri dodavanju konzumacije");
      }
    } catch (err) {
      console.error(err);
      toast.error("Greška na serveru");
    }
  };

  return (
    <div className="add-drink-form">
      <Toaster position="top-right" reverseOrder={false} />
      <h2>Nova konzumacija</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Naziv:</label>
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
          <label>Cena:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={shakeFields.price ? "shake" : ""}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>Kategorija:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={shakeFields.category ? "shake" : ""}
          >
            <option value="">Izaberi kategoriju</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Opis:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={shakeFields.description ? "shake" : ""}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Slika:</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className={shakeFields.image ? "shake" : ""}
            ref={fileInputRef} // <--- ref za reset
          />
          {errors.image && <span className="error">{errors.image}</span>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        </div>

        <button type="submit">Sačuvaj</button>
      </form>
    </div>
  );
}
