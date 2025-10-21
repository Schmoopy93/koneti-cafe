import ContactForm from "./ContactForm";
import HeroSlider from "./HeroSlider";
import Offer from "./Offer";
import WeeklyPromotions from "./WeeklyPromotions";

export default function Home() {
  return (
    <div className="home">
      <HeroSlider />
      <Offer />
      <WeeklyPromotions />
      <ContactForm />
    </div>
  );
}
