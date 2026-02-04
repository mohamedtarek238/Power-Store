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
