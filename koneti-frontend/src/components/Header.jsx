import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMartiniGlass, 
  faCalendarCheck,
  faImages,
  faUserShield,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/login");
  };

  const token = sessionStorage.getItem("adminToken");

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/login" className="logo">
          <img src="/koneti-logo-header.png" alt="Café Koneti" className="logo-img" />
        </Link>

          <nav className={`nav-links ${isOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setIsOpen(false)} data-tooltip="Početna">
              <FontAwesomeIcon icon={faHouse} />
            </Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} data-tooltip="Karta pića">
              <FontAwesomeIcon icon={faMartiniGlass} />
            </Link>
            <Link to="/reservation" onClick={() => setIsOpen(false)} data-tooltip="Rezervacije">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)} data-tooltip="Galerija">
              <FontAwesomeIcon icon={faImages} />
            </Link>

            {token && (
              <Link to="/admin" onClick={() => setIsOpen(false)} data-tooltip="Administracija">
                <FontAwesomeIcon icon={faUserShield} /> 
              </Link>
            )}

            {token && (
              <Link to="/" onClick={handleLogout} data-tooltip="Odjava">
              <FontAwesomeIcon icon={faRightFromBracket} />
              </Link>
            )}
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>
  );
}
