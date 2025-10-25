import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/home/Home";
import Menu from "./components/menu/Menu";
import "./styles/main.scss";
import ReservationForm from "./components/forms/ReservationForm";
import ScrollToTop from "./ScrollToTop";
import StaffLogin from "./components/auth/StaffLogin";
import AdminPage from "./components/admin/AdminPage";
import MenuManagementPage from "./components/menu/MenuManagementPage";
import Gallery from "./components/gallery/Gallery";
import ProtectedRoute from "./ProtectedRoute";
import CookieConsent from "./components/utils/CookieConsent";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<ReservationForm />} />
            <Route path="/login" element={<StaffLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-management"
              element={
                <ProtectedRoute>
                  <MenuManagementPage />
                </ProtectedRoute>
              }
            />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </Router>
    </AuthProvider>
  );
}
