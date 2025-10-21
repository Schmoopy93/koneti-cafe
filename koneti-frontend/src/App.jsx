import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Menu from "./components/Menu";
import "./styles/main.scss";
import ReservationForm from "./components/ReservationForm";
import ScrollToTop from "./ScrollToTop";
import StaffLogin from "./components/StaffLogin";
import AdminPage from "./components/AdminPage";
import Gallery from "./components/Gallery";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservation" element={<ReservationForm />} />
          <Route path="/login" element={<StaffLogin />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
