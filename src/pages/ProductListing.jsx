import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

function ProductListing() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('none')

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("Product")
        .select('*, Category(Name)')
        .eq("Status", "Active")

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Loading...</p>

  const filteredProducts = products
    .filter((p) => p.Name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => categoryFilter === 'all' || p.Category_ID === Number(categoryFilter))
    .sort((a, b) => {
      if (sortOrder === 'low-high') return a.Price - b.Price
      if (sortOrder === 'high-low') return b.Price - a.Price
      return 0
    })

  const categoryOptions = [
  { id: 'all', name: 'All Categories' },
  ...Array.from(new Map(products.map((p) => [p.Category_ID, p.Category?.Name])).entries())
    .map(([id, name]) => ({ id, name }))
  ]

  return (
    <div>
      <h1>All Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort by</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.Product_ID} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductListing