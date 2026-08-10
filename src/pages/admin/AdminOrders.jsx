import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

const statuses = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed', 'Cancelled']

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase.from('Order').select('*').order('Created_At', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(orderId, newStatus) {
    await supabase.from('Order').update({ Status: newStatus }).eq('Order_ID', orderId)
    fetchOrders()
  }

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>

  return (
    <AdminLayout>
      <h1>Order Management</h1>
      <table>
        <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.Order_ID}>
              <td>{o.Order_Number}</td>
              <td>{o.Customer_Name}</td>
              <td>{new Date(o.Created_At).toLocaleDateString()}</td>
              <td>₱{o.Total_Amount}</td>
              <td>{o.Payment_Method}</td>
              <td>
                <select value={o.Status} onChange={(e) => updateStatus(o.Order_ID, e.target.value)}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td><Link to={`/admin/orders/${o.Order_ID}`}>View Details</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}

export default AdminOrders