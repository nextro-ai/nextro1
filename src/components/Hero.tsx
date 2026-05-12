import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../i18n/LanguageContext';
import OptimizedImage from './OptimizedImage';

const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        y: 80,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      });
      gsap.from('.hero-bg', {
        scale: 1.05,
        duration: 2,
        ease: 'power3.out'
      })
    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-void">
      {/* Background Image */}
      <div className="hero-bg absolute inset-0 mix-blend-luminosity opacity-40">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2000&auto=format&fit=crop"
          alt="Nextro Hero Background"
          isLCP={true}
          className="w-full h-full"
        />
      </div>
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 via-transparent to-transparent mix-blend-screen"></div>

      {/* Content */}
      <div className="relative z-10 p-8 w-full max-w-5xl text-center flex flex-col items-center mt-20">
        <h1 className="flex flex-col text-cream items-center justify-center w-full">
          <span className="hero-text font-sans font-medium text-lg md:text-xl lg:text-2xl text-silver tracking-widest mb-2 uppercase">
            {t('hero.greeting')}
          </span>
          <span className="hero-text font-serif-italic text-2xl md:text-3xl lg:text-4xl text-silver/60 mb-4 lowercase tracking-wide">
            {t('hero.andThisIs')}
          </span>
          <span className="hero-text font-sans font-bold text-7xl md:text-[9rem] lg:text-[12rem] leading-[0.8] text-white mt-2 mb-4 tracking-tighter">
            NEXTRO
          </span>
        </h1>
        <p className="hero-text mt-8 max-w-2xl font-sans text-lg md:text-xl font-light text-silver leading-relaxed" dangerouslySetInnerHTML={{ __html: t('hero.description') }} />

        <ul className="hero-text mt-12 flex flex-col md:flex-row gap-8 md:gap-12 text-sm md:text-base font-sans text-silver/90 text-left md:text-center justify-center">
          <li className="flex items-center md:flex-col gap-3"><div className="hidden md:block w-2 h-2 rounded-full bg-accent-blue mb-2"></div><div className="md:hidden w-1.5 h-1.5 rounded-full bg-accent-blue"></div>{t('hero.bullet1')}</li>
          <li className="flex items-center md:flex-col gap-3"><div className="hidden md:block w-2 h-2 rounded-full bg-accent-blue mb-2"></div><div className="md:hidden w-1.5 h-1.5 rounded-full bg-accent-blue"></div>{t('hero.bullet2')}</li>
          <li className="flex items-center md:flex-col gap-3"><div className="hidden md:block w-2 h-2 rounded-full bg-accent-blue mb-2"></div><div className="md:hidden w-1.5 h-1.5 rounded-full bg-accent-blue"></div>{t('hero.bullet3')}</li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;
