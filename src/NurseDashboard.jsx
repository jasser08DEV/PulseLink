import React, { useState } from "react";
import "./NurseDashboard.css";

// ── Mock Data ────────────────────────────────────────────────
const nurse = { name: "Nurse Sara Khalil", id: "NRS-00412", ward: "Cardiology — Ward B", avatar: "SK" };

const patients = [
  { id:1, name:"Amira Mansour",  age:34, room:"B-101", condition:"Stable",   vitals:{ hr:"78",  bp:"118/76", spo2:"98", temp:"37.1" }, alerts:1 },
  { id:2, name:"Karim Belhaj",   age:58, room:"B-102", condition:"Critical", vitals:{ hr:"102", bp:"145/90", spo2:"93", temp:"38.6" }, alerts:3 },
  { id:3, name:"Lena Farhat",    age:45, room:"B-103", condition:"Stable",   vitals:{ hr:"72",  bp:"120/80", spo2:"99", temp:"36.8" }, alerts:0 },
  { id:4, name:"Omar Slimane",   age:67, room:"B-104", condition:"Caution",  vitals:{ hr:"88",  bp:"135/85", spo2:"96", temp:"37.4" }, alerts:1 },
  { id:5, name:"Nour Trabelsi",  age:29, room:"B-105", condition:"Stable",   vitals:{ hr:"68",  bp:"110/70", spo2:"99", temp:"36.6" }, alerts:0 },
];

const alertsData = [
  { id:1, patient:"Karim Belhaj",  room:"B-102", type:"critical", message:"Heart rate elevated — 102 bpm",          time:"5m ago"  },
  { id:2, patient:"Karim Belhaj",  room:"B-102", type:"critical", message:"SpO₂ dropped to 93% — check O₂ supply",  time:"8m ago"  },
  { id:3, patient:"Omar Slimane",  room:"B-104", type:"caution",  message:"Blood pressure elevated — 135/85",       time:"22m ago" },
  { id:4, patient:"Karim Belhaj",  room:"B-102", type:"critical", message:"Temperature 38.6°C — possible fever",    time:"30m ago" },
  { id:5, patient:"Amira Mansour", room:"B-101", type:"info",     message:"Medication due at 09:00 PM",              time:"1h ago"  },
];

const appointments = [
  { id:1, patient:"Amira Mansour", room:"B-101", time:"09:00 AM", type:"Vitals check",     status:"done"    },
  { id:2, patient:"Karim Belhaj",  room:"B-102", time:"10:30 AM", type:"Medication round", status:"done"    },
  { id:3, patient:"Lena Farhat",   room:"B-103", time:"11:00 AM", type:"Wound dressing",   status:"pending" },
  { id:4, patient:"Omar Slimane",  room:"B-104", time:"01:00 PM", type:"Blood sample",      status:"pending" },
  { id:5, patient:"Nour Trabelsi", room:"B-105", time:"02:30 PM", type:"Vitals check",     status:"pending" },
  { id:6, patient:"Karim Belhaj",  room:"B-102", time:"04:00 PM", type:"IV drip change",   status:"pending" },
];

const medsInit = [
  { id:1, patient:"Amira Mansour", room:"B-101", med:"Metoprolol 50mg",   time:"08:00 AM", given:true  },
  { id:2, patient:"Karim Belhaj",  room:"B-102", med:"Furosemide 40mg",   time:"08:00 AM", given:true  },
  { id:3, patient:"Lena Farhat",   room:"B-103", med:"Aspirin 100mg",     time:"08:00 AM", given:true  },
  { id:4, patient:"Omar Slimane",  room:"B-104", med:"Ramipril 5mg",      time:"09:00 AM", given:false },
  { id:5, patient:"Nour Trabelsi", room:"B-105", med:"Atorvastatin 20mg", time:"09:00 PM", given:false },
  { id:6, patient:"Amira Mansour", room:"B-101", med:"Atorvastatin 20mg", time:"09:00 PM", given:false },
  { id:7, patient:"Karim Belhaj",  room:"B-102", med:"Digoxin 0.25mg",    time:"09:00 PM", given:false },
];

