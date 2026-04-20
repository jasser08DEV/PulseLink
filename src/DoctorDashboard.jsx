import React, { useState } from "react";
import "./DoctorDashboard.css";

// ── Mock Data ────────────────────────────────────────────────
const doctor = { name: "Dr. Chaker Nouri", id: "DOC-0091", specialty: "Cardiology", avatar: "CN" };

const patients = [
  { id:1, name:"Amira Mansour", age:34, room:"B-101", diagnosis:"Hypertension",          condition:"Stable",   admitted:"20 Mar 2026" },
  { id:2, name:"Karim Belhaj",  age:58, room:"B-102", diagnosis:"Acute Heart Failure",   condition:"Critical", admitted:"28 Mar 2026" },
  { id:3, name:"Lena Farhat",   age:45, room:"B-103", diagnosis:"Arrhythmia",            condition:"Stable",   admitted:"22 Mar 2026" },
  { id:4, name:"Omar Slimane",  age:67, room:"B-104", diagnosis:"Coronary Artery Disease",condition:"Caution", admitted:"25 Mar 2026" },
  { id:5, name:"Nour Trabelsi", age:29, room:"B-105", diagnosis:"Mitral Valve Prolapse", condition:"Stable",   admitted:"27 Mar 2026" },
];

const vitalsData = {
  1: { hr:"78",  bp:"118/76", spo2:"98", temp:"37.1", rr:"16" },
  2: { hr:"102", bp:"145/90", spo2:"93", temp:"38.6", rr:"22" },
  3: { hr:"72",  bp:"120/80", spo2:"99", temp:"36.8", rr:"15" },
  4: { hr:"88",  bp:"135/85", spo2:"96", temp:"37.4", rr:"18" },
  5: { hr:"68",  bp:"110/70", spo2:"99", temp:"36.6", rr:"14" },
};

const alertsData = [
  { id:1, patient:"Karim Belhaj", room:"B-102", type:"critical", message:"Heart rate 102 bpm — exceeds threshold",        time:"5m ago"  },
  { id:2, patient:"Karim Belhaj", room:"B-102", type:"critical", message:"SpO₂ at 93% — possible respiratory compromise", time:"8m ago"  },
  { id:3, patient:"Omar Slimane", room:"B-104", type:"caution",  message:"BP 135/85 — elevated, review medication",       time:"22m ago" },
];

const appointments = [
  { id:1, patient:"Amira Mansour", room:"B-101", time:"09:30 AM", type:"Follow-up consultation", status:"done"    },
  { id:2, patient:"Karim Belhaj",  room:"B-102", time:"11:00 AM", type:"Emergency review",       status:"done"    },
  { id:3, patient:"Lena Farhat",   room:"B-103", time:"01:30 PM", type:"ECG result review",      status:"pending" },
  { id:4, patient:"Omar Slimane",  room:"B-104", time:"03:00 PM", type:"Medication adjustment",  status:"pending" },
  { id:5, patient:"Nour Trabelsi", room:"B-105", time:"04:30 PM", type:"Discharge assessment",   status:"pending" },
];

const labResults = [
  { id:1, patient:"Karim Belhaj",  test:"BNP Level",         result:"820 pg/mL", ref:"<100 pg/mL",  flag:"high"   },
  { id:2, patient:"Amira Mansour", test:"HbA1c",             result:"5.8%",      ref:"<5.7%",       flag:"high"   },
  { id:3, patient:"Omar Slimane",  test:"LDL Cholesterol",   result:"142 mg/dL", ref:"<100 mg/dL",  flag:"high"   },
  { id:4, patient:"Lena Farhat",   test:"TSH",               result:"2.1 mIU/L", ref:"0.4–4.0",     flag:"normal" },
  { id:5, patient:"Nour Trabelsi", test:"CBC — Haemoglobin", result:"13.2 g/dL", ref:"12.0–16.0",   flag:"normal" },
];

const rxInit = [
  { id:1, patient:"Amira Mansour", med:"Metoprolol",   dose:"50mg",   freq:"Once daily",  status:"active" },
  { id:2, patient:"Amira Mansour", med:"Ramipril",     dose:"5mg",    freq:"Twice daily", status:"active" },
  { id:3, patient:"Karim Belhaj",  med:"Furosemide",   dose:"40mg",   freq:"Once daily",  status:"active" },
  { id:4, patient:"Karim Belhaj",  med:"Digoxin",      dose:"0.25mg", freq:"Once daily",  status:"active" },
  { id:5, patient:"Omar Slimane",  med:"Atorvastatin", dose:"40mg",   freq:"Once daily",  status:"active" },
];

const notesInit = [
  { id:1, patient:"Karim Belhaj",  date:"Today 10:45 AM",    note:"Patient presenting with acute decompensated heart failure. BNP markedly elevated. Initiated IV Furosemide. Monitoring fluid balance closely. Echo ordered." },
  { id:2, patient:"Amira Mansour", date:"Today 09:35 AM",    note:"BP well controlled on current regimen. HbA1c mildly elevated — referred for dietary counselling. Continue Metoprolol 50mg." },
  { id:3, patient:"Omar Slimane",  date:"Yesterday 03:00 PM", note:"LDL elevated despite statin therapy. Increased Atorvastatin to 40mg. Lifestyle modification discussed. Follow-up in 4 weeks." },
];

const procInit = [
  { id:1, patient:"Karim Belhaj",  procedure:"Echocardiogram",       date:"30 Mar 2026", status:"scheduled"         },
  { id:2, patient:"Lena Farhat",   procedure:"24h Holter Monitor",   date:"1 Apr 2026",  status:"scheduled"         },
  { id:3, patient:"Amira Mansour", procedure:"Stress ECG",           date:"3 Apr 2026",  status:"scheduled"         },
  { id:4, patient:"Omar Slimane",  procedure:"Coronary Angiography", date:"5 Apr 2026",  status:"pending approval"  },
];

const navItems = [
  { id:"home",         label:"Overview",      icon:"⌂" },
  { id:"patients",     label:"Patients",      icon:"♡" },
  { id:"vitals",       label:"Vitals",        icon:"♥" },
  { id:"alerts",       label:"Alerts",        icon:"⚑" },
  { id:"appointments", label:"Appointments",  icon:"◷" },
  { id:"labs",         label:"Lab Results",   icon:"◫" },
  { id:"prescriptions",label:"Prescriptions", icon:"◈" },
  { id:"notes",        label:"Notes",         icon:"◧" },
  { id:"procedures",   label:"Procedures",    icon:"✦" },
];

const condBadge   = c => c === "Critical" ? "db-badge--critical" : c === "Caution" ? "db-badge--caution" : "db-badge--normal";
const alertBorder = t => t === "critical" ? "db-alert-card--critical" : t === "caution" ? "db-alert-card--caution" : "db-alert-card--info";
const alertDot    = t => t === "critical" ? "db-alert-dot--critical" : t === "caution" ? "db-alert-dot--caution" : "db-alert-dot--info";
const flagBadge   = f => f === "high" ? "db-badge--critical" : f === "low" ? "db-badge--caution" : "db-badge--normal";
const initials    = name => name.split(" ").map(w => w[0]).join("");

