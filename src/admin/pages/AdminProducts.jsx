import React, { useEffect, useMemo, useState } from 'react';
import useProducts from '../hooks/useProducts';
import { adminFetch } from '../utils/adminApi';

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

const validateForm = (form, requireImage) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Product name is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (form.price === '' || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
  if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'Stock cannot be negative';
  if (requireImage && !form.imageFile) errors.image = 'Product image is required';
  return errors;
};

function ProductForm({ initial, onSave, onClose, saving, submitError }) {
  const [form, setForm] = useState(initial || {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    imageFile: null,
    isActive: true
  });
  const [preview, setPreview] = useState(initial?.image || '');
  const [imageError, setImageError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const imageSrc = useMemo(() => {
    if (imageError || !preview) return FALLBACK_IMAGE;
    return preview;
  }, [imageError, preview]);

  function handleFile(e){
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    setValidationErrors((prev) => ({ ...prev, image: '' }));
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm(f => ({
        ...f,
        image: reader.result,
        imageFile: file
      }));
      setImageError(false);
    };
    reader.readAsDataURL(file);
  }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateForm(form, !initial);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSave(form);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal-product">
        <div className="product-modal-header">
          <h3>{initial ? 'Edit Product' : 'Add Product'}</h3>
          <p>Fill all required fields to publish your product.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="product-form-grid">
            <div className="form-field full-width">
              <label>Name *</label>
              <input
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
            </div>

            <div className="form-field full-width">
              <label>Description *</label>
              <textarea
                placeholder="Write a short product description"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows="3"
              />
              {validationErrors.description && <span className="field-error">{validationErrors.description}</span>}
            </div>

            <div className="form-field">
              <label>Price *</label>
              <input
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
              />
              {validationErrors.price && <span className="field-error">{validationErrors.price}</span>}
            </div>

            <div className="form-field">
              <label>Stock *</label>
              <input
                placeholder="0"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setField('stock', e.target.value)}
              />
              {validationErrors.stock && <span className="field-error">{validationErrors.stock}</span>}
            </div>

            <div className="form-field">
              <label>Image Upload *</label>
              <input type="file" accept="image/*" onChange={handleFile} />
              {validationErrors.image && <span className="field-error">{validationErrors.image}</span>}
            </div>

            <div className="form-field full-width image-preview-wrap">
              <img
                src={imageSrc}
                alt="preview"
                className="image-preview"
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          {submitError && (
            <div className="products-error" style={{ marginTop: 12 }}>
              {submitError}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? (initial ? 'Updating...' : 'Saving...') : (initial ? 'Update Product' : 'Save Product')}
            </button>
          </div>
        </form>
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
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    setProducts(apiProducts);
  }, [apiProducts]);

  useEffect(() => {
    if (!toast.message) return;
    const timeout = setTimeout(() => setToast({ type: '', message: '' }), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  function handleAdd(){
    setEditing(null);
    setSaveError('');
    setModalOpen(true);
  }

  const buildProductFormData = (item, includeImage) => {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('price', String(item.price));
    formData.append('stock', String(item.stock));
    if (includeImage && item.imageFile) {
      formData.append('image', item.imageFile);
    }
    return formData;
  };

  async function handleSave(data){
    const parsedPrice = Number(data.price);
    const parsedStock = Number(data.stock);

    const item = {
      ...data,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      stock: Number.isFinite(parsedStock) ? parsedStock : 0,
      image: data.image || editing?.image || ''
    };

    try {
      setSaving(true);
      setSaveError('');

      let response;
      const requestPayload = {
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        image: item.imageFile ? `[File] ${item.imageFile.name}` : '[unchanged]'
      };
      const isEditing = Boolean(editing);
      const formData = buildProductFormData(item, !isEditing || Boolean(item.imageFile));

      for (const [key, value] of formData.entries()) {
        console.log('[AdminProducts] FormData entry:', key, value);
      }

      const targetUrl = isEditing ? `${PRODUCTS_API_URL}${editing.id}` : PRODUCTS_API_URL;
      response = await adminFetch(targetUrl, {
        method: isEditing ? 'PUT' : 'POST',
        body: formData
      });

      console.log(`[AdminProducts] ${isEditing ? 'Update' : 'Add'} Product payload:`, requestPayload);

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const backendMessage =
          payload?.message ||
          payload?.error ||
          payload?.errors?.[0]?.msg ||
          `Failed to ${isEditing ? 'update' : 'add'} product (${response.status})`;
        console.error(`[AdminProducts] ${isEditing ? 'Update' : 'Add'} Product API error:`, {
          status: response.status,
          payload,
          requestPayload
        });
        throw new Error(backendMessage);
      }

      const savedProduct = normalizeProduct(payload?.product || payload);
      if (isEditing) {
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? savedProduct : p)));
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
      setToast({ type: 'success', message: isEditing ? 'Product updated successfully.' : 'Product added successfully.' });
    } catch (err) {
      setSaveError(err.message || 'Unable to save product. Please try again.');
      setToast({ type: 'error', message: err.message || 'Unable to save product.' });
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(p){
    setEditing(p);
    setSaveError('');
    setModalOpen(true);
  }

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

      {toast.message && (
        <div className={`admin-toast ${toast.type === 'success' ? 'success' : 'error'}`}>
          {toast.message}
        </div>
      )}
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
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onClose={()=>setModalOpen(false)}
          saving={saving}
          submitError={saveError}
        />
      )}
    </div>
  );
}
