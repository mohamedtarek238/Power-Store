import React from 'react';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import SearchBar from './SearchBar';

const Header = ({ onSearch, searchQuery }) => {
  const { getTotalItems, setIsOpen } = useCart();
  const { wishlist } = useWishlist();
  const { language, toggleLanguage } = useLanguage();
  const t = (path) => getTranslation(language, path);
  const navigate = useNavigate();
  const location = useLocation();

  const goToProducts = async () => {
    // If not on home, go home first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="glass-strong">
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <h1 className="text-gradient">{t('header.title')}</h1>
            <span className="age-badge">18+</span>
          </div>
          
          <div className="header-search">
            <SearchBar onSearch={onSearch} searchQuery={searchQuery} />
          </div>
          
          <nav className="header-nav">
            <button type="button" className="nav-link" onClick={goToProducts}>
              {t('header.products')}
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => navigate('/about')}
            >
              {t('header.about')}
            </button>
          </nav>

          <div className="header-actions">
            <button
              onClick={toggleLanguage}
              className="language-button glow-hover"
              title={language === 'en' ? 'العربية' : 'English'}
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            
            <button
              onClick={() => {
                const wishlistSection = document.getElementById('wishlist');
                if (wishlistSection) {
                  wishlistSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="wishlist-button glow-hover"
              title={t('header.wishlist')}
            >
              <FiHeart />
              {wishlist.length > 0 && (
                <span className="cart-badge">{wishlist.length}</span>
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(true)}
              className="cart-button glow-hover"
              title={t('header.cart')}
            >
              <FiShoppingCart />
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
