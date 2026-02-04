import React, { useState } from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, formatCurrency } from '../utils/translations';
import Checkout from './Checkout';

const Cart = () => {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div
        className="cart-overlay"
        onClick={() => setIsOpen(false)}
      />
      
      <div className={`cart-sidebar ${language === 'ar' ? 'rtl' : ''}`}>
        <div className="cart-content">
          <div className="cart-header">
            <h2 className="text-gradient">{t('cart.title')}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="cart-close"
            >
              <FiX />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>{t('cart.empty')}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="cart-empty-button"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item animate-fade-in">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">
                        {formatCurrency(item.price, language)}
                      </p>
                      
                      <div className="cart-item-controls">
                        <div className="cart-quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="cart-quantity-button"
                          >
                            <FiMinus />
                          </button>
                          <span className="cart-quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="cart-quantity-button"
                          >
                            <FiPlus />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cart-remove-button"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span className="cart-total-label">{t('cart.total')}</span>
                  <span className="cart-total-price text-gradient">
                    {formatCurrency(getTotalPrice(), language)}
                  </span>
                </div>
                
                <div>
                  <button 
                    className="cart-checkout-button glow-hover"
                    onClick={handleCheckout}
                  >
                    {t('cart.checkout')}
                  </button>
                  <button
                    onClick={clearCart}
                    className="cart-clear-button"
                  >
                    {t('cart.clearCart')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};

export default Cart;
