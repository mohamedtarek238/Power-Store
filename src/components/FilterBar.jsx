import React from 'react';
import { FiFilter } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

const FilterBar = ({ sortBy, onSortChange, priceRange, onPriceRangeChange }) => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <FiFilter className="filter-icon" />
        <label>{t('filters.sortBy')}</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="default">{t('filters.default')}</option>
          <option value="price-low">{t('filters.priceLow')}</option>
          <option value="price-high">{t('filters.priceHigh')}</option>
          <option value="name-asc">{t('filters.nameAsc')}</option>
          <option value="name-desc">{t('filters.nameDesc')}</option>
        </select>
      </div>

      <div className="filter-group">
        <label>{t('filters.priceRange')}</label>
        <select
          value={priceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">{t('filters.allPrices')}</option>
          <option value="0-50">{t('filters.range0_50')}</option>
          <option value="50-100">{t('filters.range50_100')}</option>
          <option value="100-150">{t('filters.range100_150')}</option>
          <option value="150+">{t('filters.range150Plus')}</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
