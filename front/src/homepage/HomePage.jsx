import { useNavigate } from 'react-router-dom'

function HomePage({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  const renderMenu = () => {
    switch (user.role) {
      case 'Admin':
        return (
          <>
            <button onClick={() => navigate('/show-items')}>Pokaż przedmioty</button>
            <button onClick={() => navigate('/show-locations')}>Pokaż lokalizacje</button>
            <button onClick={() => navigate('/show-users')}>Pokaż użytkowników</button>
            <button onClick={() => navigate('/transactions')}>Pokaż wysyłki</button>
            <button onClick={() => navigate('/configuration')}>Konfiguracja magazynu</button>
          </>
        )
      case 'Manager':
        return (
          <>
            <button onClick={() => navigate('/inventory')}>Inwentaryzacje</button>
            <button onClick={() => navigate('/current-stock')}>Obecny zapas</button>
            <button onClick={() => navigate('/deliveries')}>Dostawy</button>
            <button onClick={() => navigate('/transactions')}>Pokaż wysyłki</button>

          </>
        )
      case 'User':
        return (
          <>
          <button onClick={() => navigate('/current-stock')}>Obecny zapas</button>
          <button onClick={() => navigate('/transactions/new')}>Nowa wysyłka</button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="home-container">
      <h1>Witaj, {user.username}!</h1>
      <div className="menu">
        {renderMenu()}
      </div>
      <button onClick={handleLogout}>Wyloguj</button>
    </div>
  )
}

export default HomePage