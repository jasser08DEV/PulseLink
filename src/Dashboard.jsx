import React, { useState } from 'react';
import './Dashboard.css';

const Sidebar = ({ user, activeTab, setActiveTab, navigate }) => {

    const patientNav = [
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'vitals', icon: '💓', label: 'My Vitals' },
        { id: 'appointments', icon: '📅', label: 'Appointments' },
        { id: 'profile', icon: '👤', label: 'My Profile' },
    ];

    const doctorNav = [
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'patients', icon: '🏥', label: 'My Patients' },
        { id: 'appointments', icon: '📅', label: 'Schedule' },
        { id: 'profile', icon: '👤', label: 'My Profile' },
    ];

    const nurseNav = [
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'patients', icon: '🏥', label: 'Patient List' },
        { id: 'vitals', icon: '💓', label: 'Vitals Log' },
        { id: 'profile', icon: '👤', label: 'My Profile' },
    ];

    let navItems = patientNav;
    if (user && user.role === 'doctor') {
        navItems = doctorNav;
    } else if (user && user.role === 'nurse') {
        navItems = nurseNav;
    }

    let roleLabel = 'Patient';
    let roleBadgeClass = 'badge-patient';
    if (user && user.role === 'doctor') {
        roleLabel = 'Doctor';
        roleBadgeClass = 'badge-doctor';
    } else if (user && user.role === 'nurse') {
        roleLabel = 'Nurse';
        roleBadgeClass = 'badge-nurse';
    }

    const userName = user && user.name ? user.name : 'User';
    const avatarLetter = userName[0].toUpperCase();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-pulse">Pulse</span><span className="brand-link">Link</span>
            </div>
            <div className="sidebar-user">
                <div className="user-avatar">{avatarLetter}</div>
                <div className="user-info">
                    <span className="user-name">{userName}</span>
                    <span className={"role-badge " + roleBadgeClass}>{roleLabel}</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={activeTab === item.id ? "nav-item nav-item--active" : "nav-item"}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>
            <button className="logout-btn" onClick={() => navigate('login')}>
                Sign Out
            </button>
        </aside>
    );
};

const PatientOverview = ({ user }) => {
    const userName = user && user.name ? user.name : 'there';

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>Good morning, {userName} 👋</h1>
                <p className="page-sub">Here's your health summary for today.</p>
            </div>
            <div className="stat-grid">
                <div className="stat-card stat-card--normal">
                    <div className="stat-icon">💓</div>
                    <div className="stat-body">
                        <span className="stat-label">Heart Rate</span>
                        <span className="stat-value">72 <span className="stat-unit">bpm</span></span>
                    </div>
                </div>
                <div className="stat-card stat-card--normal">
                    <div className="stat-icon">🩸</div>
                    <div className="stat-body">
                        <span className="stat-label">Blood Pressure</span>
                        <span className="stat-value">118/76 <span className="stat-unit">mmHg</span></span>
                    </div>
                </div>
                <div className="stat-card stat-card--normal">
                    <div className="stat-icon">🌡️</div>
                    <div className="stat-body">
                        <span className="stat-label">Temperature</span>
                        <span className="stat-value">98.6 <span className="stat-unit">°F</span></span>
                    </div>
                </div>
                <div className="stat-card stat-card--normal">
                    <div className="stat-icon">💨</div>
                    <div className="stat-body">
                        <span className="stat-label">SpO₂</span>
                        <span className="stat-value">98 <span className="stat-unit">%</span></span>
                    </div>
                </div>
            </div>
            <div className="section-title">Upcoming Appointments</div>
            <div className="card-list">
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Mar 30, 2026 <span className="appt-time">10:00 AM</span></div>
                        <div className="appt-doctor">Dr. Emily Chen</div>
                        <div className="appt-type">Cardiology Follow-up</div>
                    </div>
                    <span className="badge-status badge-confirmed">confirmed</span>
                </div>
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Apr 5, 2026 <span className="appt-time">2:30 PM</span></div>
                        <div className="appt-doctor">Dr. James Patel</div>
                        <div className="appt-type">General Checkup</div>
                    </div>
                    <span className="badge-status badge-pending">pending</span>
                </div>
            </div>
        </div>
    );
};

