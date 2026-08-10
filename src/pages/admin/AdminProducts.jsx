import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

const emptyForm = {
  Name: '', Category_ID: '', Price: '', Stock_Qty: '', Status: 'Active', Image_URL: '', Description: '',
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: prod } = await supabase.from('Product').select('*')
    const { data: cats } = await supabase.from('Category').select('*')
    setProducts(prod || [])
    setCategories(cats || [])
    setLoading(false)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function startAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function startEdit(product) {
    setForm({
      Name: product.Name, Category_ID: product.Category_ID, Price: product.Price,
      Stock_Qty: product.Stock_Qty, Status: product.Status, Image_URL: product.Image_URL,
      Description: product.Description,
    })
    setEditingId(product.Product_ID)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      Category_ID: Number(form.Category_ID),
      Price: Number(form.Price),
      Stock_Qty: Number(form.Stock_Qty),
    }

    if (editingId) {
      await supabase.from('Product').update(payload).eq('Product_ID', editingId)
    } else {
      await supabase.from('Product').insert(payload)
    }

    setShowForm(false)
    fetchAll()
  }

  async function confirmDelete() {
    await supabase.from('Product').delete().eq('Product_ID', deleteTarget)
    setDeleteTarget(null)
    fetchAll()
  }

  const filtered = products
    .filter((p) => p.Name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => statusFilter === 'all' || p.Status === statusFilter)
    .filter((p) => categoryFilter === 'all' || p.Category_ID === Number(categoryFilter))

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>

  return (
    <AdminLayout>
      <h1>Product Management</h1>
      <button onClick={startAdd}>Add Product</button>

      <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c.Category_ID} value={c.Category_ID}>{c.Name}</option>
        ))}
      </select>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <input name="Name" placeholder="Product Name" value={form.Name} onChange={handleChange} required />
          <select name="Category_ID" value={form.Category_ID} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.Category_ID} value={c.Category_ID}>{c.Name}</option>)}
          </select>
          <input name="Price" type="number" placeholder="Price" value={form.Price} onChange={handleChange} required />
          <input name="Stock_Qty" type="number" placeholder="Stock Quantity" value={form.Stock_Qty} onChange={handleChange} required />
          <select name="Status" value={form.Status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <input name="Image_URL" placeholder="Image URL" value={form.Image_URL} onChange={handleChange} />
          <textarea name="Description" placeholder="Description" value={form.Description} onChange={handleChange} />
          <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.Product_ID}>
              <td>{p.Name}</td>
              <td>{categories.find((c) => c.Category_ID === p.Category_ID)?.Name || p.Category_ID}</td>
              <td>₱{p.Price}</td>
              <td>{p.Stock_Qty}</td>
              <td>{p.Status}</td>
              <td>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => setDeleteTarget(p.Product_ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteTarget && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this product?</p>
          <button onClick={confirmDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProducts