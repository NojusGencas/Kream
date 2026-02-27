import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function ApieMus() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🎂</div>
          <div className="absolute bottom-10 right-10 text-9xl">🍰</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px]">✨</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span data-aos="fade-down" className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {t('about.since')}
          </span>
          <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Kream
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" className="text-stone-300 text-xl max-w-2xl mx-auto">
            {t('about.heroDescription')}
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-stone-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div data-aos="fade-up" data-aos-delay="0" className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">5+</div>
              <p className="text-stone-600 text-sm">{t('about.stat1')}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100" className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">1000+</div>
              <p className="text-stone-600 text-sm">{t('about.stat2')}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">50+</div>
              <p className="text-stone-600 text-sm">{t('about.stat3')}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">100%</div>
              <p className="text-stone-600 text-sm">{t('about.stat4')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right" className="order-2 lg:order-1">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">{t('about.ourStory')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-6">
                {t('about.howItStarted')}
              </h2>
              <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
                <p>
                  <span className="text-stone-900 font-semibold">"Kream"</span> {t('about.storyPart1')}
                </p>
                <p>
                  {t('about.storyPart2')} <span className="text-amber-600 font-medium">{t('about.storyHighlight')}</span>, {t('about.storyPart3')}
                </p>
                <p>
                  {t('about.storyPart4')}
                </p>
              </div>
              <Link 
                to="/uzsakymas" 
                className="inline-flex items-center gap-2 mt-8 bg-stone-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-stone-800 transition-all hover:gap-3"
              >
                {t('nav.orderCake')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div data-aos="fade-left" className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl p-4 shadow-2xl">
                  <img
                    src="/img/pagrindine.jpg"
                    alt="Mūsų kepykla"
                    className="w-full h-80 object-cover rounded-xl"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'; }}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">🏆</div>
                  <div>
                    <p className="font-bold text-stone-900">{t('about.premiumQuality')}</p>
                    <p className="text-stone-500 text-sm">{t('about.bestIngredients')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div data-aos="fade-up" className="text-center mb-16">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">{t('about.whatWeOffer')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-4">{t('about.ourSpecialties')}</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {t('about.specialtiesDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div data-aos="zoom-in" data-aos-delay="0" className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-pink-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🎂
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t('about.specialty1Title')}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{t('about.specialty1Desc')}</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="100" className="group bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-violet-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                💒
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t('about.specialty2Title')}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{t('about.specialty2Desc')}</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="200" className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🍪
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t('about.specialty3Title')}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{t('about.specialty3Desc')}</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="300" className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t('about.specialty4Title')}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{t('about.specialty4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">{t('about.ourAdvantages')}</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">{t('about.whyChooseUs')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                🌿
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.advantage1Title')}</h3>
              <p className="text-stone-400 text-sm">{t('about.advantage1Desc')}</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
                💝
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.advantage2Title')}</h3>
              <p className="text-stone-400 text-sm">{t('about.advantage2Desc')}</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                🏪
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.advantage3Title')}</h3>
              <p className="text-stone-400 text-sm">{t('about.advantage3Desc')}</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                ⭐
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.advantage4Title')}</h3>
              <p className="text-stone-400 text-sm">{t('about.advantage4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">{t('about.ourPeople')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2">{t('about.team')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <div className="group text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform flex items-center justify-center text-7xl">
                  👩‍🍳
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                  🎂
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{t('about.teamMember1Name')}</h3>
              <p className="text-amber-600 font-medium text-sm mb-2">{t('about.teamMember1Role')}</p>
              <p className="text-stone-500 text-sm">{t('about.teamMember1Desc')}</p>
            </div>
            <div className="group text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform flex items-center justify-center text-7xl">
                  👨‍💻
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                  🌐
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">Nojus Genčas</h3>
              <p className="text-blue-600 font-medium text-sm mb-2">{t('about.teamMember2Role')}</p>
              <p className="text-stone-500 text-sm">{t('about.teamMember2Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-8xl transform -rotate-12">🎂</div>
          <div className="absolute bottom-10 right-10 text-8xl transform rotate-12">🍰</div>
          <div className="absolute top-1/2 right-1/4 text-6xl">✨</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('about.ctaTitle')}</h2>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
            {t('about.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/uzsakymas" 
              className="inline-flex items-center justify-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-stone-100 transition-all hover:scale-105 shadow-xl"
            >
              {t('home.orderNow')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              to="/produktai" 
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all border-2 border-white/50"
            >
              {t('home.viewProducts')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}