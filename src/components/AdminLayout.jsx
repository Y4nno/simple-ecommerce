import { Link, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

function AdminLayout({ children }) {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/customers">Customers</Link>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  )
}

export default AdminLayout