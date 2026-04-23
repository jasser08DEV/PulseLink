import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";

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
const initials    = name => name ? name.split(" ").map(w => w[0]).join("") : "??";

function DoctorDashboard({ navigate }) {
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://10.0.0.116:8080/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDoctorData(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchDoctor();
  }, []);

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
          <div className="db-avatar">
            {doctorData ? `${doctorData.firstName[0]}${doctorData.lastName[0]}` : "⟳"}
          </div>
          <div>
            <div className="db-sidebar-name">{doctorData ? `${doctorData.firstName} ${doctorData.lastName}` : "Loading..."}</div>
            <div className="db-sidebar-sub">{doctorData?.id} · {doctorData?.role}</div>
          </div>
        </div>
      </aside>

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
            {active === "home" && (
              <>
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

                {patients.filter(p => p.condition === "Critical").length > 0 && (
                  <>
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
                  </>
                )}

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
              </>
            )}

            {active === "patients" && (
              <>
                {selPatient ? (
                  <>
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
                  </>
                ) : (
                  <div className="db-patient-grid">
                    {patients.map(p => (
                      <div key={p.id} className="db-patient-card" onClick={() => setSelPat(p)}>
                        <div className="db-patient-initials" style={{ background: "#EAF3DE", color: "#1D9E75", width: 42, height: 42, fontSize: 13 }}>{initials(p.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div className="db-patient-card-name">{p.name}</div>
                          <div className="db-patient-card-sub">{p.room} · {p.diagnosis}</div>
                        </div>
                        <span className={`db-badge ${condBadge(p.condition)}`}>{p.condition}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {active === "vitals" && (
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
                          <td>{p.name}</td>
                          <td>{p.room}</td>
                          <td><span className={`db-badge ${condBadge(p.condition)}`}>{p.condition}</span></td>
                          <td>{v.hr}</td>
                          <td>{v.bp}</td>
                          <td>{v.spo2}%</td>
                          <td>{v.temp}°C</td>
                          <td>{v.rr}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {active === "alerts" && (
              visAlerts.length === 0 ? <div className="db-empty">No active alerts.</div> : visAlerts.map(a => (
                <div key={a.id} className={`db-alert-card ${alertBorder(a.type)}`}>
                  <div className="db-alert-left">
                    <div className={`db-alert-dot ${alertDot(a.type)}`}></div>
                    <div>
                      <div className="db-alert-patient">{a.patient}</div>
                      <div className="db-alert-msg">{a.message}</div>
                    </div>
                  </div>
                  <button className="db-dismiss-btn" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                </div>
              ))
            )}

            {active === "appointments" && (
              <>
                <div className="db-sub-title">Pending</div>
                {appointments.filter(a => a.status === "pending").map(a => (
                  <div key={a.id} className="db-appt-card">
                    <div className="db-appt-info">
                      <div className="db-appt-title">{a.patient}</div>
                      <div className="db-appt-doctor">{a.type} · {a.room}</div>
                    </div>
                    <div className="db-appt-time">{a.time}</div>
                  </div>
                ))}
              </>
            )}

            {active === "labs" && (
              labResults.map(r => (
                <div key={r.id} className="db-report-card">
                  <div className="db-report-left">
                    <span className={`db-badge ${flagBadge(r.flag)}`}>{r.flag}</span>
                    <div className="db-report-title">{r.test} - {r.patient}</div>
                  </div>
                  <div className="db-lab-result-val">{r.result}</div>
                </div>
              ))
            )}

            {active === "prescriptions" && (
              <div className="db-form-card">
                <div className="db-sub-title">New Prescription</div>
                <div className="db-form-grid">
                  <input placeholder="Patient Name" value={rxForm.patient} onChange={e => setRxForm({...rxForm, patient: e.target.value})} />
                  <input placeholder="Medication" value={rxForm.med} onChange={e => setRxForm({...rxForm, med: e.target.value})} />
                  <input placeholder="Dose" value={rxForm.dose} onChange={e => setRxForm({...rxForm, dose: e.target.value})} />
                  <input placeholder="Frequency" value={rxForm.freq} onChange={e => setRxForm({...rxForm, freq: e.target.value})} />
                </div>
                <button className="db-submit-btn" onClick={addRx}>Issue</button>
              </div>
            )}

            {active === "notes" && (
              <div className="db-form-card">
                <div className="db-sub-title">New Clinical Note</div>
                <textarea placeholder="Enter note..." value={noteForm.note} onChange={e => setNoteForm({...noteForm, note: e.target.value})} />
                <button className="db-submit-btn" onClick={addNote}>Save</button>
              </div>
            )}

            {active === "procedures" && (
              <div className="db-form-card">
                <div className="db-sub-title">Assign Procedure</div>
                <div className="db-form-grid">
                  <input placeholder="Patient Name" value={procForm.patient} onChange={e => setProcForm({...procForm, patient: e.target.value})} />
                  <input placeholder="Procedure" value={procForm.procedure} onChange={e => setProcForm({...procForm, procedure: e.target.value})} />
                </div>
                <button className="db-submit-btn" onClick={addProc}>Assign</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;