const PatientVitals = () => {
    const [formData, setFormData] = useState({
        heartRate: '',
        bloodPressure: '',
        temperature: '',
        spo2: '',
        weight: '',
        notes: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/vitals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
                setFormData({ heartRate: '', bloodPressure: '', temperature: '', spo2: '', weight: '', notes: '' });
            } else {
                alert("Failed to log vitals.");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the server. Is your backend running?");
        }
    };

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>My Vitals</h1>
                <p className="page-sub">Log your current health readings.</p>
            </div>
            {submitted && (
                <div className="success-banner">Vitals logged successfully!</div>
            )}
            <div className="form-card">
                <form onSubmit={handleSubmit} className="vitals-form">
                    <div className="form-grid-2">
                        <div className="input-group">
                            <label>Heart Rate (bpm)</label>
                            <input
                                type="number"
                                name="heartRate"
                                placeholder="e.g. 72"
                                value={formData.heartRate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Blood Pressure (mmHg)</label>
                            <input
                                type="text"
                                name="bloodPressure"
                                placeholder="e.g. 120/80"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Temperature (°F)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="temperature"
                                placeholder="e.g. 98.6"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>SpO₂ (%)</label>
                            <input
                                type="number"
                                name="spo2"
                                placeholder="e.g. 98"
                                value={formData.spo2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Weight (lbs)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="weight"
                                placeholder="e.g. 165"
                                value={formData.weight}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group full-width">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                placeholder="Any symptoms or notes..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">Log Vitals</button>
                </form>
            </div>
            <div className="section-title">Recent Vitals History</div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Heart Rate</th>
                            <th>Blood Pressure</th>
                            <th>Temp</th>
                            <th>SpO₂</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mar 27</td>
                            <td>72 bpm</td>
                            <td>118/76</td>
                            <td>98.6°F</td>
                            <td>98%</td>
                            <td><span className="badge-normal">Normal</span></td>
                        </tr>
                        <tr>
                            <td>Mar 26</td>
                            <td>76 bpm</td>
                            <td>122/80</td>
                            <td>98.8°F</td>
                            <td>97%</td>
                            <td><span className="badge-normal">Normal</span></td>
                        </tr>
                        <tr>
                            <td>Mar 25</td>
                            <td>88 bpm</td>
                            <td>130/85</td>
                            <td>99.2°F</td>
                            <td>96%</td>
                            <td><span className="badge-warning">Elevated</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Appointments = ({ role }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        reason: '',
        doctor: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Appointment requested successfully!");
                setShowForm(false);
                setFormData({ date: '', time: '', reason: '', doctor: '' });
            } else {
                alert("Failed to book appointment.");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the server. Is your backend running?");
        }
    };

    const pageTitle = role === 'patient' ? 'My Appointments' : 'Schedule';
    const pageSubtitle = role === 'patient' ? 'View and request appointments.' : 'Manage your patient appointments.';

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>{pageTitle}</h1>
                <p className="page-sub">{pageSubtitle}</p>
            </div>
            {role === 'patient' && (
                <button className="submit-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Request Appointment'}
                </button>
            )}
            {showForm && (
                <div className="form-card" style={{ marginTop: '1rem' }}>
                    <form onSubmit={handleSubmit} className="vitals-form">
                        <div className="form-grid-2">
                            <div className="input-group">
                                <label>Preferred Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Preferred Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Doctor</label>
                                <select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Doctor</option>
                                    <option value="Dr. Emily Chen">Dr. Emily Chen - Cardiology</option>
                                    <option value="Dr. James Patel">Dr. James Patel - General</option>
                                    <option value="Dr. Sarah Williams">Dr. Sarah Williams - Neurology</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Reason for Visit</label>
                                <input
                                    type="text"
                                    name="reason"
                                    placeholder="e.g. Follow-up checkup"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Submit Request</button>
                    </form>
                </div>
            )}
            <div className="section-title">Upcoming</div>
            <div className="card-list">
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Mar 30, 2026 <span className="appt-time">10:00 AM</span></div>
                        <div className="appt-doctor">Dr. Emily Chen</div>
                        <div className="appt-type">Cardiology Follow-up</div>
                    </div>
                    <span className="badge-status badge-confirmed">confirmed</span>
                </div>
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Apr 5, 2026 <span className="appt-time">2:30 PM</span></div>
                        <div className="appt-doctor">Dr. James Patel</div>
                        <div className="appt-type">General Checkup</div>
                    </div>
                    <span className="badge-status badge-pending">pending</span>
                </div>
            </div>
            <div className="section-title" style={{ marginTop: '2rem' }}>Past</div>
            <div className="card-list">
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Mar 10, 2026 <span className="appt-time">9:00 AM</span></div>
                        <div className="appt-doctor">Dr. Sarah Williams</div>
                        <div className="appt-type">Neurology Consult</div>
                    </div>
                    <span className="badge-status badge-completed">completed</span>
                </div>
            </div>
        </div>
    );
};

