import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from('Product')
        .select('*, Category(Name)')
        .eq('Status', 'Active')
        .limit(4)

      if (error) {
        console.error('Error fetching featured products:', error)
      } else {
        setFeaturedProducts(data)
      }
      setLoading(false)
    }

    fetchFeatured()
  }, [])

  return (
    <div>
      <div className="banner">
        <h1>Welcome to Simple</h1>
        <p>Quality products, unbeatable prices.</p>
        <Link to="/products">Shop Now</Link>
      </div>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-list">
          <Link to="/products">Electronics</Link>
          <Link to="/products">Clothing</Link>
          <Link to="/products">Accessories</Link>
          <Link to="/products">Home & Living</Link>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.Product_ID} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer>
        <p>Contact us: simple@test.com | 0912-345-6789</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </div>
  )
}

export default Home