const tasksInit = [
  { id:1, text:"Check vitals — Room B-102 (Karim)",  done:false, priority:"high"   },
  { id:2, text:"Administer Ramipril — Room B-104",   done:false, priority:"high"   },
  { id:3, text:"Change wound dressing — Room B-103", done:false, priority:"medium" },
  { id:4, text:"Submit shift handover report",       done:false, priority:"medium" },
  { id:5, text:"Restock supply cart — Bay 2",        done:true,  priority:"low"    },
  { id:6, text:"Update patient notes — Room B-101",  done:true,  priority:"low"    },
];

const reportsData = [
  { id:1, patient:"Karim Belhaj",  type:"Lab",     title:"CBC Results",   date:"Today"       },
  { id:2, patient:"Amira Mansour", type:"Imaging", title:"ECG Report",    date:"Yesterday"   },
  { id:3, patient:"Omar Slimane",  type:"Lab",     title:"Lipid Panel",   date:"25 Mar 2026" },
  { id:4, patient:"Lena Farhat",   type:"Lab",     title:"Urinalysis",    date:"24 Mar 2026" },
];

const navItems = [
  { id:"home",         label:"Overview",    icon:"⌂" },
  { id:"patients",     label:"Patients",    icon:"♡" },
  { id:"vitals",       label:"Vitals",      icon:"♥" },
  { id:"alerts",       label:"Alerts",      icon:"⚑" },
  { id:"appointments", label:"Schedule",    icon:"◷" },
  { id:"medications",  label:"Medications", icon:"◈" },
  { id:"tasks",        label:"Tasks",       icon:"✓" },
  { id:"reports",      label:"Reports",     icon:"◧" },
];

const condBadge   = c => c === "Critical" ? "db-badge--critical" : c === "Caution" ? "db-badge--caution" : "db-badge--normal";
const alertBorder = t => t === "critical" ? "db-alert-card--critical" : t === "caution" ? "db-alert-card--caution" : "db-alert-card--info";
const alertDot    = t => t === "critical" ? "db-alert-dot--critical" : t === "caution" ? "db-alert-dot--caution" : "db-alert-dot--info";
const initials    = name => name.split(" ").map(w => w[0]).join("");

