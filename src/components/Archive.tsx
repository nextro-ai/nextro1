import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../i18n/LanguageContext';

const Archive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  const projects = [
    {
      title: t('archive.proj1.title'),
      category: t('archive.proj1.category'),
      desc: t('archive.proj1.desc'),
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600",
      theme: "bg-onyx text-white border border-white/5",
      Animation: () => (
        <div className="absolute inset-0 opacity-10 overflow-hidden flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-[80vw] h-[80vw] animate-[spin_20s_linear_infinite]">
             <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
             <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
             <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </div>
      )
    },
    {
      title: t('archive.proj2.title'),
      category: t('archive.proj2.category'),
      desc: t('archive.proj2.desc'),
      img: "/logo-3d.png",
      theme: "bg-[#111111] text-white border border-white/5",
      Animation: () => (
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none flex flex-col justify-center">
          <div className="w-full h-[2px] bg-accent-blue shadow-[0_0_15px_#3B82F6] animate-[pulse_2s_ease-in-out_infinite]"></div>
          <div className="w-full h-[1px] bg-white/30 mt-10"></div>
          <div className="w-full h-[1px] bg-white/30 mt-10"></div>
        </div>
      )
    },
    {
      title: t('archive.proj3.title'),
      category: t('archive.proj3.category'),
      desc: t('archive.proj3.desc'),
      img: "/streetwear.jpg",
      theme: "bg-[#0A0A0A] text-white border border-white/10",
      Animation: () => (
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none flex items-center">
           <svg viewBox="0 0 200 50" className="w-full h-auto px-4 stroke-white fill-none stroke-2">
             <path d="M 0 25 L 40 25 L 50 10 L 60 40 L 70 20 L 80 25 L 200 25" strokeLinejoin="round" />
           </svg>
        </div>
      )
    },
    {
      title: t('archive.proj4.title'),
      category: t('archive.proj4.category'),
      desc: t('archive.proj4.desc'),
      img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1600",
      theme: "bg-void text-white border border-white/5",
      Animation: () => (
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none flex items-center justify-center">
           <svg viewBox="0 0 100 100" className="w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] animate-pulse">
             <circle cx="20" cy="20" r="3" fill="currentColor" />
             <circle cx="80" cy="30" r="3" fill="currentColor" />
             <circle cx="40" cy="80" r="3" fill="currentColor" />
             <circle cx="70" cy="70" r="3" fill="currentColor" />
             <line x1="20" y1="20" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" />
             <line x1="20" y1="20" x2="40" y2="80" stroke="currentColor" strokeWidth="0.5" />
             <line x1="80" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="0.5" />
             <line x1="40" y1="80" x2="70" y2="70" stroke="currentColor" strokeWidth="0.5" />
           </svg>
        </div>
      )
    },
    {
      title: t('archive.proj5.title'),
      category: t('archive.proj5.category'),
      desc: t('archive.proj5.desc'),
      img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=1600",
      theme: "bg-silver text-void border border-black/10",
      Animation: () => (
        <div className="absolute inset-0 opacity-10 overflow-hidden flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-[80vw] h-[80vw] animate-[spin_30s_linear_infinite_reverse]">
             <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="0.5" fill="none" />
             <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
             <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>
      )
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        if (i < cardsRef.current.length - 1) {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            filter: "blur(20px)",
            ease: "none",
            scrollTrigger: {
              trigger: cardsRef.current[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          });
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [projects]); // Depend on projects so it matches correctly

  return (
    <section ref={containerRef} className="relative w-full bg-void pb-32">
      <div className="sticky top-0 h-[20vh] flex items-center justify-center pointer-events-none z-[-1]">
         <h2 className="font-outfit font-bold text-silver/5 text-8xl md:text-[12rem] tracking-tighter">{t('archive.title')}</h2>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-[-10vh]">
        {projects.map((proj, i) => (
          <div 
            key={i}
            ref={el => { cardsRef.current[i] = el; }}
            className={`sticky top-8 md:top-24 h-[85vh] md:h-[80vh] w-full rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 mb-12 lg:mb-24 flex flex-col md:flex-row overflow-hidden shadow-2xl origin-top ${proj.theme}`}
          >
            <proj.Animation />
            
            <div className="relative z-10 flex-1 flex flex-col justify-between h-full mb-8 md:mb-0">
              <div>
                <span className="font-mono-system text-xs uppercase tracking-widest opacity-70">
                  {`PROJ.00${i + 1} // ${proj.category}`}
                </span>
                <h3 className="font-serif-italic text-4xl md:text-6xl mt-4 mb-6 leading-none">
                  {proj.title}
                </h3>
              </div>
              
              <div>
                <p className="font-sans text-lg md:text-xl font-light opacity-90 max-w-sm mb-8">
                  {proj.desc}
                </p>
                <a href="#contacto" className="inline-flex items-center space-x-2 border border-current rounded-full px-6 py-3 font-sans text-sm magnetic-hover hover:bg-white hover:text-black transition-colors">
                  <span>{t('nav.contact')}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="relative z-10 w-full md:w-1/2 h-48 md:h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
               <img src={proj.img} alt={proj.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Archive;
