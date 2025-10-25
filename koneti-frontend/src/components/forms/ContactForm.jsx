import { useState, useEffect, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulacija slanja
    await new Promise(resolve => setTimeout(resolve, 1500));

    setFormData({ fullName: "", email: "", phone: "", message: "" });
    setFormErrors({});
    setIsSubmitting(false);

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);
  };

  return (
    <section id="contact-section" className="contact-form-section" ref={sectionRef}>
      <div className="contact-header">
        <h2 className="section-title">💬 Kontaktirajte nas</h2>
        <p className="section-subtitle">Pošaljite nam poruku ili nas pozovite direktno</p>
      </div>
      
      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">👤 Ime i prezime</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Unesite vaše ime i prezime"
              value={formData.fullName}
              onChange={handleChange}
              className={formErrors.fullName ? "input-error" : ""}
            />
            {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">📧 Email adresa</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="vas.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "input-error" : ""}
              />
              {formErrors.email && <span className="error">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">📱 Broj telefona</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+381 xx xxx xxxx"
                value={formData.phone}
                onChange={handleChange}
                className={formErrors.phone ? "input-error" : ""}
              />
              {formErrors.phone && <span className="error">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">💭 Vaša poruka</label>
            <textarea
              id="message"
              name="message"
              placeholder="Opišite kako možemo da vam pomognemo..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={formErrors.message ? "input-error" : ""}
            />
            {formErrors.message && <span className="error">{formErrors.message}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`btn-submit ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Šalje se...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Pošaljite poruku
                </>
              )}
            </button>
            
            <div className="contact-options">
              <span className="or-text">ili</span>
              <a href="tel:+38165637371" className="btn-call">
                <FontAwesomeIcon icon={faPhone} />
                Pozovite nas direktno
              </a>
            </div>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <div className="success-icon">✅</div>
            <h4>Poruka je uspešno poslata!</h4>
            <p>Odgovoriće vam u najkraćem mogućem roku.</p>
          </div>
        </div>
      )}
    </section>
  );
}