export default function NurseDashboard({ navigate }) {
  const [active, setActive]     = useState("home");
  const [tasks, setTasks]       = useState(tasksInit);
  const [dismissed, setDismiss] = useState([]);
  const [meds, setMeds]         = useState(medsInit);
  const [newTask, setNewTask]   = useState("");
  const [selPatient, setSelPat] = useState(null);

  const toggleTask   = id => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const dismissAlert = id => setDismiss(p => [...p, id]);
  const toggleMed    = id => setMeds(p => p.map(m => m.id === id ? { ...m, given: !m.given } : m));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(p => [...p, { id: Date.now(), text: newTask, done: false, priority: "medium" }]);
    setNewTask("");
  };

  const visAlerts    = alertsData.filter(a => !dismissed.includes(a.id));
  const criticalCount= visAlerts.filter(a => a.type === "critical").length;
  const pendingAppts = appointments.filter(a => a.status === "pending");
  const doneTasks    = tasks.filter(t => t.done).length;
  const givenMeds    = meds.filter(m => m.given).length;

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
        <div className="db-sidebar-portal-label">Nurse Portal</div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`db-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}>
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {item.id === "alerts" && visAlerts.length > 0 &&
                <span className="db-nav-badge db-nav-badge--alert">{visAlerts.length}</span>}
              {item.id === "tasks" &&
                <span className="db-nav-badge db-nav-badge--task">{tasks.filter(t => !t.done).length}</span>}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-avatar">{nurse.avatar}</div>
          <div>
            <div className="db-sidebar-name">{nurse.name}</div>
            <div className="db-sidebar-sub">{nurse.ward}</div>
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
                {criticalCount} critical alert{criticalCount > 1 ? "s" : ""}
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
                  { label: "Patients",      val: patients.length,                              sub: "Under your care",         warn: false },
                  { label: "Critical",      val: patients.filter(p => p.condition === "Critical").length, sub: "Require immediate attention", warn: true },
                  { label: "Active Alerts", val: visAlerts.length,                             sub: "Unresolved",              warn: visAlerts.length > 0 },
                  { label: "Tasks pending", val: tasks.filter(t => !t.done).length,            sub: `${doneTasks} completed`,  warn: false },
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
                        <div className="db-appt-doctor">{p.room} · Age {p.age}</div>
                      </div>
                    </div>
                    <div className="db-critical-vitals">
                      {[["HR", p.vitals.hr, "bpm"], ["BP", p.vitals.bp, ""], ["SpO₂", p.vitals.spo2, "%"]].map(([l, v, u]) => (
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
                  <div className="db-sub-title">Recent Alerts</div>
                  {visAlerts.slice(0, 3).map(a => (
                    <div key={a.id} className={`db-card db-card--${a.type}`}>
                      <div className="db-alert-patient">{a.patient} · <span className="db-alert-room">{a.room}</span></div>
                      <div className="db-alert-msg">{a.message}</div>
                      <div className="db-alert-time">{a.time}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="db-sub-title">Today's Schedule</div>
                  {pendingAppts.slice(0, 4).map(a => (
                    <div key={a.id} className="db-appt-card" style={{ marginBottom: 8 }}>
                      <div>
                        <div className="db-appt-title">{a.patient}</div>
                        <div className="db-appt-doctor">{a.type} · {a.room}</div>
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
                    <div className="db-patient-initials" style={{ background: "#FDEAEA", color: "#E24B4A" }}>{initials(selPatient.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="db-patient-name">{selPatient.name}</div>
                      <div className="db-patient-meta">{selPatient.room} · Age {selPatient.age}</div>
                    </div>
                    <span className={`db-badge ${condBadge(selPatient.condition)}`}>{selPatient.condition}</span>
                  </div>
                  <div className="db-vitals-mini-grid db-vitals-mini-grid--4">
                    {[["Heart Rate", selPatient.vitals.hr, "bpm"], ["Blood Pressure", selPatient.vitals.bp, "mmHg"], ["SpO₂", selPatient.vitals.spo2, "%"], ["Temperature", selPatient.vitals.temp, "°C"]].map(([l, v, u]) => (
                      <div key={l} className="db-vitals-mini-cell">
                        <div className="db-vitals-mini-label">{l}</div>
                        <div className="db-vitals-mini-val">{v}<span className="db-vitals-mini-unit">{u}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="db-sub-title">Active Alerts</div>
                {alertsData.filter(a => a.patient === selPatient.name).map(a => (
                  <div key={a.id} className={`db-card db-card--${a.type}`}>
                    <div className="db-alert-msg">{a.message}</div>
                    <div className="db-alert-time">{a.time}</div>
                  </div>
                ))}
                {alertsData.filter(a => a.patient === selPatient.name).length === 0 &&
                  <div className="db-empty-sub">No active alerts for this patient</div>}
              </>) : (
                <div className="db-patient-grid">
                  {patients.map(p => (
                    <div key={p.id} className="db-patient-card" onClick={() => setSelPat(p)}>
                      <div className="db-patient-initials" style={{ background: "#EAF3DE", color: "#1D9E75", width: 42, height: 42, fontSize: 13 }}>{initials(p.name)}</div>
                      <div style={{ flex: 1 }}>
                        <div className="db-patient-card-name">{p.name}</div>
                        <div className="db-patient-card-sub">{p.room} · Age {p.age}</div>
                      </div>
                      <div className="db-patient-card-right">
                        <span className={`db-badge ${condBadge(p.condition)}`}>{p.condition}</span>
                        {p.alerts > 0 && <span className="db-patient-alert-txt">⚑ {p.alerts} alert{p.alerts > 1 ? "s" : ""}</span>}
                      </div>
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
                    <tr>
                      {["Patient", "Room", "Condition", "Heart Rate", "Blood Pressure", "SpO₂", "Temp"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p.id} className={p.condition === "Critical" ? "critical-row" : ""}>
                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                        <td style={{ color: "var(--color-muted)" }}>{p.room}</td>
                        <td><span className={`db-badge ${condBadge(p.condition)}`}>{p.condition}</span></td>
                        <td><span className={`db-table-val ${parseInt(p.vitals.hr) > 100 ? "db-table-val--warn" : ""}`}>{p.vitals.hr}<span className="db-table-unit">bpm</span></span></td>
                        <td><span className="db-table-val">{p.vitals.bp}</span></td>
                        <td><span className={`db-table-val ${parseInt(p.vitals.spo2) < 95 ? "db-table-val--warn" : ""}`}>{p.vitals.spo2}<span className="db-table-unit">%</span></span></td>
                        <td><span className={`db-table-val ${parseFloat(p.vitals.temp) > 38 ? "db-table-val--warn" : ""}`}>{p.vitals.temp}<span className="db-table-unit">°C</span></span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="db-notice">Values in red indicate readings outside normal range. Verify with patient immediately.</div>
            </>)}

            {/* ══ ALERTS ══ */}
            {active === "alerts" && (<>
              {visAlerts.length === 0
                ? <div className="db-empty-state">
                    <div className="db-empty-icon">✓</div>
                    <div className="db-empty-title">All clear</div>
                    <div className="db-empty-sub">No active alerts at this time.</div>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span className={`db-badge db-badge--${a.type === "critical" ? "critical" : a.type === "caution" ? "caution" : "info"}`}>{a.type}</span>
                      <button className="db-dismiss-btn" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                    </div>
                  </div>
                ))}
            </>)}

            {/* ══ SCHEDULE ══ */}
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

            {/* ══ MEDICATIONS ══ */}
            {active === "medications" && (<>
              <div className="db-progress-card">
                <div className="db-progress-label">{givenMeds} of {meds.length} medications administered today</div>
                <div className="db-progress-bar">
                  <div className="db-progress-fill" style={{ width: `${(givenMeds / meds.length) * 100}%` }}></div>
                </div>
              </div>
              {meds.map(m => (
                <div key={m.id} className={`db-med-card ${m.given ? "db-med-card--taken" : ""}`}>
                  <div className="db-med-left">
                    <div className="db-med-room-badge">{m.room}</div>
                    <div>
                      <div className="db-med-name">{m.patient}</div>
                      <div className="db-med-detail">{m.med}</div>
                      <div className="db-med-time">{m.time}</div>
                    </div>
                  </div>
                  <button
                    className={`db-med-toggle ${m.given ? "db-med-toggle--taken" : ""}`}
                    onClick={() => toggleMed(m.id)}>
                    {m.given ? "✓ Given" : "Mark given"}
                  </button>
                </div>
              ))}
            </>)}

            {/* ══ TASKS ══ */}
            {active === "tasks" && (<>
              <div className="db-task-input-row">
                <input
                  className="db-task-input"
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTask()}
                  placeholder="Add a new task and press Enter..." />
                <button className="db-add-btn" onClick={addTask}>Add</button>
              </div>

              <div className="db-sub-title">To do — {tasks.filter(t => !t.done).length} remaining</div>
              {tasks.filter(t => !t.done).map(t => (
                <div key={t.id} className="db-task-card" onClick={() => toggleTask(t.id)}>
                  <div className={`db-task-circle db-task-circle--${t.priority}`}></div>
                  <div className="db-task-text">{t.text}</div>
                  <span className={`db-badge ${t.priority === "high" ? "db-badge--critical" : t.priority === "medium" ? "db-badge--caution" : "db-badge--neutral"}`}>{t.priority}</span>
                </div>
              ))}

              {doneTasks > 0 && (<>
                <div className="db-sub-title" style={{ marginTop: "1.5rem" }}>Completed — {doneTasks}</div>
                {tasks.filter(t => t.done).map(t => (
                  <div key={t.id} className="db-task-card db-task-card--done" onClick={() => toggleTask(t.id)}>
                    <div className="db-task-circle db-task-circle--done-check">✓</div>
                    <div className="db-task-text db-task-text--done">{t.text}</div>
                  </div>
                ))}
              </>)}
            </>)}

            {/* ══ REPORTS ══ */}
            {active === "reports" && (<>
              {reportsData.map(r => (
                <div key={r.id} className="db-report-card">
                  <div className="db-report-left">
                    <span className="db-badge db-badge--neutral">{r.type}</span>
                    <div>
                      <div className="db-report-title">{r.title}</div>
                      <div className="db-report-sub">{r.patient} · {r.date}</div>
                    </div>
                  </div>
                  <button className="db-view-btn">View</button>
                </div>
              ))}
            </>)}

          </div>
        </div>
      </main>
    </div>
  );
}
