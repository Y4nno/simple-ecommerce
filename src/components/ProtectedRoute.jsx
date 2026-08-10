import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAdminAuth()

  if (loading) return <p>Loading...</p>

  return isLoggedIn ? children : <Navigate to="/admin/login" />
}

export default ProtectedRoute