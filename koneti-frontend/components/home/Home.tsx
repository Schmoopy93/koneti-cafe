import React from "react";
import ContactForm from "../forms/ContactForm";
import HeroSlider from "./HeroSlider";
import Offer from "./Offer";
import WeeklyPromotions from "./WeeklyPromotions";

const Home: React.FC = () => {
  return (
    <div className="home">
      <HeroSlider />
      <Offer />
      {/* <WeeklyPromotions /> */}
      <ContactForm />
    </div>
  );
};

export default Home;