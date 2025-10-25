import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Cropper from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";
import getCroppedImg from "../utils/cropImage";
import "./AddDrink.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddDrink({ onClose, onSuccess, editData }) {
  const { t } = useTranslation();
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

  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
      
    // Populate form if editing
    if (editData) {
      setFormData({
        name: editData.name || "",
        price: editData.price || "",
        category: editData.category?._id || "",
        description: editData.description || "",
        image: null, // Keep null for file input
      });
      if (editData.image) {
        setImagePreview(editData.image);
      }
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: file });
      setImagePreview(url);
      setShowCropper(true);
      if (errors.image) setErrors({ ...errors, image: "" });
    }
  };

  const onCropComplete = (croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const saveCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(imagePreview, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], formData.image.name, {
        type: "image/jpeg",
      });
      setFormData({ ...formData, image: croppedFile });
      setImagePreview(URL.createObjectURL(croppedFile));
      setShowCropper(false);
      toast.success("Crop je sačuvan!");
    } catch (err) {
      console.error(err);
      toast.error("Greška prilikom cropovanja slike");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('admin.addDrink.errors.name');
    if (!formData.price.trim()) newErrors.price = t('admin.addDrink.errors.price');
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = t('admin.addDrink.errors.priceInvalid');
    if (!formData.category) newErrors.category = t('admin.addDrink.errors.category');
    if (formData.description.length > 250)
      newErrors.description = t('admin.addDrink.errors.description');
    if (!editData && !formData.image) newErrors.image = t('admin.addDrink.errors.image');
    else if (formData.image && !["image/jpeg", "image/png"].includes(formData.image.type))
      newErrors.image = t('admin.addDrink.errors.imageFormat');
    else if (formData.image && formData.image.size > 2 * 1024 * 1024)
      newErrors.image = t('admin.addDrink.errors.imageSize');
    return newErrors;
  };

  const triggerShake = (fields) => {
    const shakeObj = {};
    fields.forEach((f) => (shakeObj[f] = true));
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
      if (formData.image) {
        payload.append("image", formData.image);
      }

      const url = editData ? `${API_URL}/drinks/${editData._id}` : `${API_URL}/drinks`;
      const method = editData ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method: method,
        body: payload,
      });

      if (res.ok) {
        toast.success(editData ? "Piće uspešno ažurirano!" : "Piće uspešno dodato!");
        setFormData({ name: "", price: "", category: "", description: "", image: null });
        setImagePreview(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess();
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
      <h2>{editData ? t('admin.addDrink.editTitle') : t('admin.addDrink.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('admin.addDrink.name')}:</label>
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
          <label>{t('admin.addDrink.price')}:</label>
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
          <label>{t('admin.addDrink.category')}:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={shakeFields.category ? "shake" : ""}
          >
            <option value="">{t('admin.addDrink.category')}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>{t('admin.addDrink.description')}:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={shakeFields.description ? "shake" : ""}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>{t('admin.addDrink.image')}:</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className={shakeFields.image ? "shake" : ""}
            ref={fileInputRef}
          />
          {errors.image && <span className="error">{errors.image}</span>}

          {imagePreview && !showCropper && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>

        {/* Cropper */}
        {showCropper && (
          <div className="cropper-container">
            <div className="cropper-wrapper">
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="cropper-controls">
              <label>Zoom:</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
              <div className="cropper-buttons">
                <button type="button" className="btn-confirm-crop" onClick={saveCroppedImage}>
                  Potvrdi crop
                </button>
                <button
                  type="button"
                  className="btn-cancel-crop"
                  onClick={() => {
                    setShowCropper(false);
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Otkaži
                </button>
              </div>
            </div>
          </div>
        )}

        <button type="submit">{t('admin.addDrink.save')}</button>
      </form>
    </div>
  );
}
