import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(product, quantity) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.Product_ID === product.Product_ID)
      if (existing) {
        return prev.map((item) =>
          item.Product_ID === product.Product_ID
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.Product_ID !== productId))
  }

  function updateQuantity(productId, quantity) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.Product_ID === productId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}