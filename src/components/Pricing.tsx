import { useLanguage } from '../i18n/LanguageContext';

const Pricing = () => {
  const { t } = useLanguage();
  
  return (
    <section id="precios" className="py-32 px-6 md:px-16 lg:px-24 bg-void relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-white mb-4 tracking-tight">{t('pricing.title')}</h2>
          <p className="font-sans text-silver text-lg">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {/* Plan 1 */}
          <div className="bg-onyx rounded-[2rem] p-8 border border-white/10 flex flex-col h-full justify-between">
            <div>
              <span className="font-mono-system text-xs uppercase tracking-widest text-silver/50">{t('pricing.plan1.badge')}</span>
              <h3 className="font-serif-italic text-3xl text-white mt-2 mb-4">{t('pricing.plan1.title')}</h3>
              <p className="font-sans text-sm text-silver/80 mb-6">{t('pricing.plan1.desc')}</p>
              
              <div className="flex flex-col mb-8">
                <div className="text-4xl font-sans font-bold text-white mb-1">
                  {t('pricing.plan1.launch') || t('pricing.plan1.price')}
                  <span className="text-lg font-normal text-silver">{t('pricing.plan1.period')}</span>
                </div>
                {t('pricing.plan1.launch') && (
                  <div className="text-sm font-sans text-silver/60 line-through">
                    Normal: {t('pricing.plan1.price')}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {[t('pricing.plan1.f1'), t('pricing.plan1.f2'), t('pricing.plan1.f3'), t('pricing.plan1.f4')].map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-sans text-silver">
                    <svg className="w-4 h-4 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-4 rounded-xl border border-white/20 font-sans font-medium text-white hover:bg-white hover:text-void transition-colors">
              {t('pricing.plan1.cta')}
            </button>
          </div>

          <div className="bg-[#111111] rounded-[2.5rem] p-10 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col h-[105%] justify-between transform md:-translate-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-accent-blue text-white text-[10px] font-mono-system uppercase tracking-widest py-1 px-3 rounded-full">{t('pricing.plan2.tag')}</span>
            </div>
            <div>
              <span className="font-mono-system text-xs uppercase tracking-widest text-white/50">{t('pricing.plan2.badge')}</span>
              <h3 className="font-serif-italic text-4xl text-white mt-2 mb-4">{t('pricing.plan2.title')}</h3>
              <p className="font-sans text-sm text-silver mb-6">{t('pricing.plan2.desc')}</p>
              
              <div className="flex flex-col mb-8">
                <div className="text-5xl font-sans font-bold text-white mb-1">
                  {t('pricing.plan2.launch') || t('pricing.plan2.price')}
                  <span className="text-xl font-normal text-silver">{t('pricing.plan2.period')}</span>
                </div>
                {t('pricing.plan2.launch') && (
                  <div className="text-base font-sans text-silver/60 line-through">
                    Normal: {t('pricing.plan2.price')}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {[t('pricing.plan2.f1'), t('pricing.plan2.f2'), t('pricing.plan2.f3'), t('pricing.plan2.f4'), t('pricing.plan2.f5')].map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-sans text-silver">
                    <svg className="w-4 h-4 mr-3 text-accent-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-4 rounded-xl bg-accent-blue text-white font-sans font-medium hover:bg-blue-600 transition-colors magnetic-hover">
              {t('pricing.plan2.cta')}
            </button>
          </div>

          <div className="bg-onyx rounded-[2rem] p-8 border border-white/10 flex flex-col h-full justify-between">
            <div>
              <span className="font-mono-system text-xs uppercase tracking-widest text-silver/50">{t('pricing.plan3.badge')}</span>
              <h3 className="font-serif-italic text-3xl text-white mt-2 mb-4">{t('pricing.plan3.title')}</h3>
              <p className="font-sans text-sm text-silver/80 mb-6">{t('pricing.plan3.desc')}</p>
              
              <div className="text-4xl font-sans font-bold text-white mb-8">
                {t('pricing.plan3.price')}
              </div>

              <ul className="space-y-4 mb-8">
                {[t('pricing.plan3.f1'), t('pricing.plan3.f2'), t('pricing.plan3.f3'), t('pricing.plan3.f4'), t('pricing.plan3.f5')].map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-sans text-silver">
                    <svg className="w-4 h-4 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-4 rounded-xl border border-white/20 font-sans font-medium text-white hover:bg-white hover:text-void transition-colors">
              {t('pricing.plan3.cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
