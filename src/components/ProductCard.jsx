import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'


function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <img src={product.Image_URL} alt={product.Name} />
      <h3>{product.Name}</h3>
      <p>₱{product.Price}</p>
      <p>{product.Category?.Name}</p>
      <p>{product.Stock_Qty > 0 ? 'In stock' : 'Out of stock'}</p>

      <Link to={`/products/${product.Product_ID}`}>View Details</Link>

      <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
    </div>
  )
}

export default ProductCard