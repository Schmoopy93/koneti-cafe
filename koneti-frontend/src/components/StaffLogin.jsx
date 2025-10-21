import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffLogin.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Ako token postoji, odmah redirect
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      navigate("/admin", { replace: true }); // replace: true da ne bi bio u istoriji
    }
  }, [navigate]); // dodaj navigate u dependency array

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
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server nije vratio JSON");
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Čuvanje tokena u sessionStorage
      sessionStorage.setItem("adminToken", data.token);

      // Redirect na admin stranicu
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-login-wrapper">
      <form className="staff-login-form" onSubmit={handleSubmit}>
        <h2>Koneti Staff Login</h2>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
