import React from 'react';
import { FiX, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, formatCurrency } from '../utils/translations';

const ProductDetail = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} ${t('productDetail.addedToCart')}`, 'success');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      isInWishlist(product.id)
        ? t('productDetail.removedFromWishlist')
        : t('productDetail.addedToWishlist'),
      'success'
    );
  };

  return (
    <>
      <div className="product-detail-overlay" onClick={onClose} />
      <div className="product-detail-modal">
        <button className="product-detail-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-image"
            />
            {product.featured && (
              <div className="product-featured">
                <FiStar />
                {t('products.featured')}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <div className="product-detail-category">{product.category}</div>
            <h2 className="product-detail-name">{product.name}</h2>
            <div className="product-detail-price text-gradient">
              {formatCurrency(product.price, language)}
            </div>
            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-actions">
              <button
                onClick={handleAddToCart}
                className="product-detail-add-button glow-hover"
              >
                <FiShoppingCart />
                {t('productDetail.addToCart')}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`product-detail-wishlist-button ${
                  isInWishlist(product.id) ? 'active' : ''
                }`}
              >
                <FiHeart />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
