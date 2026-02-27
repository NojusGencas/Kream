import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const getCategoryStyle = (slug) => {
  const styles = {
    tortai: {
      bg: 'bg-gradient-to-br from-pink-100 to-rose-50',
    },
    pyragai: {
      bg: 'bg-gradient-to-br from-amber-100 to-orange-50',
    },
    saldainiai: {
      bg: 'bg-gradient-to-br from-purple-100 to-violet-50',
    },
    sausainiai: {
      bg: 'bg-gradient-to-br from-yellow-100 to-amber-50',
    },
    obuoliu: {
      bg: 'bg-gradient-to-br from-red-100 to-rose-50',
    },
  };

  if (styles[slug]) return styles[slug];
  for (const key of Object.keys(styles)) if (slug && slug.includes(key)) return styles[key];
  return { bg: 'bg-gradient-to-br from-stone-100 to-stone-50' };
};

export function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Helper funkcija kategorijos pavadinimo vertimui
  const getCategoryName = (category) => {
    const slug = category.slug?.toLowerCase() || category.name?.toLowerCase();
    const translationKey = `categories.${slug}`;
    const translated = t(translationKey);
    // Jei vertimas egzistuoja (negrąžina rakto), naudoti jį; kitu atveju naudoti originalų pavadinimą
    return translated !== translationKey ? translated : category.name;
  };

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Klaida gaunant kategorijas:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 overflow-hidden">
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 text-[150px] opacity-10 transform -rotate-12 animate-pulse">🎂</div>
          <div className="absolute -bottom-10 -right-10 text-[150px] opacity-10 transform rotate-12">🧁</div>
          <div className="absolute top-20 right-1/4 text-6xl opacity-20 animate-bounce" style={{animationDuration: '3s'}}>✨</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-15 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>🍰</div>
          <div className="absolute top-1/3 left-10 text-4xl opacity-10 animate-bounce" style={{animationDuration: '5s', animationDelay: '0.5s'}}>🎀</div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm text-amber-400 px-4 py-2 rounded-full mb-6 text-sm font-semibold border border-amber-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                {t('home.newOffers')}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                {t('home.heroTitle')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400"> {t('home.heroHighlight')}</span>
              </h1>

              <p className="text-stone-300 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                {t('home.heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/produktai" 
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
                >
                  {t('home.viewProducts')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  to="/uzsakymas" 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {t('nav.orderCake')}
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-stone-400">
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm">{t('home.badge1')}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm">{t('home.badge2')}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <span className="text-2xl">💝</span>
                  <span className="text-sm">{t('home.badge3')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-400 to-rose-500 rounded-3xl transform rotate-3 opacity-80"></div>
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-400 to-rose-500 rounded-3xl transform -rotate-3 opacity-40"></div>
                
                <div className="relative bg-white rounded-2xl p-3 shadow-2xl">
                  <img
                    src="/img/pagrindine.jpg"
                    alt="Skanūs tortai"
                    className="w-full h-80 md:h-96 object-cover rounded-xl"
                    onError={(e) => { 
                      e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600';
                    }}
                  />
                  
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                      🍰
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">{t('home.from')}</p>
                      <p className="font-bold text-stone-900 text-lg">15 €/kg</p>
                    </div>
                  </div>

                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                    ✨ {t('home.new')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafaf9"/>
          </svg>
        </div>
      </section>

      <section className="py-12 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div data-aos="fade-up" data-aos-delay="0" className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="font-bold text-stone-900 mb-1">{t('home.feature1Title')}</h3>
              <p className="text-stone-500 text-sm">{t('home.feature1Desc')}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100" className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">👩‍🍳</div>
              <h3 className="font-bold text-stone-900 mb-1">{t('home.feature2Title')}</h3>
              <p className="text-stone-500 text-sm">{t('home.feature2Desc')}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-bold text-stone-900 mb-1">{t('home.feature3Title')}</h3>
              <p className="text-stone-500 text-sm">{t('home.feature3Desc')}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-bold text-stone-900 mb-1">{t('home.feature4Title')}</h3>
              <p className="text-stone-500 text-sm">{t('home.feature4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rose-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
              <span className="text-lg">✨</span>
              <span className="text-sm font-semibold uppercase tracking-wider">{t('home.whatWeOffer')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">{t('home.ourCategories')}</h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              {t('home.categoriesDescription')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {categories.map((cat, index) => {
                const style = getCategoryStyle(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    to={`/produktai`}
                    className="group relative w-[calc(50%-1rem)] sm:w-56"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                  <div className="relative bg-white rounded-3xl p-8 h-56 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border border-stone-100 overflow-hidden">
                      <div className={`absolute inset-0 ${style.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border border-amber-100/50">
                          <span className="text-5xl group-hover:animate-bounce" style={{ animationDuration: '1s' }}>{cat.image || '🍰'}</span>
                        </div>
                        
                        <h3 className="font-bold text-stone-800 text-lg text-center mb-1">{getCategoryName(cat)}</h3>
                        
                        <span className="text-stone-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {t('products.moreInfo')} →
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-14" data-aos="fade-up" data-aos-delay="200">
            <Link 
              to="/produktai" 
              className="group inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-stone-800 transition-all duration-300"
            >
              <span>{t('home.viewAllProducts')}</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-stone-900 to-stone-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl opacity-10">🎂</div>
          <div className="absolute bottom-10 right-10 text-8xl opacity-10">🧁</div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-stone-300 text-lg mb-8 max-w-xl mx-auto">
            {t('home.ctaDescription')}
          </p>
          <Link 
            to="/uzsakymas" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            {t('home.orderNow')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}