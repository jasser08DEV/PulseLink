import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const message = await response.text();
        if (response.ok && message === "Login Successful!") {
            alert("Success: " + message);
        } else {
            alert("Error: " + message);
        }
    } catch (error) {
        console.error("Connection failed:", error);
        alert("Could not connect to the server. Is your backend still running?");
    }
};

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h2>Patient Monitoring System</h2>
                    <p>Secure Access Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button">Sign In</button>
                    
                    <div className="form-footer">
                        <button type="button" className="signup-btn">
                            Create an account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;