import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/auth'
import './Login.css';

function Login({ setUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await apiRequest("User/Login", null, { username, password }, 'POST');
      setUser(data);
      navigate('/home');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Nieprawidłowa nazwa użytownika lub hasło.');
      } else if (err.response && err.response.status === 400) {
        setError('Nieprawidłowe dane logowania.');
      } else if (err.response && err.response.status === 500) {
        setError('Błąd serwera. Spróbuj ponownie.');
      } else {
        setError('Nieznany błąd.');
      }
      console.error('Login error:', err);
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Nazwa Użytkownika:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default Login