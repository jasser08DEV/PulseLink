import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";

const API = "http://10.0.0.116:8080/api/v1";

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// Sparkline SVG
const Sparkline = ({ data, color, height = 52 }) => {
  const w = 200;
  const h = height;
  if (!data || data.length < 2) return <div style={{ height: h }} />;
  const nums = data.map(Number).filter(n => !isNaN(n));
  if (nums.length < 2) return <div style={{ height: h }} />;
  const max = Math.max(...nums), min = Math.min(...nums);
  const range = max - min || 1;
  const pad = 4;
  const pts = nums.map((v, i) => {
    const x = pad + (i / (nums.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  // Area fill
  const first = nums[0], last = nums[nums.length - 1];
  const x0 = pad, xN = pad + (w - pad * 2);
  const areaPath = `M${x0},${h} ` +
    nums.map((v, i) => {
      const x = pad + (i / (nums.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `L${x},${y}`;
    }).join(" ") +
    ` L${xN},${h} Z`;

  const gradId = `grad-${color.replace("#", "")}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      {(() => {
        const lastX = pad + (w - pad * 2);
        const lastY = pad + (1 - (nums[nums.length - 1] - min) / range) * (h - pad * 2);
        return <circle cx={lastX} cy={lastY} r="3" fill={color} />;
      })()}
    </svg>
  );
};

// Status badge
const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status}`}>
    {status === "normal" ? "Normal" : status === "caution" ? "Caution" : "Critical"}
  </span>
);

// Nav items
const NAV = [
  { id: "home",         label: "Overview",      icon: <HomeIcon /> },
  { id: "vitals",       label: "Vitals",         icon: <HeartIcon /> },
  { id: "medications",  label: "Medications",    icon: <PillIcon /> },
  { id: "appointments", label: "Appointments",   icon: <CalIcon /> },
  { id: "alerts",       label: "Alerts",         icon: <BellIcon /> },
  { id: "reports",      label: "Reports",        icon: <ReportIcon /> },
];

// ─── Icons ───────────────────────────────────────────────────────────────────
function HomeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>;
}
function HeartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function PillIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>;
}
function CalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function ReportIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function LogoutIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
function PulseIcon() {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"/></svg>;
}

// ─── Dashboard Component ──────────────────────────────────────────────────────
const Dashboard = () => {
  const [userData, setUserData]       = useState(null);
  const [pulseHistory, setPulseHistory] = useState([]);
  const [activeSection, setActiveSection] = useState("home");
  const [meds, setMeds]               = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medsLoading, setMedsLoading] = useState(false);

  // ── Fetch profile ────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    (async () => {
      try {
        const res = await authFetch(`${API}/auth/me`);
        if (res.ok) setUserData(await res.json());
        else if (res.status === 401) window.location.href = "/login";
      } catch (e) { console.error("Profile:", e); }
    })();
  }, []);

  // ── Poll vitals ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchVitals = async () => {
      const patientId = localStorage.getItem("identifier");
      if (!patientId) return;
      try {
        const res = await authFetch(`${API}/vitals/pulse/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setPulseHistory(data.slice(-20));
        }
      } catch (e) { console.error("Vitals:", e); }
    };
    fetchVitals();
    const iv = setInterval(fetchVitals, 5000);
    return () => clearInterval(iv);
  }, []);

  // ── Fetch meds ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeSection !== "medications" && activeSection !== "home") return;
    const fetchMeds = async () => {
      const patientId = localStorage.getItem("identifier");
      if (!patientId) return;
      setMedsLoading(true);
      try {
        const res = await authFetch(`${API}/medication/patient/${patientId}`);
        if (res.ok) setMeds(await res.json());
      } catch (e) { console.error("Meds:", e); }
      finally { setMedsLoading(false); }
    };
    fetchMeds();
  }, [activeSection]);

  // ── Toggle med taken ─────────────────────────────────────────────────────
  const toggleMed = async (id) => {
    try {
      const res = await authFetch(`${API}/medication/toggle/${id}`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setMeds(prev => prev.map(m => m.id === id ? updated : m));
      }
    } catch (e) { console.error("Toggle:", e); }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ── Computed vitals ──────────────────────────────────────────────────────
  const latest = pulseHistory[pulseHistory.length - 1] || null;

  const vitals = [
    {
      key: "heartRate", label: "Heart Rate", icon: "♥",
      value: latest?.heartRate ?? "--", unit: "bpm",
      data: pulseHistory.map(d => d.heartRate),
      color: "#ef4444", status: "normal",
      normal: "60–100",
    },
    {
      key: "bloodPressure", label: "Blood Pressure", icon: "↑↓",
      value: latest?.bloodPressure ?? "--", unit: "mmHg",
      data: pulseHistory.map(d => d.bloodPressure),
      color: "#3b82f6", status: "normal",
      normal: "90–120",
    },
    {
      key: "bodyTemperature", label: "Temperature", icon: "◉",
      value: latest?.bodyTemperature ?? "--", unit: "°C",
      data: pulseHistory.map(d => d.bodyTemperature),
      color: "#f59e0b", status: "normal",
      normal: "36.1–37.2",
    },
    {
      key: "spo2", label: "SpO₂", icon: "◎",
      value: latest?.spo2 ?? "--", unit: "%",
      data: pulseHistory.map(d => d.spo2),
      color: "#06b6d4", status: "normal",
      normal: "95–100",
    },
    {
      key: "glucoseLevel", label: "Glucose", icon: "◈",
      value: latest?.glucoseLevel ?? "--", unit: "mg/dL",
      data: pulseHistory.map(d => d.glucoseLevel),
      color: "#f97316", status: "caution",
      normal: "70–140",
    },
    {
      key: "respiratoryRate", label: "Respiratory", icon: "≋",
      value: latest?.respiratoryRate ?? "--", unit: "breaths/min",
      data: pulseHistory.map(d => d.respiratoryRate),
      color: "#10b981", status: "normal",
      normal: "12–20",
    },
  ];

  const todayMeds    = meds.filter(m => !m.takenToday);
  const takenMeds    = meds.filter(m => m.takenToday);
  const medProgress  = meds.length ? Math.round((takenMeds.length / meds.length) * 100) : 0;

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="db-root">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-logo">
          <div className="db-logo-icon"><PulseIcon /></div>
          <span className="db-logo-text">PulseLink</span>
        </div>

        <nav className="db-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {activeSection === item.id && <span className="db-nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-patient-card">
            <div className="db-patient-avatar">
              {userData ? userData.firstName?.[0] + (userData.lastName?.[0] || "") : "?"}
            </div>
            <div className="db-patient-info">
              <div className="db-patient-name">
                {userData ? `${userData.firstName} ${userData.lastName}` : "Loading…"}
              </div>
              <div className="db-patient-id">{userData?.id}</div>
            </div>
          </div>
          <button className="db-logout-btn" onClick={logout}>
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="db-main">
        {/* Topbar */}
        <header className="db-topbar">
          <button className="db-hamburger" onClick={() => setSidebarOpen(s => !s)}>
            <span /><span /><span />
          </button>
          <div className="db-topbar-left">
            <h1 className="db-topbar-title">
              {NAV.find(n => n.id === activeSection)?.label}
            </h1>
            <p className="db-topbar-date">{dateStr}</p>
          </div>
          <div className="db-topbar-right">
            <div className="db-live-badge">
              <span className="db-live-dot" />
              Live
            </div>
          </div>
        </header>

        <div className="db-content">

          {/* ══ HOME ═══════════════════════════════════════════════════════ */}
          {activeSection === "home" && (
            <div className="db-section fade-in">
              {/* Welcome banner */}
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

              {/* Quick stats row */}
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
                  <span className="db-stat-num">{vitals.filter(v => v.status === "normal").length}</span>
                  <span className="db-stat-label">Vitals normal</span>
                </div>
                <div className="db-stat-pill">
                  <span className={`db-stat-num ${latest ? "db-stat-live" : ""}`}>
                    {latest?.heartRate ?? "--"}
                  </span>
                  <span className="db-stat-label">BPM live</span>
                </div>
              </div>

              {/* Vitals grid */}
              <h3 className="db-section-heading">Vital Signs</h3>
              <div className="db-vitals-grid">
                {vitals.map(v => (
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

              {/* Med summary */}
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
                      {meds.map(m => (
                        <div key={m.id} className={`db-med-chip ${m.takenToday ? "taken" : ""}`}>
                          <span>{m.medicationName}</span>
                          {m.takenToday && <span className="db-check">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ VITALS ════════════════════════════════════════════════════ */}
          {activeSection === "vitals" && (
            <div className="db-section fade-in">
              <div className="db-vitals-full">
                {vitals.map(v => (
                  <div key={v.key} className={`db-vital-full-card status-border-${v.status}`}>
                    <div className="db-vital-full-left">
                      <div className="db-vital-full-icon" style={{ color: v.color }}>{v.icon}</div>
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
                      <div className="db-chart-label">Last {pulseHistory.length} readings</div>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ MEDICATIONS ═══════════════════════════════════════════════ */}
          {activeSection === "medications" && (
            <div className="db-section fade-in">
              {/* Progress header */}
              {meds.length > 0 && (
                <div className="db-meds-header-card">
                  <div className="db-meds-header-row">
                    <div>
                      <div className="db-meds-header-title">Daily Progress</div>
                      <div className="db-meds-header-sub">{takenMeds.length} of {meds.length} medications taken</div>
                    </div>
                    <div className="db-meds-circle">
                      <svg viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3"/>
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" strokeWidth="3"
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
              )}

              {medsLoading ? (
                <div className="db-loading">
                  <div className="db-spinner" />
                  Loading medications…
                </div>
              ) : meds.length === 0 ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon"><PillIcon /></div>
                  <p>No medications prescribed yet.</p>
                </div>
              ) : (
                <>
                  {todayMeds.length > 0 && (
                    <>
                      <h3 className="db-section-heading">Pending</h3>
                      <div className="db-med-list">
                        {todayMeds.map(m => (
                          <MedCard key={m.id} med={m} onToggle={toggleMed} />
                        ))}
                      </div>
                    </>
                  )}
                  {takenMeds.length > 0 && (
                    <>
                      <h3 className="db-section-heading">Completed</h3>
                      <div className="db-med-list">
                        {takenMeds.map(m => (
                          <MedCard key={m.id} med={m} onToggle={toggleMed} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ APPOINTMENTS ══════════════════════════════════════════════ */}
          {activeSection === "appointments" && (
            <div className="db-section fade-in">
              <div className="db-empty-state">
                <div className="db-empty-icon"><CalIcon /></div>
                <p>No upcoming appointments.</p>
                <p className="db-empty-sub">Contact your care team to schedule a visit.</p>
              </div>
            </div>
          )}

          {/* ══ ALERTS ════════════════════════════════════════════════════ */}
          {activeSection === "alerts" && (
            <div className="db-section fade-in">
              {vitals.filter(v => v.status !== "normal").length === 0 ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon db-empty-green"><BellIcon /></div>
                  <p>All vitals within normal range.</p>
                  <p className="db-empty-sub">No active alerts at this time.</p>
                </div>
              ) : (
                <div className="db-alert-list">
                  {vitals.filter(v => v.status !== "normal").map(v => (
                    <div key={v.key} className={`db-alert-card alert-${v.status}`}>
                      <div className="db-alert-icon" style={{ color: v.color }}>{v.icon}</div>
                      <div>
                        <div className="db-alert-title">{v.label} out of range</div>
                        <div className="db-alert-body">
                          Current: <strong>{v.value} {v.unit}</strong> · Normal: {v.normal}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ REPORTS ═══════════════════════════════════════════════════ */}
          {activeSection === "reports" && (
            <div className="db-section fade-in">
              <div className="db-empty-state">
                <div className="db-empty-icon"><ReportIcon /></div>
                <p>No reports available.</p>
                <p className="db-empty-sub">Reports generated by your care team will appear here.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// ─── Medication Card ──────────────────────────────────────────────────────────
const MedCard = ({ med, onToggle }) => (
  <div className={`db-med-card ${med.takenToday ? "taken" : ""}`}>
    <div className="db-med-left">
      <div className={`db-med-dot ${med.takenToday ? "taken" : ""}`} />
      <div className="db-med-info">
        <div className="db-med-name">
          {med.medicationName}
          <span className="db-med-dose">{med.dosage}</span>
        </div>
        <div className="db-med-meta">
          <span>{med.frequency}</span>
          {med.startDate && <span>From {med.startDate}</span>}
          {med.endDate   && <span>Until {med.endDate}</span>}
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