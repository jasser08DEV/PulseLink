
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './SignUp-LogIn/Login';
import SignUp from './SignUp-LogIn/SignUp';
import Dashboard from './Dashboard/Dashboard';
import DoctorDashboard from './Dashboard/DoctorDashboard';
import NurseDashboard from './Dashboard/NurseDashboard';


function App() {
   
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/doctor-dashboard" element={isAuthenticated ? <DoctorDashboard /> : <Navigate to="/login" />} />
                <Route path="/nurse-dashboard" element={isAuthenticated ? <NurseDashboard /> : <Navigate to="/login" />} />
                
            </Routes>
        </Router>
    );
}

export default App;