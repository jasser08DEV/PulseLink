import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const API = "http://10.0.0.116:8080/api/v1";

// ── Authenticated fetch helper ────────────────────────────────
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// ── Greeting ──────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ── Dynamic vitals status based on live values ────────────────
// Returns "normal" | "caution" | "critical"
const getVitalStatus = (key, value) => {
  if (value === "--" || value === null || value === undefined) return "normal";
  const v = parseFloat(value);
  if (isNaN(v)) return "normal";
  switch (key) {
    case "heartRate":
      return v > 120 || v < 40 ? "critical" : v > 100 || v < 60 ? "caution" : "normal";
    case "spo2":
      return v < 90 ? "critical" : v < 95 ? "caution" : "normal";
    case "bodyTemperature":
      return v > 39.5 || v < 35 ? "critical" : v > 38.5 || v < 36 ? "caution" : "normal";
    case "glucoseLevel":
      return v > 180 || v < 50 ? "critical" : v > 140 || v < 70 ? "caution" : "normal";
    case "respiratoryRate":
      return v > 30 || v < 8 ? "critical" : v > 20 || v < 12 ? "caution" : "normal";
    case "bloodPressure": {
      // bloodPressure may be a string like "118/76" — check systolic only
      const systolic = parseFloat(String(value).split("/")[0]);
      if (isNaN(systolic)) return "normal";
      return systolic > 180 || systolic < 70 ? "critical" : systolic > 140 || systolic < 90 ? "caution" : "normal";
    }
    default:
      return "normal";
  }
};

