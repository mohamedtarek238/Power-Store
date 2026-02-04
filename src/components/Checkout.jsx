import React, { useState } from 'react';
import { FiX, FiCreditCard, FiTruck, FiMapPin, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { getTranslation, formatCurrency } from '../utils/translations';

const Checkout = ({ isOpen, onClose }) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const t = (path) => getTranslation(language, path);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Egypt',
    paymentMethod: 'cash',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'ar' ? 'الاسم مطلوب' : 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = language === 'ar' ? 'العنوان مطلوب' : 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = language === 'ar' ? 'المدينة مطلوبة' : 'City is required';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = language === 'ar' ? 'الرمز البريدي مطلوب' : 'Postal code is required';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = language === 'ar' ? 'رقم البطاقة مطلوب' : 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = language === 'ar' ? 'رقم البطاقة غير صحيح' : 'Invalid card number';
      }

      if (!formData.cardName.trim()) {
        newErrors.cardName = language === 'ar' ? 'اسم حامل البطاقة مطلوب' : 'Cardholder name is required';
      }

      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = language === 'ar' ? 'تاريخ الانتهاء مطلوب' : 'Expiry date is required';
      }

      if (!formData.cardCVV.trim()) {
        newErrors.cardCVV = language === 'ar' ? 'CVV مطلوب' : 'CVV is required';
      } else if (formData.cardCVV.length < 3) {
        newErrors.cardCVV = language === 'ar' ? 'CVV غير صحيح' : 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast(
        language === 'ar' 
          ? 'يرجى إكمال جميع الحقول المطلوبة'
          : 'Please complete all required fields',
        'error'
      );
      return;
    }

    // Simulate order processing
    showToast(
      language === 'ar'
        ? 'تم إرسال طلبك بنجاح!'
        : 'Order placed successfully!',
      'success'
    );

    // Clear cart and close
    setTimeout(() => {
      clearCart();
      onClose();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Egypt',
        paymentMethod: 'cash',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCVV: '',
      });
    }, 1500);
  };

  return (
    <>
      <div className="checkout-overlay" onClick={onClose} />
      <div className={`checkout-modal ${language === 'ar' ? 'rtl' : ''}`}>
        <button className="checkout-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="checkout-content">
          <h2 className="checkout-title text-gradient">{t('checkout.title')}</h2>

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Address */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <FiMapPin className="section-icon" />
                <h3>{t('checkout.shippingAddress')}</h3>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FiUser className="input-icon" />
                    {t('checkout.fullName')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <FiMail className="input-icon" />
                    {t('checkout.email')} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <FiPhone className="input-icon" />
                    {t('checkout.phone')} <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label>
                    <FiMapPin className="input-icon" />
                    {t('checkout.address')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    placeholder={language === 'ar' ? 'العنوان الكامل' : 'Street Address'}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label>
                    {t('checkout.city')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                    placeholder={language === 'ar' ? 'المدينة' : 'City'}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>
                    {t('checkout.postalCode')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={errors.postalCode ? 'error' : ''}
                    placeholder={language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                  />
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                </div>

                <div className="form-group">
                  <label>{t('checkout.country')}</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="Egypt">{language === 'ar' ? 'مصر' : 'Egypt'}</option>
                    <option value="Other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <FiCreditCard className="section-icon" />
                <h3>{t('checkout.paymentMethod')}</h3>
              </div>

              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <FiTruck className="payment-icon" />
                    <div>
                      <strong>{t('checkout.cashOnDelivery')}</strong>
                      <span>{t('checkout.cashOnDeliveryDesc')}</span>
                    </div>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <FiCreditCard className="payment-icon" />
                    <div>
                      <strong>{t('checkout.creditCard')}</strong>
                      <span>{t('checkout.creditCardDesc')}</span>
                    </div>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group full-width">
                    <label>
                      {t('checkout.cardNumber')} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      className={errors.cardNumber ? 'error' : ''}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>
                      {t('checkout.cardName')} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={errors.cardName ? 'error' : ''}
                      placeholder={language === 'ar' ? 'اسم حامل البطاقة' : 'Cardholder Name'}
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>

                  <div className="form-group">
                    <label>
                      {t('checkout.expiryDate')} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setFormData((prev) => ({ ...prev, cardExpiry: value }));
                      }}
                      className={errors.cardExpiry ? 'error' : ''}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                  </div>

                  <div className="form-group">
                    <label>
                      CVV <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardCVV"
                      value={formData.cardCVV}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                        setFormData((prev) => ({ ...prev, cardCVV: value }));
                      }}
                      className={errors.cardCVV ? 'error' : ''}
                      placeholder="123"
                      maxLength="3"
                    />
                    {errors.cardCVV && <span className="error-message">{errors.cardCVV}</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <h3>{t('checkout.orderSummary')}</h3>
              </div>

              <div className="order-summary">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <h4>{item.name}</h4>
                      <p>
                        {formatCurrency(item.price, language)} × {item.quantity}
                      </p>
                    </div>
                    <div className="order-item-total">
                      {formatCurrency(item.price * item.quantity, language)}
                    </div>
                  </div>
                ))}

                <div className="order-total">
                  <div className="order-total-row">
                    <span>{t('checkout.subtotal')}</span>
                    <span>{formatCurrency(getTotalPrice(), language)}</span>
                  </div>
                  <div className="order-total-row">
                    <span>{t('checkout.shipping')}</span>
                    <span>{language === 'ar' ? 'مجاني' : 'Free'}</span>
                  </div>
                  <div className="order-total-row final">
                    <span>{t('checkout.total')}</span>
                    <span className="text-gradient">{formatCurrency(getTotalPrice(), language)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" onClick={onClose} className="checkout-cancel-button">
                {t('checkout.cancel')}
              </button>
              <button type="submit" className="checkout-submit-button glow-hover">
                {t('checkout.placeOrder')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
