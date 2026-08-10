import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

function AdminOrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      const { data: orderData } = await supabase.from('Order').select('*').eq('Order_ID', id).single()
      const { data: itemData } = await supabase
        .from('Order_Item')
        .select('*, Product(Name)')
        .eq('Order_ID', id)

      setOrder(orderData)
      setItems(itemData || [])
      setLoading(false)
    }

    fetchOrder()
  }, [id])

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>
  if (!order) return <AdminLayout><p>Order not found.</p></AdminLayout>

  return (
    <AdminLayout>
      <h1>Order {order.Order_Number}</h1>
      <p>Customer: {order.Customer_Name} ({order.Customer_Email})</p>
      <p>Delivery Address: {order.Delivery_Address}</p>
      <p>Payment Method: {order.Payment_Method}</p>
      <p>Status: {order.Status}</p>
      <p>Notes: {order.Notes || 'None'}</p>

      <h2>Items</h2>
      <table>
        <thead><tr><th>Product</th><th>Quantity</th><th>Price at Purchase</th><th>Subtotal</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.Order_Item_ID}>
              <td>{item.Product?.Name || item.Product_ID}</td>
              <td>{item.Quantity}</td>
              <td>₱{item.Price_At_Purchase}</td>
              <td>₱{item.Quantity * item.Price_At_Purchase}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: ₱{order.Total_Amount}</h2>
    </AdminLayout>
  )
}

export default AdminOrderDetails