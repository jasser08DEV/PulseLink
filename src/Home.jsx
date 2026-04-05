import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">

      
      <nav className="nav">
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
        <ul className="nav-links">
          <li><Link to="/" className="active">Home</Link></li>
          <li><a href="#alerts">System Alert</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link to="/login" className="nav-login">Login</Link></li>
        </ul>
      </nav>

    
      <section className="hero">
        <div className="eyebrow">Unified Health-Tracking Dashboard</div>
        <h1>Precision monitoring<br />for clinical care</h1>
        <p>
          Real-time vitals, synchronized reporting, and streamlined
          communication — designed for medical teams that move at the speed of care.
        </p>
      </section>

      
      <div className="portals">
        <div className="portal-card">
          <svg className="portal-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="13" r="6" stroke="currentColor" strokeWidth="1" />
            <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <div className="portal-title">Patient Portal</div>
          <p className="portal-desc">Access your vitals, records, and care history in one place.</p>
          <span className="portal-arrow">→</span>
        </div>

        <div className="portal-card">
          <svg className="portal-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="13" r="6" stroke="currentColor" strokeWidth="1" />
            <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="28" y1="8" x2="28" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="24" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <div className="portal-title">Nurse Portal</div>
          <p className="portal-desc">Monitor assigned patients and coordinate real-time alerts.</p>
          <span className="portal-arrow">→</span>
        </div>

        <div className="portal-card">
          <svg className="portal-icon" viewBox="0 0 40 40" fill="none">
            <path d="M14 20 C14 20, 16 26, 20 26 C24 26, 26 20, 26 20"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
            <line x1="20" y1="26" x2="20" y2="32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="17" cy="32" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="23" cy="32" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="13" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          <div className="portal-title">Doctor Portal</div>
          <p className="portal-desc">Review patient data, issue orders, and consult clinical reports.</p>
          <span className="portal-arrow">→</span>
        </div>
      </div>

     
      <div className="stats">
        <div className="stat">
          <div className="stat-label">Uptime</div>
          <div className="stat-value">99.9%</div>
          <div className="stat-sub">System reliability</div>
        </div>
        <div className="stat">
          <div className="stat-label">Data sync</div>
          <div className="stat-value">&lt;2s</div>
          <div className="stat-sub">Vitals refresh rate</div>
        </div>
        <div className="stat">
          <div className="stat-label">Access</div>
          <div className="stat-value">24 / 7</div>
          <div className="stat-sub">Authorized personnel only</div>
        </div>
      </div>

    
      <footer className="footer">
        <div className="footer-notice">
          <strong>Notice</strong> — PulseLink is not a diagnostic tool and does not replace professional medical judgment.<br />
          Access restricted to authorized personnel and registered patients only.
        </div>
        <div className="footer-copy">© 2026 PulseLink</div>
      </footer>

    </div>
  );
}

export default Home;
