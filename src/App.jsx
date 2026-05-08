import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Cart from './components/Cart';
import { getTranslation } from './utils/translations';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminOrders from './admin/pages/AdminOrders';
import LoginPage from './pages/LoginPage';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <div style={{ minHeight: '100vh' }} className={language === 'ar' ? 'rtl' : ''}>
              <Header
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
              />

              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      searchQuery={searchQuery}
                      onSearchQueryChange={setSearchQuery}
                    />
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <footer>
                <div className="footer-content">
                  <h3 className="text-gradient">{t('footer.title')}</h3>
                  <p>{t('footer.description')}</p>
                  <p>{t('footer.copyright')}</p>
                </div>
              </footer>

              <Cart />
            </div>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
