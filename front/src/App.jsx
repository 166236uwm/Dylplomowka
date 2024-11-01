import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './login/Login'
import HomePage from './homepage/HomePage'
import ShowUsers from './users/ShowUsers';
import ShowLocations from './locations/ShowLocations';
import CurrentStock from './items/currentStock/CurrentStock';
import InventoryCheck from './inventoryCheck/InventoryCheck';
import NewInventoryCheck from './inventoryCheck/NewInventoryCheck';
import Register from './login/Register'
import './App.css'
import ShowItems from './items/showItems/ShowItems';

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
          <Route path="/show-locations" element={user && user.role === 'Admin' ? <ShowLocations user={user} /> : <Navigate to="/login" />} />
          <Route path="/current-stock" element={user ? <CurrentStock user={user} /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={user ? <InventoryCheck user={user} /> : <Navigate to="/login" />} />
          <Route path="/inventory/new" element={user ? <NewInventoryCheck user={user} /> : <Navigate to="/login" />} /> 
          <Route path="/register" element={<Register/>} />
          <Route path="/show-items" element={user && user.role === 'Admin' ? <ShowItems user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
