import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faLaptop,
  faChampagneGlasses,
  faMedal,
  faCrown,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import "./ReservationForm.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReservationForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [shakeFields, setShakeFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const triggerShake = (fields) => {
    const shakeObj = {};
    fields.forEach((f) => (shakeObj[f] = true));
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  const handleTypeSelect = (type) => {
    setFormData({
      type,
      subType: "",
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
      message: "",
    });
    setFormErrors({});
    setShowEventForm(false);
    
    // Scroll to form for biznis type
    if (type === 'biznis') {
      setTimeout(() => {
        const formElement = document.querySelector('.form-section');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleSubTypeSelect = (subType) => {
    setFormData({
      ...formData,
      subType,
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
      message: "",
    });
    setFormErrors({});
    setShowEventForm(true);
    
    // Scroll to form after state update
    setTimeout(() => {
      const formElement = document.querySelector('.event-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const openInfo = (type, e) => {
    e.stopPropagation();
    const typeToKey = {
      biznis: 'business',
      koneti: 'experience',
      basic: 'basic',
      premium: 'premium',
      vip: 'vip'
    };
    const key = typeToKey[type] || type;
    const data = {
      title: t(`home.reservation.popups.${key}.title`),
      description: t(`home.reservation.popups.${key}.description`),
      details: t(`home.reservation.popups.${key}.details`, { returnObjects: true }),
      price: t(`home.reservation.popups.${key}.price`),
      extraInfo: t(`home.reservation.popups.${key}.extraInfo`),
    };

    setPopupData(data);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const selectedDate = new Date(formData.date);
    const currentTime = new Date();
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);

    if (!formData.type) errors.type = t('home.reservation.errors.type');
    if (formData.type === "koneti" && !formData.subType)
      errors.subType = t('home.reservation.errors.subType');
    if (!formData.name) errors.name = t('home.reservation.errors.name');

    if (!formData.email) {
      errors.email = t('home.reservation.errors.email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('home.reservation.errors.emailInvalid');
    }

    if (!formData.phone) errors.phone = t('home.reservation.errors.phone');

    if (!formData.date) {
      errors.date = t('home.reservation.errors.date');
    } else if (selectedDate < today.setHours(0,0,0,0)) {
      errors.date = t('home.reservation.errors.datePast');
    }

    if (!formData.time) {
      errors.time = t('home.reservation.errors.time');
    } else if (formData.date && selectedDateTime < currentTime) {
      errors.time = t('home.reservation.errors.timePast');
    }

    if (!formData.guests || formData.guests < 1)
      errors.guests = t('home.reservation.errors.guests');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerShake(Object.keys(errors));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Greška pri slanju rezervacije");

      setFormData({
        type: "",
        subType: "",
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 1,
        message: "",
      });
      setFormErrors({});
      setShowEventForm(false);

      setPopupData({
        title: "Uspešno poslato!",
        description: "Vaša rezervacija je primljena. Odgovorićemo uskoro.",
        details: [],
        price: null,
        extraInfo: null,
      });
      setShowPopup(true);
      
      // Rutiranje na home nakon 5 sekundi
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error(error);
      alert(t('home.reservation.errors.submit'));
    }
  };

  return (
    <div className="reservation-wrapper">
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('home.reservation.title') }}>
      </h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="intro-text">
          <p>{t('home.reservation.intro')}</p>
        </div>

        <label>{t('home.reservation.typeLabel')}</label>
        <div className="type-grid">
          {/* Biznis */}
          <div
            className={`type-card ${formData.type === "biznis" ? "selected" : ""} ${shakeFields.type ? "shake" : ""}`}
            onClick={() => handleTypeSelect("biznis")}
          >
            <FontAwesomeIcon icon={faLaptop} className="type-icon" /> {t('home.reservation.types.business')}
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="info-icon"
              onClick={(e) => openInfo("biznis", e)}
            />
          </div>

          {/* Koneti Experience */}
          <div
            className={`type-card ${formData.type === "koneti" ? "selected" : ""} ${shakeFields.type ? "shake" : ""}`}
            onClick={() => handleTypeSelect("koneti")}
          >
            <FontAwesomeIcon icon={faChampagneGlasses} className="type-icon" /> {t('home.reservation.types.experience')}
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="info-icon"
              onClick={(e) => openInfo("koneti", e)}
            />
          </div>
        </div>
        {formErrors.type && <span className="error">{formErrors.type}</span>}

        {/* Biznis forma */}
        {formData.type === "biznis" && (
          <div className="form-section">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('home.reservation.form.name')}
              className={shakeFields.name ? "shake" : ""}
            />
            {formErrors.name && <span className="error">{formErrors.name}</span>}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('home.reservation.form.email')}
              className={shakeFields.email ? "shake" : ""}
            />
            {formErrors.email && <span className="error">{formErrors.email}</span>}

            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('home.reservation.form.phone')}
              className={shakeFields.phone ? "shake" : ""}
            />
            {formErrors.phone && <span className="error">{formErrors.phone}</span>}

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={shakeFields.date ? "shake" : ""}
            />
            {formErrors.date && <span className="error">{formErrors.date}</span>}

            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className={shakeFields.time ? "shake" : ""}
            />
            {formErrors.time && <span className="error">{formErrors.time}</span>}

            <input
              name="guests"
              type="number"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              placeholder={t('home.reservation.form.guests')}
              className={shakeFields.guests ? "shake" : ""}
            />
            {formErrors.guests && <span className="error">{formErrors.guests}</span>}

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('home.reservation.form.message')}
              className={shakeFields.message ? "shake" : ""}
            />
            {formErrors.message && <span className="error">{formErrors.message}</span>}
          </div>
        )}

        {/* Koneti Experience */}
        {formData.type === "koneti" && (
          <>
            <label>{t('home.reservation.packageLabel')}</label>
            <div className="type-grid-three">
              <div
                className={`subtype-card ${formData.subType === "basic" ? "selected" : ""} ${shakeFields.subType ? "shake" : ""}`}
                onClick={() => handleSubTypeSelect("basic")}
              >
                <FontAwesomeIcon icon={faMedal} className="type-icon silver" /> {t('home.reservation.packages.basic')}
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("basic", e)} />
              </div>
              <div
                className={`subtype-card ${formData.subType === "premium" ? "selected" : ""} ${shakeFields.subType ? "shake" : ""}`}
                onClick={() => handleSubTypeSelect("premium")}
              >
                <FontAwesomeIcon icon={faStar} className="type-icon gold" /> {t('home.reservation.packages.premium')}
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("premium", e)} />
              </div>
              <div
                className={`subtype-card ${formData.subType === "vip" ? "selected" : ""} ${shakeFields.subType ? "shake" : ""}`}
                onClick={() => handleSubTypeSelect("vip")}
              >
                <FontAwesomeIcon icon={faCrown} className="type-icon vip" /> {t('home.reservation.packages.vip')}
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("vip", e)} />
              </div>
            </div>
            {formErrors.subType && <span className="error">{formErrors.subType}</span>}

            {showEventForm && (
              <div className="event-form">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('home.reservation.form.name')}
                  className={shakeFields.name ? "shake" : ""}
                />
                {formErrors.name && <span className="error">{formErrors.name}</span>}

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('home.reservation.form.email')}
                  className={shakeFields.email ? "shake" : ""}
                />
                {formErrors.email && <span className="error">{formErrors.email}</span>}

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('home.reservation.form.phone')}
                  className={shakeFields.phone ? "shake" : ""}
                />
                {formErrors.phone && <span className="error">{formErrors.phone}</span>}

                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={shakeFields.date ? "shake" : ""}
                />
                {formErrors.date && <span className="error">{formErrors.date}</span>}

                <input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={shakeFields.time ? "shake" : ""}
                />
                {formErrors.time && <span className="error">{formErrors.time}</span>}

                <input
                  name="guests"
                  type="number"
                  min="1"
                  value={formData.guests}
                  onChange={handleChange}
                  placeholder={t('home.reservation.form.guests')}
                  className={shakeFields.guests ? "shake" : ""}
                />
                {formErrors.guests && <span className="error">{formErrors.guests}</span>}

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('home.reservation.form.message')}
                  className={shakeFields.message ? "shake" : ""}
                />
                {formErrors.message && <span className="error">{formErrors.message}</span>}
              </div>
            )}
          </>
        )}

        {((formData.type === "biznis") || (formData.type === "koneti" && formData.subType)) && (
          <button type="submit" className="btn-submit">
            {t('home.reservation.submit')}
          </button>
        )}
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>
            <h2>{popupData.title}</h2>
            <p>{popupData.description}</p>
            {popupData.details && popupData.details.length > 0 && (
              <ul>
                {popupData.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            )}
            {popupData.price && <p className="price">{popupData.price}</p>}
            {popupData.extraInfo && <p className="extra-info">{popupData.extraInfo}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
