import React, { useState } from "react";
import "./Dashboard.css";

const patient = {
  name: "Patient A",
  id: "MRN-8821-X",
  age: 34,
  ward: "Cardiology — Ward B",
  doctor: "Doctor B",
  avatar: "PA",
};

const vitals = [
  { label: "Heart Rate", value: "78", unit: "bpm", status: "normal", icon: "♥" },
  { label: "Blood Pressure", value: "118/76", unit: "mmHg", status: "normal", icon: "⊕" },
  { label: "Temperature", value: "37.1", unit: "°C", status: "normal", icon: "◈" },
  { label: "SpO₂", value: "98", unit: "%", status: "normal", icon: "◉" },
  { label: "Glucose", value: "112", unit: "mg/dL", status: "caution", icon: "◆" },
  { label: "Respiratory", value: "16", unit: "breaths/min", status: "normal", icon: "◎" },
];

const alerts = [
  { id: 1, type: "caution", message: "Glucose slightly elevated — monitor after meals", time: "2h ago" },
  { id: 2, type: "info", message: "Cardiology follow-up scheduled for tomorrow 09:00", time: "5h ago" },
  { id: 3, type: "info", message: "New lab results available in your reports", time: "Yesterday" },
];

const appointments = [
  { id: 1, title: "Cardiology Follow-up", doctor: "Doctor B", date: "30 Mar 2026", time: "09:00 AM", status: "upcoming" },
  { id: 2, title: "Blood Work Review", doctor: "Dr. Sana Belhadj", date: "3 Apr 2026", time: "11:30 AM", status: "upcoming" },
  { id: 3, title: "ECG Screening", doctor: "Doctor B", date: "10 Apr 2026", time: "02:00 PM", status: "upcoming" },
  { id: 4, title: "General Check-up", doctor: "Dr. Rania Slim", date: "18 Mar 2026", time: "10:00 AM", status: "completed" },
];

const medications = [
  { id: 1, name: "Metoprolol", dose: "50mg", frequency: "Once daily", time: "08:00 AM", taken: true },
  { id: 2, name: "Aspirin", dose: "100mg", frequency: "Once daily", time: "08:00 AM", taken: true },
  { id: 3, name: "Atorvastatin", dose: "20mg", frequency: "Once daily", time: "09:00 PM", taken: false },
  { id: 4, name: "Ramipril", dose: "5mg", frequency: "Twice daily", time: "08:00 AM / 08:00 PM", taken: false },
];

const reports = [
  { id: 1, title: "Complete Blood Count", date: "25 Mar 2026", type: "Lab", status: "Ready" },
  { id: 2, title: "Echocardiogram Report", date: "20 Mar 2026", type: "Imaging", status: "Ready" },
  { id: 3, title: "Lipid Panel", date: "15 Mar 2026", type: "Lab", status: "Ready" },
  { id: 4, title: "Chest X-Ray", date: "10 Mar 2026", type: "Imaging", status: "Ready" },
];

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

const heartData  = [72, 75, 78, 74, 80, 76, 78];
const bpData     = [118, 122, 115, 120, 118, 116, 118];
const spo2Data   = [97, 98, 98, 99, 98, 97, 98];
const glucData   = [105, 108, 115, 112, 118, 112, 112];
const sparkData = { "Heart Rate": heartData, "Blood Pressure": bpData, "SpO₂": spo2Data, "Glucose": glucData };
const sparkColor = { normal: "#1D9E75", caution: "#EF9F27" };

