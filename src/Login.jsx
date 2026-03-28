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

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const message = await response.text();

      if (response.ok && message === "Login Successful!") {
        navigate("/"); 
      } else {
        setError(message || "Invalid credentials. Please try again.");
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

          <a href="#" className="forgot-link">Forgot password?</a>

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
