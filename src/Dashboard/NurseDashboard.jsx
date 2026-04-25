import React, { useState, useEffect } from "react";
import "./NurseDashboard.css";

// ─── API Config ───────────────────────────────────────────────────────────────
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

// ─── Static task init (no patient dependency) ─────────────────────────────────
const TASKS_INIT = [
  { id: 1, text: "Submit shift handover report", done: false, priority: "medium" },
  { id: 2, text: "Restock supply cart — Bay 2", done: false, priority: "low" },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",         label: "Overview",   icon: <HomeIcon /> },
  { id: "patients",    label: "Patients",   icon: <PatientsIcon /> },
  { id: "vitals",      label: "Vitals",     icon: <HeartIcon /> },
  { id: "alerts",      label: "Alerts",     icon: <BellIcon /> },
  { id: "appointments",label: "Schedule",   icon: <CalIcon /> },
  { id: "medications", label: "Medications",icon: <PillIcon /> },
  { id: "tasks",       label: "Tasks",      icon: <TaskIcon /> },
  { id: "reports",     label: "Reports",    icon: <ReportIcon /> },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  );
}
function PatientsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function PillIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initials = (name) =>
  name ? name.split(" ").map((w) => w[0]).join("").toUpperCase() : "?";
const condColor = (c) =>
  c === "Critical" ? "critical" : c === "Caution" ? "caution" : "normal";

