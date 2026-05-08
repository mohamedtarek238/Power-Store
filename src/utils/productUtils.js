// Shared product normalization utility
export const normalizeProduct = (product) => ({
  id: product._id || product.id,
  name: product.name || '',
  description: product.description || '',
  price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
  image: product.image || '',
  category: product.category || 'General',
  stock: typeof product.stock === 'number' ? product.stock : parseInt(product.stock) || 0,
  isActive: product.isActive ?? true,
  featured: product.featured || false,
});

// Normalize array of products
export const normalizeProducts = (products) => {
  if (!Array.isArray(products)) {
    // Handle case where API returns { products: [...] }
    products = products.products || [];
  }
  return products.map(normalizeProduct);
};

// API endpoints
export const API_BASE = 'http://localhost:5001/api';

export const api = {
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    return normalizeProducts(data);
  },

  async createProduct(product) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }
    const data = await response.json();
    return normalizeProduct(data);
  },

  async updateProduct(id, product) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
    const data = await response.json();
    return normalizeProduct(data);
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
    return response.json();
  },
};