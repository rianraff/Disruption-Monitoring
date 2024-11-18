import React, { useState } from "react";
import { Alert } from "react-bootstrap"; // Import Alert for error handling
import { useNavigate } from "react-router-dom";
import "../css/pages/RegisterPage.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Base URL dari environment variable
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.status === 201) {
                navigate("/login");
            } else {
                setErrorMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Create an Account</h2>
                {errorMessage && (
                    <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                        {errorMessage}
                    </Alert>
                )}
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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
                    <div className="form-actions">
                        <button type="submit" className="register-button">Sign Up</button>
                    </div>
                    <p className="login-link" onClick={() => navigate("/")}>
                        Already have an account? Log In
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
