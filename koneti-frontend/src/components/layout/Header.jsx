import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMartiniGlass,
  faCalendarCheck,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import "./Header.scss";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isLangDropdownOpen &&
        !event.target.closest(".language-dropdown") &&
        !event.target.closest(".mobile-language-switcher")
      ) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/login" className="logo">
          <img
            src="/koneti-logo-header.png"
            alt="Café Koneti"
            className="logo-img"
          />
        </Link>

        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            data-tooltip={t("header.home")}
          >
            <FontAwesomeIcon icon={faHouse} /> {t("header.home")}
          </Link>
          <Link
            to="/menu"
            onClick={() => setIsOpen(false)}
            data-tooltip={t("header.menu")}
          >
            <FontAwesomeIcon icon={faMartiniGlass} /> {t("header.menu")}
          </Link>
          <Link
            to="/reservation"
            onClick={() => setIsOpen(false)}
            data-tooltip={t("header.reservation")}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />{" "}
            {t("header.reservation")}
          </Link>

          {isAuthenticated && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              data-tooltip={t("header.admin")}
            >
              <FontAwesomeIcon icon={faUserShield} /> {t("header.admin")}
            </Link>
          )}

          {/* --- MOBILE LANGUAGE SWITCHER --- */}
          <div className="mobile-language-switcher">
            <button
              className="language-switcher-mobile"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              aria-label="Switch language"
            >
              {i18n.language === "sr" ? (
                <>
                  <ReactCountryFlag
                    countryCode="RS"
                    svg
                    style={{
                      width: "16px",
                      height: "12px",
                      marginRight: "4px",
                    }}
                  />{" "}
                  SR
                </>
              ) : (
                <>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{
                      width: "16px",
                      height: "12px",
                      marginRight: "4px",
                    }}
                  />{" "}
                  EN
                </>
              )}
              <ChevronDown size={14} />
            </button>

            {isLangDropdownOpen && (
              <div className="language-dropdown-menu-mobile">
                {i18n.language === "sr" ? (
                  <button
                    className="language-option-mobile"
                    onClick={async () => {
                      await i18n.changeLanguage("en");
                      setIsLangDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{
                        width: "16px",
                        height: "12px",
                        marginRight: "4px",
                      }}
                    />{" "}
                    EN
                  </button>
                ) : (
                  <button
                    className="language-option-mobile"
                    onClick={async () => {
                      await i18n.changeLanguage("sr");
                      setIsLangDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <ReactCountryFlag
                      countryCode="RS"
                      svg
                      style={{
                        width: "16px",
                        height: "12px",
                        marginRight: "4px",
                      }}
                    />{" "}
                    SR
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* --- DESKTOP LANGUAGE DROPDOWN --- */}
        <div className="header-right">
          <div className="language-dropdown">
            <button
              className="language-switcher"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              aria-label="Switch language"
            >
              {i18n.language === "sr" ? (
                <>
                  <ReactCountryFlag
                    countryCode="RS"
                    svg
                    style={{
                      width: "16px",
                      height: "12px",
                      marginRight: "4px",
                    }}
                  />{" "}
                  SR
                </>
              ) : (
                <>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{
                      width: "16px",
                      height: "12px",
                      marginRight: "4px",
                    }}
                  />{" "}
                  EN
                </>
              )}
              <ChevronDown size={14} />
            </button>

            {isLangDropdownOpen && (
              <div className="language-dropdown-menu">
                {i18n.language === "sr" ? (
                  <button
                    className="language-option"
                    onClick={async () => {
                      await i18n.changeLanguage("en");
                      setIsLangDropdownOpen(false);
                    }}
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{
                        width: "16px",
                        height: "12px",
                        marginRight: "4px",
                      }}
                    />{" "}
                    EN
                  </button>
                ) : (
                  <button
                    className="language-option"
                    onClick={async () => {
                      await i18n.changeLanguage("sr");
                      setIsLangDropdownOpen(false);
                    }}
                  >
                    <ReactCountryFlag
                      countryCode="RS"
                      svg
                      style={{
                        width: "16px",
                        height: "12px",
                        marginRight: "4px",
                      }}
                    />{" "}
                    SR
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
}
