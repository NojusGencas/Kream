import { getApiUrl } from '../config.js';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export function ProduktoDetal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(getApiUrl(`/api/products/${id}`))
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Klaida gaunant produktą:', error);
        setError('Nepavyko gauti produkto informacijos');
        setLoading(false);
      });
  }, [id]);

  // Tikrinti ar produktas naujas (mažiau nei 7 dienos)
  const isNewProduct = (publishDate) => {
    if (!publishDate) return false;
    const publish = new Date(publishDate);
    const now = new Date();
    const diffTime = Math.abs(now - publish);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Gauti nuotraukas
  const getImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => {
        let src = img.image_path;
        // Jei prasideda su http, naudoti kaip yra
        if (src?.startsWith('http')) {
          return { src, alt: img.alt_text || product.name };
        }
        // Jei prasideda su /img arba img, pridėti tik / jei reikia
        if (src?.startsWith('img/')) {
          src = '/' + src;
        } else if (src && !src.startsWith('/')) {
          // Jei tik failo pavadinimas, pridėti pilną kelią
          src = '/img/products/' + src;
        }
        return { src, alt: img.alt_text || product.name };
      });
    } else if (product?.main_image) {
      let src = product.main_image;
      if (!src.startsWith('/') && !src.startsWith('http')) {
        src = '/img/products/' + src;
      }
      return [{ src, alt: product.name }];
    }
    return [];
  };

  const images = product ? getImages() : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">{t('productDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-5xl mb-4">😔</div>
          <p className="text-red-600 font-semibold mb-4">{t('productDetails.error')}</p>
          <button 
            onClick={() => navigate('/produktai')} 
            className="bg-amber-500 text-white px-6 py-2 rounded-xl hover:bg-amber-600 transition-colors"
          >
            {t('productDetails.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-stone-600 font-semibold mb-4">{t('productDetails.notFound')}</p>
          <button 
            onClick={() => navigate('/produktai')} 
            className="bg-amber-500 text-white px-6 py-2 rounded-xl hover:bg-amber-600 transition-colors"
          >
            {t('productDetails.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <button
          onClick={() => navigate('/produktai')}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 font-medium mb-8 group transition-colors"
        >
          <span className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
            ←
          </span>
          <span>{t('productDetails.backToProducts')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4" data-aos="fade-right">
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden aspect-square">
              {isNewProduct(product.publish_date) && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    {t('productDetails.new')}
                  </span>
                </div>
              )}

              {images.length > 0 ? (
                <div className="relative w-full h-full">
                  <img
                    src={images[currentImageIndex]?.src}
                    alt={images[currentImageIndex]?.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100"><span class="text-8xl">🎂</span></div>';
                    }}
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-stone-700 hover:bg-amber-500 hover:text-white transition-all z-10"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-stone-700 hover:bg-amber-500 hover:text-white transition-all z-10"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                  <span className="text-8xl">🎂</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? 'ring-4 ring-amber-500 ring-offset-2 scale-105'
                        : 'ring-2 ring-stone-200 hover:ring-amber-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-amber-100"><span class="text-2xl">🎂</span></div>';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6" data-aos="fade-left">
            {product.category_name && (
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium" data-aos="fade-up">
                {product.category_name}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight" data-aos="fade-up" data-aos-delay="100">
              {product.name}
            </h1>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-end gap-4">
                {product.price > 0 && (
                  <div>
                    <p className="text-amber-100 text-sm mb-1">{t('productDetails.price')}</p>
                    <p className="text-4xl font-bold">{product.price} €</p>
                  </div>
                )}
                {product.price_per_kg > 0 && (
                  <div className={product.price > 0 ? 'border-l border-white/30 pl-4' : ''}>
                    <p className="text-amber-100 text-sm mb-1">{t('productDetails.pricePerKg')}</p>
                    <p className="text-3xl font-bold">{product.price_per_kg} €/kg</p>
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📝</span> {t('productDetails.description')}
                </h2>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">📅</span>
                  <span className="text-stone-500 text-sm">{t('productDetails.added')}</span>
                </div>
                <p className="font-bold text-stone-800 text-lg">
                  {new Date(product.publish_date).toLocaleDateString(language === 'lt' ? 'lt-LT' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                    {product.is_active ? '✅' : '❌'}
                  </span>
                  <span className="text-stone-500 text-sm">{t('productDetails.status')}</span>
                </div>
                <p className={`font-bold text-lg ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {product.is_active ? t('productDetails.available') : t('productDetails.unavailable')}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/uzsakymas"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300"
              >
                <span className="text-2xl">🎂</span>
                <span>{t('productDetails.orderThis')}</span>
              </Link>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <span>💡</span> {t('productDetails.usefulInfo')}
              </h3>
              <ul className="text-amber-700 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>{t('productDetails.info1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>{t('productDetails.info2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>{t('productDetails.info3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
