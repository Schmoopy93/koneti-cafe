import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Offer.scss";

export default function Offer() {
  const { t } = useTranslation();
  const cardsRef = useRef([]);

  const services = [
    {
      title: t('home.offer.services.coffee.title'),
      subtitle: t('home.offer.services.coffee.subtitle'),
      text: t('home.offer.services.coffee.description'),
      features: t('home.offer.services.coffee.features', { returnObjects: true }),
      icon: "☕",
      img: "espresso.jpg",
      link: "/menu",
      linkText: t('home.offer.services.coffee.linkText'),
      color: "#8B4513"
    },
    {
      title: t('home.offer.services.business.title'),
      subtitle: t('home.offer.services.business.subtitle'),
      text: t('home.offer.services.business.description'),
      features: t('home.offer.services.business.features', { returnObjects: true }),
      icon: "💼",
      img: "business-meeting.jpg",
      link: "/reservation",
      linkText: t('home.offer.services.business.linkText'),
      color: "#2C3E50"
    },
    {
      title: t('home.offer.services.party.title'),
      subtitle: t('home.offer.services.party.subtitle'),
      text: t('home.offer.services.party.description'),
      features: t('home.offer.services.party.features', { returnObjects: true }),
      icon: "🎉",
      img: "party.jpg",
      link: "/reservation",
      linkText: t('home.offer.services.party.linkText'),
      color: "#E74C3C"
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="offer">
      <div className="offer-header">
        <h2 className="section-title">
          <span className="title-icon">🎆</span>
          {t('home.offer.title')}
        </h2>
        <p className="section-subtitle">
          {t('home.offer.subtitle')}
        </p>
      </div>

      <div className="offer-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            ref={el => (cardsRef.current[index] = el)}
            style={{ 
              transitionDelay: `${index * 0.2}s`,
              '--accent-color': service.color
            }}
          >
            <div className="card-header">
              <img src={service.img} alt={service.title} className="card-image" />
            </div>
            
            <div className="card-content">
              <div className="card-title-section">
                <h3>{service.title}</h3>
                <span className="subtitle">{service.subtitle}</span>
              </div>
              
              <p className="description">{service.text}</p>
              
              <div className="features">
                {service.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
              
              <Link to={service.link} className="btn-card">
                <span>{service.linkText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
