import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './login/Login'
import HomePage from './homepage/HomePage'
import ShowUsers from './users/ShowUsers'; // Import the new component
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route 
            path="/home" 
            element={user ? <HomePage user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/show-users" 
            element={user && user.role === 'Admin' ? <ShowUsers user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App