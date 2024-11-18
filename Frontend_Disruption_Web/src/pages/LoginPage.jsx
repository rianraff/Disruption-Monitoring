import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/pages/LoginPage.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Ambil API Base URL dari environment variable
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Simpan token dan userId ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/homepage"); // Redirect ke halaman homepage
      } else {
        setErrorMessage("Login failed. Please check your email and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-box">
          <div className="profile-pic">
            <img src="/img/logo.png" alt="Logo" className="logo" />
          </div>

          {/* Display Alert if there’s an error message */}
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username or email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          <div className="login-footer">
            <a href="/register" className="footer-link">
              Create An Account
            </a>
            <a href="/forgot-password" className="footer-link">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
