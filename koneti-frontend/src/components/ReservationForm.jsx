import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faLaptop, faChampagneGlasses, faMedal } from "@fortawesome/free-solid-svg-icons";
import "./ReservationForm.scss";
const API_URL = import.meta.env.VITE_API_URL;

export default function ReservationForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
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
  };

  const openInfo = (type, e) => {
    e.stopPropagation();

    let data = {};

    if (type === "biznis") {
      data = {
        title: "Biznis sastanci",
        description:
          "Organizujte svoje poslovne sastanke u prijatnom ambijentu. Idealno za prezentacije, timske sastanke ili poslovne ručkove.",
        details: [
          "Rezervacija sale",
          "Wi-Fi i tehnička oprema",
          "Piće po izboru",
        ],
        price: null,
        extraInfo: "Naš tim će vam pomoći u organizaciji svakog detalja.",
      };
    } else if (type === "proslave") {
      data = {
        title: "Proslave",
        description:
          "Proslave i događaji uz pažljivo odabrane menije i dekoraciju prema vašim željama.",
        details: [],
        price: null,
        extraInfo: "Mogućnost prilagođavanja menija i dekoracije po dogovoru.",
      };
    } else if (type === "silver") {
      data = {
        title: "Silver Meni",
        description:
          "Elegantni Silver meni sa predjelom, glavnim jelom i desertom.",
        details: ["Predjelo", "Glavno jelo", "Desert"],
        price: 25,
        extraInfo: "Idealno za manja okupljanja i intimnije proslave.",
      };
    } else if (type === "gold") {
      data = {
        title: "Gold Meni",
        description:
          "Luksuzni Gold meni sa pažljivo odabranim jelima i desertima.",
        details: ["Predjelo", "Glavno jelo", "Desert"],
        price: 40,
        extraInfo: "Za veće proslave i ekskluzivne događaje.",
      };
    }

    setPopupData(data);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.type) errors.type = "Odaberite tip rezervacije";
    if (formData.type === "proslave" && !formData.subType)
      errors.subType = "Odaberite meni";
    if (!formData.name) errors.name = "Unesite ime i prezime";
    if (!formData.email) errors.email = "Unesite email";
    if (!formData.phone) errors.phone = "Unesite telefon";
    if (!formData.date) errors.date = "Odaberite datum";
    if (!formData.time) errors.time = "Odaberite vreme";
    if (!formData.guests || formData.guests < 1)
      errors.guests = "Unesite broj gostiju";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Greška pri slanju rezervacije");

      const data = await response.json();
      console.log("Rezervacija uspešna:", data);

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
      });
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      alert(
        "Došlo je do greške prilikom slanja rezervacije. Pokušajte ponovo."
      );
    }
  };

  return (
    <div className="reservation-wrapper">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <label>Tip rezervacije:</label>
        <div className="type-grid">
          <div
            className={`type-card ${formData.type === "biznis" ? "selected" : ""} ${formErrors.type ? "input-error" : ""}`}
            onClick={() => handleTypeSelect("biznis")}
          >
            <FontAwesomeIcon icon={faLaptop} className="type-icon" /> Biznis sastanci
            <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("biznis", e)} />
          </div>
          <div
            className={`type-card ${formData.type === "proslave" ? "selected" : ""} ${formErrors.type ? "input-error" : ""}`}
            onClick={() => handleTypeSelect("proslave")}
          >
            <FontAwesomeIcon icon={faChampagneGlasses} className="type-icon" /> Proslave
            <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("proslave", e)} />
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
              placeholder="Ime i prezime"
              className={formErrors.name ? "input-error" : ""}
            />
            {formErrors.name && <span className="error">{formErrors.name}</span>}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={formErrors.email ? "input-error" : ""}
            />
            {formErrors.email && <span className="error">{formErrors.email}</span>}

            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefon"
              className={formErrors.phone ? "input-error" : ""}
            />
            {formErrors.phone && <span className="error">{formErrors.phone}</span>}

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={formErrors.date ? "input-error" : ""}
            />
            {formErrors.date && <span className="error">{formErrors.date}</span>}

            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className={formErrors.time ? "input-error" : ""}
            />
            {formErrors.time && <span className="error">{formErrors.time}</span>}

            <input
              name="guests"
              type="number"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              className={formErrors.guests ? "input-error" : ""}
            />
            {formErrors.guests && <span className="error">{formErrors.guests}</span>}

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Poruka"
            />
          </div>
        )}

        {/* Proslave forma */}
        {formData.type === "proslave" && (
          <>
            <label>Meni:</label>
            <div className="subtype-grid">
              <div
                className={`subtype-card ${formData.subType === "silver" ? "selected" : ""} ${formErrors.subType ? "input-error" : ""}`}
                onClick={() => handleSubTypeSelect("silver")}
              >
                <FontAwesomeIcon icon={faMedal} className="type-icon silver" /> Silver Meni
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("silver", e)} />
              </div>
              <div
                className={`subtype-card ${formData.subType === "gold" ? "selected" : ""} ${formErrors.subType ? "input-error" : ""}`}
                onClick={() => handleSubTypeSelect("gold")}
              >
                <FontAwesomeIcon icon={faMedal} className="type-icon gold" /> Gold Meni
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={(e) => openInfo("gold", e)} />
              </div>
            </div>
            {formErrors.subType && <span className="error">{formErrors.subType}</span>}

            {showEventForm && (
              <div className="event-form">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ime i prezime"
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && <span className="error">{formErrors.name}</span>}

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={formErrors.email ? "input-error" : ""}
                />
                {formErrors.email && <span className="error">{formErrors.email}</span>}

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon"
                  className={formErrors.phone ? "input-error" : ""}
                />
                {formErrors.phone && <span className="error">{formErrors.phone}</span>}

                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={formErrors.date ? "input-error" : ""}
                />
                {formErrors.date && <span className="error">{formErrors.date}</span>}

                <input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={formErrors.time ? "input-error" : ""}
                />
                {formErrors.time && <span className="error">{formErrors.time}</span>}

                <input
                  name="guests"
                  type="number"
                  min="1"
                  value={formData.guests}
                  onChange={handleChange}
                  className={formErrors.guests ? "input-error" : ""}
                />
                {formErrors.guests && <span className="error">{formErrors.guests}</span>}

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Poruka"
                />
              </div>
            )}
          </>
        )}

        <button type="submit" className="btn-submit">
          Pošalji rezervaciju
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>
            <h2
              data-emoji={
                popupData.title === "Biznis sastanci"
                  ? "💻"
                  : popupData.title === "Proslave"
                  ? "🎉"
                  : popupData.title === "Silver Meni"
                  ? "🥈"
                  : popupData.title === "Gold Meni"
                  ? "🥇"
                  : ""
              }
            >
              {popupData.title}
            </h2>
            <p>{popupData.description}</p>
            <ul>
              {popupData.details?.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
              {popupData.price && <li>Cena po osobi: {popupData.price}€</li>}
            </ul>
            {popupData.extraInfo && <p className="extra-info">{popupData.extraInfo}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
