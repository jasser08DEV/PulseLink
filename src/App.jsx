import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';

function App() {
   
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Dashboard/>
    );
}

export default App;