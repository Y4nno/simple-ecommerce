import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      const { data: orders } = await supabase.from('Order').select('*')

      const grouped = {}
      orders?.forEach((o) => {
        if (!grouped[o.Customer_Email]) {
          grouped[o.Customer_Email] = {
            name: o.Customer_Name,
            email: o.Customer_Email,
            contact: o.Customer_Contact,
            orderCount: 0,
            totalSpent: 0,
            status: 'Active',
          }
        }
        grouped[o.Customer_Email].orderCount += 1
        grouped[o.Customer_Email].totalSpent += o.Total_Amount
      })

      setCustomers(Object.values(grouped))
      setLoading(false)
    }

    fetchCustomers()
  }, [])

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>

  return (
    <AdminLayout>
      <h1>Customer Management</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Contact</th><th>Orders</th><th>Total Spent</th><th>Status</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.email}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.contact}</td>
              <td>{c.orderCount}</td>
              <td>₱{c.totalSpent}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}

export default AdminCustomers