import { getApiUrl, resolveProductImage } from '../config.js';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Funkcija patikrinti ar produktas naujas (mažiau nei 7 dienos)
const isNewProduct = (publishDate) => {
  if (!publishDate) return false;
  const published = new Date(publishDate);
  const now = new Date();
  const diffTime = now - published;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};

export function Kategorijos() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Funkcija ikonai pagal kategorijos pavadinimą
  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('tort')) return '🎂';
    if (lower.includes('pyrag')) return '🥧';
    if (lower.includes('keks')) return '🧁';
    if (lower.includes('sald')) return '🍬';
    return '🍰'; // default
  };

  // Gauti kategorijas
  useEffect(() => {
    fetch(getApiUrl('/api/categories'))
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        // if URL contains ?category= use it, otherwise pick first
        try {
          const params = new URLSearchParams(location.search);
          const cat = params.get('category');
          if (cat) {
            const id = Number(cat);
            const exists = data.some((c) => c.id === id);
            if (exists) setSelectedCategory(id);
            else if (data.length > 0) setSelectedCategory(data[0].id);
          } else if (data.length > 0) {
            setSelectedCategory(data[0].id);
          }
        } catch (e) {
          if (data.length > 0) setSelectedCategory(data[0].id);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Klaida gaunant kategorijas:', error);
        setError('Nepavyko gauti kategorijų');
        setLoading(false);
      });
  }, []);

  

  // Gauti produktus pagal kategoriją
  useEffect(() => {
    if (!selectedCategory) return;

    fetch(getApiUrl(`/api/products/category/${selectedCategory}`))
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error('Klaida gaunant produktus:', error);
        setProducts([]);
      });
  }, [selectedCategory]);

  if (loading) return <p className="text-center py-8">Kraunasi...</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-stone-800" data-aos="fade-down">Kategorijos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1" data-aos="fade-right">
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-3 ${
                  selectedCategory === category.id
                    ? 'bg-stone-900 text-stone-50 font-bold'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
                title={category.name} // tooltip with name
              >
                <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                <span className="flex-1">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3" data-aos="fade-left">
          <h2 className="text-2xl font-bold mb-6 text-stone-700">
            {categories.find((c) => c.id === selectedCategory)?.name || 'Produktai'}
          </h2>

          {products.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Nėra produktų šioje kategorijoje</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/produkto-detales/${product.id}`}
                  data-aos="zoom-in"
                  data-aos-delay={Math.min(index * 100, 300)}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden relative"
                >
                  {isNewProduct(product.publish_date) && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        ✨ NAUJA
                      </span>
                    </div>
                  )}
                  <div className="w-full h-[250px] bg-gray-200 overflow-hidden rounded-lg">
                  <span>
                      <img 
                         src={resolveProductImage(product.main_image, product.slug)}
                         alt={product.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         onError={(e) => {
                           e.target.style.display = 'none';
                         }}
                       />
                     </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-stone-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold text-stone-800">{product.price}</span>
                        {product.price_per_kg > 0 && <span className="block text-sm text-stone-600">{product.price_per_kg} €/kg</span>}
                      </div>
                      <span className="text-shadow-stone-300 group-hover:text-stone-950">Peržiūrėti →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
