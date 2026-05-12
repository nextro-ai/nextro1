import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../i18n/LanguageContext';
import OptimizedImage from './OptimizedImage';

const Manifesto = () => {
  const container = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
          end: 'bottom 80%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.from(textRef1.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .from(textRef2.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, "-=0.6");

      // Parallax effect on background
      gsap.to('.manifesto-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id="manifiesto" ref={container} className="relative py-32 md:py-48 min-h-[90vh] overflow-hidden flex items-center bg-void">
      <div className="manifesto-bg absolute top-[-20%] left-0 w-full h-[140%] opacity-30 mix-blend-luminosity">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2074&auto=format&fit=crop"
          alt="Manifesto Background"
          className="w-full h-full"
        />
      </div>
      
      {/* Noise filter native inside the component to enhance darkness texture */}
      <div className="absolute inset-0 bg-void/80 mix-blend-multiply"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-16 lg:px-24 py-16">
        <div ref={textRef1} className="font-sans text-2xl md:text-3xl lg:text-5xl text-silver/50 mb-20 font-light tracking-wide leading-tight">
          {t('manifesto.q1')}<br /> <span className="text-white font-medium">{t('manifesto.q2')}</span>
        </div>
        
        <div ref={textRef2} className="font-sans font-bold text-5xl md:text-7xl lg:text-[6rem] text-silver/70 mb-4 leading-[1.1] tracking-tighter">
          {t('manifesto.a1')}<br /> <span className="text-white drop-shadow-lg">{t('manifesto.a2')}</span>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
