import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";

// ─── Shared fetch helper ──────────────────────────────────────────────────────
const API = "http://10.0.0.116:8080/api/v1";
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

// ─── Static demo data (replace with API calls when endpoints exist) ───────────
const PATIENTS = [
  {
    id: "P087b7513",
    name: "Matthew Schiavo",
    age: 29,
    room: "B-101",
    diagnosis: "Hypertension",
    condition: "Stable",
    admitted: "20 Mar 2026",
  },
  {
    id: "Pa2567288",
    name: "Karim Belhaj",
    age: 58,
    room: "B-102",
    diagnosis: "Acute Heart Failure",
    condition: "Critical",
    admitted: "28 Mar 2026",
  },
  {
    id: "Pb1234567",
    name: "Lena Farhat",
    age: 45,
    room: "B-103",
    diagnosis: "Arrhythmia",
    condition: "Stable",
    admitted: "22 Mar 2026",
  },
  {
    id: "Pc9876543",
    name: "Omar Slimane",
    age: 67,
    room: "B-104",
    diagnosis: "Coronary Artery Disease",
    condition: "Caution",
    admitted: "25 Mar 2026",
  },
  {
    id: "Pd1122334",
    name: "Nour Trabelsi",
    age: 29,
    room: "B-105",
    diagnosis: "Mitral Valve Prolapse",
    condition: "Stable",
    admitted: "27 Mar 2026",
  },
];

const VITALS_MAP = {
  P087b7513: { hr: 78, bp: "118/76", spo2: 98, temp: 37.1, rr: 16 },
  Pa2567288: { hr: 102, bp: "145/90", spo2: 93, temp: 38.6, rr: 22 },
  Pb1234567: { hr: 72, bp: "120/80", spo2: 99, temp: 36.8, rr: 15 },
  Pc9876543: { hr: 88, bp: "135/85", spo2: 96, temp: 37.4, rr: 18 },
  Pd1122334: { hr: 68, bp: "110/70", spo2: 99, temp: 36.6, rr: 14 },
};

const ALERTS_INIT = [
  {
    id: 1,
    patientName: "Karim Belhaj",
    room: "B-102",
    type: "critical",
    message: "Heart rate 102 bpm — exceeds threshold",
    time: "5m ago",
  },
  {
    id: 2,
    patientName: "Karim Belhaj",
    room: "B-102",
    type: "critical",
    message: "SpO₂ at 93% — possible respiratory compromise",
    time: "8m ago",
  },
  {
    id: 3,
    patientName: "Omar Slimane",
    room: "B-104",
    type: "caution",
    message: "BP 135/85 — elevated, review medication",
    time: "22m ago",
  },
];

const APPOINTMENTS = [
  {
    id: 1,
    patientName: "Matthew Schiavo",
    room: "B-101",
    time: "09:30 AM",
    type: "Follow-up consultation",
    status: "done",
  },
  {
    id: 2,
    patientName: "Karim Belhaj",
    room: "B-102",
    time: "11:00 AM",
    type: "Emergency review",
    status: "done",
  },
  {
    id: 3,
    patientName: "Lena Farhat",
    room: "B-103",
    time: "01:30 PM",
    type: "ECG result review",
    status: "pending",
  },
  {
    id: 4,
    patientName: "Omar Slimane",
    room: "B-104",
    time: "03:00 PM",
    type: "Medication adjustment",
    status: "pending",
  },
  {
    id: 5,
    patientName: "Nour Trabelsi",
    room: "B-105",
    time: "04:30 PM",
    type: "Discharge assessment",
    status: "pending",
  },
];

const LAB_RESULTS = [
  {
    id: 1,
    patientName: "Karim Belhaj",
    test: "BNP Level",
    result: "820 pg/mL",
    ref: "<100 pg/mL",
    flag: "high",
  },
  {
    id: 2,
    patientName: "Matthew Schiavo",
    test: "HbA1c",
    result: "5.8%",
    ref: "<5.7%",
    flag: "high",
  },
  {
    id: 3,
    patientName: "Omar Slimane",
    test: "LDL Cholesterol",
    result: "142 mg/dL",
    ref: "<100 mg/dL",
    flag: "high",
  },
  {
    id: 4,
    patientName: "Lena Farhat",
    test: "TSH",
    result: "2.1 mIU/L",
    ref: "0.4–4.0",
    flag: "normal",
  },
  {
    id: 5,
    patientName: "Nour Trabelsi",
    test: "CBC — Haemoglobin",
    result: "13.2 g/dL",
    ref: "12.0–16.0",
    flag: "normal",
  },
];

