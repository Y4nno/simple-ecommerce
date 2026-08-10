import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabaseClient'

function Checkout() {
  const { cartItems, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    paymentMethod: 'Cash on Delivery',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(null)

  const total = cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const orderNumber = 'ORD-' + Date.now()

    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .insert({
        Order_Number: orderNumber,
        Customer_Name: form.name,
        Customer_Email: form.email,
        Customer_Contact: form.contact,
        Delivery_Address: form.address,
        Payment_Method: form.paymentMethod,
        Status: 'Pending',
        Notes: form.notes,
        Total_Amount: total,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      setSubmitting(false)
      return
    }

    const orderItems = cartItems.map((item) => ({
      Order_ID: orderData.Order_ID,
      Product_ID: item.Product_ID,
      Quantity: item.quantity,
      Price_At_Purchase: item.Price,
    }))

    const { error: itemsError } = await supabase.from('Order_Item').insert(orderItems)

    if (itemsError) {
      console.error('Error saving order items:', itemsError)
      setSubmitting(false)
      return
    }

    const savedOrders = JSON.parse(localStorage.getItem('myOrders') || '[]')
    localStorage.setItem('myOrders', JSON.stringify([...savedOrders, orderNumber]))

    setOrderConfirmed({ orderNumber, total })
    clearCart()
    setSubmitting(false)
  }

  if (orderConfirmed) {
    return (
      <div>
        <h1>Order Confirmed!</h1>
        <p>Order Number: {orderConfirmed.orderNumber}</p>
        <p>Save this order number to track your order status later.</p>
        <p>Total: ₱{orderConfirmed.total}</p>
        <button onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
        <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required />
        <input name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} required />

        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="E-Wallet">E-Wallet</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        <textarea name="notes" placeholder="Order Notes" value={form.notes} onChange={handleChange} />

        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <p key={item.Product_ID}>{item.Name} x{item.quantity} — ₱{item.Price * item.quantity}</p>
        ))}
        <h3>Total: ₱{total}</h3>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}

export default Checkout