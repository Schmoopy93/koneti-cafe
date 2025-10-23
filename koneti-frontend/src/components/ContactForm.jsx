import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";
import "./ContactForm.scss";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = "Unesite ime i prezime";
    if (!formData.email) {
      errors.email = "Unesite email adresu";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email adresa nije validna";
    }
    if (!formData.phone) errors.phone = "Unesite broj telefona";
    if (!formData.message) errors.message = "Unesite poruku";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({ fullName: "", email: "", phone: "", message: "" });
    setFormErrors({});

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <section id="contact-section" className="contact-form-section">
      <h2 className="section-title">Kontakt</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Ime i prezime"
          value={formData.fullName}
          onChange={handleChange}
          className={formErrors.fullName ? "input-error" : ""}
        />
        {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email adresa"
          value={formData.email}
          onChange={handleChange}
          className={formErrors.email ? "input-error" : ""}
        />
        {formErrors.email && <span className="error">{formErrors.email}</span>}

        <input
          type="tel"
          name="phone"
          placeholder="Broj telefona"
          value={formData.phone}
          onChange={handleChange}
          className={formErrors.phone ? "input-error" : ""}
        />
        {formErrors.phone && <span className="error">{formErrors.phone}</span>}

        <textarea
          name="message"
          placeholder="Poruka"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className={formErrors.message ? "input-error" : ""}
        />
        {formErrors.message && <span className="error">{formErrors.message}</span>}

        <div className="form-buttons">
          <button type="submit" className="btn-icon btn-send" aria-label="Pošalji poruku">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          <a href="tel:+3816337371" className="btn-icon btn-call" aria-label="Pozovi nas">
            <FontAwesomeIcon icon={faPhone} />
          </a>
        </div>
      </form>

      {showPopup && (
        <div className="popup-message">
          Poruka je uspešno poslata!
        </div>
      )}
    </section>
  );
}
