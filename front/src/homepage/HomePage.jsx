import { useNavigate } from 'react-router-dom'

function HomePage({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear user data and redirect to login
    navigate('/login')
  }

  const renderMenu = () => {
    switch (user.role) {
      case 'Admin':
        return (
          <>
            <button onClick={() => navigate('/add-user')}>Add User</button>
            <button onClick={() => navigate('/add-location')}>Add Location</button>
          </>
        )
      case 'Manager':
        return (
          <>
            <button onClick={() => navigate('/book-inventory')}>Book Inventory</button>
            <button onClick={() => navigate('/current-stock')}>Current Stock</button>
          </>
        )
      case 'User':
        return (
          <button onClick={() => navigate('/current-stock')}>Current Stock</button>
        )
      default:
        return null
    }
  }

  return (
    <div className="home-container">
      <h1>Welcome, {user.username}!</h1>
      <div className="menu">
        {renderMenu()}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default HomePage