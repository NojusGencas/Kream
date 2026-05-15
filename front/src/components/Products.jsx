import { getApiUrl, resolveProductImage } from '../config.js';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

// Funkcija patikrinti ar produktas naujas (mažiau nei 7 dienos)
const isNewProduct = (publishDate) => {
  if (!publishDate) return false;
  const published = new Date(publishDate);
  const now = new Date();
  const diffTime = now - published;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { t, language } = useLanguage();

  // Helper function to translate category name
  const getCategoryName = (category) => {
    const slug = category.slug?.toLowerCase() || category.name?.toLowerCase();
    const translationKey = `categories.${slug}`;
    const translated = t(translationKey);
    // If translation exists (not returning the key), use it; otherwise use original name
    return translated !== translationKey ? translated : category.name;
  };

  useEffect(() => {
    Promise.all([
      fetch(getApiUrl('/api/products')).then(res => res.json()),
      fetch(getApiUrl('/api/categories')).then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Klaida gaunant duomenis:", error);
        setError("Nepavyko gauti duomenų");
        setLoading(false);
      });
  }, []);

  // Filtruoti ir rūšiuoti produktus
  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category_id === Number(selectedCategory))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publish_date) - new Date(a.publish_date);
        case 'oldest':
          return new Date(a.publish_date) - new Date(b.publish_date);
        case 'price-low':
          return (a.price_per_kg || 0) - (b.price_per_kg || 0);
        case 'price-high':
          return (b.price_per_kg || 0) - (a.price_per_kg || 0);
        case 'name':
          return a.name.localeCompare(b.name, 'lt');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-300 border-t-stone-900"></div>
      </div>
    );
  }
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8" data-aos="fade-down">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t('products.allCategories')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(String(category.id))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === String(category.id)
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-600">{t('products.sortBy')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-stone-500 focus:border-transparent cursor-pointer"
            >
              <option value="newest">{t('products.newest')}</option>
              <option value="oldest">{t('products.oldest')}</option>
              <option value="price-low">{t('products.priceAsc')}</option>
              <option value="price-high">{t('products.priceDesc')}</option>
              <option value="name">{t('products.nameAsc')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6" data-aos="fade-up">
        <p className="text-stone-600">
          {t('products.found')}: <span className="font-semibold text-stone-900">{filteredProducts.length}</span>
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16" data-aos="fade-up">
          <div className="text-6xl mb-4">🍰</div>
          <p className="text-stone-600 text-lg">{t('products.noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/produkto-detales/${product.id}`}
              data-aos="fade-up"
              data-aos-delay={Math.min(index * 100, 400)}
              className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                product.is_active ? 'hover:-translate-y-1' : 'opacity-75'
              }`}
            >
              <div className="relative h-56 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
                {isNewProduct(product.publish_date) && product.is_active && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                      {t('products.new')}
                    </span>
                  </div>
                )}
                
                {!product.is_active && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                        {t('products.unavailable')}
                      </span>
                    </div>
                  </div>
                )}
                
                <img 
                  src={resolveProductImage(product.main_image, product.slug)}
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    product.is_active ? 'group-hover:scale-110' : 'grayscale'
                  }`}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/f5f5f4/a8a29e?text=Kream';
                  }} 
                />
                {product.is_active && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                )}
              </div>

              <div className={`p-5 ${!product.is_active ? 'opacity-60' : ''}`}>
                <h3 className={`text-lg font-bold mb-2 transition-colors line-clamp-1 ${
                  product.is_active 
                    ? 'text-stone-900 group-hover:text-stone-700' 
                    : 'text-stone-500'
                }`}>
                  {product.name}
                </h3>
                <p className="text-stone-500 text-sm mb-4 line-clamp-2">
                  {product.description || 'Skanus rankų darbo kepinys'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    {product.price_per_kg > 0 && (
                      <p className={`text-xl font-bold ${product.is_active ? 'text-stone-900' : 'text-stone-400 line-through'}`}>
                        {product.price_per_kg} €<span className="text-sm font-normal text-stone-500">/kg</span>
                      </p>
                    )}
                  </div>
                  {product.is_active ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">
                      {t('products.moreInfo')}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-400">
                      {t('products.unavailable')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;