const navItems = [
  { id: "home",        label: "Home",         icon: "⌂" },
  { id: "vitals",      label: "Vitals",        icon: "♥" },
  { id: "alerts",      label: "Alerts",        icon: "⚑" },
  { id: "appointments",label: "Appointments",  icon: "◷" },
  { id: "medications", label: "Medications",   icon: "◈" },
  { id: "reports",     label: "Reports",       icon: "◧" },
];

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [meds, setMeds] = useState(medications);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const toggleMed = (id) =>
    setMeds((prev) => prev.map((m) => m.id === id ? { ...m, taken: !m.taken } : m));

  const dismissAlert = (id) =>
    setDismissedAlerts((prev) => [...prev, id]);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));

  return (
    <div className="db-root">
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"
              stroke="currentColor" strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="db-logo-text">PulseLink</span>
        </div>

        <nav className="db-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`db-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {item.id === "alerts" && visibleAlerts.length > 0 && (
                <span className="db-badge">{visibleAlerts.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-avatar">{patient.avatar}</div>
          <div className="db-sidebar-patient">
            <div className="db-sidebar-name">{patient.name}</div>
            <div className="db-sidebar-id">{patient.id}</div>
          </div>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-topbar">
          <div>
            <div className="db-topbar-title">
              {navItems.find((n) => n.id === activeSection)?.label}
            </div>
            <div className="db-topbar-sub">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
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
                  <div className="db-welcome-name">{patient.name}</div>
                  <div className="db-welcome-meta">
                    {patient.ward} &nbsp;·&nbsp; Under care of {patient.doctor}
                  </div>
                </div>
                <div className="db-welcome-stats">
                  <div className="db-mini-stat">
                    <div className="db-mini-stat-val">{meds.filter(m => m.taken).length}/{meds.length}</div>
                    <div className="db-mini-stat-label">Meds taken today</div>
                  </div>
                  <div className="db-mini-stat">
                    <div className="db-mini-stat-val">{appointments.filter(a => a.status === "upcoming").length}</div>
                    <div className="db-mini-stat-label">Upcoming visits</div>
                  </div>
                  <div className="db-mini-stat">
                    <div className={`db-mini-stat-val ${visibleAlerts.length > 0 ? "caution" : ""}`}>{visibleAlerts.length}</div>
                    <div className="db-mini-stat-label">Active alerts</div>
                  </div>
                </div>
              </div>

              <div className="db-sub-title">Today's Vitals</div>
              <div className="db-vitals-grid">
                {vitals.map((v) => (
                  <div key={v.label} className={`db-vital-card ${v.status}`}>
                    <div className="db-vital-top">
                      <span className="db-vital-label">{v.label}</span>
                      <span className={`db-vital-badge ${v.status}`}>{v.status}</span>
                    </div>
                    <div className="db-vital-value">
                      {v.value}<span className="db-vital-unit">{v.unit}</span>
                    </div>
                    {sparkData[v.label] && (
                      <Sparkline data={sparkData[v.label]} color={sparkColor[v.status]} />
                    )}
                  </div>
                ))}
              </div>

              <div className="db-home-bottom">
                <div className="db-home-col">
                  <div className="db-sub-title">Recent Alerts</div>
                  {visibleAlerts.slice(0, 2).map((a) => (
                    <div key={a.id} className={`db-alert-item ${a.type}`}>
                      <div className="db-alert-msg">{a.message}</div>
                      <div className="db-alert-time">{a.time}</div>
                    </div>
                  ))}
                  {visibleAlerts.length === 0 && <div className="db-empty">No active alerts</div>}
                </div>
                <div className="db-home-col">
                  <div className="db-sub-title">Next Appointment</div>
                  {(() => {
                    const next = appointments.find(a => a.status === "upcoming");
                    return next ? (
                      <div className="db-next-appt">
                        <div className="db-appt-title">{next.title}</div>
                        <div className="db-appt-doctor">{next.doctor}</div>
                        <div className="db-appt-datetime">{next.date} &nbsp;·&nbsp; {next.time}</div>
                      </div>
                    ) : <div className="db-empty">No upcoming appointments</div>;
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeSection === "vitals" && (
            <div className="db-section">
              <div className="db-vitals-grid db-vitals-grid--large">
                {vitals.map((v) => (
                  <div key={v.label} className={`db-vital-card db-vital-card--large ${v.status}`}>
                    <div className="db-vital-top">
                      <span className="db-vital-label">{v.label}</span>
                      <span className={`db-vital-badge ${v.status}`}>{v.status}</span>
                    </div>
                    <div className="db-vital-value">
                      {v.value}<span className="db-vital-unit">{v.unit}</span>
                    </div>
                    {sparkData[v.label] && (
                      <div className="db-sparkline-large">
                        <Sparkline data={sparkData[v.label]} color={sparkColor[v.status]} />
                      </div>
                    )}
                    <div className="db-vital-footer">Last updated: today, 08:42 AM</div>
                  </div>
                ))}
              </div>
              <div className="db-notice-box">
                Vitals are updated by your care team. Contact your nurse if a reading seems incorrect.
              </div>
            </div>
          )}

          {activeSection === "alerts" && (
            <div className="db-section">
              {visibleAlerts.length === 0 && (
                <div className="db-empty-state">
                  <div className="db-empty-icon">✓</div>
                  <div className="db-empty-title">All clear</div>
                  <div className="db-empty-sub">You have no active alerts at this time.</div>
                </div>
              )}
              {visibleAlerts.map((a) => (
                <div key={a.id} className={`db-alert-card ${a.type}`}>
                  <div className="db-alert-card-left">
                    <div className={`db-alert-indicator ${a.type}`}></div>
                    <div>
                      <div className="db-alert-card-msg">{a.message}</div>
                      <div className="db-alert-card-time">{a.time}</div>
                    </div>
                  </div>
                  <button className="db-alert-dismiss" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                </div>
              ))}
              {dismissedAlerts.length > 0 && (
                <div className="db-dismissed-note">{dismissedAlerts.length} alert(s) dismissed this session.</div>
              )}
            </div>
          )}

          {activeSection === "appointments" && (
            <div className="db-section">
              <div className="db-sub-title">Upcoming</div>
              {appointments.filter(a => a.status === "upcoming").map((a) => (
                <div key={a.id} className="db-appt-card">
                  <div className="db-appt-date-box">
                    <div className="db-appt-day">{a.date.split(" ")[0]}</div>
                    <div className="db-appt-month">{a.date.split(" ")[1]}</div>
                  </div>
                  <div className="db-appt-info">
                    <div className="db-appt-card-title">{a.title}</div>
                    <div className="db-appt-card-doctor">{a.doctor}</div>
                    <div className="db-appt-card-time">{a.time}</div>
                  </div>
                  <span className="db-appt-status upcoming">Upcoming</span>
                </div>
              ))}

              <div className="db-sub-title" style={{ marginTop: "2rem" }}>Past</div>
              {appointments.filter(a => a.status === "completed").map((a) => (
                <div key={a.id} className="db-appt-card db-appt-card--past">
                  <div className="db-appt-date-box past">
                    <div className="db-appt-day">{a.date.split(" ")[0]}</div>
                    <div className="db-appt-month">{a.date.split(" ")[1]}</div>
                  </div>
                  <div className="db-appt-info">
                    <div className="db-appt-card-title">{a.title}</div>
                    <div className="db-appt-card-doctor">{a.doctor}</div>
                    <div className="db-appt-card-time">{a.time}</div>
                  </div>
                  <span className="db-appt-status completed">Completed</span>
                </div>
              ))}
            </div>
          )}

          {activeSection === "medications" && (
            <div className="db-section">
              <div className="db-med-progress">
                <div className="db-med-progress-label">
                  {meds.filter(m => m.taken).length} of {meds.length} taken today
                </div>
                <div className="db-progress-bar">
                  <div className="db-progress-fill"
                    style={{ width: `${(meds.filter(m => m.taken).length / meds.length) * 100}%` }}>
                  </div>
                </div>
              </div>

              {meds.map((m) => (
                <div key={m.id} className={`db-med-card ${m.taken ? "taken" : ""}`}>
                  <div className="db-med-info">
                    <div className="db-med-name">{m.name}</div>
                    <div className="db-med-detail">{m.dose} &nbsp;·&nbsp; {m.frequency}</div>
                    <div className="db-med-time">{m.time}</div>
                  </div>
                  <button
                    className={`db-med-toggle ${m.taken ? "taken" : ""}`}
                    onClick={() => toggleMed(m.id)}
                  >
                    {m.taken ? "✓ Taken" : "Mark taken"}
                  </button>
                </div>
              ))}

              <div className="db-notice-box">
                Do not adjust your medication without consulting your doctor or nurse.
              </div>
            </div>
          )}

          {activeSection === "reports" && (
            <div className="db-section">
              {reports.map((r) => (
                <div key={r.id} className="db-report-card">
                  <div className="db-report-left">
                    <div className="db-report-type-badge">{r.type}</div>
                    <div>
                      <div className="db-report-title">{r.title}</div>
                      <div className="db-report-date">{r.date}</div>
                    </div>
                  </div>
                  <button className="db-report-btn">View Report</button>
                </div>
              ))}
              <div className="db-notice-box">
                Reports are provided by your clinical team. Contact your doctor for interpretation.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

