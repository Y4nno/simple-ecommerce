import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="admin-login">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default AdminLogin