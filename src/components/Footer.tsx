import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer id="contacto" className="bg-onyx border-t border-white/5 rounded-t-[3rem] md:rounded-t-[5rem] text-cream pt-32 pb-12 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col pt-10 pb-24 border-b border-white/10 mb-8">
        <h2 className="font-outfit font-bold text-5xl md:text-8xl tracking-tighter mb-16 text-white text-center md:text-left">
          {t('nav.contact')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
          <div className="flex flex-col space-y-12">
            <a href="mailto:alonsoreyesleo178@gmail.com" className="group flex flex-col items-start">
              <span className="font-mono-system text-xs uppercase tracking-widest text-accent-blue mb-4">Email Principal</span>
              <span className="font-sans font-light text-2xl md:text-4xl text-silver group-hover:text-white transition-colors duration-300">
                alonsoreyesleo178<br className="hidden md:block"/>@gmail.com
              </span>
              <div className="h-[1px] w-0 bg-white group-hover:w-full transition-all duration-500 mt-4"></div>
            </a>
            
            <a href="https://wa.me/5493517714541" target="_blank" rel="noreferrer" className="group flex flex-col items-start">
              <span className="font-mono-system text-xs uppercase tracking-widest text-accent-blue mb-4">WhatsApp / Teléfono</span>
              <span className="font-sans font-light text-2xl md:text-4xl text-silver group-hover:text-white transition-colors duration-300">
                +54 9 3517714541
              </span>
              <div className="h-[1px] w-0 bg-white group-hover:w-full transition-all duration-500 mt-4"></div>
            </a>
          </div>
          
          <div className="flex flex-col md:items-end justify-start">
            <div className="inline-flex items-center space-x-4 bg-white/5 rounded-full px-6 py-3 border border-white/10 mb-12">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-blue"></span>
              </div>
              <span className="font-mono-system text-sm uppercase tracking-widest text-white">{t('footer.status')}</span>
            </div>
            
            <p className="font-sans font-light text-silver text-xl md:text-right max-w-sm mb-12">
              {t('footer.description')}
            </p>
            
            <div className="flex space-x-8">
               <ul className="space-y-2 md:text-right">
                 <li><a href="#servicios" className="font-mono-system text-sm tracking-widest text-white/50 hover:text-white transition-colors uppercase">{t('nav.services')}</a></li>
                 <li><a href="#proyectos" className="font-mono-system text-sm tracking-widest text-white/50 hover:text-white transition-colors uppercase">{t('nav.projects')}</a></li>
                 <li><a href="#precios" className="font-mono-system text-sm tracking-widest text-white/50 hover:text-white transition-colors uppercase">{t('nav.pricing')}</a></li>
               </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center font-sans text-sm text-white/40">
        <p className="mb-4 md:mb-0">{t('footer.rights')}</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
