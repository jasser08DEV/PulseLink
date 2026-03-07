import React from 'react'
import './Home.css'
import logoImg from './assets/logo.png';

function Home() {
    return (
        <div className="home">
            <div className="banner">
                <div className="logo-section">
                    <img src={logoImg} alt="Logo" className="logo" />
                    <h2 className="title">PulseLink</h2>
                </div>
                <div className="leftSideBanner">
                    <h3>Home</h3>
                    <h3>System Alert</h3>
                    <h3>Contact</h3>
                    <h3>Login</h3>
                </div>
            </div>
            <div className="body">
                <div className="intro">
                    <h1>Unified Health-Tracking Dashboard</h1>
                    <h3>Real-time vitals monitoring and synchronized reporting for streamlined clinical communication</h3>
                </div>
                <div className="portal-selection">
                    <div className="portal-button">
                        <div className="icon">👤</div>
                        <h2>Patient Portal</h2>
                    </div>
                    <div className="portal-button">
                        <div className="icon">👩‍⚕️</div>
                        <h2>Nurse Portal</h2>
                    </div>
                    <div className="portal-button">
                        <div className="icon">🩺</div>
                        <h2>Doctor Portal</h2>
                    </div>
                </div>
            </div>
            <footer>
            <div class="disclaimer">
                <p><strong>Notice:</strong> PulseLink is not a diagnostic tool and does not replace professional medical judgment</p>
                <p>Access restricted to authorized personnel and registered patients only.</p>
            </div>
            </footer>
        </div>
    )
}

export default Home