const Badge = ({ label, variant = "normal" }) => (
  <span className={`nd-badge nd-badge--${variant}`}>{label}</span>
);
const SectionHeading = ({ children }) => (
  <h3 className="nd-section-heading">{children}</h3>
);
const EmptyState = ({ icon, title, sub }) => (
  <div className="nd-empty-state">
    <div className="nd-empty-icon">{icon}</div>
    <p>{title}</p>
    {sub && <p className="nd-empty-sub">{sub}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
function NurseDashboard({ navigate }) {
  const [nurseData, setNurseData]     = useState(null);
  const [active, setActive]           = useState("home");
  const [sidebarOpen, setSidebar]     = useState(false);
  const [selPatient, setSelPat]       = useState(null);

  // Live data from API
  const [patients, setPatients]       = useState([]);
  const [alerts, setAlerts]           = useState([]);
  const [appointments, setAppts]      = useState([]);
  const [meds, setMeds]               = useState([]);
  const [reports, setReports]         = useState([]);

  // Local state
  const [dismissed, setDismiss]       = useState([]);
  const [tasks, setTasks]             = useState(TASKS_INIT);
  const [newTask, setNewTask]         = useState("");

  // Add Patient modal
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [addPatientForm, setAddPatientForm] = useState({ patientId: "" });
  const [addPatientLoading, setAddPatientLoading] = useState(false);
  const [addPatientError, setAddPatientError]   = useState("");

  // ── Fetch nurse profile ──────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    (async () => {
      try {
        const res = await authFetch(`${API}/auth/me`);
        if (res.ok) setNurseData(await res.json());
        else if (res.status === 401) window.location.href = "/login";
      } catch (e) { console.error("Profile:", e); }
    })();
  }, []);

  // ── Fetch patients under supervision ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API}/patients/supervised`);
        if (res.ok) setPatients(await res.json());
      } catch (e) { console.error("Patients:", e); }
    })();
  }, []);

  // ── Fetch alerts (poll every 10s) ────────────────────────────────────────
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await authFetch(`${API}/alerts/all`);
        if (res.ok) setAlerts(await res.json());
      } catch (e) { console.error("Alerts:", e); }
    };
    fetchAlerts();
    const iv = setInterval(fetchAlerts, 10000);
    return () => clearInterval(iv);
  }, []);

  // ── Fetch appointments when tab is active ────────────────────────────────
  useEffect(() => {
    if (active !== "appointments" && active !== "home") return;
    (async () => {
      try {
        const res = await authFetch(`${API}/appointments`);
        if (res.ok) setAppts(await res.json());
      } catch (e) { console.error("Appointments:", e); }
    })();
  }, [active]);

  // ── Fetch medications when tab is active ─────────────────────────────────
  useEffect(() => {
    if (active !== "medications") return;
    (async () => {
      try {
        const res = await authFetch(`${API}/medication/all`);
        if (res.ok) setMeds(await res.json());
      } catch (e) { console.error("Medications:", e); }
    })();
  }, [active]);

  // ── Fetch reports when tab is active ────────────────────────────────────
  useEffect(() => {
    if (active !== "reports") return;
    (async () => {
      try {
        const res = await authFetch(`${API}/reports`);
        if (res.ok) setReports(await res.json());
      } catch (e) { console.error("Reports:", e); }
    })();
  }, [active]);

  // ── Add patient to supervision ───────────────────────────────────────────
  const addPatientToSupervise = async () => {
    if (!addPatientForm.patientId.trim()) return;
    setAddPatientLoading(true);
    setAddPatientError("");
    try {
      const res = await authFetch(`${API}/patients/supervise`, {
        method: "POST",
        body: JSON.stringify({ patientId: addPatientForm.patientId.trim() }),
      });
      if (res.ok) {
        const newPatient = await res.json();
        setPatients((prev) => [...prev, newPatient]);
        setAddPatientForm({ patientId: "" });
        setShowAddPatient(false);
      } else {
        const err = await res.json().catch(() => ({}));
        setAddPatientError(err.message || `Error ${res.status} — patient not found or already assigned.`);
      }
    } catch (e) {
      setAddPatientError("Network error — check backend connection.");
    }
    setAddPatientLoading(false);
  };

  // ── Toggle medication ────────────────────────────────────────────────────
  const toggleMed = async (id) => {
    try {
      const res = await authFetch(`${API}/medication/toggle/${id}`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setMeds((prev) => prev.map((m) => (m.id === id ? updated : m)));
      }
    } catch (e) { console.error(e); }
  };

  // ── Task helpers ─────────────────────────────────────────────────────────
  const toggleTask = (id) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((p) => [...p, { id: Date.now(), text: newTask, done: false, priority: "medium" }]);
    setNewTask("");
  };

  // ── Alert helpers ────────────────────────────────────────────────────────
  const dismissAlert = (id) => setDismiss((p) => [...p, id]);
  const visAlerts    = alerts.filter((a) => !dismissed.includes(a.id));
  const criticalCount = visAlerts.filter((a) => a.type === "critical").length;

  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const givenMeds   = meds.filter((m) => m.given || m.takenToday).length;
  const pendingAppts = appointments.filter((a) => a.status === "pending");
  const doneTasks    = tasks.filter((t) => t.done).length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="nd-root">
      {sidebarOpen && <div className="nd-overlay" onClick={() => setSidebar(false)} />}

      {/* ── Add Patient Modal ──────────────────────────────────────────────── */}
      {showAddPatient && (
        <div className="nd-modal-backdrop" onClick={() => setShowAddPatient(false)}>
          <div className="nd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nd-modal-header">
              <h3 className="nd-modal-title">Add Patient to Supervise</h3>
              <button className="nd-modal-close" onClick={() => { setShowAddPatient(false); setAddPatientError(""); }}>✕</button>
            </div>
            <p className="nd-modal-desc">
              Enter the patient ID to add them to your supervision list. The patient must already be registered in the system.
            </p>
            <div className="nd-modal-body">
              <label className="nd-label">Patient ID</label>
              <input
                className="nd-input"
                placeholder="e.g. P087b7513"
                value={addPatientForm.patientId}
                onChange={(e) => setAddPatientForm({ patientId: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addPatientToSupervise()}
                autoFocus
              />
              {addPatientError && (
                <div className="nd-modal-error">{addPatientError}</div>
              )}
            </div>
            <div className="nd-modal-footer">
              <button
                className="nd-btn-ghost"
                onClick={() => { setShowAddPatient(false); setAddPatientError(""); }}
              >
                Cancel
              </button>
              <button
                className="nd-btn-primary"
                onClick={addPatientToSupervise}
                disabled={addPatientLoading}
              >
                {addPatientLoading ? "Adding…" : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={`nd-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="nd-sidebar-logo">
          <div className="nd-logo-icon"><PulseIcon /></div>
          <span className="nd-logo-text">PulseLink</span>
        </div>
        <div className="nd-portal-label">Nurse Portal</div>

        <nav className="nd-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nd-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => { setActive(item.id); setSelPat(null); setSidebar(false); }}
            >
              <span className="nd-nav-icon">{item.icon}</span>
              <span className="nd-nav-label">{item.label}</span>
              {item.id === "alerts" && visAlerts.length > 0 && (
                <span className={`nd-nav-badge ${criticalCount > 0 ? "nd-nav-badge--critical" : "nd-nav-badge--warn"}`}>
                  {visAlerts.length}
                </span>
              )}
              {item.id === "tasks" && tasks.filter((t) => !t.done).length > 0 && (
                <span className="nd-nav-badge nd-nav-badge--warn">
                  {tasks.filter((t) => !t.done).length}
                </span>
              )}
              {active === item.id && <span className="nd-nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="nd-sidebar-bottom">
          <div className="nd-nurse-card">
            <div className="nd-nurse-avatar">
              {nurseData ? initials(`${nurseData.firstName} ${nurseData.lastName}`) : "…"}
            </div>
            <div className="nd-nurse-info">
              <div className="nd-nurse-name">
                {nurseData ? `${nurseData.firstName} ${nurseData.lastName}` : "Loading…"}
              </div>
              <div className="nd-nurse-id">{nurseData?.id}</div>
            </div>
          </div>
          <button className="nd-logout-btn" onClick={logout}>
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="nd-main">
        <header className="nd-topbar">
          <button className="nd-hamburger" onClick={() => setSidebar((s) => !s)}>
            <span /><span /><span />
          </button>
          <div className="nd-topbar-left">
            <h1 className="nd-topbar-title">{NAV.find((n) => n.id === active)?.label}</h1>
            <p className="nd-topbar-date">{dateStr}</p>
          </div>
          <div className="nd-topbar-right">
            {criticalCount > 0 && (
              <div className="nd-critical-banner">
                <span className="nd-critical-dot" />
                {criticalCount} critical
              </div>
            )}
            {navigate && (
              <button className="nd-btn-ghost nd-back-btn" onClick={() => navigate("home")}>
                ← Back
              </button>
            )}
          </div>
        </header>

        <div className="nd-content">

          {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
          {active === "home" && (
            <div className="nd-section fade-in">
              <div className="nd-welcome-banner">
                <div>
                  <p className="nd-welcome-greeting">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},</p>
                  <h2 className="nd-welcome-name">{nurseData?.firstName || "Nurse"}</h2>
                </div>
                <div className="nd-welcome-chips">
                  <span className="nd-role-chip">NURSE</span>
                  <span className="nd-id-chip">{nurseData?.id}</span>
                </div>
              </div>

              <div className="nd-stats-grid">
                {[
                  { label: "My Patients",   value: patients.length,                                         sub: "Under your care",        variant: "default" },
                  { label: "Critical",       value: patients.filter((p) => p.condition === "Critical").length, sub: "Require attention",      variant: "critical" },
                  { label: "Active Alerts",  value: visAlerts.length,                                        sub: "Unresolved",             variant: visAlerts.length > 0 ? "warn" : "default" },
                  { label: "Tasks Pending",  value: tasks.filter((t) => !t.done).length,                   sub: `${doneTasks} completed`,  variant: "default" },
                ].map((s, i) => (
                  <div key={i} className={`nd-stat-card nd-stat-card--${s.variant}`}>
                    <div className="nd-stat-value">{s.value}</div>
                    <div className="nd-stat-label">{s.label}</div>
                    <div className="nd-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {patients.filter((p) => p.condition === "Critical").length > 0 && (
                <>
                  <SectionHeading>Critical Patients</SectionHeading>
                  <div className="nd-critical-list">
                    {patients.filter((p) => p.condition === "Critical").map((p) => (
                      <div key={p.id} className="nd-critical-card">
                        <div className="nd-critical-left">
                          <div className="nd-avatar nd-avatar--critical">{initials(p.name)}</div>
                          <div>
                            <div className="nd-patient-name">{p.name}</div>
                            <div className="nd-patient-sub">{p.room} · Age {p.age}</div>
                          </div>
                        </div>
                        {p.vitals && (
                          <div className="nd-critical-vitals">
                            {[["HR", p.vitals.hr, "bpm"], ["BP", p.vitals.bp, ""], ["SpO₂", p.vitals.spo2, "%"]].map(([l, v, u]) => (
                              <div key={l} className="nd-crit-vital">
                                <div className="nd-crit-vital-label">{l}</div>
                                <div className="nd-crit-vital-val">{v}<span className="nd-crit-vital-unit">{u}</span></div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Badge label={p.condition} variant="critical" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <SectionHeading>Today's Schedule</SectionHeading>
              {pendingAppts.length === 0 ? (
                <EmptyState icon={<CalIcon />} title="No pending appointments" sub="All tasks are up to date." />
              ) : (
                <div className="nd-appt-list">
                  {pendingAppts.slice(0, 5).map((a) => (
                    <div key={a.id} className="nd-appt-row">
                      <div className="nd-appt-time">{a.time}</div>
                      <div className="nd-appt-dot" data-status="pending" />
                      <div className="nd-appt-info">
                        <div className="nd-appt-name">{a.patientName || a.patient}</div>
                        <div className="nd-appt-type">{a.type} · {a.room}</div>
                      </div>
                      <Badge label="Pending" variant="warn" />
                    </div>
                  ))}
                </div>
              )}

              {visAlerts.length > 0 && (
                <>
                  <SectionHeading>Recent Alerts</SectionHeading>
                  <div className="nd-alert-list">
                    {visAlerts.slice(0, 3).map((a) => (
                      <div key={a.id} className={`nd-alert-card nd-alert-card--${a.type}`}>
                        <div className="nd-alert-left">
                          <div className={`nd-alert-dot nd-alert-dot--${a.type}`} />
                          <div>
                            <div className="nd-alert-patient">{a.patientName || a.patient} <span className="nd-alert-room">· {a.room}</span></div>
                            <div className="nd-alert-msg">{a.message}</div>
                            <div className="nd-alert-time">{a.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ PATIENTS ══════════════════════════════════════════════════════ */}
          {active === "patients" && (
            <div className="nd-section fade-in">
              {selPatient ? (
                <>
                  <button className="nd-back-link" onClick={() => setSelPat(null)}>← All patients</button>
                  <div className="nd-patient-detail">
                    <div className="nd-patient-detail-header">
                      <div className={`nd-avatar nd-avatar--accent nd-avatar--lg`}>{initials(selPatient.name)}</div>
                      <div className="nd-patient-detail-info">
                        <h2>{selPatient.name}</h2>
                        <p>{selPatient.room} · Age {selPatient.age}{selPatient.admitted ? ` · Admitted ${selPatient.admitted}` : ""}</p>
                        {selPatient.diagnosis && <p className="nd-patient-diag">{selPatient.diagnosis}</p>}
                      </div>
                      <Badge label={selPatient.condition} variant={condColor(selPatient.condition)} />
                    </div>
                    {selPatient.vitals && (
                      <>
                        <SectionHeading>Current Vitals</SectionHeading>
                        <div className="nd-vitals-row">
                          {[
                            ["Heart Rate",     selPatient.vitals.hr,   "bpm"],
                            ["Blood Pressure", selPatient.vitals.bp,   "mmHg"],
                            ["SpO₂",          selPatient.vitals.spo2, "%"],
                            ["Temperature",   selPatient.vitals.temp, "°C"],
                          ].map(([label, val, unit]) => (
                            <div key={label} className="nd-vital-pill">
                              <div className="nd-vital-pill-label">{label}</div>
                              <div className="nd-vital-pill-value">{val ?? "—"}<span className="nd-vital-pill-unit">{unit}</span></div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {alerts.filter((a) => (a.patientName || a.patient) === selPatient.name).length > 0 && (
                      <>
                        <SectionHeading>Active Alerts</SectionHeading>
                        <div className="nd-alert-list">
                          {alerts.filter((a) => (a.patientName || a.patient) === selPatient.name).map((a) => (
                            <div key={a.id} className={`nd-alert-card nd-alert-card--${a.type}`}>
                              <div className="nd-alert-left">
                                <div className={`nd-alert-dot nd-alert-dot--${a.type}`} />
                                <div>
                                  <div className="nd-alert-msg">{a.message}</div>
                                  <div className="nd-alert-time">{a.time}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="nd-patients-toolbar">
                    <p className="nd-patients-count">{patients.length} patient{patients.length !== 1 ? "s" : ""} under your care</p>
                    <button className="nd-btn-primary nd-btn-add-patient" onClick={() => setShowAddPatient(true)}>
                      <span className="nd-btn-icon"><PlusIcon /></span>
                      Add Patient
                    </button>
                  </div>

                  {patients.length === 0 ? (
                    <div className="nd-empty-patients">
                      <EmptyState
                        icon={<PatientsIcon />}
                        title="No patients assigned yet"
                        sub="Use 'Add Patient' to start supervising a patient."
                      />
                      <button className="nd-btn-primary nd-btn-add-empty" onClick={() => setShowAddPatient(true)}>
                        <span className="nd-btn-icon"><PlusIcon /></span>
                        Add Your First Patient
                      </button>
                    </div>
                  ) : (
                    <div className="nd-patient-grid">
                      {patients.map((p) => (
                        <div key={p.id} className="nd-patient-card" onClick={() => setSelPat(p)}>
                          <div className="nd-patient-card-top">
                            <div className={`nd-avatar nd-avatar--${condColor(p.condition)}`}>{initials(p.name)}</div>
                            <Badge label={p.condition} variant={condColor(p.condition)} />
                          </div>
                          <div className="nd-patient-card-name">{p.name}</div>
                          <div className="nd-patient-card-sub">{p.room} · Age {p.age}</div>
                          {p.diagnosis && <div className="nd-patient-card-diag">{p.diagnosis}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ VITALS ════════════════════════════════════════════════════════ */}
          {active === "vitals" && (
            <div className="nd-section fade-in">
              {patients.length === 0 ? (
                <EmptyState icon={<HeartIcon />} title="No patients to display" sub="Add patients to supervision to view vitals." />
              ) : (
                <div className="nd-vitals-table-wrap">
                  <table className="nd-vitals-table">
                    <thead>
                      <tr>
                        <th>Patient</th><th>Room</th>
                        <th>HR (bpm)</th><th>BP (mmHg)</th>
                        <th>SpO₂ (%)</th><th>Temp (°C)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => {
                        const v = p.vitals;
                        return (
                          <tr key={p.id} className={p.condition === "Critical" ? "nd-tr--critical" : ""}>
                            <td>
                              <div className="nd-table-patient">
                                <div className={`nd-avatar nd-avatar--sm nd-avatar--${condColor(p.condition)}`}>{initials(p.name)}</div>
                                {p.name}
                              </div>
                            </td>
                            <td className="nd-mono">{p.room}</td>
                            <td className={`nd-mono ${v?.hr > 100 ? "nd-val--warn" : ""}`}>{v?.hr ?? "—"}</td>
                            <td className="nd-mono">{v?.bp ?? "—"}</td>
                            <td className={`nd-mono ${v?.spo2 < 95 ? "nd-val--critical" : ""}`}>{v?.spo2 ?? "—"}</td>
                            <td className={`nd-mono ${v?.temp > 38 ? "nd-val--warn" : ""}`}>{v?.temp ?? "—"}</td>
                            <td><Badge label={p.condition} variant={condColor(p.condition)} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="nd-table-notice">Values highlighted in red/amber indicate readings outside the normal range. Verify with patient immediately.</p>
            </div>
          )}

          {/* ══ ALERTS ════════════════════════════════════════════════════════ */}
          {active === "alerts" && (
            <div className="nd-section fade-in">
              {visAlerts.length === 0 ? (
                <EmptyState icon={<BellIcon />} title="No active alerts" sub="All patients are within normal parameters." />
              ) : (
                <div className="nd-alert-list">
                  {visAlerts.map((a) => (
                    <div key={a.id} className={`nd-alert-card nd-alert-card--${a.type}`}>
                      <div className="nd-alert-left">
                        <div className={`nd-alert-dot nd-alert-dot--${a.type}`} />
                        <div>
                          <div className="nd-alert-patient">
                            {a.patientName || a.patient} <span className="nd-alert-room">· {a.room}</span>
                          </div>
                          <div className="nd-alert-msg">{a.message}</div>
                          <div className="nd-alert-time">{a.time}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <Badge label={a.type} variant={a.type === "critical" ? "critical" : a.type === "caution" ? "caution" : "default"} />
                        <button className="nd-dismiss-btn" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ APPOINTMENTS ══════════════════════════════════════════════════ */}
          {active === "appointments" && (
            <div className="nd-section fade-in">
              {appointments.length === 0 ? (
                <EmptyState icon={<CalIcon />} title="No appointments scheduled" sub="Your schedule is clear." />
              ) : (
                <>
                  <SectionHeading>Pending</SectionHeading>
                  <div className="nd-appt-full-list">
                    {appointments.filter((a) => a.status === "pending").map((a) => (
                      <div key={a.id} className="nd-appt-full-card">
                        <div className="nd-appt-full-time">{a.time}</div>
                        <div className="nd-appt-full-body">
                          <div className="nd-appt-full-name">{a.patientName || a.patient}</div>
                          <div className="nd-appt-full-meta">{a.type} · {a.room}</div>
                        </div>
                        <Badge label="Pending" variant="warn" />
                      </div>
                    ))}
                  </div>
                  <SectionHeading>Completed</SectionHeading>
                  <div className="nd-appt-full-list">
                    {appointments.filter((a) => a.status === "done").map((a) => (
                      <div key={a.id} className="nd-appt-full-card done">
                        <div className="nd-appt-full-time">{a.time}</div>
                        <div className="nd-appt-full-body">
                          <div className="nd-appt-full-name">{a.patientName || a.patient}</div>
                          <div className="nd-appt-full-meta">{a.type} · {a.room}</div>
                        </div>
                        <Badge label="Done" variant="normal" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ MEDICATIONS ═══════════════════════════════════════════════════ */}
          {active === "medications" && (
            <div className="nd-section fade-in">
              {meds.length > 0 && (
                <div className="nd-progress-card">
                  <div className="nd-progress-label">{givenMeds} of {meds.length} medications administered today</div>
                  <div className="nd-progress-bar">
                    <div className="nd-progress-fill" style={{ width: `${(givenMeds / meds.length) * 100}%` }} />
                  </div>
                </div>
              )}
              {meds.length === 0 ? (
                <EmptyState icon={<PillIcon />} title="No medications scheduled" sub="No active medication rounds at this time." />
              ) : (
                <div className="nd-med-list">
                  {meds.map((m) => (
                    <div key={m.id} className={`nd-med-card ${m.given || m.takenToday ? "nd-med-card--taken" : ""}`}>
                      <div className="nd-med-left">
                        <div className="nd-med-room-badge">{m.room}</div>
                        <div>
                          <div className="nd-med-name">{m.patientName || m.patient}</div>
                          <div className="nd-med-detail">{m.medicationName || m.name || m.med} {m.dosage || m.dose ? `· ${m.dosage || m.dose}` : ""}</div>
                          <div className="nd-med-time">{m.time || m.frequency}</div>
                        </div>
                      </div>
                      <button
                        className={`nd-med-toggle ${m.given || m.takenToday ? "nd-med-toggle--taken" : ""}`}
                        onClick={() => toggleMed(m.id)}
                      >
                        {m.given || m.takenToday ? "✓ Given" : "Mark given"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TASKS ═════════════════════════════════════════════════════════ */}
          {active === "tasks" && (
            <div className="nd-section fade-in">
              <div className="nd-form-card">
                <h3 className="nd-form-title">Add New Task</h3>
                <div className="nd-form-row">
                  <input
                    className="nd-input"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="Describe the task and press Enter…"
                  />
                  <button className="nd-btn-primary" onClick={addTask}>Add</button>
                </div>
              </div>

              <SectionHeading>To Do — {tasks.filter((t) => !t.done).length} remaining</SectionHeading>
              <div className="nd-task-list">
                {tasks.filter((t) => !t.done).map((t) => (
                  <div key={t.id} className="nd-task-card" onClick={() => toggleTask(t.id)}>
                    <div className={`nd-task-circle nd-task-circle--${t.priority}`} />
                    <div className="nd-task-text">{t.text}</div>
                    <Badge
                      label={t.priority}
                      variant={t.priority === "high" ? "critical" : t.priority === "medium" ? "caution" : "default"}
                    />
                  </div>
                ))}
                {tasks.filter((t) => !t.done).length === 0 && (
                  <EmptyState icon={<TaskIcon />} title="All tasks completed" sub="Great work!" />
                )}
              </div>

              {doneTasks > 0 && (
                <>
                  <SectionHeading>Completed — {doneTasks}</SectionHeading>
                  <div className="nd-task-list">
                    {tasks.filter((t) => t.done).map((t) => (
                      <div key={t.id} className="nd-task-card nd-task-card--done" onClick={() => toggleTask(t.id)}>
                        <div className="nd-task-circle nd-task-circle--done">✓</div>
                        <div className="nd-task-text nd-task-text--done">{t.text}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ REPORTS ═══════════════════════════════════════════════════════ */}
          {active === "reports" && (
            <div className="nd-section fade-in">
              {reports.length === 0 ? (
                <EmptyState icon={<ReportIcon />} title="No reports available" sub="Reports for your patients will appear here." />
              ) : (
                <div className="nd-report-list">
                  {reports.map((r) => (
                    <div key={r.id} className="nd-report-card">
                      <div className="nd-report-left">
                        <Badge label={r.type} variant="default" />
                        <div>
                          <div className="nd-report-title">{r.title}</div>
                          <div className="nd-report-sub">{r.patientName || r.patient} · {r.date}</div>
                        </div>
                      </div>
                      <button className="nd-dismiss-btn">View</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default NurseDashboard;