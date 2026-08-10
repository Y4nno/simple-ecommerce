import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, pendingOrders: 0,
    completedOrders: 0, totalCustomers: 0, totalSales: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const { data: products } = await supabase.from('Product').select('*')
      const { data: orders } = await supabase.from('Order').select('*')

      const uniqueCustomers = new Set(orders?.map((o) => o.Customer_Email))
      const totalSales = orders
        ?.filter((o) => o.Status === 'Completed')
        .reduce((sum, o) => sum + o.Total_Amount, 0)

      setStats({
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        pendingOrders: orders?.filter((o) => o.Status === 'Pending').length || 0,
        completedOrders: orders?.filter((o) => o.Status === 'Completed').length || 0,
        totalCustomers: uniqueCustomers.size,
        totalSales: totalSales || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>

  return (
    <AdminLayout>
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card"><h3>Total Products</h3><p>{stats.totalProducts}</p></div>
        <div className="stat-card"><h3>Total Orders</h3><p>{stats.totalOrders}</p></div>
        <div className="stat-card"><h3>Pending Orders</h3><p>{stats.pendingOrders}</p></div>
        <div className="stat-card"><h3>Completed Orders</h3><p>{stats.completedOrders}</p></div>
        <div className="stat-card"><h3>Total Customers</h3><p>{stats.totalCustomers}</p></div>
        <div className="stat-card"><h3>Total Sales</h3><p>₱{stats.totalSales}</p></div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard