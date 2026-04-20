import React, { useState } from "react";
import "./Dashboard.css";

// ── Mock Data ────────────────────────────────────────────────
const patient = {
  name: "Amira Mansour", id: "MRN-8821-X",
  ward: "Cardiology — Ward B", doctor: "Dr. Chaker Nouri", avatar: "AM",
};

const vitals = [
  { label: "Heart Rate",     value: "78",     unit: "bpm",         status: "normal"  },
  { label: "Blood Pressure", value: "118/76", unit: "mmHg",        status: "normal"  },
  { label: "Temperature",    value: "37.1",   unit: "°C",          status: "normal"  },
  { label: "SpO₂",           value: "98",     unit: "%",           status: "normal"  },
  { label: "Glucose",        value: "112",    unit: "mg/dL",       status: "caution" },
  { label: "Respiratory",    value: "16",     unit: "breaths/min", status: "normal"  },
];

const alertsData = [
  { id: 1, type: "caution", message: "Glucose slightly elevated — monitor after meals", time: "2h ago" },
  { id: 2, type: "info",    message: "Cardiology follow-up scheduled for tomorrow 09:00", time: "5h ago" },
  { id: 3, type: "info",    message: "New lab results available in your reports", time: "Yesterday" },
];

const appointments = [
  { id: 1, title: "Cardiology Follow-up", doctor: "Dr. Chaker Nouri", date: "30 Mar 2026", time: "09:00 AM", status: "upcoming"  },
  { id: 2, title: "Blood Work Review",    doctor: "Dr. Sana Belhadj",  date: "3 Apr 2026",  time: "11:30 AM", status: "upcoming"  },
  { id: 3, title: "ECG Screening",        doctor: "Dr. Chaker Nouri", date: "10 Apr 2026", time: "02:00 PM", status: "upcoming"  },
  { id: 4, title: "General Check-up",     doctor: "Dr. Rania Slim",   date: "18 Mar 2026", time: "10:00 AM", status: "completed" },
];

const medsInit = [
  { id: 1, name: "Metoprolol",   dose: "50mg",  frequency: "Once daily",  time: "08:00 AM",            taken: true  },
  { id: 2, name: "Aspirin",      dose: "100mg", frequency: "Once daily",  time: "08:00 AM",            taken: true  },
  { id: 3, name: "Atorvastatin", dose: "20mg",  frequency: "Once daily",  time: "09:00 PM",            taken: false },
  { id: 4, name: "Ramipril",     dose: "5mg",   frequency: "Twice daily", time: "08:00 AM / 08:00 PM", taken: false },
];

const reports = [
  { id: 1, title: "Complete Blood Count",  date: "25 Mar 2026", type: "Lab"     },
  { id: 2, title: "Echocardiogram Report", date: "20 Mar 2026", type: "Imaging" },
  { id: 3, title: "Lipid Panel",           date: "15 Mar 2026", type: "Lab"     },
  { id: 4, title: "Chest X-Ray",           date: "10 Mar 2026", type: "Imaging" },
];

const sparkPoints = {
  "Heart Rate":    [72, 75, 78, 74, 80, 76, 78],
  "Blood Pressure":[118,122,115,120,118,116,118],
  "SpO₂":         [97, 98, 98, 99, 98, 97, 98],
  "Glucose":      [105,108,115,112,118,112,112],
};

const navItems = [
  { id: "home",         label: "Home",        icon: "⌂" },
  { id: "vitals",       label: "Vitals",       icon: "♥" },
  { id: "alerts",       label: "Alerts",       icon: "⚑" },
  { id: "appointments", label: "Appointments", icon: "◷" },
  { id: "medications",  label: "Medications",  icon: "◈" },
  { id: "reports",      label: "Reports",      icon: "◧" },
];

// ── Sparkline ────────────────────────────────────────────────
const Sparkline = ({ data, color, w = 110, h = 36 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="db-sparkline">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Colors for sparklines ────────────────────────────────────
const SPARK_COLOR = { normal: "#1D9E75", caution: "#EF9F27" };

export default function Dashboard({ navigate }) {
  const [active, setActive]       = useState("home");
  const [meds, setMeds]           = useState(medsInit);
  const [dismissed, setDismissed] = useState([]);

  const toggleMed   = id => setMeds(p => p.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  const dismiss     = id => setDismissed(p => [...p, id]);
  const visible     = alertsData.filter(a => !dismissed.includes(a.id));
  const takenCount  = meds.filter(m => m.taken).length;
  const upcoming    = appointments.filter(a => a.status === "upcoming");
  const nextAppt    = upcoming[0];

  return (
    <div className="db-root">

      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"
              stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="db-logo-text">PulseLink</span>
        </div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`db-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}>
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {item.id === "alerts" && visible.length > 0 &&
                <span className="db-nav-badge db-nav-badge--alert">{visible.length}</span>}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-avatar">{patient.avatar}</div>
          <div>
            <div className="db-sidebar-name">{patient.name}</div>
            <div className="db-sidebar-sub">{patient.id}</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="db-main">
        <header className="db-topbar">
          <div>
            <div className="db-topbar-title">{navItems.find(n => n.id === active)?.label}</div>
            <div className="db-topbar-sub">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <div className="db-topbar-right">
            <div className="db-status-dot"></div>
            <span className="db-status-text">All systems normal</span>
            {navigate && <button className="db-back-btn" onClick={() => navigate("home")}>← Home</button>}
          </div>
        </header>

        <div className="db-content">
          <div className="db-section">

            {/* ══ HOME ══ */}
            {active === "home" && (<>
              <div className="db-welcome">
                <div>
                  <div className="db-welcome-greeting">Good morning,</div>
                  <div className="db-welcome-name">{patient.name}</div>
                  <div className="db-welcome-meta">{patient.ward} · Under care of {patient.doctor}</div>
                </div>
                <div className="db-welcome-stats">
                  <div className="db-mini-stat">
                    <div className="db-mini-stat-val">{takenCount}/{meds.length}</div>
                    <div className="db-mini-stat-label">Meds taken today</div>
                  </div>
                  <div className="db-mini-stat">
                    <div className="db-mini-stat-val">{upcoming.length}</div>
                    <div className="db-mini-stat-label">Upcoming visits</div>
                  </div>
                  <div className="db-mini-stat">
                    <div className={`db-mini-stat-val ${visible.length > 0 ? "db-mini-stat-val--warn" : ""}`}>{visible.length}</div>
                    <div className="db-mini-stat-label">Active alerts</div>
                  </div>
                </div>
              </div>

              <div className="db-sub-title">Today's Vitals</div>
              <div className="db-vitals-grid">
                {vitals.map(v => (
                  <div key={v.label} className={`db-vital-card ${v.status === "caution" ? "db-vital-card--caution" : ""}`}>
                    <div className="db-vital-top">
                      <span className="db-vital-label">{v.label}</span>
                      <span className={`db-badge db-badge--${v.status}`}>{v.status}</span>
                    </div>
                    <div className="db-vital-value">
                      {v.value}<span className="db-vital-unit">{v.unit}</span>
                    </div>
                    {sparkPoints[v.label] &&
                      <Sparkline data={sparkPoints[v.label]} color={SPARK_COLOR[v.status]} />}
                  </div>
                ))}
              </div>

              <div className="db-home-grid">
                <div>
                  <div className="db-sub-title">Recent Alerts</div>
                  {visible.length === 0
                    ? <div className="db-empty-sub">No active alerts</div>
                    : visible.slice(0, 2).map(a => (
                      <div key={a.id} className={`db-card db-card--${a.type}`}>
                        <div className="db-alert-msg">{a.message}</div>
                        <div className="db-alert-time">{a.time}</div>
                      </div>
                    ))}
                </div>
                <div>
                  <div className="db-sub-title">Next Appointment</div>
                  {nextAppt
                    ? <div className="db-next-appt">
                        <div className="db-next-appt-title">{nextAppt.title}</div>
                        <div className="db-next-appt-doctor">{nextAppt.doctor}</div>
                        <div className="db-next-appt-dt">{nextAppt.date} · {nextAppt.time}</div>
                      </div>
                    : <div className="db-empty-sub">No upcoming appointments</div>}
                </div>
              </div>
            </>)}

            {/* ══ VITALS ══ */}
            {active === "vitals" && (<>
              <div className="db-vitals-grid db-vitals-grid--two-col">
                {vitals.map(v => (
                  <div key={v.label} className={`db-vital-card ${v.status === "caution" ? "db-vital-card--caution" : ""}`}>
                    <div className="db-vital-top">
                      <span className="db-vital-label">{v.label}</span>
                      <span className={`db-badge db-badge--${v.status}`}>{v.status}</span>
                    </div>
                    <div className="db-vital-value db-vital-value--large">
                      {v.value}<span className="db-vital-unit">{v.unit}</span>
                    </div>
                    {sparkPoints[v.label] &&
                      <Sparkline data={sparkPoints[v.label]} color={SPARK_COLOR[v.status]} w={200} h={44} />}
                    <div className="db-vital-footer">Last updated: today, 08:42 AM</div>
                  </div>
                ))}
              </div>
              <div className="db-notice">Vitals are updated by your care team. Contact your nurse if a reading seems incorrect.</div>
            </>)}

            {/* ══ ALERTS ══ */}
            {active === "alerts" && (<>
              {visible.length === 0
                ? <div className="db-empty-state">
                    <div className="db-empty-icon">✓</div>
                    <div className="db-empty-title">All clear</div>
                    <div className="db-empty-sub">You have no active alerts at this time.</div>
                  </div>
                : visible.map(a => (
                  <div key={a.id} className={`db-alert-card db-alert-card--${a.type}`}>
                    <div className="db-alert-left">
                      <div className={`db-alert-dot db-alert-dot--${a.type}`}></div>
                      <div>
                        <div className="db-alert-msg">{a.message}</div>
                        <div className="db-alert-time">{a.time}</div>
                      </div>
                    </div>
                    <button className="db-dismiss-btn" onClick={() => dismiss(a.id)}>Dismiss</button>
                  </div>
                ))}
              {dismissed.length > 0 && <div className="db-dismissed-note">{dismissed.length} alert(s) dismissed this session.</div>}
            </>)}

            {/* ══ APPOINTMENTS ══ */}
            {active === "appointments" && (<>
              <div className="db-sub-title">Upcoming</div>
              {upcoming.map(a => (
                <div key={a.id} className="db-appt-card">
                  <div className="db-appt-date-box">
                    <div className="db-appt-day">{a.date.split(" ")[0]}</div>
                    <div className="db-appt-month">{a.date.split(" ")[1]}</div>
                  </div>
                  <div className="db-appt-info">
                    <div className="db-appt-title">{a.title}</div>
                    <div className="db-appt-doctor">{a.doctor}</div>
                    <div className="db-appt-time">{a.time}</div>
                  </div>
                  <span className="db-badge db-badge--info">Upcoming</span>
                </div>
              ))}

              <div className="db-sub-title" style={{ marginTop: "1.5rem" }}>Past</div>
              {appointments.filter(a => a.status === "completed").map(a => (
                <div key={a.id} className="db-appt-card db-appt-card--past">
                  <div className="db-appt-date-box db-appt-date-box--past">
                    <div className="db-appt-day">{a.date.split(" ")[0]}</div>
                    <div className="db-appt-month">{a.date.split(" ")[1]}</div>
                  </div>
                  <div className="db-appt-info">
                    <div className="db-appt-title">{a.title}</div>
                    <div className="db-appt-doctor">{a.doctor}</div>
                    <div className="db-appt-time">{a.time}</div>
                  </div>
                  <span className="db-badge db-badge--normal">Completed</span>
                </div>
              ))}
            </>)}

            {/* ══ MEDICATIONS ══ */}
            {active === "medications" && (<>
              <div className="db-progress-card">
                <div className="db-progress-label">{takenCount} of {meds.length} taken today</div>
                <div className="db-progress-bar">
                  <div className="db-progress-fill" style={{ width: `${(takenCount / meds.length) * 100}%` }}></div>
                </div>
              </div>
              {meds.map(m => (
                <div key={m.id} className={`db-med-card ${m.taken ? "db-med-card--taken" : ""}`}>
                  <div>
                    <div className="db-med-name">{m.name}</div>
                    <div className="db-med-detail">{m.dose} · {m.frequency}</div>
                    <div className="db-med-time">{m.time}</div>
                  </div>
                  <button
                    className={`db-med-toggle ${m.taken ? "db-med-toggle--taken" : ""}`}
                    onClick={() => toggleMed(m.id)}>
                    {m.taken ? "✓ Taken" : "Mark taken"}
                  </button>
                </div>
              ))}
              <div className="db-notice">Do not adjust your medication without consulting your doctor or nurse.</div>
            </>)}

            {/* ══ REPORTS ══ */}
            {active === "reports" && (<>
              {reports.map(r => (
                <div key={r.id} className="db-report-card">
                  <div className="db-report-left">
                    <span className="db-badge db-badge--neutral">{r.type}</span>
                    <div>
                      <div className="db-report-title">{r.title}</div>
                      <div className="db-report-date">{r.date}</div>
                    </div>
                  </div>
                  <button className="db-view-btn">View Report</button>
                </div>
              ))}
              <div className="db-notice">Reports are provided by your clinical team. Contact your doctor for interpretation.</div>
            </>)}

          </div>
        </div>
      </main>
    </div>
  );
}
