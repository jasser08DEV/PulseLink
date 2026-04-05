import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    contactNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim())  newErrors.lastName  = "Required";
    if (!formData.dob)              newErrors.dob        = "Required";
    if (!formData.gender)           newErrors.gender     = "Required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Required";
    if (!formData.address.trim())   newErrors.address    = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.email.trim())    newErrors.email    = "Required";
    if (!formData.password)        newErrors.password = "Required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.securityQuestion) newErrors.securityQuestion = "Required";
    if (!formData.securityAnswer.trim()) newErrors.securityAnswer = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const message = await response.text();
      if (response.ok) {
        alert(message);
        navigate("/login"); 
      } else {
        alert("Signup failed: " + message);
      }
    } catch (error) {
      setErrors({ submit: "Could not connect to the server. Is your backend running?" });
    }
  };

  return (
    <div className="main-container">
      <div className="signup-container">

        
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
          <h1>Secure Access to Clinical Care</h1>
          <p>Fill out the form below to create an account.</p>
        </div>

        
        <div className="step-indicator">
          <div className={`step ${currentStep === 1 ? "active" : ""} ${currentStep > 1 ? "done" : ""}`}>
            <div className="step-num">1</div>
            <p>Personal</p>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep === 2 ? "active" : ""} ${currentStep > 2 ? "done" : ""}`}>
            <div className="step-num">2</div>
            <p>Credentials</p>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep === 3 ? "active" : ""}`}>
            <div className="step-num">3</div>
            <p>Confirm</p>
          </div>
        </div>

       
        {currentStep === 1 && (
          <div className="step-content">
            <div className="section-title">Personal information</div>
            <div className="section-sub">Your basic details for account identification.</div>
            <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
              <div className="info">
                <div className="name-field">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName"
                    value={formData.firstName} onChange={handleChange} />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="lastN-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName"
                    value={formData.lastName} onChange={handleChange} />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
                <div className="dob-info">
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" name="dob"
                    value={formData.dob} onChange={handleChange} />
                  {errors.dob && <span className="field-error">{errors.dob}</span>}
                </div>
                <div className="gender-info">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender"
                    value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="field-error">{errors.gender}</span>}
                </div>
              </div>

              <label htmlFor="contactNumber">Contact Number</label>
              <input type="tel" id="contactNumber" name="contactNumber"
                value={formData.contactNumber} onChange={handleChange}
                placeholder="+1 234 567 8900" />
              {errors.contactNumber && <span className="field-error">{errors.contactNumber}</span>}

              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" rows="3"
                value={formData.address} onChange={handleChange}
                placeholder="Street, City, Postal code"></textarea>
              {errors.address && <span className="field-error">{errors.address}</span>}
            </form>
            <div className="action-buttons">
              <span></span>
              <button className="next-button" onClick={handleNext}>Continue →</button>
            </div>
          </div>
        )}

     
        {currentStep === 2 && (
          <div className="step-content">
            <div className="section-title">Account credentials</div>
            <div className="section-sub">Choose a secure email and password for your account.</div>
            <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@hospital.org" />
              {errors.email && <span className="field-error">{errors.email}</span>}

              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" />
              {errors.password && <span className="field-error">{errors.password}</span>}

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••••" />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}

              <label htmlFor="securityQuestion">Security Question</label>
              <select id="securityQuestion" name="securityQuestion"
                value={formData.securityQuestion} onChange={handleChange}>
                <option value="" disabled>Select a question</option>
                <option>What is the name of your first pet?</option>
                <option>What city were you born in?</option>
                <option>What was your childhood nickname?</option>
                <option>What is your mother's maiden name?</option>
              </select>
              {errors.securityQuestion && <span className="field-error">{errors.securityQuestion}</span>}

              <label htmlFor="securityAnswer">Security Answer</label>
              <input type="text" id="securityAnswer" name="securityAnswer"
                value={formData.securityAnswer} onChange={handleChange}
                placeholder="Your answer" />
              {errors.securityAnswer && <span className="field-error">{errors.securityAnswer}</span>}
            </form>
            <div className="action-buttons">
              <button className="back-button" onClick={handleBack}>← Back</button>
              <button className="next-button" onClick={handleNext}>Continue →</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <div className="section-title">Review &amp; Confirm</div>
            <div className="section-sub">Read and accept the terms before submitting.</div>

            <div className="terms-box">
              PulseLink is a restricted clinical platform. Access is granted solely to authorized
              medical personnel and registered patients of participating institutions. All activity
              is logged, monitored, and retained in compliance with applicable healthcare data
              regulations. Unauthorized access or misuse may result in immediate account suspension
              and legal action. Patient data is protected under end-to-end encryption and is never
              shared with third parties without explicit consent.
            </div>

            <div className="checkbox-field">
              <input type="checkbox" id="chk1" />
              <label htmlFor="chk1">
                I confirm that all information I have provided is accurate and that I am an authorized user or registered patient.
              </label>
            </div>
            <div className="checkbox-field">
              <input type="checkbox" id="chk2" />
              <label htmlFor="chk2">
                I agree to PulseLink's Terms of Access and understand that my activity is monitored.
              </label>
            </div>
            <div className="checkbox-field">
              <input type="checkbox" id="chk3" />
              <label htmlFor="chk3">
                I consent to the secure storage and processing of my personal and clinical data for healthcare coordination.
              </label>
            </div>

            {errors.submit && <p className="field-error submit-error">{errors.submit}</p>}

            <div className="action-buttons">
              <button className="back-button" onClick={handleBack}>← Back</button>
              <button className="next-button" onClick={handleSubmit}>Submit Registration</button>
            </div>
          </div>
        )}

      
        <p className="login-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;
