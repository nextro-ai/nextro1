import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../i18n/LanguageContext';
import { useRevealEngine } from '../hooks/useRevealEngine';

const CardDeck = () => {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.feature-card');
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        const currentCard = cards[currentIndex] as HTMLElement;
        const nextIndex = (currentIndex + 1) % cards.length;
        const nextCard = cards[nextIndex] as HTMLElement;
        const lastIndex = (currentIndex + 2) % cards.length;
        const lastCard = cards[lastIndex] as HTMLElement;

        gsap.to(currentCard, { zIndex: 1, scale: 0.9, y: 30, opacity: 0.4, duration: 0.8, ease: "back.out(1.5)" });
        gsap.to(nextCard, { zIndex: 3, scale: 1, y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" });
        gsap.to(lastCard, { zIndex: 2, scale: 0.95, y: 15, opacity: 0.7, duration: 0.8, ease: "back.out(1.5)" });

        currentIndex = nextIndex;
      }, 3000);

      return () => clearInterval(interval);
    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative h-64 w-full flex justify-center perspective-1000">
      <div className="feature-card absolute w-64 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 z-30 transform scale-100 translate-y-0 opacity-100 flex flex-col items-center justify-center h-48">
        <span className="font-outfit font-bold text-void text-xl mb-1">{t('features.card1.title')}</span>
        <p className="text-sm font-sans text-center text-charcoal/60">{t('features.card1.desc')}</p>
      </div>
      <div className="feature-card absolute w-64 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 z-20 transform scale-95 translate-y-4 opacity-70 flex flex-col items-center justify-center h-48">
        <span className="font-outfit font-bold text-void text-xl mb-1">{t('features.card2.title')}</span>
        <p className="text-sm font-sans text-center text-charcoal/60">{t('features.card2.desc')}</p>
      </div>
      <div className="feature-card absolute w-64 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 z-10 transform scale-90 translate-y-8 opacity-40 flex flex-col items-center justify-center h-48">
        <span className="font-outfit font-bold text-void text-xl mb-1">{t('features.card3.title')}</span>
        <p className="text-sm font-sans text-center text-charcoal/60">{t('features.card3.desc')}</p>
      </div>
    </div>
  );
};

const ServiceExplanation = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-[#FAFAFA] rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 w-full h-full flex flex-col justify-center">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-void"></div>
        <span className="font-mono-system text-xs text-charcoal/50 tracking-[0.2em] uppercase">{t('features.methodology')}</span>
      </div>
      <h3 className="font-serif-italic text-3xl md:text-4xl text-void mb-6">
        {t('features.methodology.title')}
      </h3>
      <p className="font-sans text-charcoal/70 text-base md:text-lg font-light leading-relaxed mb-8">
        {t('features.methodology.desc1')}
        <strong className="font-medium text-void">{t('features.methodology.desc2')}</strong>
        {t('features.methodology.desc3')}
      </p>
      <div className="border-t border-black/5 pt-6 flex flex-wrap gap-4 text-xs font-mono-system text-charcoal/40 uppercase tracking-widest">
        <span className="bg-black/5 px-3 py-1.5 rounded-full">{t('features.tag1')}</span>
        <span className="bg-black/5 px-3 py-1.5 rounded-full">{t('features.tag2')}</span>
        <span className="bg-black/5 px-3 py-1.5 rounded-full">{t('features.tag3')}</span>
      </div>
    </div>
  );
};

const Features = () => {
  const { t } = useLanguage();
  const revealRef = useRevealEngine();
  
  return (
    <section id="servicios" ref={revealRef as any} className="py-32 px-6 md:px-16 lg:px-24 bg-white relative z-10 text-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 text-center">
          <h2 className="font-serif-italic text-5xl md:text-7xl lg:text-[5.5rem] text-void mb-6 leading-tight">{t('features.title1')}<br/><span className="font-sans font-bold italic text-void/60">{t('features.title2')}</span></h2>
          <p className="font-sans text-charcoal/60 max-w-xl mx-auto text-lg md:text-xl font-light">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 border border-black/5 rounded-[2.5rem] p-8 aspect-square flex items-center justify-center bg-[#FAFAFA] shadow-sm relative overflow-hidden">
             {/* Decoración de fondo discreta */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-[5rem]"></div>
            <CardDeck />
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <ServiceExplanation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
