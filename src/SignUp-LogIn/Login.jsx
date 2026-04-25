import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://10.0.0.116:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Role raw value:", JSON.stringify(data.role));
      

      const userRole = (data.role || "").toUpperCase().trim(); //

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("identifier", data.identifier);

        // Log exactly what we are checking against
        console.log("Checking Role:", userRole);

        if (userRole === "PATIENT") {
          window.location.href = "/dashboard";
        } else if (userRole === "DOCTOR") {
          window.location.href = "/doctor-dashboard";
        } else if (userRole === "NURSE") {
          window.location.href = "/nurse-dashboard"; //
        } else {
          setError(
            `Access Denied: Role "${userRole}" is not authorized for a portal.`,
          );
        }
      }
    } catch (err) {
      setError("Could not connect to the server. Is your backend running?");
    }
  };

  return (
    <div className="main-Container">
      <div className="login-container">
        <div className="header">
          <div className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polyline
                points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="nav-logo-text">PulseLink</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your clinical portal.</p>
        </div>

        <form className="login-Form" onSubmit={handleSubmit}>
          <label htmlFor="identifier">Username</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter your email or ID"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <a href="#" className="forgot-link">
            Forgot password?
          </a>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="login-Button">
            Log In
          </button>

          <p className="signup-Link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
