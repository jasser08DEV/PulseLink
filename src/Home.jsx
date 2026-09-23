// Home.jsx[cite: 2]
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Real-Time Vitals",
      desc: "Live monitoring of heart rate, SpO₂, blood pressure, temperature, glucose, and respiratory rate — updated every 5 seconds.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      title: "Instant Alerts",
      desc: "Automated threshold-based alerts notify care teams the moment a patient's vitals cross critical boundaries.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Role-Based Access",
      desc: "Separate secure portals for patients, nurses, and doctors — each with tailored views, permissions, and clinical tools.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
      title: "Unified Dashboard",
      desc: "All patient data, medications, appointments, procedures, and clinical notes in one synchronized interface.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Secure & Compliant",
      desc: "JWT authentication, BCrypt password hashing, and role-based endpoint protection built to clinical data standards.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      title: "Cloud Database",
      desc: "Patient data persisted securely on MongoDB Atlas — accessible from anywhere, always available to your care team.",
    },
  ];

  return (
    <div className="home-root">
      {/* ── HEADER ── */}
      <header className={`home-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="home-nav-inner">
          <Link to="/" className="home-nav-logo" aria-label="PulseLink Home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polyline
                points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>PulseLink</span>
          </Link>

          <nav className={`home-nav-links ${menuOpen ? "open" : ""}`} aria-label="Main Navigation">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="home-nav-login">
              Sign In
            </Link>
          </nav>

          <button
            className={`home-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="home-hero">
          <div className="home-hero-bg">
            <div className="home-hero-grid" />
            <div className="home-hero-glow" />
          </div>

          <div className="home-hero-content animate-fade-up">
            <div className="home-hero-badge">
              <span className="home-hero-badge-dot" />
              Live patient monitoring system
            </div>

            <h1 className="home-hero-title">
              Clinical care,
              <br />
              <span className="home-hero-accent">connected in real time</span>
            </h1>

            <p className="home-hero-sub">
              PulseLink unifies patient vitals, medications, alerts, and care coordination into one secure platform — built for doctors, nurses, and patients.
            </p>

            <div className="home-hero-actions">
              <Link to="/login" className="home-btn-primary">
                Access Portal
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#features" className="home-btn-ghost">
                See how it works
              </a>
            </div>

            <div className="home-hero-stats">
              {[
                { value: "6", label: "Vital metrics tracked" },
                { value: "5s", label: "Data refresh interval" },
                { value: "3", label: "Role-based portals" },
                { value: "14+", label: "API endpoints" },
              ].map((s, i) => (
                <div key={i} className="home-hero-stat">
                  <div className="home-hero-stat-val">{s.value}</div>
                  <div className="home-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-hero-visual animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="home-vitals-card">
              <div className="home-vitals-card-header">
                <div className="home-vitals-card-title">
                  <div className="home-vitals-live-dot" />
                  Live Vitals
                </div>
                <span className="home-vitals-card-id">Patient #P624b730</span>
              </div>
              <div className="home-vitals-list">
                {[
                  { label: "Heart Rate", value: "78", unit: "bpm", color: "#ef4444", status: "normal" },
                  { label: "SpO₂", value: "98", unit: "%", color: "#06b6d4", status: "normal" },
                  { label: "Blood Press", value: "118/76", unit: "mmHg", color: "#3b82f6", status: "normal" },
                  { label: "Temperature", value: "38.6", unit: "°C", color: "#f59e0b", status: "critical" },
                  { label: "Glucose", value: "112", unit: "mg/dL", color: "#f97316", status: "normal" },
                ].map((v, i) => (
                  <div key={i} className="home-vital-row">
                    <div className="home-vital-row-left">
                      <div className="home-vital-dot" style={{ color: v.color, background: v.color }} />
                      <span className="home-vital-row-label">{v.label}</span>
                    </div>
                    <div className="home-vital-row-right">
                      <span className="home-vital-row-val" style={{ color: v.color }}>{v.value}</span>
                      <span className="home-vital-row-unit">{v.unit}</span>
                      <span className={`home-vital-status home-vital-status--${v.status}`}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="home-vitals-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Temperature out of range — nurse notified
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="home-section home-features" id="features">
          <div className="home-section-inner">
            <header className="home-section-header">
              <div className="home-section-eyebrow">Platform capabilities</div>
              <h2 className="home-section-title">Everything your care team needs</h2>
              <p className="home-section-sub">
                Built from the ground up for clinical environments where speed, accuracy, and security are non-negotiable.
              </p>
            </header>

            <div className="home-features-grid">
              {features.map((f, i) => (
                <article key={i} className="home-feature-card">
                  <div className="home-feature-icon">{f.icon}</div>
                  <h3 className="home-feature-title">{f.title}</h3>
                  <p className="home-feature-desc">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="home-section home-about" id="about">
          <div className="home-section-inner home-about-inner">
            <div className="home-about-text">
              <div className="home-section-eyebrow">About PulseLink</div>
              <h2 className="home-section-title home-section-title--light">
                Built for modern clinical environments
              </h2>
              <p className="home-about-desc">
                PulseLink was developed as part of a software engineering initiative to address the fragmented state of patient monitoring in clinical settings. The platform connects real-time device data, care team workflows, and patient records into a single synchronized system.
              </p>
              <p className="home-about-desc">
                Designed with role-based access at its core, PulseLink ensures every member of the care team sees exactly what they need — nothing more, nothing less.
              </p>
              <div className="home-about-pills">
                {["React + Vite", "Spring Boot", "MongoDB Atlas", "JWT Auth", "REST API"].map((tech, i) => (
                  <span key={i} className="home-about-pill">{tech}</span>
                ))}
              </div>
            </div>
            <div className="home-about-card">
              <div className="home-about-stat-grid">
                {[
                  { n: "35+", l: "Demo patients" },
                  { n: "3", l: "User roles" },
                  { n: "6", l: "Vital metrics" },
                  { n: "100%", l: "Cloud hosted" },
                ].map((s, i) => (
                  <div key={i} className="home-about-stat">
                    <div className="home-about-stat-num">{s.n}</div>
                    <div className="home-about-stat-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="home-section home-contact" id="contact">
          <div className="home-section-inner">
            <header className="home-section-header" style={{ marginBottom: "2rem" }}>
              <div className="home-section-eyebrow">Get access</div>
              <h2 className="home-section-title home-section-title--light">Ready to get started?</h2>
              <p className="home-section-sub home-section-sub--light">
                Create an account or sign in to access your clinical portal. All access is restricted to authorized personnel and registered patients.
              </p>
            </header>
            <div className="home-contact-actions">
              <Link to="/signup" className="home-btn-primary">
                Create Account
              </Link>
              <Link to="/login" className="home-btn-outline">
                Sign In
              </Link>
            </div>
            <div className="home-contact-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>PulseLink is not a diagnostic tool and does not replace professional medical judgment. Access is restricted to authorized personnel and registered patients only.</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <polyline
                points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>PulseLink</span>
          </div>
          <div className="home-footer-copy">
            © {new Date().getFullYear()} PulseLink. All rights reserved.
          </div>
          <nav className="home-footer-links" aria-label="Footer Navigation">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;