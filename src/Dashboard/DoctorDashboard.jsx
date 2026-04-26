// DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";

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

function HomeIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><polyline points="9 21 9 12 15 12 15 21" /></svg>; }
function PatientsIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function HeartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }
function BellIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>; }
function CalIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
function LabIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" /></svg>; }
function PillIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z" /><line x1="8.5" y1="8.5" x2="15.5" y2="15.5" /></svg>; }
function NoteIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>; }
function ProcIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>; }
function PulseIcon() { return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16" /></svg>; }
function PlusIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }

const initials = (name) => name ? name.split(" ").map((w) => w[0]).join("").toUpperCase() : "?";
const condColor = (c) => c === "Critical" ? "critical" : c === "Caution" ? "caution" : "normal";
const flagColor = (f) => f === "high" ? "critical" : f === "low" ? "caution" : "normal";

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

function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null);
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebar] = useState(false);
  const [selPatient, setSelPat] = useState(null);

  const [patients, setPatients] = useState([]);
  const [liveVitals, setLiveVitals] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [appointments, setAppts] = useState([]);
  const [labs, setLabs] = useState([]);
  const [rx, setRx] = useState([]);
  const [notes, setNotes] = useState([]);
  const [procedures, setProc] = useState([]);
  const [dismissed, setDismiss] = useState([]);
  const [rxLoading, setRxLoading] = useState(false);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [addPatientForm, setAddPatientForm] = useState({ patientId: "" });
  const [addPatientLoading, setAddPatientLoading] = useState(false);
  const [addPatientError, setAddPatientError] = useState("");

  const [noteForm, setNoteForm] = useState({ patient: "", note: "" });
  const [rxForm, setRxForm] = useState({ patient: "", med: "", dose: "", freq: "", startDate: "", endDate: "" });
  const [procForm, setProcForm] = useState({ patient: "", procedure: "", date: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    (async () => {
      try {
        const res = await authFetch(`${API}/auth/me`);
        if (res.ok) setDoctorData(await res.json());
        else if (res.status === 401) window.location.href = "/login";
      } catch (e) { console.error("Profile:", e); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API}/patients/supervised`);
        if (res.ok) setPatients(await res.json());
      } catch (e) { console.error("Patients:", e); }
    })();
  }, []);

  useEffect(() => {
    const fetchAllVitals = async () => {
      const updatedVitals = { ...liveVitals };
      for (const p of patients) {
        try {
          const res = await authFetch(`${API}/vitals/pulse/${p.id}`);
          if (res.ok) {
            const history = await res.json();
            if (history.length > 0) {
              updatedVitals[p.id] = history[history.length - 1]; 
            }
          }
        } catch (e) { console.error("Vitals error:", e); }
      }
      setLiveVitals(updatedVitals);
    };

    if (patients.length > 0) {
      fetchAllVitals();
      const iv = setInterval(fetchAllVitals, 5000);
      return () => clearInterval(iv);
    }
  }, [patients]);

  useEffect(() => {
    const generatedAlerts = [];
    patients.forEach((p) => {
      const v = liveVitals[p.id];
      if (!v) return;

      if (v.heartRate > 100) {
        generatedAlerts.push({ id: `${p.id}-hr-${v.timestamp}`, patientName: `${p.firstName} ${p.lastName}`, room: p.room || "N/A", type: "critical", message: `Heart rate ${v.heartRate} bpm — exceeds normal threshold`, time: "Just now" });
      }
      if (v.spo2 < 95) {
        generatedAlerts.push({ id: `${p.id}-spo2-${v.timestamp}`, patientName: `${p.firstName} ${p.lastName}`, room: p.room || "N/A", type: "critical", message: `SpO₂ at ${v.spo2}% — possible respiratory compromise`, time: "Just now" });
      }
      if (v.bodyTemperature > 38) {
        generatedAlerts.push({ id: `${p.id}-temp-${v.timestamp}`, patientName: `${p.firstName} ${p.lastName}`, room: p.room || "N/A", type: "caution", message: `Temperature ${v.bodyTemperature}°C — elevated`, time: "Just now" });
      }
    });
    setAlerts(generatedAlerts);
  }, [liveVitals, patients]);

  useEffect(() => {
    if (active !== "appointments" && active !== "home") return;
    (async () => {
      try {
        const res = await authFetch(`${API}/appointments`);
        if (res.ok) setAppts(await res.json());
      } catch (e) { console.error("Appointments:", e); }
    })();
  }, [active]);

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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const visAlerts = alerts.filter((a) => !dismissed.includes(a.id));
  const criticalCount = visAlerts.filter((a) => a.type === "critical").length;
  const dismissAlert = (id) => setDismiss((p) => [...p, id]);

  const addNote = () => {
    if (!noteForm.patient || !noteForm.note.trim()) return;
    setNotes((p) => [
      { id: Date.now(), patientName: noteForm.patient, date: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), note: noteForm.note },
      ...p,
    ]);
    setNoteForm({ patient: "", note: "" });
  };

  const addRx = async () => {
    if (!rxForm.patient || !rxForm.med.trim()) return;
    setRxLoading(true);

    const payload = {
      patientId: rxForm.patient,
      medicationName: rxForm.med, 
      dosage: rxForm.dose,        
      frequency: rxForm.freq,
      startDate: rxForm.startDate,
      endDate: rxForm.endDate,
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
        setRxForm({ patient: "", med: "", dose: "", freq: "", startDate: "", endDate: "" });
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed: ${err.message || res.status}`);
      }
    } catch (e) {
      alert("Network error — check backend connection.");
    }
    setRxLoading(false);
  };

  const addProc = async () => {
    if (!procForm.patient || !procForm.procedure.trim()) return;

    const procPayload = {
      patientId: procForm.patient, 
      name: procForm.procedure,
      date: procForm.date,
    };

    const apptPayload = {
      patientId: procForm.patient,
      patientName: `Patient ${procForm.patient}`, 
      appointmentName: `Procedure: ${procForm.procedure}`, 
      room: "TBD",
      appointmentDate: procForm.date, 
      appointmentTime: "TBD",
      status: "pending"
    };

    try {
      const resProc = await authFetch(`${API}/procedure/assign`, {
        method: "POST",
        body: JSON.stringify(procPayload),
      });
      
      if (resProc.ok) {
        const newProc = await resProc.json();
        setProc((p) => [newProc, ...p]);

        await authFetch(`${API}/appointments/schedule`, {
          method: "POST",
          body: JSON.stringify(apptPayload),
        });

        setProcForm({ patient: "", procedure: "", date: "" });
        alert("Procedure scheduled and added to Patient Appointments!");
      }
    } catch (e) {
      console.error("Procedure Error:", e);
    }
  };

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="dd-root">
      {sidebarOpen && <div className="dd-overlay" onClick={() => setSidebar(false)} />}

      {showAddPatient && (
        <div className="nd-modal-backdrop" onClick={() => setShowAddPatient(false)}>
          <div className="nd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nd-modal-header">
              <h3 className="nd-modal-title">Add Patient to Supervise</h3>
              <button className="nd-modal-close" onClick={() => { setShowAddPatient(false); setAddPatientError(""); }}>✕</button>
            </div>
            <p className="nd-modal-desc">Enter the patient ID to add them to your supervision list.</p>
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
              {addPatientError && <div className="nd-modal-error">{addPatientError}</div>}
            </div>
            <div className="nd-modal-footer">
              <button className="nd-btn-ghost" onClick={() => { setShowAddPatient(false); setAddPatientError(""); }}>Cancel</button>
              <button className="nd-btn-primary" onClick={addPatientToSupervise} disabled={addPatientLoading}>
                {addPatientLoading ? "Adding…" : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className={`dd-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dd-sidebar-logo">
          <div className="dd-logo-icon"><PulseIcon /></div>
          <span className="dd-logo-text">PulseLink</span>
        </div>
        <div className="dd-portal-label">Doctor Portal</div>

        <nav className="dd-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`dd-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => { setActive(item.id); setSelPat(null); setSidebar(false); }}
            >
              <span className="dd-nav-icon">{item.icon}</span>
              <span className="dd-nav-label">{item.label}</span>
              {item.id === "alerts" && visAlerts.length > 0 && (
                <span className={`dd-nav-badge ${criticalCount > 0 ? "dd-nav-badge--critical" : "dd-nav-badge--warn"}`}>
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
              {doctorData ? initials(`${doctorData.firstName} ${doctorData.lastName}`) : "…"}
            </div>
            <div className="dd-doctor-info">
              <div className="dd-doctor-name">
                {doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : "Loading…"}
              </div>
              <div className="dd-doctor-id">{doctorData?.id}</div>
            </div>
          </div>
          <button className="dd-logout-btn" onClick={logout}>
            <LogoutIcon /><span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="dd-main">
        <header className="dd-topbar">
          <button className="dd-hamburger" onClick={() => setSidebar((s) => !s)}><span /><span /><span /></button>
          <div className="dd-topbar-left">
            <h1 className="dd-topbar-title">{NAV.find((n) => n.id === active)?.label}</h1>
            <p className="dd-topbar-date">{dateStr}</p>
          </div>
          <div className="dd-topbar-right">
            {criticalCount > 0 && (
              <div className="dd-critical-banner">
                <span className="dd-critical-dot" />{criticalCount} critical
              </div>
            )}
          </div>
        </header>

        <div className="dd-content">
          {active === "home" && (
            <div className="dd-section fade-in">
              <div className="dd-welcome-banner">
                <div>
                  <p className="dd-welcome-greeting">Good morning,</p>
                  <h2 className="dd-welcome-name">Dr. {doctorData?.firstName || "Doctor"}</h2>
                </div>
                <div className="dd-welcome-chips">
                  <span className="dd-role-chip">DOCTOR</span>
                  <span className="dd-id-chip">{doctorData?.id}</span>
                </div>
              </div>

              <div className="dd-stats-grid">
                {[
                  { label: "My Patients", value: patients.length, sub: "Under your care", variant: "default" },
                  { label: "Critical", value: patients.filter((p) => p.condition === "Critical").length, sub: "Require attention", variant: "critical" },
                  { label: "Pending Visits", value: appointments.filter((a) => a.status === "pending").length, sub: "Today's schedule", variant: "default" },
                  { label: "Active Alerts", value: visAlerts.length, sub: "Unresolved", variant: visAlerts.length > 0 ? "warn" : "default" },
                ].map((s, i) => (
                  <div key={i} className={`dd-stat-card dd-stat-card--${s.variant}`}>
                    <div className="dd-stat-value">{s.value}</div>
                    <div className="dd-stat-label">{s.label}</div>
                    <div className="dd-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {patients.filter((p) => p.condition === "Critical").length > 0 && (
                <>
                  <SectionHeading>Critical Patients</SectionHeading>
                  <div className="dd-critical-list">
                    {patients.filter((p) => p.condition === "Critical").map((p) => {
                      const v = liveVitals[p.id];
                      return (
                        <div key={p.id} className="dd-critical-card">
                          <div className="dd-critical-left">
                            <div className="dd-avatar dd-avatar--critical">{initials(`${p.firstName} ${p.lastName}`)}</div>
                            <div>
                              <div className="dd-patient-name">{p.firstName} {p.lastName}</div>
                              <div className="dd-patient-sub">{p.room} · {p.diagnosis}</div>
                            </div>
                          </div>
                          {v && (
                            <div className="dd-critical-vitals">
                              {[["HR", v.heartRate, "bpm"], ["BP", v.bloodPressure, ""], ["SpO₂", v.spo2, "%"]].map(([l, val, u]) => (
                                <div key={l} className="dd-crit-vital">
                                  <div className="dd-crit-vital-label">{l}</div>
                                  <div className="dd-crit-vital-val">{val}<span className="dd-crit-vital-unit">{u}</span></div>
                                </div>
                              ))}
                            </div>
                          )}
                          <Badge label={p.condition} variant="critical" />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <SectionHeading>Today's Schedule</SectionHeading>
              {appointments.length === 0 ? (
                <EmptyState icon={<CalIcon />} title="No appointments scheduled" sub="Your schedule is clear." />
              ) : (
                <div className="dd-appt-list">
                  {appointments.slice(0, 5).map((a) => (
                    <div key={a.id} className={`dd-appt-row ${a.status === "done" ? "done" : ""}`}>
                      <div className="dd-appt-time">{a.appointmentTime || a.time || "TBD"}</div>
                      <div className="dd-appt-dot" data-status={a.status} />
                      <div className="dd-appt-info">
                        <div className="dd-appt-name">{a.patientName}</div>
                        <div className="dd-appt-type">{a.appointmentName || a.type} · {a.room}</div>
                      </div>
                      <Badge label={a.status === "done" ? "Done" : "Pending"} variant={a.status === "done" ? "normal" : "warn"} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === "patients" && (
            <div className="dd-section fade-in">
              {selPatient ? (
                <>
                  <button className="dd-back-link" onClick={() => setSelPat(null)}>← All patients</button>
                  <div className="dd-patient-detail">
                    <div className="dd-patient-detail-header">
                      <div className="dd-avatar dd-avatar--accent dd-avatar--lg">{initials(`${selPatient.firstName} ${selPatient.lastName}`)}</div>
                      <div className="dd-patient-detail-info">
                        <h2>{selPatient.firstName} {selPatient.lastName}</h2>
                        <p>{selPatient.room} · Age {selPatient.age}</p>
                        <p className="dd-patient-diag">{selPatient.diagnosis}</p>
                      </div>
                      <Badge label={selPatient.condition} variant={condColor(selPatient.condition)} />
                    </div>

                    {liveVitals[selPatient.id] && (
                      <>
                        <SectionHeading>Current Vitals</SectionHeading>
                        <div className="dd-vitals-row">
                          {[
                            ["Heart Rate", liveVitals[selPatient.id].heartRate, "bpm"],
                            ["Blood Pressure", liveVitals[selPatient.id].bloodPressure, "mmHg"],
                            ["SpO₂", liveVitals[selPatient.id].spo2, "%"],
                            ["Temperature", liveVitals[selPatient.id].bodyTemperature, "°C"],
                            ["Resp. Rate", liveVitals[selPatient.id].respiratoryRate, "br/min"],
                          ].map(([label, val, unit]) => (
                            <div key={label} className="dd-vital-pill">
                              <div className="dd-vital-pill-label">{label}</div>
                              <div className="dd-vital-pill-value">{val ?? "—"}<span className="dd-vital-pill-unit">{unit}</span></div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {notes.filter((n) => n.patientName === `${selPatient.firstName} ${selPatient.lastName}`).length > 0 && (
                      <>
                        <SectionHeading>Clinical Notes</SectionHeading>
                        {notes.filter((n) => n.patientName === `${selPatient.firstName} ${selPatient.lastName}`).map((n) => (
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
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <p style={{ color: "var(--text3)", fontSize: "13px" }}>{patients.length} patients under your care</p>
                    <button className="nd-btn-primary" onClick={() => setShowAddPatient(true)} style={{ padding: "8px 16px", borderRadius: "8px", background: "var(--accent)", color: "#0d1a12", fontWeight: "600", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                       <span style={{ width: "16px", height: "16px", display: "inline-block" }}><PlusIcon /></span> Add Patient
                    </button>
                  </div>

                  {patients.length === 0 ? (
                    <EmptyState icon={<PatientsIcon />} title="No patients assigned yet" sub="Use 'Add Patient' to start supervising a patient." />
                  ) : (
                    <div className="dd-patient-grid">
                      {patients.map((p) => (
                        <div key={p.id} className="dd-patient-card" onClick={() => setSelPat(p)}>
                          <div className="dd-patient-card-top">
                            <div className={`dd-avatar dd-avatar--${condColor(p.condition)}`}>{initials(`${p.firstName} ${p.lastName}`)}</div>
                            <Badge label={p.condition} variant={condColor(p.condition)} />
                          </div>
                          <div className="dd-patient-card-name">{p.firstName} {p.lastName}</div>
                          <div className="dd-patient-card-sub">{p.room} · Age {p.age}</div>
                          <div className="dd-patient-card-diag">{p.diagnosis}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {active === "vitals" && (
            <div className="dd-section fade-in">
              {patients.length === 0 ? (
                <EmptyState icon={<HeartIcon />} title="No patients to display" sub="Add patients to view vitals." />
              ) : (
                <div className="dd-vitals-table-wrap">
                  <table className="dd-vitals-table">
                    <thead>
                      <tr>
                        <th>Patient</th><th>Room</th><th>HR (bpm)</th><th>BP (mmHg)</th>
                        <th>SpO₂ (%)</th><th>Temp (°C)</th><th>RR (br/min)</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => {
                        const v = liveVitals[p.id];
                        return (
                          <tr key={p.id} className={p.condition === "Critical" ? "dd-tr--critical" : ""}>
                            <td>
                              <div className="dd-table-patient">
                                <div className={`dd-avatar dd-avatar--sm dd-avatar--${condColor(p.condition)}`}>{initials(`${p.firstName} ${p.lastName}`)}</div>
                                {p.firstName} {p.lastName}
                              </div>
                            </td>
                            <td className="dd-mono">{p.room}</td>
                            <td className={`dd-mono ${v?.heartRate > 100 ? "dd-val--warn" : ""}`}>{v?.heartRate ?? "—"}</td>
                            <td className="dd-mono">{v?.bloodPressure ?? "—"}</td>
                            <td className={`dd-mono ${v?.spo2 < 95 ? "dd-val--critical" : ""}`}>{v?.spo2 ?? "—"}</td>
                            <td className={`dd-mono ${v?.bodyTemperature > 38 ? "dd-val--warn" : ""}`}>{v?.bodyTemperature ?? "—"}</td>
                            <td className={`dd-mono ${v?.respiratoryRate > 20 ? "dd-val--warn" : ""}`}>{v?.respiratoryRate ?? "—"}</td>
                            <td><Badge label={p.condition} variant={condColor(p.condition)} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {active === "alerts" && (
            <div className="dd-section fade-in">
              {visAlerts.length === 0 ? (
                <EmptyState icon={<BellIcon />} title="No active alerts" sub="All patients are within normal parameters." />
              ) : (
                <div className="dd-alert-list">
                  {visAlerts.map((a) => (
                    <div key={a.id} className={`dd-alert-card dd-alert-card--${a.type}`}>
                      <div className="dd-alert-left">
                        <div className={`dd-alert-dot dd-alert-dot--${a.type}`} />
                        <div>
                          <div className="dd-alert-patient">{a.patientName} <span className="dd-alert-room">· {a.room}</span></div>
                          <div className="dd-alert-msg">{a.message}</div>
                          <div className="dd-alert-time">{a.time}</div>
                        </div>
                      </div>
                      <button className="dd-dismiss-btn" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === "appointments" && (
            <div className="dd-section fade-in">
              {appointments.length === 0 ? (
                <EmptyState icon={<CalIcon />} title="No appointments scheduled" sub="Your schedule is clear." />
              ) : (
                <div className="dd-appt-full-list">
                  {appointments.map((a) => (
                    <div key={a.id} className={`dd-appt-full-card ${a.status === "done" ? "done" : ""}`}>
                      <div className="dd-appt-full-time">{a.appointmentTime || a.time || "TBD"}</div>
                      <div className="dd-appt-full-body">
                        <div className="dd-appt-full-name">{a.patientName || a.patientId}</div>
                        <div className="dd-appt-full-meta">{a.appointmentName || a.type} · {a.room}</div>
                      </div>
                      <Badge label={a.status === "done" ? "Completed" : "Pending"} variant={a.status === "done" ? "normal" : "warn"} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === "labs" && (
            <div className="dd-section fade-in">
              {labs.length === 0 ? (
                <EmptyState icon={<LabIcon />} title="No Lab Results" sub="Lab records will appear here when ready." />
              ) : (
                <div className="dd-lab-list">
                  {labs.map((l) => (
                    <div key={l.id} className={`dd-lab-card ${l.flag !== "normal" ? "dd-lab-card--flagged" : ""}`}>
                      <div className="dd-lab-left">
                        <div className="dd-lab-test">{l.test}</div>
                        <div className="dd-lab-patient">{l.patientName}</div>
                      </div>
                      <div className="dd-lab-right">
                        <div className={`dd-lab-result dd-lab-result--${flagColor(l.flag)}`}>{l.result}</div>
                        <div className="dd-lab-ref">Ref: {l.ref}</div>
                      </div>
                      <Badge label={l.flag} variant={flagColor(l.flag)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === "prescriptions" && (
            <div className="dd-section fade-in">
              <div className="dd-form-card">
                <h3 className="dd-form-title">Issue New Prescription</h3>
                <div className="dd-form-grid">
                  <input className="dd-input" placeholder="Patient ID (e.g. P087b7513)" value={rxForm.patient} onChange={(e) => setRxForm({ ...rxForm, patient: e.target.value })} />
                  <input className="dd-input" placeholder="Medication name" value={rxForm.med} onChange={(e) => setRxForm({ ...rxForm, med: e.target.value })} />
                  <input className="dd-input" placeholder="Dosage (e.g. 50mg)" value={rxForm.dose} onChange={(e) => setRxForm({ ...rxForm, dose: e.target.value })} />
                  <input className="dd-input" placeholder="Frequency (e.g. Once daily)" value={rxForm.freq} onChange={(e) => setRxForm({ ...rxForm, freq: e.target.value })} />
                  <input className="dd-input" placeholder="Start date (YYYY-MM-DD)" value={rxForm.startDate} onChange={(e) => setRxForm({ ...rxForm, startDate: e.target.value })} />
                  <input className="dd-input" placeholder="End date (YYYY-MM-DD)" value={rxForm.endDate} onChange={(e) => setRxForm({ ...rxForm, endDate: e.target.value })} />
                </div>
                <button className="dd-submit-btn" onClick={addRx} disabled={rxLoading}>
                  {rxLoading ? "Issuing…" : "Issue Prescription"}
                </button>
              </div>

              {rx.length > 0 && (
                <>
                  <SectionHeading>Issued This Session</SectionHeading>
                  <div className="dd-rx-list">
                    {rx.map((m, i) => (
                      <div key={m.id || i} className="dd-rx-card">
                        <div className="dd-rx-name">{m.medicationName} <span className="dd-rx-dose">{m.dosage}</span></div>
                        <div className="dd-rx-meta">{m.frequency} · Patient: {m.patientId}</div>
                        {m.startDate && <div className="dd-rx-dates">From {m.startDate} → {m.endDate}</div>}
                        <Badge label="Issued" variant="normal" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {active === "notes" && (
            <div className="dd-section fade-in">
              <div className="dd-form-card">
                <h3 className="dd-form-title">Add Clinical Note</h3>
                <div className="dd-form-grid dd-form-grid--single">
                  <input className="dd-input" placeholder="Patient name" value={noteForm.patient} onChange={(e) => setNoteForm({ ...noteForm, patient: e.target.value })} />
                  <textarea className="dd-input dd-textarea" placeholder="Write clinical note…" rows={4} value={noteForm.note} onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })} />
                </div>
                <button className="dd-submit-btn" onClick={addNote}>Save Note</button>
              </div>

              {notes.length > 0 && (
                <>
                  <SectionHeading>Clinical Notes</SectionHeading>
                  <div className="dd-notes-list">
                    {notes.map((n) => (
                      <div key={n.id} className="dd-note-card">
                        <div className="dd-note-header">
                          <div className={`dd-avatar dd-avatar--sm dd-avatar--accent`}>{initials(n.patientName)}</div>
                          <div>
                            <div className="dd-note-patient">{n.patientName}</div>
                            <div className="dd-note-date">{n.date}</div>
                          </div>
                        </div>
                        <p className="dd-note-text">{n.note}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {active === "procedures" && (
            <div className="dd-section fade-in">
              <div className="dd-form-card">
                <h3 className="dd-form-title">Schedule Procedure</h3>
                <div className="dd-form-grid">
                  <input className="dd-input" placeholder="Patient ID (e.g. P087b7513)" value={procForm.patient} onChange={(e) => setProcForm({ ...procForm, patient: e.target.value })} />
                  <input className="dd-input" placeholder="Procedure name" value={procForm.procedure} onChange={(e) => setProcForm({ ...procForm, procedure: e.target.value })} />
                  <input className="dd-input" placeholder="Date (e.g. YYYY-MM-DD)" value={procForm.date} onChange={(e) => setProcForm({ ...procForm, date: e.target.value })} />
                </div>
                <button className="dd-submit-btn" onClick={addProc}>Schedule</button>
              </div>

              <SectionHeading>Scheduled Procedures</SectionHeading>
              {procedures.length === 0 ? (
                 <EmptyState icon={<ProcIcon />} title="No Procedures" sub="Scheduled procedures will appear here." />
              ) : (
                <div className="dd-proc-list">
                  {procedures.map((p, i) => (
                    <div key={p.id || i} className="dd-proc-card">
                      <div className="dd-proc-left">
                        <div className="dd-proc-name">{p.name || p.procedure}</div>
                        <div className="dd-proc-patient">{p.patientId || p.patientName}</div>
                      </div>
                      <div className="dd-proc-date">{p.date}</div>
                      <Badge label={p.status || "scheduled"} variant={p.status === "pending approval" ? "warn" : "normal"} />
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

export default DoctorDashboard;