import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Offer.scss";

export default function Offer() {
  const cardsRef = useRef([]);

  const services = [
    {
      title: "Kafić i konzumacije",
      text: "Uživajte u pažljivo odabranim napicima i toploj atmosferi.",
      img: "espresso.jpg",
      link: "/menu",
      linkText: "Karta pića",
    },
    {
      title: "Biznis sastanci",
      text: "Idealno mesto za poslovne dogovore uz šoljicu vrhunske kafe.",
      img: "business-meeting.jpg",
      link: "/reservation",
      linkText: "Rezerviši termin",
    },
    {
      title: "Proslave",
      text: "Organizujte devojačke i momačke večeri ili rođendane.",
      img: "party.jpg",
      link: "/reservation",
      linkText: "Rezerviši termin",
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
    <section className="offer py-16 px-4 text-center">
      <h2 className="section-title">Naše usluge</h2>

      <div className="offer-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            ref={el => (cardsRef.current[index] = el)}
            style={{ transitionDelay: `${index * 0.2}s` }}
          >
            <img src={service.img} alt={service.title} />
            <div className="card-content">
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <Link to={service.link} className="btn-card">
                {service.linkText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
