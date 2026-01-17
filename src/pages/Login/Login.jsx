import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// const Backend_Url= process.env.Backend_Url

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://medical-store-production.up.railway.app/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token (for protected routes later)
      localStorage.setItem("adminToken", data.token);

      alert("Login Successful");
      console.log("Admin:", data.admin);

      localStorage.setItem("adminToken", data.token);

    navigate("/dashboard");

      // navigate("/admin/dashboard"); // optional
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Admin Login</h2>
        <p className="login-subtitle">Welcome back, please login</p>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@medical.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
