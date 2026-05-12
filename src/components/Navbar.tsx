import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl transition-all duration-300">
      <nav 
        ref={navRef}
        className={`flex items-center justify-between px-6 py-4 rounded-full transition-all duration-500 border
          ${isScrolled 
            ? 'bg-void/70 backdrop-blur-md text-white border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent text-white border-transparent'
          }`}
      >
        <div className="font-outfit font-bold text-xl tracking-wide flex items-center space-x-4">
          <span>NEXTRO</span>
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="text-[10px] font-mono-system uppercase opacity-50 hover:opacity-100 transition-opacity"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
        <ul className="hidden md:flex space-x-8 font-sans text-sm font-medium">
          <li><a href="#servicios" className="hover:text-accent-blue transition-colors">{t('nav.services')}</a></li>
          <li><a href="#proyectos" className="hover:text-accent-blue transition-colors">{t('nav.projects')}</a></li>
          <li><a href="#precios" className="hover:text-accent-blue transition-colors">{t('nav.pricing')}</a></li>
        </ul>
        <a href="#contacto" className="bg-accent-blue text-white px-5 py-2 rounded-full font-sans font-medium text-sm magnetic-hover">
          {t('nav.contact')}
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
