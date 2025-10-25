import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faMapMarkerAlt, faPhone, faEnvelope, faCoffee, faHeart, faClock, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./Footer.scss";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src="/koneti-logo.png" alt="Koneti Logo" className="logo-img" />
          </div>
          <p className="footer-description">
            <FontAwesomeIcon icon={faCoffee} className="coffee-icon" />
            <span dangerouslySetInnerHTML={{ __html: t('home.footer.welcome') }} />
          </p>

        </div>
      </div>

      <div className="footer-main">
        <div className="footer-left">
          <h3><FontAwesomeIcon icon={faMapMarkerAlt} /> {t('home.footer.contact')} </h3>
          <div className="contact-grid">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <strong>{t('home.footer.address')}</strong>
                <span>Bulevar oslobođenja 97<br/>Novi Sad, Srbija</span>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>{t('home.footer.phone')}</strong>
                <span>+381 65 6337371</span>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <div>
                <strong>{t('home.footer.email')}</strong>
                <span>koneticafe@info.rs</span>
              </div>
            </div>
          </div>
          
          <div className="hours-section">
            <h4><FontAwesomeIcon icon={faClock} /> {t('home.footer.hours')}</h4>
            <div className="hours-card">
              <div className="hours-item">
                <span className="day">{t('home.footer.mondayFriday')}</span>
                <span className="time">07:00 - 23:00</span>
              </div>
              <div className="hours-item weekend">
                <span className="day">{t('home.footer.saturday')}</span>
                <span className="time">08:00 - 00:00</span>
              </div>
              <div className="hours-item weekend">
                <span className="day">{t('home.footer.sunday')}</span>
                <span className="time">08:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-right">
          <h3>{t('home.footer.followUs')} </h3>
          <div className="social-grid">
            <a href="#" className="social-card facebook">
              <FontAwesomeIcon icon={faFacebookF} />
              <div>
                <strong>Facebook</strong>
                <span>{t('home.footer.facebook')}</span>
              </div>
            </a>
            <a href="#" className="social-card instagram">
              <FontAwesomeIcon icon={faInstagram} />
              <div>
                <strong>Instagram</strong>
                <span>{t('home.footer.instagram')}</span>
              </div>
            </a>
            <a href="#" className="social-card tiktok">
              <FontAwesomeIcon icon={faTiktok} />
              <div>
                <strong>TikTok</strong>
                <span>{t('home.footer.tiktok')}</span>
              </div>
            </a>
          </div>
          
          <div className="google-map-section">
            <h4>📍 {t('home.footer.location')}</h4>
            <div className="google-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2808.8234567890123!2d19.833549315!3d45.267136179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7aa3d7b6c4a7%3A0x123456789abcdef0!2sBulevar%20oslobođenja%2097%2C%20Novi%20Sad!5e0!3m2!1ssr!2srs!4v1234567890123!5m2!1ssr!2srs"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Café Koneti lokacija"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p><span dangerouslySetInnerHTML={{ __html: t('home.footer.copyright', { year: new Date().getFullYear() }) }} /></p>
          <p className="footer-tagline">{t('home.footer.tagline')}</p>
        </div>
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </footer>
  );
}
