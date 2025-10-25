import { useState, useEffect } from "react";
import "./CookieConsent.scss";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted') {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <p>
          Ovaj sajt koristi kolačiće (cookies) da bi vam pružio najbolje iskustvo.
          Nastavkom korišćenja sajta pristajete na upotrebu kolačića.
        </p>
        <button onClick={acceptCookies} className="accept-btn">
          Prihvatam
        </button>
      </div>
    </div>
  );
}
