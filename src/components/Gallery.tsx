import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../i18n/LanguageContext';
import OptimizedImage from './OptimizedImage';

const Gallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const mediaItems = [
    {
      type: 'image',
      src: '/gallery-1.jpg',
      title: t('gallery.item1')
    },
    {
      type: 'video',
      src: '/Gigante_de_Flores_Observa_Modelo (1).mp4',
      title: t('gallery.item2')
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600',
      title: t('gallery.item3')
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1600',
      title: t('gallery.item4')
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop',
      title: t('gallery.item5')
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const scrollWidth = scrollRef.current?.scrollWidth || 0;
      const clientWidth = window.innerWidth;
      
      gsap.to(scrollRef.current, {
        x: -(scrollWidth - clientWidth + 100), // +100 for some padding
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mediaItems]);

  return (
    <section id="proyectos" ref={sectionRef} className="relative bg-void h-screen flex flex-col justify-center overflow-hidden border-t border-white/5 pb-20 pt-20">
      <div className="absolute top-10 left-6 md:left-16 lg:left-24 z-10 w-full flex items-center space-x-4">
        <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
        <h2 className="font-mono-system text-xs tracking-widest uppercase text-white/50">{t('gallery.title')}</h2>
      </div>

      <div ref={scrollRef} className="flex gap-8 px-6 md:px-16 lg:px-24 h-[60vh] md:h-[70vh] items-center w-max">
        {mediaItems.map((item, index) => (
          <div 
            key={index} 
            className="relative w-[75vw] md:w-[45vw] lg:w-[35vw] h-full rounded-[2rem] overflow-hidden group border border-white/10 shrink-0"
          >
            {item.type === 'video' ? (
              <video 
                src={item.src} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                <OptimizedImage 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full"
                />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <h3 className="font-outfit font-bold text-2xl text-white tracking-wide">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
