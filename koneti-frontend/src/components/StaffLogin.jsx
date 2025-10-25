import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import "./StaffLogin.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to admin
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Pošalji i primi cookies
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server nije vratio JSON");
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Update auth context and navigate
      login();
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-login-section">
      <div className="staff-header">
        <h2 className="section-title">Koneti Café</h2>
        <p className="section-subtitle">Administratorski pristup</p>
      </div>
      
      <div className="staff-container">
        <form className="staff-form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Unesite email adresu"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Unesite lozinku"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`btn-submit ${loading ? 'submitting' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-content">
                  <img src="/koneti-logo.png" alt="Koneti Logo" className="logo-bounce" />
                  <span>Prijavljivanje...</span>
                </div>
              ) : (
                "Prijavite se"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
