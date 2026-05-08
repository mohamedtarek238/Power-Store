import { useEffect, useState } from 'react';
import { adminFetch } from '../utils/adminApi';

const PRODUCTS_API_URL = 'http://localhost:5000/api/products';
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

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await adminFetch(PRODUCTS_API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : data.products;
        setProducts(Array.isArray(list) ? list.map(normalizeProduct) : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to fetch products. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  return { products, loading, error };
}