// ── Sparkline SVG ─────────────────────────────────────────────
const Sparkline = ({ data, color, height = 52 }) => {
  const w = 200;
  const h = height;
  if (!data || data.length < 2) return <div style={{ height: h }} />;
  const nums = data.map(Number).filter((n) => !isNaN(n));
  if (nums.length < 2) return <div style={{ height: h }} />;
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const range = max - min || 1;
  const pad = 4;
  const pts = nums
    .map((v, i) => {
      const x = pad + (i / (nums.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const xN = pad + (w - pad * 2);
  const areaPath =
    `M${pad},${h} ` +
    nums
      .map((v, i) => {
        const x = pad + (i / (nums.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - min) / range) * (h - pad * 2);
        return `L${x},${y}`;
      })
      .join(" ") +
    ` L${xN},${h} Z`;

  const gradId = `grad-${color.replace("#", "")}`;
  const lastX = pad + (w - pad * 2);
  const lastY =
    pad + (1 - (nums[nums.length - 1] - min) / range) * (h - pad * 2);

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
};

// ── Status badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status}`}>
    {status === "normal" ? "Normal" : status === "caution" ? "Caution" : "Critical"}
  </span>
);

// ── Nav items ─────────────────────────────────────────────────
const NAV = [
  { id: "home",         label: "Overview",    icon: <HomeIcon /> },
  { id: "vitals",       label: "Vitals",      icon: <HeartIcon /> },
  { id: "medications",  label: "Medications", icon: <PillIcon /> },
  { id: "appointments", label: "Appointments", icon: <CalIcon /> },
  { id: "alerts",       label: "Alerts",      icon: <BellIcon /> },
  { id: "reports",      label: "Reports",     icon: <ReportIcon /> },
];

// ── Icons ─────────────────────────────────────────────────────
function HomeIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>; }
function HeartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function PillIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>; }
function CalIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function BellIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ReportIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function PulseIcon() { return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"/></svg>; }

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = () => {
  const [userData,      setUserData]      = useState(null);
  const [pulseHistory,  setPulseHistory]  = useState([]);
  const [activeSection, setActiveSection] = useState("home");
  const [meds,          setMeds]          = useState([]);
  const [appointments,  setAppointments]  = useState([]);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [medsLoading,   setMedsLoading]   = useState(false);
  const [apptLoading,   setApptLoading]   = useState(false);

  // ── 1. Auth guard + profile ───────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    (async () => {
      try {
        const res = await authFetch(`${API}/auth/me`);
        if (res.ok) setUserData(await res.json());
        else if (res.status === 401) window.location.href = "/login";
      } catch (e) { console.error("Profile fetch failed:", e); }
    })();
  }, []);

  // ── 2. Vitals — poll every 5 s ────────────────────────────────
  useEffect(() => {
    const patientId = localStorage.getItem("identifier");
    if (!patientId) return;

    const fetchVitals = async () => {
      try {
        const res = await authFetch(`${API}/vitals/pulse/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          // Keep last 20 readings for sparkline
          setPulseHistory(Array.isArray(data) ? data.slice(-20) : []);
        }
      } catch (e) { console.error("Vitals fetch failed:", e); }
    };

    fetchVitals();
    const iv = setInterval(fetchVitals, 5000);
    return () => clearInterval(iv);
  }, []);

  // ── 3. Medications (Smart Fallback API Fix) ───────────────────
  useEffect(() => {
    if (activeSection !== "medications" && activeSection !== "home") return;

    const patientId = localStorage.getItem("identifier");
    if (!patientId) return;

    const fetchMeds = async () => {
      setMedsLoading(true);
      try {
        let res = await authFetch(`${API}/medication/patient/${patientId}`);
        let data = [];

        if (res.ok) {
          data = await res.json();
        } else {
          // Fallback: If patient route fails, fetch ALL and filter securely
          res = await authFetch(`${API}/medication/all`);
          if (res.ok) {
            const allMeds = await res.json();
            data = allMeds.filter(m => JSON.stringify(m).includes(patientId));
          }
        }
        setMeds(Array.isArray(data) ? data : []);
      } catch (e) { console.error("Medication fetch failed:", e); } 
      finally { setMedsLoading(false); }
    };

    fetchMeds();
  }, [activeSection]);

  // ── 4. Appointments (Smart Fallback API Fix) ──────────────────
  useEffect(() => {
    if (activeSection !== "appointments" && activeSection !== "home") return;

    const patientId = localStorage.getItem("identifier");
    if (!patientId) return;

    const fetchAppts = async () => {
      setApptLoading(true);
      try {
        let res = await authFetch(`${API}/appointments/patient/${patientId}`);
        let data = [];

        if (res.ok) {
          data = await res.json();
        } else {
          // Fallback: If patient route fails, fetch ALL and filter securely
          res = await authFetch(`${API}/appointments`);
          if (res.ok) {
            const allAppts = await res.json();
            data = allAppts.filter(a => JSON.stringify(a).includes(patientId));
          }
        }
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) { console.error("Appointments fetch failed:", e); } 
      finally { setApptLoading(false); }
    };

    fetchAppts();
  }, [activeSection]);

  // ── Toggle medication taken ───────────────────────────────────
  const toggleMed = async (id) => {
    try {
      const res = await authFetch(`${API}/medication/toggle/${id}`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setMeds((prev) => prev.map((m) => m.id === id ? updated : m));
      }
    } catch (e) { console.error("Toggle med failed:", e); }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ── Latest vitals reading ─────────────────────────────────────
  const latest = pulseHistory.length > 0
    ? pulseHistory[pulseHistory.length - 1]
    : null;

  // ── Build vitals array with DYNAMIC status ────────────────────
  const vitals = [
    {
      key: "heartRate",
      label: "Heart Rate",
      icon: "♥",
      value: latest?.heartRate ?? "--",
      unit: "bpm",
      data: pulseHistory.map((d) => d.heartRate),
      color: "#ef4444",
      normal: "60–100",
      status: getVitalStatus("heartRate", latest?.heartRate),
    },
    {
      key: "bloodPressure",
      label: "Blood Pressure",
      icon: "↑↓",
      value: latest?.bloodPressure ?? "--",
      unit: "mmHg",
      data: pulseHistory.map((d) => parseFloat(String(d.bloodPressure).split("/")[0])),
      color: "#3b82f6",
      normal: "90/60–120/80",
      status: getVitalStatus("bloodPressure", latest?.bloodPressure),
    },
    {
      key: "bodyTemperature",
      label: "Temperature",
      icon: "◉",
      value: latest?.bodyTemperature ?? "--",
      unit: "°C",
      data: pulseHistory.map((d) => d.bodyTemperature),
      color: "#f59e0b",
      normal: "36.1–37.2",
      status: getVitalStatus("bodyTemperature", latest?.bodyTemperature),
    },
    {
      key: "spo2",
      label: "SpO₂",
      icon: "◎",
      value: latest?.spo2 ?? "--",
      unit: "%",
      data: pulseHistory.map((d) => d.spo2),
      color: "#06b6d4",
      normal: "95–100",
      status: getVitalStatus("spo2", latest?.spo2),
    },
    {
      key: "glucoseLevel",
      label: "Glucose",
      icon: "◈",
      value: latest?.glucoseLevel ?? "--",
      unit: "mg/dL",
      data: pulseHistory.map((d) => d.glucoseLevel),
      color: "#f97316",
      normal: "70–140",
      status: getVitalStatus("glucoseLevel", latest?.glucoseLevel),
    },
    {
      key: "respiratoryRate",
      label: "Respiratory",
      icon: "≋",
      value: latest?.respiratoryRate ?? "--",
      unit: "breaths/min",
      data: pulseHistory.map((d) => d.respiratoryRate),
      color: "#10b981",
      normal: "12–20",
      status: getVitalStatus("respiratoryRate", latest?.respiratoryRate),
    },
  ];

  // ── Derived med counts ────────────────────────────────────────
  const takenMeds   = meds.filter((m) => m.takenToday);
  const pendingMeds = meds.filter((m) => !m.takenToday);
  const medProgress = meds.length
    ? Math.round((takenMeds.length / meds.length) * 100)
    : 0;

  // ── Alerts derived from live vitals ──────────────────────────
  const activeAlerts = vitals.filter((v) => v.status !== "normal");

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="db-root">
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-logo">
          <div className="db-logo-icon"><PulseIcon /></div>
          <span className="db-logo-text">PulseLink</span>
        </div>

        <nav className="db-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`db-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {/* Alert badge on Alerts nav item */}
              {item.id === "alerts" && activeAlerts.length > 0 && (
                <span className="db-nav-alert-badge">{activeAlerts.length}</span>
              )}
              {activeSection === item.id && <span className="db-nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-patient-card">
            <div className="db-patient-avatar">
              {userData
                ? (userData.firstName?.[0] ?? "") + (userData.lastName?.[0] ?? "")
                : "?"}
            </div>
            <div className="db-patient-info">
              <div className="db-patient-name">
                {userData ? `${userData.firstName} ${userData.lastName}` : "Loading…"}
              </div>
              <div className="db-patient-id">{userData?.id}</div>
            </div>
          </div>
          <button className="db-logout-btn" onClick={logout}>
            <LogoutIcon /><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="db-main">
        <header className="db-topbar">
          <button
            className="db-hamburger"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <span /><span /><span />
          </button>
          <div className="db-topbar-left">
            <h1 className="db-topbar-title">
              {NAV.find((n) => n.id === activeSection)?.label}
            </h1>
            <p className="db-topbar-date">{dateStr}</p>
          </div>
          <div className="db-topbar-right">
            {activeAlerts.length > 0 && (
              <div className="db-alert-banner">
                ⚠ {activeAlerts.length} vital{activeAlerts.length > 1 ? "s" : ""} out of range
              </div>
            )}
            <div className="db-live-badge">
              <span className="db-live-dot" />Live
            </div>
          </div>
        </header>

        <div className="db-content">

          {/* ══ OVERVIEW ══ */}
          {activeSection === "home" && (
            <div className="db-section fade-in">
              <div className="db-welcome-banner">
                <div className="db-welcome-text">
                  <p className="db-welcome-greeting">{getGreeting()},</p>
                  <h2 className="db-welcome-name">{userData?.firstName || "Patient"}</h2>
                </div>
                <div className="db-welcome-meta">
                  <span className="db-role-chip">{userData?.role || "PATIENT"}</span>
                  <span className="db-id-chip">ID: {userData?.id}</span>
                </div>
              </div>

              <div className="db-quick-stats">
                <div className="db-stat-pill">
                  <span className="db-stat-num">{meds.length}</span>
                  <span className="db-stat-label">Medications</span>
                </div>
                <div className="db-stat-pill">
                  <span className="db-stat-num">{takenMeds.length}/{meds.length}</span>
                  <span className="db-stat-label">Taken today</span>
                </div>
                <div className="db-stat-pill">
                  <span className={`db-stat-num ${activeAlerts.length > 0 ? "db-stat-warn" : ""}`}>
                    {activeAlerts.length}
                  </span>
                  <span className="db-stat-label">Active alerts</span>
                </div>
                <div className="db-stat-pill">
                  <span className={`db-stat-num ${latest ? "db-stat-live" : ""}`}>
                    {latest?.heartRate ?? "--"}
                  </span>
                  <span className="db-stat-label">BPM live</span>
                </div>
              </div>

              <h3 className="db-section-heading">Vital Signs</h3>
              <div className="db-vitals-grid">
                {vitals.map((v) => (
                  <div key={v.key} className={`db-vital-card status-border-${v.status}`}>
                    <div className="db-vital-top">
                      <div className="db-vital-label">{v.label}</div>
                      <StatusBadge status={v.status} />
                    </div>
                    <div className="db-vital-value">
                      <span className="db-vital-num">{v.value}</span>
                      <span className="db-vital-unit">{v.unit}</span>
                    </div>
                    <div className="db-vital-chart">
                      <Sparkline data={v.data} color={v.color} />
                    </div>
                    <div className="db-vital-range">Normal: {v.normal}</div>
                  </div>
                ))}
              </div>

              {/* Medications summary on home */}
              {meds.length > 0 && (
                <>
                  <h3 className="db-section-heading">Today's Medications</h3>
                  <div className="db-med-summary-card">
                    <div className="db-med-progress-row">
                      <span>{takenMeds.length} of {meds.length} taken</span>
                      <span>{medProgress}%</span>
                    </div>
                    <div className="db-med-progress-track">
                      <div className="db-med-progress-fill" style={{ width: `${medProgress}%` }} />
                    </div>
                    <div className="db-med-chips">
                      {meds.map((m) => (
                        <div key={m.id} className={`db-med-chip ${m.takenToday ? "taken" : ""}`}>
                          {/* Correctly mapped backend field */}
                          <span>{m.medicationName || m.name || "Medication"}</span>
                          {m.takenToday && <span className="db-check">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Next appointment on home */}
              {appointments.length > 0 && (
                <>
                  <h3 className="db-section-heading">Next Appointment</h3>
                  <div className="db-next-appt-card">
                    <div className="db-next-appt-title">
                      {/* Correctly mapped backend field */}
                      {appointments[0].appointmentName || appointments[0].type || "Procedure / Appointment"}
                    </div>
                    <div className="db-next-appt-meta">
                      {appointments[0].appointmentDate}
                      {appointments[0].appointmentDate && appointments[0].appointmentTime ? " · " : ""}
                      {appointments[0].appointmentTime}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ VITALS ══ */}
          {activeSection === "vitals" && (
            <div className="db-section fade-in">
              {!latest && (
                <div className="db-empty-state">
                  <div className="db-empty-icon"><HeartIcon /></div>
                  <p>No vitals data received yet.</p>
                  <p className="db-empty-sub">Data will appear once your device starts streaming.</p>
                </div>
              )}
              <div className="db-vitals-full">
                {vitals.map((v) => (
                  <div key={v.key} className={`db-vital-full-card status-border-${v.status}`}>
                    <div className="db-vital-full-left">
                      <div className="db-vital-full-icon" style={{ color: v.color }}>
                        {v.icon}
                      </div>
                      <div>
                        <div className="db-vital-full-label">{v.label}</div>
                        <div className="db-vital-full-value">
                          <span style={{ color: v.color }}>{v.value}</span>
                          <span className="db-vital-full-unit">{v.unit}</span>
                        </div>
                        <div className="db-vital-range">Normal range: {v.normal}</div>
                      </div>
                    </div>
                    <div className="db-vital-full-chart">
                      <Sparkline data={v.data} color={v.color} height={64} />
                      <div className="db-chart-label">
                        Last {pulseHistory.length} readings
                      </div>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ MEDICATIONS ══ */}
          {activeSection === "medications" && (
            <div className="db-section fade-in">
              {medsLoading ? (
                <div className="db-loading">
                  <div className="db-spinner" />Loading medications…
                </div>
              ) : meds.length === 0 ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon"><PillIcon /></div>
                  <p>No medications prescribed yet.</p>
                  <p className="db-empty-sub">Your doctor will add medications to your plan.</p>
                </div>
              ) : (
                <>
                  {/* Progress header */}
                  <div className="db-meds-header-card">
                    <div className="db-meds-header-row">
                      <div>
                        <div className="db-meds-header-title">Daily Progress</div>
                        <div className="db-meds-header-sub">
                          {takenMeds.length} of {meds.length} medications taken
                        </div>
                      </div>
                      <div className="db-meds-circle">
                        <svg viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15.9"
                            fill="none" stroke="var(--accent)" strokeWidth="3"
                            strokeDasharray={`${medProgress} 100`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                        <span>{medProgress}%</span>
                      </div>
                    </div>
                    <div className="db-med-progress-track">
                      <div className="db-med-progress-fill" style={{ width: `${medProgress}%` }} />
                    </div>
                  </div>

                  {pendingMeds.length > 0 && (
                    <>
                      <h3 className="db-section-heading">Pending</h3>
                      <div className="db-med-list">
                        {pendingMeds.map((m) => (
                          <MedCard key={m.id} med={m} onToggle={toggleMed} />
                        ))}
                      </div>
                    </>
                  )}

                  {takenMeds.length > 0 && (
                    <>
                      <h3 className="db-section-heading">Completed</h3>
                      <div className="db-med-list">
                        {takenMeds.map((m) => (
                          <MedCard key={m.id} med={m} onToggle={toggleMed} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ APPOINTMENTS ══ */}
          {activeSection === "appointments" && (
            <div className="db-section fade-in">
              {apptLoading ? (
                <div className="db-loading">
                  <div className="db-spinner" />Loading appointments…
                </div>
              ) : appointments.length === 0 ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon"><CalIcon /></div>
                  <p>No upcoming appointments.</p>
                  <p className="db-empty-sub">
                    Contact your care team to schedule a visit.
                  </p>
                </div>
              ) : (
                <div className="db-med-list">
                  {appointments.map((a, i) => (
                    <div key={a.id || i} className="db-med-card">
                      <div className="db-med-left">
                        <div className="db-med-dot" />
                        <div className="db-med-info">
                          {/* Correctly mapped backend field */}
                          <div className="db-med-name">
                            {a.appointmentName || a.type || "Procedure / Appointment"}
                          </div>
                          <div className="db-med-meta">
                            {a.appointmentDate && (
                              <span>{a.appointmentDate}</span>
                            )}
                            {a.appointmentTime && (
                              <span> · {a.appointmentTime}</span>
                            )}
                            {a.doctorName && (
                              <span> · Dr. {a.doctorName}</span>
                            )}
                            {a.room && (
                              <span> · Room: {a.room}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={a.status === "pending" ? "caution" : "normal"} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ALERTS ══ */}
          {activeSection === "alerts" && (
            <div className="db-section fade-in">
              {activeAlerts.length === 0 ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon db-empty-green"><BellIcon /></div>
                  <p>All vitals within normal range.</p>
                  <p className="db-empty-sub">No active alerts at this time.</p>
                </div>
              ) : (
                <>
                  <div className="db-alerts-count">
                    {activeAlerts.length} active alert{activeAlerts.length > 1 ? "s" : ""}
                  </div>
                  <div className="db-alert-list">
                    {activeAlerts.map((v) => (
                      <div key={v.key} className={`db-alert-card alert-${v.status}`}>
                        <div className="db-alert-icon" style={{ color: v.color }}>
                          {v.icon}
                        </div>
                        <div>
                          <div className="db-alert-title">
                            {v.label} out of range
                          </div>
                          <div className="db-alert-body">
                            Current:{" "}
                            <strong>
                              {v.value} {v.unit}
                            </strong>{" "}
                            · Normal: {v.normal}
                          </div>
                        </div>
                        <StatusBadge status={v.status} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ REPORTS ══ */}
          {activeSection === "reports" && (
            <div className="db-section fade-in">
              <div className="db-empty-state">
                <div className="db-empty-icon"><ReportIcon /></div>
                <p>No reports available.</p>
                <p className="db-empty-sub">
                  Reports generated by your care team will appear here.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// ── Medication Card ───────────────────────────────────────────
const MedCard = ({ med, onToggle }) => (
  <div className={`db-med-card ${med.takenToday ? "taken" : ""}`}>
    <div className="db-med-left">
      <div className={`db-med-dot ${med.takenToday ? "taken" : ""}`} />
      <div className="db-med-info">
        <div className="db-med-name">
          {med.medicationName || med.name || "Unnamed medication"}
          {(med.dosage || med.dose) && (
            <span className="db-med-dose"> · {med.dosage || med.dose}</span>
          )}
        </div>
        <div className="db-med-meta">
          {med.frequency && <span>{med.frequency}</span>}
          {med.startDate && <span> · From {med.startDate}</span>}
          {med.endDate   && <span> · Until {med.endDate}</span>}
        </div>
      </div>
    </div>
    <button
      className={`db-toggle-btn ${med.takenToday ? "taken" : ""}`}
      onClick={() => onToggle(med.id)}
    >
      {med.takenToday ? "✓ Taken" : "Mark taken"}
    </button>
  </div>
);

export default Dashboard;