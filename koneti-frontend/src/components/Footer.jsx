import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/koneti-logo.png" alt="Koneti Logo" className="logo-img" />
        </div>

        <div className="footer-center">
          <div className="footer-contact">
            <p><FontAwesomeIcon icon="map-marker-alt" /> Bulevar oslobođenja 97, Novi Sad</p>
            <p><FontAwesomeIcon icon="phone" /> +381 63 37371</p>
            <p><FontAwesomeIcon icon="envelope" /> koneticafe@info.rs</p>
          </div>

          <div className="footer-social">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
          </div>
        </div>

        <div className="footer-hours">
          <h4>Radno vreme</h4>
          <ul>
            <li>Pon - Pet: 07:00 - 23:00</li>
            <li>Subota: 08:00 - 00:00</li>
            <li>Nedelja: 08:00 - 23:00</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Cafe Koneti. Sva prava zadržana.
      </div>
    </footer>
  );
}
