import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';
import FilterBar from '../components/FilterBar';

export default function HomePage({ searchQuery, onSearchQueryChange }) {
  const [products, setProducts] = useState([]); // بدل import
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  // 🔥 fetch من الـ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();

        // normalize بسيط عشان _id → id
        const normalized = (Array.isArray(data) ? data : []).map(p => ({
          ...p,
          id: p._id
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter((p) => {
        switch (priceRange) {
          case '0-50':
            return p.price >= 0 && p.price <= 2000;
          case '50-100':
            return p.price > 2000 && p.price <= 4000;
          case '100-150':
            return p.price > 4000 && p.price <= 6000;
          case '150+':
            return p.price > 6000;
          default:
            return true;
        }
      });
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedProduct(null);
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      All: t('categories.all'),
      Sets: t('categories.sets'),
      Care: t('categories.care'),
      Wellness: t('categories.wellness'),
      Lingerie: t('categories.lingerie'),
      Accessories: t('categories.accessories'),
      Fragrance: t('categories.fragrance'),
    };
    return categoryMap[category] || category;
  };

  return (
    <>
      <Hero />

      <section id="products" className="products-section">
        <div className="section-header">
          <h2>{t('products.title')}</h2>
          <p>{t('products.description')}</p>
        </div>

        {/* 🔥 loading */}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : (
          <>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-button ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>

            <FilterBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />

            {filteredAndSortedProducts.length === 0 ? (
              <div className="no-products">
                <p>{t('products.noProducts')}</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <ProductDetail
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </>
  );
}