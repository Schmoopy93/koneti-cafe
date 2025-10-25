import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Offer.scss";

export default function Offer() {
  const cardsRef = useRef([]);

  const services = [
    {
      title: "Vrhunska kafa",
      subtitle: "Autentični ukusi",
      text: "Uživajte u pažljivo odabranim zrnima kafe iz celog sveta. Naši baristi pripremaju svaku šolju sa ljubavlju i preciznošću.",
      features: ["Espresso", "Cappuccino", "Latte", "Americano"],
      icon: "☕",
      img: "espresso.jpg",
      link: "/menu",
      linkText: "Pogledaj meni",
      color: "#8B4513"
    },
    {
      title: "Poslovni prostor",
      subtitle: "Idealno za sastanke",
      text: "Moderno opremljen prostor sa WiFi konekcijom, idealan za poslovne sastanke, prezentacije i kreativne sesije.",
      features: ["Free WiFi", "Projektor", "Tiho okruženje", "Parking"],
      icon: "💼",
      img: "business-meeting.jpg",
      link: "/reservation",
      linkText: "Rezerviši prostor",
      color: "#2C3E50"
    },
    {
      title: "Privatne proslave",
      subtitle: "Nezaboravni događaji",
      text: "Organizujte rođendane, devojačke/momačke večeri ili bilo koju proslavu u našem toplom i prijatnom ambijentu.",
      features: ["Dekoracija", "Muzika", "Catering", "Fotografisanje"],
      icon: "🎉",
      img: "party.jpg",
      link: "/reservation",
      linkText: "Planiraj događaj",
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
          Naša ponuda
        </h2>
        <p className="section-subtitle">
          Otkrijte sve što Café Koneti ima da ponudi - od vrhunske kafe do nezaboravnih događaja
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
