import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

const SearchBar = ({ onSearch, searchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const handleChange = (e) => {
    onSearch(e.target.value);
    if (e.target.value) {
      setIsExpanded(true);
    }
  };

  const handleClear = () => {
    onSearch('');
    setIsExpanded(false);
  };

  return (
    <div className={`search-bar ${isExpanded || searchQuery ? 'expanded' : ''}`}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder={t('products.searchPlaceholder')}
        value={searchQuery}
        onChange={handleChange}
        className="search-input"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />
      {searchQuery && (
        <button onClick={handleClear} className="search-clear">
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
