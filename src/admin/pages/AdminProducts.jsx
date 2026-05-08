import React, { useEffect, useState } from 'react';
import useProducts from '../hooks/useProducts';

const PRODUCTS_API_URL = 'http://localhost:5000/api/products/';
const FALLBACK_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

const formatCategory = (category) => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') return category.name || category.title || 'Uncategorized';
  return 'Uncategorized';
};

const normalizeProduct = (product) => ({
  id: product._id || product.id,
  image: product.image || FALLBACK_IMAGE,
  name: product.name || 'Untitled Product',
  description: product.description || '',
  price: Number(product.price || 0),
  category: formatCategory(product.category),
  stock: Number(product.stock ?? product.countInStock ?? 0),
  isActive: typeof product.isActive === 'boolean' ? product.isActive : true
});

function ProductForm({initial, onSave, onClose, saving}){
  const [form, setForm] = useState(initial || {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    isActive: true
  });
  const [preview, setPreview] = useState(initial?.image || '');
  const [imageError, setImageError] = useState(false);

  function handleFile(e){
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm(f => ({...f, image: reader.result}));
      setImageError(false);
    };
    reader.readAsDataURL(file);
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError || !preview
    ? 'https://via.placeholder.com/80?text=No+Image'
    : preview;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{initial? 'Edit Product' : 'Add Product'}</h3>
        <div className="form-row">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})}
            required
          />
        </div>
        <div className="form-row">
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}
            rows="3"
            style={{width: '100%', padding: '8px', border: '1px solid #e6e9ee', borderRadius: '6px', resize: 'vertical'}}
          />
        </div>
        <div className="form-row">
          <input
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={e=>setForm({...form,price:e.target.value})}
            required
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={e=>setForm({...form,stock:e.target.value})}
            required
          />
        </div>
        <div className="form-row">
          <input
            placeholder="Category"
            value={form.category}
            onChange={e=>setForm({...form,category:e.target.value})}
          />
          <select
            value={form.isActive ? 'active' : 'inactive'}
            onChange={e=>setForm({...form,isActive:e.target.value === 'active'})}
            style={{padding: '8px', border: '1px solid #e6e9ee', borderRadius: '6px'}}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',marginBottom:6,fontSize:13,color:'#334155'}}>Product image</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {preview && (
            <div style={{marginTop:8}}>
              <img
                src={imageSrc}
                alt="preview"
                style={{width:80,height:80,objectFit:'cover',borderRadius:6,border:'1px solid #e6e9ee'}}
                onError={handleImageError}
              />
            </div>
          )}
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn"
            onClick={()=>{
              if (!form.name.trim() || !form.price) {
                alert('Name and price are required');
                return;
              }
              onSave(form);
            }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts(){
  const { products: apiProducts, loading, error } = useProducts();
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setProducts(apiProducts);
  }, [apiProducts]);

  function handleAdd(){ setEditing(null); setModalOpen(true); }

  async function handleSave(data){
    const item = {
      ...data,
      price: parseFloat(data.price)||0,
      stock: parseInt(data.stock||0) || 0,
      image: data.image || editing?.image || ''
    };

    if(editing){
      setProducts(p=>p.map(x=> x.id===editing.id ? {...x, ...item} : x));
      setModalOpen(false);
      return;
    }

    try {
      setSaving(true);
      setSaveError('');

      const response = await fetch(PRODUCTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          countInStock: item.stock,
          category: item.category,
          image: item.image,
          isActive: item.isActive
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add product (${response.status})`);
      }

      const created = await response.json();
      const createdProduct = normalizeProduct(created?.product || created);
      setProducts((prev) => [createdProduct, ...prev]);
      setModalOpen(false);
    } catch (err) {
      setSaveError(err.message || 'Unable to add product. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(p){ setEditing(p); setModalOpen(true); }

  function handleDelete(id){
    if(!confirm('Delete product?')) return;
    setProducts(p=>p.filter(x=>x.id!==id));
  }

  return (
    <div>
      <div className="admin-top">
        <h2>Products</h2>
        <div>
          <button className="btn" onClick={handleAdd}>Add Product</button>
        </div>
      </div>

      {loading && <div className="products-loading">Loading products...</div>}
      {error && <div className="products-error">{error}</div>}
      {saveError && <div className="products-error">{saveError}</div>}
      {!loading && !error && (
        <div className="table products-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image || 'https://via.placeholder.com/80?text=No+Image'}
                      alt="thumb"
                      className="thumb"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                      }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {p.description || 'No description'}
                  </td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.category || 'General'}</td>
                  <td>
                    <span className={`status ${p.isActive ? 'completed' : 'cancelled'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn ghost" onClick={()=>handleEdit(p)}>Edit</button>
                    <button className="btn" style={{marginLeft:8}} onClick={()=>handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductForm initial={editing} onSave={handleSave} onClose={()=>setModalOpen(false)} saving={saving} />
      )}
    </div>
  );
}