const NOTES_INIT = [
  {
    id: 1,
    patientName: "Karim Belhaj",
    date: "Today 10:45 AM",
    note: "Patient presenting with acute decompensated heart failure. BNP markedly elevated. Initiated IV Furosemide. Monitoring fluid balance closely. Echo ordered.",
  },
  {
    id: 2,
    patientName: "Matthew Schiavo",
    date: "Today 09:35 AM",
    note: "BP well controlled on current regimen. HbA1c mildly elevated — referred for dietary counselling. Continue Metoprolol 50mg.",
  },
  {
    id: 3,
    patientName: "Omar Slimane",
    date: "Yesterday 03:00 PM",
    note: "LDL elevated despite statin therapy. Increased Atorvastatin to 40mg. Lifestyle modification discussed. Follow-up in 4 weeks.",
  },
];

const PROC_INIT = [
  {
    id: 1,
    patientName: "Karim Belhaj",
    procedure: "Echocardiogram",
    date: "30 Mar 2026",
    status: "scheduled",
  },
  {
    id: 2,
    patientName: "Lena Farhat",
    procedure: "24h Holter Monitor",
    date: "1 Apr 2026",
    status: "scheduled",
  },
  {
    id: 3,
    patientName: "Matthew Schiavo",
    procedure: "Stress ECG",
    date: "3 Apr 2026",
    status: "scheduled",
  },
  {
    id: 4,
    patientName: "Omar Slimane",
    procedure: "Coronary Angiography",
    date: "5 Apr 2026",
    status: "pending approval",
  },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Overview", icon: <HomeIcon /> },
  { id: "patients", label: "Patients", icon: <PatientsIcon /> },
  { id: "vitals", label: "Vitals", icon: <HeartIcon /> },
  { id: "alerts", label: "Alerts", icon: <BellIcon /> },
  { id: "appointments", label: "Appointments", icon: <CalIcon /> },
  { id: "labs", label: "Lab Results", icon: <LabIcon /> },
  { id: "prescriptions", label: "Prescriptions", icon: <PillIcon /> },
  { id: "notes", label: "Notes", icon: <NoteIcon /> },
  { id: "procedures", label: "Procedures", icon: <ProcIcon /> },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  );
}
function PatientsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function LabIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
    </svg>
  );
}
function PillIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function ProcIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initials = (name) =>
  name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";
const condColor = (c) =>
  c === "Critical" ? "critical" : c === "Caution" ? "caution" : "normal";
const flagColor = (f) =>
  f === "high" ? "critical" : f === "low" ? "caution" : "normal";

const Badge = ({ label, variant = "normal" }) => (
  <span className={`dd-badge dd-badge--${variant}`}>{label}</span>
);

const SectionHeading = ({ children }) => (
  <h3 className="dd-section-heading">{children}</h3>
);

const EmptyState = ({ icon, title, sub }) => (
  <div className="dd-empty-state">
    <div className="dd-empty-icon">{icon}</div>
    <p>{title}</p>
    {sub && <p className="dd-empty-sub">{sub}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null);
  const [active, setActive] = useState("home");
  const [dismissed, setDismiss] = useState([]);
  const [rx, setRx] = useState([]);
  const [rxLoading, setRxLoading] = useState(false);
  const [notes, setNotes] = useState(NOTES_INIT);
  const [procedures, setProc] = useState(PROC_INIT);
  const [selPatient, setSelPat] = useState(null);
  const [sidebarOpen, setSidebar] = useState(false);

  const [noteForm, setNoteForm] = useState({ patient: "", note: "" });
  const [rxForm, setRxForm] = useState({
    patient: "",
    med: "",
    dose: "",
    freq: "",
    startDate: "",
    endDate: "",
  });
  const [procForm, setProcForm] = useState({
    patient: "",
    procedure: "",
    date: "",
  });

  // ── Fetch doctor profile ─────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    (async () => {
      try {
        const res = await authFetch(`${API}/auth/me`);
        if (res.ok) setDoctorData(await res.json());
        else if (res.status === 401) window.location.href = "/login";
      } catch (e) {
        console.error("Profile:", e);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ── Alerts ───────────────────────────────────────────────────────────────
  const visAlerts = ALERTS_INIT.filter((a) => !dismissed.includes(a.id));
  const criticalCount = visAlerts.filter((a) => a.type === "critical").length;
  const dismissAlert = (id) => setDismiss((p) => [...p, id]);

  // ── Add note ─────────────────────────────────────────────────────────────
  const addNote = () => {
    if (!noteForm.patient || !noteForm.note.trim()) return;
    setNotes((p) => [
      {
        id: Date.now(),
        patientName: noteForm.patient,
        date: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        note: noteForm.note,
      },
      ...p,
    ]);
    setNoteForm({ patient: "", note: "" });
  };

  // ── Issue prescription ───────────────────────────────────────────────────
  const addRx = async () => {
    if (!rxForm.patient || !rxForm.med.trim()) return;
    setRxLoading(true);

    const payload = {
      patientId: rxForm.patient,
      name: rxForm.med, // Changed from medicationName to name
      dose: rxForm.dose, // Matches MedicationData 'dose'
      frequency: rxForm.freq, // Matches MedicationData 'frequency'
      time: rxForm.startDate, // Ensure this matches your backend field
      takenToday: false,
    };
    try {
      const res = await authFetch(`${API}/medication/prescribe`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newMed = await res.json();
        setRx((p) => [newMed, ...p]);
        setRxForm({
          patient: "",
          med: "",
          dose: "",
          freq: "",
          startDate: "",
          endDate: "",
        });
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed: ${err.message || res.status}`);
      }
    } catch (e) {
      alert("Network error — check backend connection.");
    }
    setRxLoading(false);
  };

  // ── Add procedure ────────────────────────────────────────────────────────
  const addProc = async () => {
    if (!procForm.patient || !procForm.procedure.trim()) return;

    const payload = {
      patientId: procForm.patient, // Ensure the doctor enters the P-ID
      name: procForm.procedure,
      date: procForm.date,
    };

    try {
      const res = await authFetch(`${API}/procedure/assign`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newProc = await res.json();
        setProc((p) => [newProc, ...p]);
        setProcForm({ patient: "", procedure: "", date: "" });
        alert("Procedure scheduled!");
      }
    } catch (e) {
      console.error("Procedure Error:", e);
    }
  };

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="dd-root">
      {sidebarOpen && (
        <div className="dd-overlay" onClick={() => setSidebar(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={`dd-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dd-sidebar-logo">
          <div className="dd-logo-icon">
            <PulseIcon />
          </div>
          <span className="dd-logo-text">PulseLink</span>
        </div>
        <div className="dd-portal-label">Doctor Portal</div>

        <nav className="dd-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`dd-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => {
                setActive(item.id);
                setSelPat(null);
                setSidebar(false);
              }}
            >
              <span className="dd-nav-icon">{item.icon}</span>
              <span className="dd-nav-label">{item.label}</span>
              {item.id === "alerts" && visAlerts.length > 0 && (
                <span
                  className={`dd-nav-badge ${criticalCount > 0 ? "dd-nav-badge--critical" : "dd-nav-badge--warn"}`}
                >
                  {visAlerts.length}
                </span>
              )}
              {active === item.id && <span className="dd-nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="dd-sidebar-bottom">
          <div className="dd-doctor-card">
            <div className="dd-doctor-avatar">
              {doctorData
                ? initials(`${doctorData.firstName} ${doctorData.lastName}`)
                : "…"}
            </div>
            <div className="dd-doctor-info">
              <div className="dd-doctor-name">
                {doctorData
                  ? `Dr. ${doctorData.firstName} ${doctorData.lastName}`
                  : "Loading…"}
              </div>
              <div className="dd-doctor-id">{doctorData?.id}</div>
            </div>
          </div>
          <button className="dd-logout-btn" onClick={logout}>
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="dd-main">
        <header className="dd-topbar">
          <button
            className="dd-hamburger"
            onClick={() => setSidebar((s) => !s)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="dd-topbar-left">
            <h1 className="dd-topbar-title">
              {NAV.find((n) => n.id === active)?.label}
            </h1>
            <p className="dd-topbar-date">{dateStr}</p>
          </div>
          <div className="dd-topbar-right">
            {criticalCount > 0 && (
              <div className="dd-critical-banner">
                <span className="dd-critical-dot" />
                {criticalCount} critical
              </div>
            )}
          </div>
        </header>

        <div className="dd-content">
          {/* ══ OVERVIEW ═══════════════════════════════════════════════════ */}
          {active === "home" && (
            <div className="dd-section fade-in">
              {/* Welcome */}
              <div className="dd-welcome-banner">
                <div>
                  <p className="dd-welcome-greeting">Good morning,</p>
                  <h2 className="dd-welcome-name">
                    Dr. {doctorData?.firstName || "Doctor"}
                  </h2>
                </div>
                <div className="dd-welcome-chips">
                  <span className="dd-role-chip">DOCTOR</span>
                  <span className="dd-id-chip">{doctorData?.id}</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="dd-stats-grid">
                {[
                  {
                    label: "My Patients",
                    value: PATIENTS.length,
                    sub: "Under your care",
                    variant: "default",
                  },
                  {
                    label: "Critical",
                    value: PATIENTS.filter((p) => p.condition === "Critical")
                      .length,
                    sub: "Require attention",
                    variant: "critical",
                  },
                  {
                    label: "Pending Visits",
                    value: APPOINTMENTS.filter((a) => a.status === "pending")
                      .length,
                    sub: "Today's schedule",
                    variant: "default",
                  },
                  {
                    label: "Active Alerts",
                    value: visAlerts.length,
                    sub: "Unresolved",
                    variant: visAlerts.length > 0 ? "warn" : "default",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`dd-stat-card dd-stat-card--${s.variant}`}
                  >
                    <div className="dd-stat-value">{s.value}</div>
                    <div className="dd-stat-label">{s.label}</div>
                    <div className="dd-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Critical patients */}
              {PATIENTS.filter((p) => p.condition === "Critical").length >
                0 && (
                <>
                  <SectionHeading>Critical Patients</SectionHeading>
                  <div className="dd-critical-list">
                    {PATIENTS.filter((p) => p.condition === "Critical").map(
                      (p) => {
                        const v = VITALS_MAP[p.id];
                        return (
                          <div key={p.id} className="dd-critical-card">
                            <div className="dd-critical-left">
                              <div className="dd-avatar dd-avatar--critical">
                                {initials(p.name)}
                              </div>
                              <div>
                                <div className="dd-patient-name">{p.name}</div>
                                <div className="dd-patient-sub">
                                  {p.room} · {p.diagnosis}
                                </div>
                              </div>
                            </div>
                            {v && (
                              <div className="dd-critical-vitals">
                                {[
                                  ["HR", v.hr, "bpm"],
                                  ["BP", v.bp, ""],
                                  ["SpO₂", v.spo2, "%"],
                                ].map(([l, val, u]) => (
                                  <div key={l} className="dd-crit-vital">
                                    <div className="dd-crit-vital-label">
                                      {l}
                                    </div>
                                    <div className="dd-crit-vital-val">
                                      {val}
                                      <span className="dd-crit-vital-unit">
                                        {u}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <Badge label={p.condition} variant="critical" />
                          </div>
                        );
                      },
                    )}
                  </div>
                </>
              )}

              {/* Today's appointments preview */}
              <SectionHeading>Today's Schedule</SectionHeading>
              <div className="dd-appt-list">
                {APPOINTMENTS.map((a) => (
                  <div
                    key={a.id}
                    className={`dd-appt-row ${a.status === "done" ? "done" : ""}`}
                  >
                    <div className="dd-appt-time">{a.time}</div>
                    <div className="dd-appt-dot" data-status={a.status} />
                    <div className="dd-appt-info">
                      <div className="dd-appt-name">{a.patientName}</div>
                      <div className="dd-appt-type">
                        {a.type} · {a.room}
                      </div>
                    </div>
                    <Badge
                      label={a.status === "done" ? "Done" : "Pending"}
                      variant={a.status === "done" ? "normal" : "warn"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PATIENTS ═══════════════════════════════════════════════════ */}
          {active === "patients" && (
            <div className="dd-section fade-in">
              {selPatient ? (
                <>
                  <button
                    className="dd-back-link"
                    onClick={() => setSelPat(null)}
                  >
                    ← All patients
                  </button>
                  <div className="dd-patient-detail">
                    <div className="dd-patient-detail-header">
                      <div className="dd-avatar dd-avatar--accent dd-avatar--lg">
                        {initials(selPatient.name)}
                      </div>
                      <div className="dd-patient-detail-info">
                        <h2>{selPatient.name}</h2>
                        <p>
                          {selPatient.room} · Age {selPatient.age} · Admitted{" "}
                          {selPatient.admitted}
                        </p>
                        <p className="dd-patient-diag">
                          {selPatient.diagnosis}
                        </p>
                      </div>
                      <Badge
                        label={selPatient.condition}
                        variant={condColor(selPatient.condition)}
                      />
                    </div>

                    {/* Vitals panel */}
                    {VITALS_MAP[selPatient.id] && (
                      <>
                        <SectionHeading>Current Vitals</SectionHeading>
                        <div className="dd-vitals-row">
                          {[
                            ["Heart Rate", VITALS_MAP[selPatient.id].hr, "bpm"],
                            [
                              "Blood Pressure",
                              VITALS_MAP[selPatient.id].bp,
                              "mmHg",
                            ],
                            ["SpO₂", VITALS_MAP[selPatient.id].spo2, "%"],
                            [
                              "Temperature",
                              VITALS_MAP[selPatient.id].temp,
                              "°C",
                            ],
                            [
                              "Resp. Rate",
                              VITALS_MAP[selPatient.id].rr,
                              "br/min",
                            ],
                          ].map(([label, val, unit]) => (
                            <div key={label} className="dd-vital-pill">
                              <div className="dd-vital-pill-label">{label}</div>
                              <div className="dd-vital-pill-value">
                                {val}
                                <span className="dd-vital-pill-unit">
                                  {unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Patient notes */}
                    {notes.filter((n) => n.patientName === selPatient.name)
                      .length > 0 && (
                      <>
                        <SectionHeading>Clinical Notes</SectionHeading>
                        {notes
                          .filter((n) => n.patientName === selPatient.name)
                          .map((n) => (
                            <div key={n.id} className="dd-note-card">
                              <div className="dd-note-date">{n.date}</div>
                              <p className="dd-note-text">{n.note}</p>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="dd-patient-grid">
                    {PATIENTS.map((p) => (
                      <div
                        key={p.id}
                        className="dd-patient-card"
                        onClick={() => setSelPat(p)}
                      >
                        <div className="dd-patient-card-top">
                          <div
                            className={`dd-avatar dd-avatar--${condColor(p.condition)}`}
                          >
                            {initials(p.name)}
                          </div>
                          <Badge
                            label={p.condition}
                            variant={condColor(p.condition)}
                          />
                        </div>
                        <div className="dd-patient-card-name">{p.name}</div>
                        <div className="dd-patient-card-sub">
                          {p.room} · Age {p.age}
                        </div>
                        <div className="dd-patient-card-diag">
                          {p.diagnosis}
                        </div>
                        <div className="dd-patient-card-admitted">
                          Admitted {p.admitted}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ VITALS ════════════════════════════════════════════════════ */}
          {active === "vitals" && (
            <div className="dd-section fade-in">
              <div className="dd-vitals-table-wrap">
                <table className="dd-vitals-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Room</th>
                      <th>HR (bpm)</th>
                      <th>BP (mmHg)</th>
                      <th>SpO₂ (%)</th>
                      <th>Temp (°C)</th>
                      <th>RR (br/min)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PATIENTS.map((p) => {
                      const v = VITALS_MAP[p.id];
                      return (
                        <tr
                          key={p.id}
                          className={
                            p.condition === "Critical" ? "dd-tr--critical" : ""
                          }
                        >
                          <td>
                            <div className="dd-table-patient">
                              <div
                                className={`dd-avatar dd-avatar--sm dd-avatar--${condColor(p.condition)}`}
                              >
                                {initials(p.name)}
                              </div>
                              {p.name}
                            </div>
                          </td>
                          <td className="dd-mono">{p.room}</td>
                          <td
                            className={`dd-mono ${v?.hr > 100 ? "dd-val--warn" : ""}`}
                          >
                            {v?.hr ?? "—"}
                          </td>
                          <td className="dd-mono">{v?.bp ?? "—"}</td>
                          <td
                            className={`dd-mono ${v?.spo2 < 95 ? "dd-val--critical" : ""}`}
                          >
                            {v?.spo2 ?? "—"}
                          </td>
                          <td
                            className={`dd-mono ${v?.temp > 38 ? "dd-val--warn" : ""}`}
                          >
                            {v?.temp ?? "—"}
                          </td>
                          <td
                            className={`dd-mono ${v?.rr > 20 ? "dd-val--warn" : ""}`}
                          >
                            {v?.rr ?? "—"}
                          </td>
                          <td>
                            <Badge
                              label={p.condition}
                              variant={condColor(p.condition)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ALERTS ════════════════════════════════════════════════════ */}
          {active === "alerts" && (
            <div className="dd-section fade-in">
              {visAlerts.length === 0 ? (
                <EmptyState
                  icon={<BellIcon />}
                  title="No active alerts"
                  sub="All patients are within normal parameters."
                />
              ) : (
                <div className="dd-alert-list">
                  {visAlerts.map((a) => (
                    <div
                      key={a.id}
                      className={`dd-alert-card dd-alert-card--${a.type}`}
                    >
                      <div className="dd-alert-left">
                        <div
                          className={`dd-alert-dot dd-alert-dot--${a.type}`}
                        />
                        <div>
                          <div className="dd-alert-patient">
                            {a.patientName}{" "}
                            <span className="dd-alert-room">· {a.room}</span>
                          </div>
                          <div className="dd-alert-msg">{a.message}</div>
                          <div className="dd-alert-time">{a.time}</div>
                        </div>
                      </div>
                      <button
                        className="dd-dismiss-btn"
                        onClick={() => dismissAlert(a.id)}
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ APPOINTMENTS ══════════════════════════════════════════════ */}
          {active === "appointments" && (
            <div className="dd-section fade-in">
              <div className="dd-appt-full-list">
                {APPOINTMENTS.map((a) => (
                  <div
                    key={a.id}
                    className={`dd-appt-full-card ${a.status === "done" ? "done" : ""}`}
                  >
                    <div className="dd-appt-full-time">{a.time}</div>
                    <div className="dd-appt-full-body">
                      <div className="dd-appt-full-name">{a.patientName}</div>
                      <div className="dd-appt-full-meta">
                        {a.type} · {a.room}
                      </div>
                    </div>
                    <Badge
                      label={a.status === "done" ? "Completed" : "Pending"}
                      variant={a.status === "done" ? "normal" : "warn"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ LAB RESULTS ═══════════════════════════════════════════════ */}
          {active === "labs" && (
            <div className="dd-section fade-in">
              <div className="dd-lab-list">
                {LAB_RESULTS.map((l) => (
                  <div
                    key={l.id}
                    className={`dd-lab-card ${l.flag !== "normal" ? "dd-lab-card--flagged" : ""}`}
                  >
                    <div className="dd-lab-left">
                      <div className="dd-lab-test">{l.test}</div>
                      <div className="dd-lab-patient">{l.patientName}</div>
                    </div>
                    <div className="dd-lab-right">
                      <div
                        className={`dd-lab-result dd-lab-result--${flagColor(l.flag)}`}
                      >
                        {l.result}
                      </div>
                      <div className="dd-lab-ref">Ref: {l.ref}</div>
                    </div>
                    <Badge label={l.flag} variant={flagColor(l.flag)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PRESCRIPTIONS ═════════════════════════════════════════════ */}
          {active === "prescriptions" && (
            <div className="dd-section fade-in">
              <div className="dd-form-card">
                <h3 className="dd-form-title">Issue New Prescription</h3>
                <div className="dd-form-grid">
                  <input
                    className="dd-input"
                    placeholder="Patient ID (e.g. P087b7513)"
                    value={rxForm.patient}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, patient: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="Medication name"
                    value={rxForm.med}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, med: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="Dosage (e.g. 50mg)"
                    value={rxForm.dose}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, dose: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="Frequency (e.g. Once daily)"
                    value={rxForm.freq}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, freq: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="Start date (YYYY-MM-DD)"
                    value={rxForm.startDate}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, startDate: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="End date (YYYY-MM-DD)"
                    value={rxForm.endDate}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, endDate: e.target.value })
                    }
                  />
                </div>
                <button
                  className="dd-submit-btn"
                  onClick={addRx}
                  disabled={rxLoading}
                >
                  {rxLoading ? "Issuing…" : "Issue Prescription"}
                </button>
              </div>

              {rx.length > 0 && (
                <>
                  <SectionHeading>Issued This Session</SectionHeading>
                  <div className="dd-rx-list">
                    {rx.map((m, i) => (
                      <div key={m.id || i} className="dd-rx-card">
                        <div className="dd-rx-name">
                          {m.medicationName}{" "}
                          <span className="dd-rx-dose">{m.dosage}</span>
                        </div>
                        <div className="dd-rx-meta">
                          {m.frequency} · Patient: {m.patientId}
                        </div>
                        {m.startDate && (
                          <div className="dd-rx-dates">
                            {m.startDate} → {m.endDate}
                          </div>
                        )}
                        <Badge label="Issued" variant="normal" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ NOTES ═════════════════════════════════════════════════════ */}
          {active === "notes" && (
            <div className="dd-section fade-in">
              <div className="dd-form-card">
                <h3 className="dd-form-title">Add Clinical Note</h3>
                <div className="dd-form-grid dd-form-grid--single">
                  <input
                    className="dd-input"
                    placeholder="Patient name"
                    value={noteForm.patient}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, patient: e.target.value })
                    }
                  />
                  <textarea
                    className="dd-input dd-textarea"
                    placeholder="Write clinical note…"
                    rows={4}
                    value={noteForm.note}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, note: e.target.value })
                    }
                  />
                </div>
                <button className="dd-submit-btn" onClick={addNote}>
                  Save Note
                </button>
              </div>

              <SectionHeading>Clinical Notes</SectionHeading>
              <div className="dd-notes-list">
                {notes.map((n) => (
                  <div key={n.id} className="dd-note-card">
                    <div className="dd-note-header">
                      <div
                        className={`dd-avatar dd-avatar--sm dd-avatar--accent`}
                      >
                        {initials(n.patientName)}
                      </div>
                      <div>
                        <div className="dd-note-patient">{n.patientName}</div>
                        <div className="dd-note-date">{n.date}</div>
                      </div>
                    </div>
                    <p className="dd-note-text">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PROCEDURES ════════════════════════════════════════════════ */}
          {active === "procedures" && (
            <div className="dd-section fade-in">
              <div className="dd-form-card">
                <h3 className="dd-form-title">Schedule Procedure</h3>
                <div className="dd-form-grid">
                  <input
                    className="dd-input"
                    placeholder="Patient name"
                    value={procForm.patient}
                    onChange={(e) =>
                      setProcForm({ ...procForm, patient: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="Procedure name"
                    value={procForm.procedure}
                    onChange={(e) =>
                      setProcForm({ ...procForm, procedure: e.target.value })
                    }
                  />
                  <input
                    className="dd-input"
                    placeholder="Date (e.g. 1 Apr 2026)"
                    value={procForm.date}
                    onChange={(e) =>
                      setProcForm({ ...procForm, date: e.target.value })
                    }
                  />
                </div>
                <button className="dd-submit-btn" onClick={addProc}>
                  Schedule
                </button>
              </div>

              <SectionHeading>Scheduled Procedures</SectionHeading>
              <div className="dd-proc-list">
                {procedures.map((p) => (
                  <div key={p.id} className="dd-proc-card">
                    <div className="dd-proc-left">
                      <div className="dd-proc-name">{p.procedure}</div>
                      <div className="dd-proc-patient">{p.patientName}</div>
                    </div>
                    <div className="dd-proc-date">{p.date}</div>
                    <Badge
                      label={p.status}
                      variant={
                        p.status === "scheduled"
                          ? "normal"
                          : p.status === "pending approval"
                            ? "warn"
                            : "default"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
