import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./HeroSlider.scss";

export default function HeroSlider() {
  const { t } = useTranslation();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  const slides = [
    {
      image: "cafe1.jpg",
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      description: t('home.hero.slide1.description')
    },
    {
      image: "cafe2.jpg",
      title: t('home.hero.slide2.title'),
      subtitle: t('home.hero.slide2.subtitle'),
      description: t('home.hero.slide2.description')
    },
    {
      image: "cafe3.jpg",
      title: t('home.hero.slide3.title'),
      subtitle: t('home.hero.slide3.subtitle'),
      description: t('home.hero.slide3.description')
    },
  ];

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <div
              className="slide-image"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content">
              <div className="slide-text">
                <span className="slide-number">0{index + 1}</span>
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                <div className="slide-actions">
                  <Link to="/menu" className="btn-primary">
                    <span>{t('home.hero.exploreMenu')}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <Link to="/reservation" className="btn-secondary">
                    <span>{t('home.hero.reserveTable')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      
      <div 
        className="hero-scroll-indicator" 
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="scroll-text">{t('home.hero.scrollDown')}</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
}
