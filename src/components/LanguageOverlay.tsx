import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';

const LanguageOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    
    // Fade out animation
    if (overlayRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.inOut'
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsVisible(false);
          document.body.style.overflow = 'auto'; // Restore scrolling
        }
      });
    }
  };

  useEffect(() => {
    // Prevent scrolling while overlay is active
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      // Fade in content
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      );
    }
    
    // Cleanup if component unmounts
    return () => { document.body.style.overflow = 'auto'; };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] bg-void w-full h-full flex flex-col items-center justify-center pointer-events-auto"
    >
      <div ref={contentRef} className="opacity-0 flex flex-col items-center">
        {/* Subtle logo presence */}
        <div className="font-outfit font-bold text-5xl tracking-tight text-white/10 mb-24 select-none">
          NEXTRO
        </div>
        
        <h1 className="font-sans font-medium text-silver/80 text-xl md:text-2xl mb-12 tracking-wide">
          Select Your Region
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <button 
            onClick={() => handleSelect('en')}
            className="px-10 py-5 rounded-full border border-white/20 text-white font-sans font-medium hover:bg-white hover:text-void transition-colors tracking-widest text-sm"
          >
            ENGLISH
          </button>
          
          <button 
            onClick={() => handleSelect('es')}
            className="px-10 py-5 rounded-full border border-white/20 text-white font-sans font-medium hover:bg-white hover:text-void transition-colors tracking-widest text-sm"
          >
            ESPAÑOL
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageOverlay;
