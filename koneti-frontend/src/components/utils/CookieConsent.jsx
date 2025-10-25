import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CookieConsent.scss";

export default function CookieConsent() {
  const { t } = useTranslation();
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
          {t('cookieConsent.message')}
        </p>
        <button onClick={acceptCookies} className="accept-btn">
          {t('cookieConsent.accept')}
        </button>
      </div>
    </div>
  );
}
