import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Sparkline = ({ data, color }) => {
  const w = 120, h = 40;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const navItems = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "vitals", label: "Vitals", icon: "♥" },
  { id: "alerts", label: "Alerts", icon: "⚑" },
  { id: "appointments", label: "Appointments", icon: "◷" },
  { id: "medications", label: "Medications", icon: "◈" },
  { id: "reports", label: "Reports", icon: "◧" },
];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [pulseHistory, setPulseHistory] = useState([]);
  const [activeSection, setActiveSection] = useState("home");
  const [meds, setMeds] = useState([
    { id: 1, name: "Metoprolol", dose: "50mg", frequency: "Once daily", time: "08:00 AM", taken: true },
    { id: 2, name: "Aspirin", dose: "100mg", frequency: "Once daily", time: "08:00 AM", taken: true },
    { id: 3, name: "Atorvastatin", dose: "20mg", frequency: "Once daily", time: "09:00 PM", taken: false },
    { id: 4, name: "Ramipril", dose: "5mg", frequency: "Twice daily", time: "08:00 AM / 08:00 PM", taken: false },
  ]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://10.0.0.116:8080/api/v1/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPulse = async () => {
      const patientId = localStorage.getItem("identifier");
      if (!patientId) return;
      try {
        const response = await fetch(`http://10.0.0.116:8080/api/v1/vitals/pulse/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPulseHistory(data.slice(-15));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPulse();
    const interval = setInterval(fetchPulse, 5000);
    return () => clearInterval(interval);
  }, []);

  const latestBpm = pulseHistory.length > 0 ? pulseHistory[pulseHistory.length - 1].heartRate : "--";
  const heartGraph = pulseHistory.length > 1 ? pulseHistory.map(d => d.heartRate) : [72, 72];

 const latestData = pulseHistory.length > 0 ? pulseHistory[pulseHistory.length - 1] : null;

const vitals = [
  { label: "Heart Rate", value: latestData?.heartRate || "--", unit: "bpm", status: "normal" },
  { label: "Blood Pressure", value: latestData?.bloodPressure || "--", unit: "mmHg", status: "normal" },
  { label: "Temperature", value: latestData?.bodyTemperature || "--", unit: "°C", status: "normal" },
  { label: "SpO₂", value: latestData?.spo2 || "--", unit: "%", status: "normal" },
  { label: "Glucose", value: latestData?.glucoseLevel || "--", unit: "mg/dL", status: "caution" },
  { label: "Respiratory", value: latestData?.respiratoryRate || "--", unit: "breaths/min", status: "normal" },
];

  const toggleMed = (id) => setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  const dismissAlert = (id) => setDismissedAlerts([...dismissedAlerts, id]);

  return (
    <div className="db-root">
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="db-logo-text">PulseLink</span>
        </div>
        <nav className="db-nav">
          {navItems.map(item => (
            <button key={item.id} className={`db-nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => setActiveSection(item.id)}>
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="db-sidebar-footer">
          <div className="db-avatar">👤</div>
          <div className="db-sidebar-patient">
            <div className="db-sidebar-name">{userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</div>
            <div className="db-sidebar-id">{userData?.id || "P-XXXXXXXX"}</div>
          </div>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-topbar">
          <div>
            <div className="db-topbar-title">{navItems.find(n => n.id === activeSection)?.label}</div>
            <div className="db-topbar-sub">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <div className="db-topbar-right">
            <div className="db-status-dot"></div>
            <span className="db-status-text">All systems normal</span>
          </div>
        </header>

        <div className="db-content">
          {activeSection === "home" && (
            <div className="db-section">
              <div className="db-welcome">
                <div>
                  <div className="db-welcome-greeting">Good morning,</div>
                  <div className="db-welcome-name">{userData?.firstName}</div>
                  <div className="db-welcome-meta">Role: {userData?.role} · ID: {userData?.id}</div>
                </div>
              </div>
              <div className="db-vitals-grid">
                {vitals.map(v => (
                  <div key={v.label} className={`db-vital-card ${v.status}`}>
                    <div className="db-vital-top">
                      <span className="db-vital-label">{v.label}</span>
                      <span className={`db-vital-badge ${v.status}`}>{v.status}</span>
                    </div>
                    <div className="db-vital-value">{v.value}<span className="db-vital-unit">{v.unit}</span></div>
                    {v.label === "Heart Rate" ? <Sparkline data={heartGraph} color="#1D9E75" /> : <div style={{height: "40px"}}></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "medications" && (
            <div className="db-section">
              {meds.map(m => (
                <div key={m.id} className={`db-med-card ${m.taken ? "taken" : ""}`}>
                  <div className="db-med-info">
                    <div className="db-med-name">{m.name}</div>
                    <div className="db-med-detail">{m.dose} · {m.frequency}</div>
                  </div>
                  <button className={`db-med-toggle ${m.taken ? "taken" : ""}`} onClick={() => toggleMed(m.id)}>
                    {m.taken ? "✓ Taken" : "Mark taken"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;