import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('Product_ID', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
      } else {
        setProduct(data)

        const { data: related } = await supabase
          .from('Product')
          .select('*')
          .eq('Category_ID', data.Category_ID)
          .eq('Status', 'Active')
          .neq('Product_ID', data.Product_ID)
          .limit(4)

        setRelatedProducts(related || [])
      }
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!product) return <p>Product not found.</p>

  return (
    <div>
      <img src={product.Image_URL} alt={product.Name} />
      <h1>{product.Name}</h1>
      <p>₱{product.Price}</p>
      <p>{product.Description}</p>
      <p>{product.Stock_Qty > 0 ? `${product.Stock_Qty} in stock` : 'Out of stock'}</p>

      <div className="quantity-selector">
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity((q) => Math.min(product.Stock_Qty, q + 1))}>+</button>
      </div>

        <button onClick={() => addToCart(product, quantity)}>
        Add to Cart
        </button>

      <section>
        <h2>Related Products</h2>
        <div className="product-grid">
          {relatedProducts.map((p) => (
            <ProductCard key={p.Product_ID} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetails