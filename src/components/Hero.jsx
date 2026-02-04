import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

const Hero = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  return (
    <section className="hero">
      <div className="hero-overlay" />
      
      <div className="hero-content">
        <div className="hero-inner animate-fade-in">
          <h1>
            <span className="text-gradient">{t('hero.title')}</span>
            <span style={{ color: 'white' }}>{t('hero.subtitle')}</span>
          </h1>
          
          <p>
            {t('hero.description')}
          </p>
          
          <div className="hero-buttons">
            <a href="#products" className="hero-button-primary glow-hover">
              {t('hero.shopNow')}
              <FiArrowRight style={{ transform: language === 'ar' ? 'scaleX(-1)' : 'none' }} />
            </a>
            
            <a href="#collections" className="hero-button-secondary">
              {t('hero.viewCollections')}
            </a>
          </div>
        </div>
      </div>
      
      <div className="hero-gradient" />
    </section>
  );
};

export default Hero;
