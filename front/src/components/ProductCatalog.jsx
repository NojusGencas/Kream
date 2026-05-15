import { getApiUrl, resolveProductImage } from '../config.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Funkcija patikrinti ar produktas naujas (mažiau nei 7 dienos)
const isNewProduct = (publishDate) => {
  if (!publishDate) return false;
  const published = new Date(publishDate);
  const now = new Date();
  const diffTime = now - published;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};

export function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(getApiUrl('/products'))
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Klaida gaunant produktus:', error);
        setError('Nepavyko gauti produktų');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-12">Kraunasi produktai...</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">Mūsų Produktai</h2>
      
      {products.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Produktų nėra</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/produkto-detales/${product.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
            >
              <div className="h-56 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center overflow-hidden relative">
                {isNewProduct(product.publish_date) && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                      ✨ NAUJA
                    </span>
                  </div>
                )}
                <img 
                  src={resolveProductImage(product.main_image, product.slug)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-stone-800 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-stone-800">{product.price}€</span>
                  <button className="bg-stone-900 text-stone-50 px-3 py-1 rounded hover:bg-stone-800 transition-colors text-sm font-semibold">
                    Peržiūrėti
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
