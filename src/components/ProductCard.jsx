import React from 'react';
import { FiShoppingCart, FiStar, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, formatCurrency } from '../utils/translations';

const ProductCard = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} ${t('productDetail.addedToCart')}`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isInWishlist(product.id)
        ? t('productDetail.removedFromWishlist')
        : t('productDetail.addedToWishlist'),
      'success'
    );
  };

  const handleViewDetail = (e) => {
    e.stopPropagation();
    if (onViewDetail) {
      onViewDetail(product);
    }
  };

  return (
    <div className="product-card hover-lift glow-hover animate-fade-in">
      {product.featured && (
        <div className="product-featured">
          <FiStar />
          {t('products.featured')}
        </div>
      )}
      
      <div className="product-card-actions">
        <button
          onClick={handleViewDetail}
          className="product-action-button"
          title={t('products.viewDetails')}
        >
          <FiEye />
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`product-action-button ${isInWishlist(product.id) ? 'active' : ''}`}
          title={isInWishlist(product.id) ? t('products.removeFromWishlist') : t('products.addToWishlist')}
        >
          <FiHeart />
        </button>
      </div>
      
      <div className="product-image-wrapper" onClick={handleViewDetail}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        
        <h3 className="product-name" onClick={handleViewDetail}>{product.name}</h3>
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <span className="product-price text-gradient">
            {formatCurrency(product.price, language)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="product-add-button glow-hover"
          >
            <FiShoppingCart />
            {t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
