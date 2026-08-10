import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ Name: '', Description: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteWarning, setDeleteWarning] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: cats } = await supabase.from('Category').select('*')
    const { data: prod } = await supabase.from('Product').select('*')
    setCategories(cats || [])
    setProducts(prod || [])
    setLoading(false)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function startAdd() {
    setForm({ Name: '', Description: '' })
    setEditingId(null)
    setShowForm(true)
  }

  function startEdit(cat) {
    setForm({ Name: cat.Name, Description: cat.Description })
    setEditingId(cat.Category_ID)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('Category').update(form).eq('Category_ID', editingId)
    } else {
      await supabase.from('Category').insert(form)
    }
    setShowForm(false)
    fetchAll()
  }

  function tryDelete(categoryId) {
    const inUse = products.some((p) => p.Category_ID === categoryId)
    if (inUse) {
      setDeleteWarning('Cannot delete: this category is assigned to one or more products.')
      return
    }
    setDeleteWarning('')
    setDeleteTarget(categoryId)
  }

  async function confirmDelete() {
    await supabase.from('Category').delete().eq('Category_ID', deleteTarget)
    setDeleteTarget(null)
    fetchAll()
  }

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>

  return (
    <AdminLayout>
      <h1>Category Management</h1>
      <button onClick={startAdd}>Add Category</button>

      {deleteWarning && <p className="error">{deleteWarning}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <input name="Name" placeholder="Category Name" value={form.Name} onChange={handleChange} required />
          <textarea name="Description" placeholder="Description" value={form.Description} onChange={handleChange} />
          <button type="submit">{editingId ? 'Update' : 'Add'} Category</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <table>
        <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.Category_ID}>
              <td>{c.Name}</td>
              <td>{c.Description}</td>
              <td>
                <button onClick={() => startEdit(c)}>Edit</button>
                <button onClick={() => tryDelete(c.Category_ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteTarget && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this category?</p>
          <button onClick={confirmDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCategories