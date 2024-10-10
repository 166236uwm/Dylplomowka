import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { unauthorisedWithBody } from '../api/auth'

function Login({ setUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await unauthorisedWithBody("/User/Login", { username, password })
      console.log(data)
      setUser(data.data)
      navigate('/home')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default Login