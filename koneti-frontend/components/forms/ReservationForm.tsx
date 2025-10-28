"use client";

import { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faLaptop,
  faChampagneGlasses,
  faMedal,
  faCrown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./ReservationForm.scss";

import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// ✅ Tipovi podataka
interface FormData {
  type: string;
  subType: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
}

interface PopupData {
  title?: string;
  description?: string;
  details?: string[];
  price?: string | null;
  extraInfo?: string | null;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type ShakeFields = Partial<
  Record<keyof FormData | "type" | "subType", boolean>
>;

// ✅ API URL iz .env fajla
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReservationForm() {
  const router = useRouter();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
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

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});
  const [shakeFields, setShakeFields] = useState<ShakeFields>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const triggerShake = (fields: string[]) => {
    const shakeObj: ShakeFields = {};
    fields.forEach((f) => (shakeObj[f as keyof ShakeFields] = true));
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  const handleTypeSelect = (type: string) => {
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

    if (type === "biznis") {
      setTimeout(() => {
        const el = document.querySelector(".form-section");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  const handleSubTypeSelect = (subType: string) => {
    setFormData((prev) => ({
      ...prev,
      subType,
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
      message: "",
    }));
    setFormErrors({});
    setShowEventForm(true);

    setTimeout(() => {
      const el = document.querySelector(".event-form");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const openInfo = (type: string, e: MouseEvent) => {
    e.stopPropagation();
    const typeToKey: Record<string, string> = {
      biznis: "business",
      koneti: "experience",
      basic: "basic",
      premium: "premium",
      vip: "vip",
    };

    const key = typeToKey[type] || type;
    const data: PopupData = {
      title: t(`home.reservation.popups.${key}.title`),
      description: t(`home.reservation.popups.${key}.description`),
      details: t(`home.reservation.popups.${key}.details`, {
        returnObjects: true,
      }) as string[],
      price: t(`home.reservation.popups.${key}.price`),
      extraInfo: t(`home.reservation.popups.${key}.extraInfo`),
    };

    setPopupData(data);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    const today = new Date();
    const selectedDate = new Date(formData.date);
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);

    if (!formData.type) errors.type = t("home.reservation.errors.type");
    if (formData.type === "koneti" && !formData.subType)
      errors.subType = t("home.reservation.errors.subType");
    if (!formData.name) errors.name = t("home.reservation.errors.name");

    if (!formData.email) {
      errors.email = t("home.reservation.errors.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("home.reservation.errors.emailInvalid");
    }

    if (!formData.phone) errors.phone = t("home.reservation.errors.phone");

    if (!formData.date) {
      errors.date = t("home.reservation.errors.date");
    } else if (selectedDate < new Date(today.setHours(0, 0, 0, 0))) {
      errors.date = t("home.reservation.errors.datePast");
    }

    if (!formData.time) {
      errors.time = t("home.reservation.errors.time");
    } else if (formData.date && selectedDateTime < new Date()) {
      errors.time = t("home.reservation.errors.timePast");
    }

    if (!formData.guests || formData.guests < 1)
      errors.guests = t("home.reservation.errors.guests");

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
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
      });
      setShowPopup(true);

      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (err) {
      console.error(err);
      alert(t("home.reservation.errors.submit"));
    }
  };

  return (
    <div className="reservation-wrapper">
      <h2
        className="section-title"
        dangerouslySetInnerHTML={{ __html: t("home.reservation.title") }}
      ></h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="intro-text">
          <p>{t("home.reservation.intro")}</p>
        </div>

        <label>{t("home.reservation.typeLabel")}</label>
        <div className="type-grid">
          {/* Biznis */}
          <div
            className={`type-card ${
              formData.type === "biznis" ? "selected" : ""
            } ${shakeFields.type ? "shake" : ""}`}
            onClick={() => handleTypeSelect("biznis")}
          >
            <FontAwesomeIcon icon={faLaptop} className="type-icon" />{" "}
            {t("home.reservation.types.business")}
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="info-icon"
              data-tooltip-id="info-tip-biznis"
              data-tooltip-content={t("home.reservation.tooltip")}
              onClick={(e) => openInfo("biznis", e)}
            />
            <Tooltip
              id="info-tip-biznis"
              place="top"
              offset={25}
              variant="dark"
              opacity={1}
              style={{
                backgroundColor: "#5a3e36",
                color: "#fff",
                fontSize: "0.8rem",
                borderRadius: "6px",
                padding: "6px 10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          {/* Koneti Experience */}
          <div
            className={`type-card ${
              formData.type === "koneti" ? "selected" : ""
            } ${shakeFields.type ? "shake" : ""}`}
            onClick={() => handleTypeSelect("koneti")}
          >
            <FontAwesomeIcon icon={faChampagneGlasses} className="type-icon" />{" "}
            {t("home.reservation.types.experience")}
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="info-icon"
              data-tooltip-id="info-tip-biznis"
              data-tooltip-content={t("home.reservation.tooltip")}
              onClick={(e) => openInfo("koneti", e)}
            />
            <Tooltip
              id="info-tip-biznis"
              place="top"
              offset={25}
              variant="dark"
              opacity={1}
              style={{
                backgroundColor: "#946051ff",
                color: "#fff",
                fontSize: "0.8rem",
                borderRadius: "6px",
                padding: "6px 10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
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
              placeholder={t("home.reservation.form.name")}
              className={shakeFields.name ? "shake" : ""}
            />
            {formErrors.name && (
              <span className="error">{formErrors.name}</span>
            )}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("home.reservation.form.email")}
              className={shakeFields.email ? "shake" : ""}
            />
            {formErrors.email && (
              <span className="error">{formErrors.email}</span>
            )}

            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("home.reservation.form.phone")}
              className={shakeFields.phone ? "shake" : ""}
            />
            {formErrors.phone && (
              <span className="error">{formErrors.phone}</span>
            )}

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={shakeFields.date ? "shake" : ""}
            />
            {formErrors.date && (
              <span className="error">{formErrors.date}</span>
            )}

            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className={shakeFields.time ? "shake" : ""}
            />
            {formErrors.time && (
              <span className="error">{formErrors.time}</span>
            )}

            <input
              name="guests"
              type="number"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              placeholder={t("home.reservation.form.guests")}
              className={shakeFields.guests ? "shake" : ""}
            />
            {formErrors.guests && (
              <span className="error">{formErrors.guests}</span>
            )}

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("home.reservation.form.message")}
              className={shakeFields.message ? "shake" : ""}
            />
            {formErrors.message && (
              <span className="error">{formErrors.message}</span>
            )}
          </div>
        )}

        {/* Koneti Experience */}
        {formData.type === "koneti" && (
          <>
            <label>{t("home.reservation.packageLabel")}</label>
            <div className="type-grid-three">
              <div
                className={`subtype-card ${
                  formData.subType === "basic" ? "selected" : ""
                } ${shakeFields.subType ? "shake" : ""}`}
                onClick={() => handleSubTypeSelect("basic")}
              >
                <FontAwesomeIcon icon={faMedal} className="type-icon silver" />{" "}
                {t("home.reservation.packages.basic")}
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="info-icon"
                  onClick={(e) => openInfo("basic", e)}
                />
              </div>
              <div
                className={`subtype-card ${
                  formData.subType === "premium" ? "selected" : ""
                } ${shakeFields.subType ? "shake" : ""}`}
                onClick={() => handleSubTypeSelect("premium")}
              >
                <FontAwesomeIcon icon={faStar} className="type-icon gold" />{" "}
                {t("home.reservation.packages.premium")}
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="info-icon"
                  onClick={(e) => openInfo("premium", e)}
                />
              </div>
              <div
                className={`subtype-card ${
                  formData.subType === "vip" ? "selected" : ""
                } ${shakeFields.subType ? "shake" : ""}`}
                onClick={() => handleSubTypeSelect("vip")}
              >
                <FontAwesomeIcon icon={faCrown} className="type-icon vip" />{" "}
                {t("home.reservation.packages.vip")}
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="info-icon"
                  onClick={(e) => openInfo("vip", e)}
                />
              </div>
            </div>
            {formErrors.subType && (
              <span className="error">{formErrors.subType}</span>
            )}

            {showEventForm && (
              <div className="event-form">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("home.reservation.form.name")}
                  className={shakeFields.name ? "shake" : ""}
                />
                {formErrors.name && (
                  <span className="error">{formErrors.name}</span>
                )}

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("home.reservation.form.email")}
                  className={shakeFields.email ? "shake" : ""}
                />
                {formErrors.email && (
                  <span className="error">{formErrors.email}</span>
                )}

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("home.reservation.form.phone")}
                  className={shakeFields.phone ? "shake" : ""}
                />
                {formErrors.phone && (
                  <span className="error">{formErrors.phone}</span>
                )}

                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={shakeFields.date ? "shake" : ""}
                />
                {formErrors.date && (
                  <span className="error">{formErrors.date}</span>
                )}

                <input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={shakeFields.time ? "shake" : ""}
                />
                {formErrors.time && (
                  <span className="error">{formErrors.time}</span>
                )}

                <input
                  name="guests"
                  type="number"
                  min="1"
                  value={formData.guests}
                  onChange={handleChange}
                  placeholder={t("home.reservation.form.guests")}
                  className={shakeFields.guests ? "shake" : ""}
                />
                {formErrors.guests && (
                  <span className="error">{formErrors.guests}</span>
                )}

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("home.reservation.form.message")}
                  className={shakeFields.message ? "shake" : ""}
                />
                {formErrors.message && (
                  <span className="error">{formErrors.message}</span>
                )}
              </div>
            )}
          </>
        )}

        {(formData.type === "biznis" ||
          (formData.type === "koneti" && formData.subType)) && (
          <button type="submit" className="btn-submit">
            {t("home.reservation.submit")}
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
            {popupData.details && (
              <ul>
                {popupData.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
            {popupData.price && <p className="price">{popupData.price}</p>}
            {popupData.extraInfo && (
              <p className="extra-info">{popupData.extraInfo}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
