import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import Login from "./SignUp-LogIn/Login";
import SignUp from "./SignUp-LogIn/SignUp";
import Dashboard from "./Dashboard/Dashboard";
import DoctorDashboard from "./Dashboard/DoctorDashboard";
import NurseDashboard from "./Dashboard/NurseDashboard";

const ProtectedRoute = ({ element, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase().trim();

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole)
    return <Navigate to="/login" replace />;
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<Dashboard />} allowedRole="PATIENT" />
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute
              element={<DoctorDashboard />}
              allowedRole="DOCTOR"
            />
          }
        />
        <Route
          path="/nurse-dashboard"
          element={
            <ProtectedRoute element={<NurseDashboard />} allowedRole="NURSE" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
