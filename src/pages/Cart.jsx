import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  const total = cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Your Cart</h1>

      {cartItems.map((item) => (
        <div key={item.Product_ID} className="cart-item">
          <img src={item.Image_URL} alt={item.Name} />
          <h3>{item.Name}</h3>
          <p>₱{item.Price}</p>

          <div className="quantity-selector">
            <button onClick={() => updateQuantity(item.Product_ID, Math.max(1, item.quantity - 1))}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.Product_ID, item.quantity + 1)}>+</button>
          </div>

          <p>Subtotal: ₱{item.Price * item.quantity}</p>

          <button onClick={() => removeFromCart(item.Product_ID)}>Remove</button>
        </div>
      ))}

      <h2>Total: ₱{total}</h2>

      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  )
}

export default Cart