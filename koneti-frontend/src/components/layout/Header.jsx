import { useState, useEffect } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import "./Header.scss";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
        <div className="nav-container">
          <Link to="/login" className="logo">
            <img src="/koneti-logo-header.png" alt="Café Koneti" className="logo-img" />
          </Link>

          <nav className={`nav-links ${isOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setIsOpen(false)} data-tooltip="Početna">
              <FontAwesomeIcon icon={faHouse} /> Početna
            </Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} data-tooltip="Meni">
              <FontAwesomeIcon icon={faMartiniGlass} /> Meni
            </Link>
            <Link to="/reservation" onClick={() => setIsOpen(false)} data-tooltip="Rezervacije">
              <FontAwesomeIcon icon={faCalendarCheck} /> Rezervacije
            </Link>
            {/* <Link to="/gallery" onClick={() => setIsOpen(false)} data-tooltip="Galerija">
              <FontAwesomeIcon icon={faImages} />
            </Link> */}

            {isAuthenticated && (
              <Link to="/admin" onClick={() => setIsOpen(false)} data-tooltip="Administracija">
                <FontAwesomeIcon icon={faUserShield} /> Administracija
              </Link>
            )}
        </nav>

        <div className="header-right">
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
