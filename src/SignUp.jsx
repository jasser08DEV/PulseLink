import React, { useState } from "react";
import './SignUp.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dob: '',
        gender: '',
        contactNumber: '',
        address: '',
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
            const response = await fetch("http://localhost:8080/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const message = await response.text();
                alert("Success: " + message);
            } else {
                const errorText = await response.text();
                alert("Server Error: " + errorText);
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the server. Is your backend running?");
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Patient Monitoring System</h2>
                    <p>Create Your Account</p>
                </div>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group full-width">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group full-width">
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
                        <div className="input-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="input-group full-width">
                            <label htmlFor="contactNumber">Contact Number</label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                placeholder="Enter your contact number"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group full-width">
                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                    <div className="form-footer">
                        <button type="button" className="login-btn">
                            Already have an account? Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;