const PatientList = ({ role }) => {
    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>{role === 'doctor' ? 'My Patients' : 'Patient List'}</h1>
                <p className="page-sub">
                    {role === 'doctor'
                        ? 'Overview of patients under your care.'
                        : 'All patients currently assigned to your ward.'}
                </p>
            </div>
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏥</div>
                    <div className="stat-body">
                        <span className="stat-label">Total Patients</span>
                        <span className="stat-value">5</span>
                    </div>
                </div>
                <div className="stat-card stat-card--critical">
                    <div className="stat-icon">🔴</div>
                    <div className="stat-body">
                        <span className="stat-label">Critical</span>
                        <span className="stat-value">1</span>
                    </div>
                </div>
                <div className="stat-card stat-card--warning">
                    <div className="stat-icon">🟡</div>
                    <div className="stat-body">
                        <span className="stat-label">Monitoring</span>
                        <span className="stat-value">1</span>
                    </div>
                </div>
                <div className="stat-card stat-card--normal">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-body">
                        <span className="stat-label">Stable</span>
                        <span className="stat-value">3</span>
                    </div>
                </div>
            </div>
            <div className="section-title">Patient Records</div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Health Issue</th>
                            <th>Room</th>
                            <th>Status</th>
                            {role === 'doctor' && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Maria Gonzalez</strong></td>
                            <td>45</td>
                            <td>Hypertension</td>
                            <td>201</td>
                            <td><span className="badge-status badge-confirmed">stable</span></td>
                            {role === 'doctor' && <td><button className="action-btn">View Chart</button></td>}
                        </tr>
                        <tr>
                            <td><strong>David Kim</strong></td>
                            <td>62</td>
                            <td>Diabetes Type II</td>
                            <td>114</td>
                            <td><span className="badge-status badge-critical">critical</span></td>
                            {role === 'doctor' && <td><button className="action-btn">View Chart</button></td>}
                        </tr>
                        <tr>
                            <td><strong>Susan Park</strong></td>
                            <td>38</td>
                            <td>Asthma</td>
                            <td>308</td>
                            <td><span className="badge-status badge-confirmed">stable</span></td>
                            {role === 'doctor' && <td><button className="action-btn">View Chart</button></td>}
                        </tr>
                        <tr>
                            <td><strong>Robert Torres</strong></td>
                            <td>71</td>
                            <td>Post-Surgery</td>
                            <td>220</td>
                            <td><span className="badge-status badge-pending">monitoring</span></td>
                            {role === 'doctor' && <td><button className="action-btn">View Chart</button></td>}
                        </tr>
                        <tr>
                            <td><strong>Lisa Nguyen</strong></td>
                            <td>29</td>
                            <td>Anemia</td>
                            <td>145</td>
                            <td><span className="badge-status badge-confirmed">stable</span></td>
                            {role === 'doctor' && <td><button className="action-btn">View Chart</button></td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DoctorOverview = ({ user }) => {
    const userName = user && user.name ? user.name : 'Doctor';

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>Welcome, Dr. {userName} 👋</h1>
                <p className="page-sub">Here's your clinical summary for today.</p>
            </div>
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-body">
                        <span className="stat-label">Total Patients</span>
                        <span className="stat-value">5</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-body">
                        <span className="stat-label">Appointments Today</span>
                        <span className="stat-value">3</span>
                    </div>
                </div>
                <div className="stat-card stat-card--critical">
                    <div className="stat-icon">🔴</div>
                    <div className="stat-body">
                        <span className="stat-label">Critical Alerts</span>
                        <span className="stat-value">1</span>
                    </div>
                </div>
                <div className="stat-card stat-card--normal">
                    <div className="stat-icon">✅</div>
                    <div className="stat-body">
                        <span className="stat-label">Discharged Today</span>
                        <span className="stat-value">2</span>
                    </div>
                </div>
            </div>
            <div className="section-title">Today's Schedule</div>
            <div className="card-list">
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Today <span className="appt-time">9:00 AM</span></div>
                        <div className="appt-doctor">Maria Gonzalez</div>
                        <div className="appt-type">Follow-up - Hypertension</div>
                    </div>
                    <span className="badge-status badge-confirmed">confirmed</span>
                </div>
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Today <span className="appt-time">11:30 AM</span></div>
                        <div className="appt-doctor">David Kim</div>
                        <div className="appt-type">Review - Diabetes Management</div>
                    </div>
                    <span className="badge-status badge-confirmed">confirmed</span>
                </div>
                <div className="list-row">
                    <div className="list-row-left">
                        <div className="appt-date">Today <span className="appt-time">3:00 PM</span></div>
                        <div className="appt-doctor">Lisa Nguyen</div>
                        <div className="appt-type">Initial Consult - Anemia</div>
                    </div>
                    <span className="badge-status badge-pending">pending</span>
                </div>
            </div>
        </div>
    );
};

const NurseOverview = ({ user }) => {
    const userName = user && user.name ? user.name : 'Nurse';

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>Welcome, {userName} 👋</h1>
                <p className="page-sub">Shift summary and patient status.</p>
            </div>
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-body">
                        <span className="stat-label">Assigned Patients</span>
                        <span className="stat-value">5</span>
                    </div>
                </div>
                <div className="stat-card stat-card--critical">
                    <div className="stat-icon">🔴</div>
                    <div className="stat-body">
                        <span className="stat-label">Critical</span>
                        <span className="stat-value">1</span>
                    </div>
                </div>
                <div className="stat-card stat-card--warning">
                    <div className="stat-icon">💊</div>
                    <div className="stat-body">
                        <span className="stat-label">Meds Due</span>
                        <span className="stat-value">3</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-body">
                        <span className="stat-label">Tasks Pending</span>
                        <span className="stat-value">4</span>
                    </div>
                </div>
            </div>
            <div className="section-title">Vitals Due</div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Room</th>
                            <th>Last Recorded</th>
                            <th>Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Maria Gonzalez</td>
                            <td>201</td>
                            <td>2h ago</td>
                            <td><span className="badge-warning">Now</span></td>
                        </tr>
                        <tr>
                            <td>David Kim</td>
                            <td>114</td>
                            <td>1h ago</td>
                            <td><span className="badge-normal">30 min</span></td>
                        </tr>
                        <tr>
                            <td>Robert Torres</td>
                            <td>220</td>
                            <td>3h ago</td>
                            <td><span className="badge-warning">Overdue</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const NurseVitalsLog = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        heartRate: '',
        bloodPressure: '',
        temperature: '',
        spo2: '',
        notes: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/vitals/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
                setFormData({ patientId: '', heartRate: '', bloodPressure: '', temperature: '', spo2: '', notes: '' });
            } else {
                alert("Failed to save vitals.");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the server. Is your backend running?");
        }
    };

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>Vitals Log</h1>
                <p className="page-sub">Record patient vitals during your shift.</p>
            </div>
            {submitted && (
                <div className="success-banner">Vitals recorded successfully!</div>
            )}
            <div className="form-card">
                <form onSubmit={handleSubmit} className="vitals-form">
                    <div className="form-grid-2">
                        <div className="input-group full-width">
                            <label>Patient</label>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Patient</option>
                                <option value="1">Maria Gonzalez - Room 201</option>
                                <option value="2">David Kim - Room 114</option>
                                <option value="3">Susan Park - Room 308</option>
                                <option value="4">Robert Torres - Room 220</option>
                                <option value="5">Lisa Nguyen - Room 145</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Heart Rate (bpm)</label>
                            <input
                                type="number"
                                name="heartRate"
                                placeholder="e.g. 72"
                                value={formData.heartRate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Blood Pressure</label>
                            <input
                                type="text"
                                name="bloodPressure"
                                placeholder="e.g. 120/80"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Temperature (°F)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="temperature"
                                placeholder="e.g. 98.6"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>SpO₂ (%)</label>
                            <input
                                type="number"
                                name="spo2"
                                placeholder="e.g. 98"
                                value={formData.spo2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group full-width">
                            <label>Clinical Notes</label>
                            <textarea
                                name="notes"
                                placeholder="Observations, symptoms, alerts..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">Save Vitals</button>
                </form>
            </div>
        </div>
    );
};

const Profile = ({ user }) => {
    const userName = user && user.name ? user.name : '';
    const userEmail = user && user.email ? user.email : '';
    const userRole = user && user.role ? user.role : '';
    const avatarLetter = userName ? userName[0].toUpperCase() : 'U';

    return (
        <div className="tab-content">
            <div className="page-header">
                <h1>My Profile</h1>
                <p className="page-sub">Your account information.</p>
            </div>
            <div className="form-card">
                <div className="profile-avatar-lg">{avatarLetter}</div>
                <div className="form-grid-2" style={{ marginTop: '1.5rem' }}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" value={userName} readOnly />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <input type="text" value={userRole} readOnly />
                    </div>
                    <div className="input-group full-width">
                        <label>Email</label>
                        <input type="email" value={userEmail} readOnly />
                    </div>
                </div>
                <p className="profile-note">To update your information please contact your system administrator.</p>
            </div>
        </div>
    );
};

const Dashboard = ({ user, navigate }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const role = user && user.role ? user.role : 'patient';

    const renderContent = () => {
        if (role === 'patient') {
            if (activeTab === 'overview') return <PatientOverview user={user} />;
            if (activeTab === 'vitals') return <PatientVitals />;
            if (activeTab === 'appointments') return <Appointments role="patient" />;
            if (activeTab === 'profile') return <Profile user={user} />;
        }
        if (role === 'doctor') {
            if (activeTab === 'overview') return <DoctorOverview user={user} />;
            if (activeTab === 'patients') return <PatientList role="doctor" />;
            if (activeTab === 'appointments') return <Appointments role="doctor" />;
            if (activeTab === 'profile') return <Profile user={user} />;
        }
        if (role === 'nurse') {
            if (activeTab === 'overview') return <NurseOverview user={user} />;
            if (activeTab === 'patients') return <PatientList role="nurse" />;
            if (activeTab === 'vitals') return <NurseVitalsLog />;
            if (activeTab === 'profile') return <Profile user={user} />;
        }
        return <PatientOverview user={user} />;
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="dashboard-layout">
            <Sidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                navigate={navigate}
            />
            <main className="dashboard-main">
                <div className="topbar">
                    <div className="topbar-left">
                        <span className="topbar-date">{today}</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-alert">
                            🔔
                            <span className="alert-dot" />
                        </div>
                    </div>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