export default function DoctorDashboard({ navigate }) {
  const [active, setActive]     = useState("home");
  const [dismissed, setDismiss] = useState([]);
  const [rx, setRx]             = useState(rxInit);
  const [notes, setNotes]       = useState(notesInit);
  const [procedures, setProc]   = useState(procInit);
  const [selPatient, setSelPat] = useState(null);

  const [noteForm, setNoteForm] = useState({ patient: "", note: "" });
  const [rxForm,   setRxForm]   = useState({ patient: "", med: "", dose: "", freq: "" });
  const [procForm, setProcForm] = useState({ patient: "", procedure: "", date: "" });

  const dismissAlert = id => setDismiss(p => [...p, id]);
  const visAlerts    = alertsData.filter(a => !dismissed.includes(a.id));
  const criticalCount= visAlerts.filter(a => a.type === "critical").length;

  const addNote = () => {
    if (!noteForm.patient || !noteForm.note.trim()) return;
    setNotes(p => [{ id: Date.now(), patient: noteForm.patient, date: "Just now", note: noteForm.note }, ...p]);
    setNoteForm({ patient: "", note: "" });
  };

  const addRx = () => {
    if (!rxForm.patient || !rxForm.med.trim()) return;
    setRx(p => [...p, { id: Date.now(), ...rxForm, status: "active" }]);
    setRxForm({ patient: "", med: "", dose: "", freq: "" });
  };

  const cancelRx = id => setRx(p => p.map(r => r.id === id ? { ...r, status: "discontinued" } : r));

  const addProc = () => {
    if (!procForm.patient || !procForm.procedure.trim()) return;
    setProc(p => [...p, { id: Date.now(), ...procForm, status: "scheduled" }]);
    setProcForm({ patient: "", procedure: "", date: "" });
  };

  return (
    <div className="db-root">

      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <polyline points="2,16 7,16 10,9 13,23 16,13 19,19 22,16 30,16"
              stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="db-logo-text">PulseLink</span>
        </div>
        <div className="db-sidebar-portal-label">Doctor Portal</div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`db-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}>
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {item.id === "alerts" && visAlerts.length > 0 &&
                <span className="db-nav-badge db-nav-badge--alert">{visAlerts.length}</span>}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-avatar">{doctor.avatar}</div>
          <div>
            <div className="db-sidebar-name">{doctor.name}</div>
            <div className="db-sidebar-sub">{doctor.specialty}</div>
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
            {criticalCount > 0 && (
              <div className="db-critical-banner">
                <div className="db-critical-banner-dot"></div>
                {criticalCount} critical
              </div>
            )}
            {navigate && <button className="db-back-btn" onClick={() => navigate("home")}>← Back</button>}
          </div>
        </header>

        <div className="db-content">
          <div className="db-section">

            {/* ══ OVERVIEW ══ */}
            {active === "home" && (<>
              <div className="db-stats-grid">
                {[
                  { label: "My Patients",    val: patients.length,                              sub: "Under your care",    warn: false },
                  { label: "Critical",       val: patients.filter(p => p.condition === "Critical").length, sub: "Require attention", warn: true },
                  { label: "Pending visits", val: appointments.filter(a => a.status === "pending").length, sub: "Today's schedule",  warn: false },
                  { label: "Active Alerts",  val: visAlerts.length,                             sub: "Unresolved",         warn: visAlerts.length > 0 },
                ].map((s, i) => (
                  <div key={i} className="db-stat-card">
                    <div className="db-stat-label">{s.label}</div>
                    <div className={`db-stat-value ${s.warn ? "db-stat-value--warn" : ""}`}>{s.val}</div>
                    <div className="db-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {patients.filter(p => p.condition === "Critical").length > 0 && (<>
                <div className="db-sub-title">⚠ Critical Patients</div>
                {patients.filter(p => p.condition === "Critical").map(p => (
                  <div key={p.id} className="db-critical-card">
                    <div className="db-critical-card-left">
                      <div className="db-patient-avatar-sm" style={{ background: "#FDEAEA", color: "#E24B4A" }}>{initials(p.name)}</div>
                      <div>
                        <div className="db-appt-title">{p.name}</div>
                        <div className="db-appt-doctor">{p.room} · {p.diagnosis}</div>
                      </div>
                    </div>
                    <div className="db-critical-vitals">
                      {[["HR", vitalsData[p.id].hr, "bpm"], ["BP", vitalsData[p.id].bp, ""], ["SpO₂", vitalsData[p.id].spo2, "%"]].map(([l, v, u]) => (
                        <div key={l} className="db-critical-vital-item">
                          <div className="db-critical-vital-label">{l}</div>
                          <div className="db-critical-vital-val">{v}<span className="db-critical-vital-unit">{u}</span></div>
                        </div>
                      ))}
                    </div>
                    <span className="db-badge db-badge--critical">{p.condition}</span>
                  </div>
                ))}
              </>)}

              <div className="db-home-grid" style={{ marginTop: "1.5rem" }}>
                <div>
                  <div className="db-sub-title">Active Alerts</div>
                  {visAlerts.slice(0, 3).map(a => (
                    <div key={a.id} className={`db-card db-card--${a.type}`}>
                      <div className="db-alert-patient">{a.patient} · <span className="db-alert-room">{a.room}</span></div>
                      <div className="db-alert-msg">{a.message}</div>
                      <div className="db-alert-time">{a.time}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="db-sub-title">Today's Appointments</div>
                  {appointments.filter(a => a.status === "pending").slice(0, 4).map(a => (
                    <div key={a.id} className="db-appt-card" style={{ marginBottom: 8 }}>
                      <div className="db-appt-info">
                        <div className="db-appt-title">{a.patient}</div>
                        <div className="db-appt-doctor">{a.type}</div>
                      </div>
                      <div className="db-appt-time">{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>)}

            {/* ══ PATIENTS ══ */}
            {active === "patients" && (<>
              {selPatient ? (<>
                <button className="db-back-link" onClick={() => setSelPat(null)}>← All patients</button>
                <div className="db-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                  <div className="db-patient-detail-header">
                    <div className="db-patient-initials" style={{ background: "#EAF3DE", color: "#1D9E75", width: 52, height: 52, fontSize: 16 }}>{initials(selPatient.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="db-patient-name">{selPatient.name}</div>
                      <div className="db-patient-meta">{selPatient.room} · Age {selPatient.age} · Admitted {selPatient.admitted}</div>
                      <div className="db-patient-meta">{selPatient.diagnosis}</div>
                    </div>
                    <span className={`db-badge ${condBadge(selPatient.condition)}`}>{selPatient.condition}</span>
                  </div>
                  <div className="db-vitals-mini-grid db-vitals-mini-grid--5">
                    {[["Heart Rate", vitalsData[selPatient.id].hr, "bpm"], ["Blood Pressure", vitalsData[selPatient.id].bp, "mmHg"], ["SpO₂", vitalsData[selPatient.id].spo2, "%"], ["Temperature", vitalsData[selPatient.id].temp, "°C"], ["Resp. Rate", vitalsData[selPatient.id].rr, "/min"]].map(([l, v, u]) => (
                      <div key={l} className="db-vitals-mini-cell">
                        <div className="db-vitals-mini-label">{l}</div>
                        <div className="db-vitals-mini-val">{v}<span className="db-vitals-mini-unit">{u}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="db-sub-title">Recent Notes</div>
                {notes.filter(n => n.patient === selPatient.name).map(n => (
                  <div key={n.id} className="db-note-card">
                    <div className="db-note-header">
                      <div className="db-note-patient">{n.patient}</div>
                      <div className="db-note-date">{n.date}</div>
                    </div>
                    <div className="db-note-body">{n.note}</div>
                  </div>
                ))}
                {notes.filter(n => n.patient === selPatient.name).length === 0 && <div className="db-empty-sub">No notes recorded</div>}
              </>) : (
                <div className="db-patient-grid">
                  {patients.map(p => (
                    <div key={p.id} className="db-patient-card" onClick={() => setSelPat(p)}>
                      <div className="db-patient-initials" style={{ background: "#EAF3DE", color: "#1D9E75", width: 42, height: 42, fontSize: 13 }}>{initials(p.name)}</div>
                      <div style={{ flex: 1 }}>
                        <div className="db-patient-card-name">{p.name}</div>
                        <div className="db-patient-card-sub">{p.room} · {p.diagnosis}</div>
                        <div className="db-patient-card-hint">Admitted {p.admitted}</div>
                      </div>
                      <span className={`db-badge ${condBadge(p.condition)}`}>{p.condition}</span>
                    </div>
                  ))}
                </div>
              )}
            </>)}

            {/* ══ VITALS ══ */}
            {active === "vitals" && (<>
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>{["Patient","Room","Condition","HR","BP","SpO₂","Temp","RR"].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {patients.map(p => {
                      const v = vitalsData[p.id];
                      return (
                        <tr key={p.id} className={p.condition === "Critical" ? "critical-row" : ""}>
                          <td style={{ fontWeight: 500 }}>{p.name}</td>
                          <td style={{ color: "var(--color-muted)" }}>{p.room}</td>
                          <td><span className={`db-badge ${condBadge(p.condition)}`}>{p.condition}</span></td>
                          <td><span className={`db-table-val ${parseInt(v.hr) > 100 ? "db-table-val--warn" : ""}`}>{v.hr}<span className="db-table-unit">bpm</span></span></td>
                          <td><span className="db-table-val">{v.bp}</span></td>
                          <td><span className={`db-table-val ${parseInt(v.spo2) < 95 ? "db-table-val--warn" : ""}`}>{v.spo2}<span className="db-table-unit">%</span></span></td>
                          <td><span className={`db-table-val ${parseFloat(v.temp) > 38 ? "db-table-val--warn" : ""}`}>{v.temp}<span className="db-table-unit">°C</span></span></td>
                          <td><span className={`db-table-val ${parseInt(v.rr) > 20 ? "db-table-val--warn" : ""}`}>{v.rr}<span className="db-table-unit">/min</span></span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>)}

            {/* ══ ALERTS ══ */}
            {active === "alerts" && (<>
              {visAlerts.length === 0
                ? <div className="db-empty-state">
                    <div className="db-empty-icon">✓</div>
                    <div className="db-empty-title">All clear</div>
                    <div className="db-empty-sub">No active alerts.</div>
                  </div>
                : visAlerts.map(a => (
                  <div key={a.id} className={`db-alert-card ${alertBorder(a.type)}`}>
                    <div className="db-alert-left">
                      <div className={`db-alert-dot ${alertDot(a.type)}`}></div>
                      <div>
                        <div className="db-alert-patient">{a.patient} · <span className="db-alert-room">{a.room}</span></div>
                        <div className="db-alert-msg">{a.message}</div>
                        <div className="db-alert-time">{a.time}</div>
                      </div>
                    </div>
                    <button className="db-dismiss-btn" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                  </div>
                ))}
            </>)}

            {/* ══ APPOINTMENTS ══ */}
            {active === "appointments" && (<>
              <div className="db-sub-title">Pending</div>
              {appointments.filter(a => a.status === "pending").map(a => (
                <div key={a.id} className="db-appt-card">
                  <div className="db-appt-time-box">
                    <div className="db-appt-time-hour">{a.time.split(":")[0]}</div>
                    <div className="db-appt-time-ampm">{a.time.split(" ")[1]}</div>
                  </div>
                  <div className="db-appt-info">
                    <div className="db-appt-title">{a.patient}</div>
                    <div className="db-appt-doctor">{a.type} · {a.room}</div>
                  </div>
                  <span className="db-badge db-badge--info">Pending</span>
                </div>
              ))}
              <div className="db-sub-title" style={{ marginTop: "1.5rem" }}>Completed</div>
              {appointments.filter(a => a.status === "done").map(a => (
                <div key={a.id} className="db-appt-card db-appt-card--past">
                  <div className="db-appt-time-box">
                    <div className="db-appt-time-hour">{a.time.split(":")[0]}</div>
                    <div className="db-appt-time-ampm">{a.time.split(" ")[1]}</div>
                  </div>
                  <div className="db-appt-info">
                    <div className="db-appt-title">{a.patient}</div>
                    <div className="db-appt-doctor">{a.type} · {a.room}</div>
                  </div>
                  <span className="db-badge db-badge--normal">Done</span>
                </div>
              ))}
            </>)}

            {/* ══ LAB RESULTS ══ */}
            {active === "labs" && (<>
              {labResults.map(r => (
                <div key={r.id} className="db-report-card">
                  <div className="db-report-left">
                    <span className={`db-badge ${flagBadge(r.flag)}`}>{r.flag}</span>
                    <div>
                      <div className="db-report-title">{r.test}</div>
                      <div className="db-report-sub">{r.patient}</div>
                    </div>
                  </div>
                  <div>
                    <div className={`db-lab-result-val ${r.flag !== "normal" ? "db-lab-result-val--high" : ""}`}>{r.result}</div>
                    <div className="db-lab-ref">Ref: {r.ref}</div>
                  </div>
                </div>
              ))}
            </>)}

            {/* ══ PRESCRIPTIONS ══ */}
            {active === "prescriptions" && (<>
              <div className="db-form-card">
                <div className="db-sub-title">New Prescription</div>
                <div className="db-form-grid">
                  <div className="db-form-field">
                    <label className="db-form-label">Patient</label>
                    <select className="db-form-select" value={rxForm.patient} onChange={e => setRxForm(p => ({ ...p, patient: e.target.value }))}>
                      <option value="">Select patient</option>
                      {patients.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="db-form-field">
                    <label className="db-form-label">Medication</label>
                    <input className="db-form-input" placeholder="e.g. Lisinopril" value={rxForm.med} onChange={e => setRxForm(p => ({ ...p, med: e.target.value }))} />
                  </div>
                  <div className="db-form-field">
                    <label className="db-form-label">Dose</label>
                    <input className="db-form-input" placeholder="e.g. 10mg" value={rxForm.dose} onChange={e => setRxForm(p => ({ ...p, dose: e.target.value }))} />
                  </div>
                  <div className="db-form-field">
                    <label className="db-form-label">Frequency</label>
                    <input className="db-form-input" placeholder="e.g. Once daily" value={rxForm.freq} onChange={e => setRxForm(p => ({ ...p, freq: e.target.value }))} />
                  </div>
                </div>
                <button className="db-submit-btn" onClick={addRx}>Issue Prescription</button>
              </div>

              <div className="db-sub-title">Active Prescriptions</div>
              {rx.filter(r => r.status === "active").map(r => (
                <div key={r.id} className="db-report-card">
                  <div>
                    <div className="db-report-title">{r.med} {r.dose}</div>
                    <div className="db-report-sub">{r.patient} · {r.freq}</div>
                  </div>
                  <button className="db-cancel-btn" onClick={() => cancelRx(r.id)}>Discontinue</button>
                </div>
              ))}

              {rx.filter(r => r.status === "discontinued").length > 0 && (<>
                <div className="db-sub-title" style={{ marginTop: "1.5rem" }}>Discontinued</div>
                {rx.filter(r => r.status === "discontinued").map(r => (
                  <div key={r.id} className="db-card db-card--faded">
                    <div style={{ textDecoration: "line-through", fontSize: 14, fontWeight: 500 }}>{r.med} {r.dose}</div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>{r.patient} · {r.freq}</div>
                  </div>
                ))}
              </>)}
            </>)}

            {/* ══ NOTES ══ */}
            {active === "notes" && (<>
              <div className="db-form-card">
                <div className="db-sub-title">New Clinical Note</div>
                <div className="db-form-field" style={{ marginBottom: 10 }}>
                  <label className="db-form-label">Patient</label>
                  <select className="db-form-select" value={noteForm.patient} onChange={e => setNoteForm(p => ({ ...p, patient: e.target.value }))}>
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="db-form-field" style={{ marginBottom: 12 }}>
                  <label className="db-form-label">Note</label>
                  <textarea className="db-form-textarea"
                    placeholder="Enter clinical observations, assessment and plan..."
                    value={noteForm.note}
                    onChange={e => setNoteForm(p => ({ ...p, note: e.target.value }))} />
                </div>
                <button className="db-submit-btn" onClick={addNote}>Save Note</button>
              </div>

              <div className="db-sub-title">Clinical Notes</div>
              {notes.map(n => (
                <div key={n.id} className="db-note-card">
                  <div className="db-note-header">
                    <div className="db-note-patient">{n.patient}</div>
                    <div className="db-note-date">{n.date}</div>
                  </div>
                  <div className="db-note-body">{n.note}</div>
                </div>
              ))}
            </>)}

            {/* ══ PROCEDURES ══ */}
            {active === "procedures" && (<>
              <div className="db-form-card">
                <div className="db-sub-title">Assign Procedure</div>
                <div className="db-form-grid">
                  <div className="db-form-field">
                    <label className="db-form-label">Patient</label>
                    <select className="db-form-select" value={procForm.patient} onChange={e => setProcForm(p => ({ ...p, patient: e.target.value }))}>
                      <option value="">Select patient</option>
                      {patients.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="db-form-field">
                    <label className="db-form-label">Procedure</label>
                    <input className="db-form-input" placeholder="e.g. Echocardiogram" value={procForm.procedure} onChange={e => setProcForm(p => ({ ...p, procedure: e.target.value }))} />
                  </div>
                  <div className="db-form-field">
                    <label className="db-form-label">Scheduled date</label>
                    <input type="date" className="db-form-input" value={procForm.date} onChange={e => setProcForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                </div>
                <button className="db-submit-btn" onClick={addProc}>Assign Procedure</button>
              </div>

              <div className="db-sub-title">Assigned Procedures</div>
              {procedures.map(p => (
                <div key={p.id} className="db-report-card">
                  <div>
                    <div className="db-report-title">{p.procedure}</div>
                    <div className="db-report-sub">{p.patient} · {p.date}</div>
                  </div>
                  <span className={`db-badge ${p.status === "scheduled" ? "db-badge--info" : "db-badge--caution"}`}>{p.status}</span>
                </div>
              ))}
            </>)}

          </div>
        </div>
      </main>
    </div>
  );
}
