import { useState } from 'react';
import { useLanguage } from '../context/useLanguage';

export function Galerija() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);

  // Galerijos nuotraukos
  const galleryImages = [
    { id: 1, src: '/img/gallery/tortas1.jpg' },
    { id: 2, src: '/img/gallery/tortas2.jpg' },
    { id: 3, src: '/img/gallery/tortas3.jpg' },
    { id: 4, src: '/img/gallery/tortas4.jpg' },
    { id: 5, src: '/img/gallery/tortas5.jpg' },
    { id: 6, src: '/img/gallery/tortas6.jpg' },
    { id: 7, src: '/img/gallery/tortas7.jpg' },
    { id: 8, src: '/img/gallery/tortas8.jpg' },
    { id: 9, src: '/img/gallery/tortas9.jpg' },
    { id: 10, src: '/img/gallery/tortas10.jpg' },
    { id: 11, src: '/img/gallery/tortas11.jpg' },
    { id: 12, src: '/img/gallery/tortas12.jpg' }
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrev = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const goToNext = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(galleryImages[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div data-aos="fade-down" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-100 mb-6">
              <span className="text-xl">📸</span>
              <span className="text-amber-700 font-medium text-sm">{t('gallery.badge')}</span>
            </div>
            
            <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 bg-clip-text text-transparent">
                {t('gallery.title')}
              </span>
            </h1>
            
            <p data-aos="fade-up" data-aos-delay="200" className="text-stone-600 text-lg max-w-2xl mx-auto">
              {t('gallery.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(image)}
                data-aos="zoom-in"
                data-aos-delay={index * 50}
                className="group relative aspect-square bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={image.src}
                  alt={`Tortas ${image.id}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x400/f5f5f4/a8a29e?text=🎂`;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div data-aos="fade-up" className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t('gallery.ctaTitle')}
              </h2>
              <p className="text-amber-100 text-lg mb-6 max-w-xl mx-auto">
                {t('gallery.ctaDescription')}
              </p>
              <a
                href="/uzsakymas"
                className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🎂 {t('gallery.ctaButton')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {/* Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt="Tortas"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x600/f5f5f4/a8a29e?text=🎂`;
              }}
            />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {galleryImages.findIndex(img => img.id === selectedImage.id) + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
