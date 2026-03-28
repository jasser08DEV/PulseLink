import { useState } from 'react'
import './App.css'
import Home from './Home'
import Login from './Login'
import SignUp from './SignUp'
import Dashboard from './Dashboard'

function App() {
    const [page, setPage] = useState('home')
    const [currentUser, setCurrentUser] = useState(null)

    const navigate = (target, user) => {
        if (user) {
            setCurrentUser(user)
        }
        setPage(target)
    }

    return (
        <div>
            {page === 'home' && <Home navigate={navigate} />}
            {page === 'login' && <Login navigate={navigate} />}
            {page === 'signup' && <SignUp navigate={navigate} />}
            {page === 'dashboard' && <Dashboard user={currentUser} navigate={navigate} />}
        </div>
    )
}

export default App
