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
            <button onClick={() => navigate('/show-items')}>Show Items</button>
            <button onClick={() => navigate('/show-locations')}>Show Locations</button>
            <button onClick={() => navigate('/show-users')}>Show Users</button>
            <button onClick={() => navigate('/transactions')}>View Transactions</button>
          </>
        )
      case 'Manager':
        return (
          <>
            <button onClick={() => navigate('/inventory')}>Book Inventory</button>
            <button onClick={() => navigate('/current-stock')}>Current Stock</button>
            <button onClick={() => navigate('/deliveries')}>Deliveries</button>
            <button onClick={() => navigate('/transactions')}>View Transactions</button>

          </>
        )
      case 'User':
        return (
          <>
          <button onClick={() => navigate('/current-stock')}>Current Stock</button>
          <button onClick={() => navigate('/transactions/new')}>New Transaction</button>
          </>
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