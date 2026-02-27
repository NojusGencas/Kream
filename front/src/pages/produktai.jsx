import Products from '../components/Products'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export function Produktai() {
    const { t } = useLanguage();

    return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-16 bg-gradient-to-br from-stone-100 to-stone-200">
        <div className="container mx-auto px-4 text-center">
          <h1 data-aos="fade-down" className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight mb-4">
            {t('products.title')}
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="text-stone-600 text-lg max-w-2xl mx-auto mb-6">
            {t('products.description')}
          </p>
          <Link 
            to="/uzsakymas" 
            data-aos="fade-up" data-aos-delay="200"
            className="inline-block bg-stone-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-800 transition"
          >
            {t('home.orderNow')}
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4" data-aos="fade-up">
          <Products />
        </div>
      </section>
    </div>
  );
}