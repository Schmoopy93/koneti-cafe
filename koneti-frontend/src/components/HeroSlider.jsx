import Slider from "react-slick";
import "./HeroSlider.scss";

export default function HeroSlider() {
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

  const images = [
    "/src/assets/cafe1.jpg",
    "/src/assets/cafe2.jpg",
    "/src/assets/cafe3.jpg",
  ];

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <div
              className="slide-image"
              style={{
                backgroundImage: `url(${img})`,
              }}
            />
          </div>
        ))}
      </Slider>

      <div className="hero-text">
        <h1>Café KONETI</h1>
        <p>Uživajte u aromi luksuza svakog dana</p>
      </div>
    </div>
  );
}
