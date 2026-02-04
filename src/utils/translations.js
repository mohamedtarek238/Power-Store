import { en } from '../locales/en';
import { ar } from '../locales/ar';

export const translations = { en, ar };

export const getTranslation = (language, path) => {
  const keys = path.split('.');
  let value = translations[language];
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      return path; // Return path if translation not found
    }
  }
  
  return value;
};

// Format currency in Egyptian Pounds
export const formatCurrency = (amount, language = 'en') => {
  const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Replace EGP with E£ for better display, or use ج.م for Arabic
  if (language === 'ar') {
    return formatted.replace('EGP', 'ج.م').replace('EGP', 'ج.م');
  }
  return formatted.replace('EGP', 'E£');
};
