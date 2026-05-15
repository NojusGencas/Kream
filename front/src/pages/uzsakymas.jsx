import { useState, useEffect } from 'react';
import { useLanguage } from '../context/useLanguage';

export function Uzsakymas() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    categoryId: '',
    productId: '',
    weight: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Funkcija ikonai pagal kategorijos pavadinimą
  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('tort')) return '🎂';
    if (lower.includes('pyrag')) return '🥧';
    if (lower.includes('keks')) return '🧁';
    if (lower.includes('sald')) return '🍬';
    return '🍰';
  };

  // Gauti kategorijas iš DB
  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error('Klaida gaunant kategorijas:', error);
        setLoadingCategories(false);
      });
  }, []);

  // Gauti produktus pagal pasirinktą kategoriją
  useEffect(() => {
    if (!formData.categoryId) {
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    fetch(`/api/products/category/${formData.categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error('Klaida gaunant produktus:', error);
        setProducts([]);
        setLoadingProducts(false);
      });
  }, [formData.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Jei keičiama kategorija, išvalyti produktą
    if (name === 'categoryId') {
      setFormData({
        ...formData,
        categoryId: value,
        productId: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Rasti pasirinktos kategorijos ir produkto pavadinimus
    const selectedCategory = categories.find(c => c.id === Number(formData.categoryId));
    const selectedProduct = products.find(p => p.id === Number(formData.productId));
    const totalPrice = selectedProduct && formData.weight ? (selectedProduct.price_per_kg * parseFloat(formData.weight)).toFixed(2) : 0;
    
    // Siųsti į orders API
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cake_type: selectedProduct?.name || selectedCategory?.name || 'Individualus',
        cake_size: formData.weight ? `${formData.weight} kg` : null,
        cake_flavor: null,
        decoration: null,
        delivery_date: formData.date || null,
        delivery_time: null,
        message: formData.message || null
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success' || data.id) {
          setSubmitted(true);
          setFormData({ name: '', email: '', phone: '', date: '', categoryId: '', productId: '', weight: '', message: '' });
        } else {
          alert('Klaida: ' + (data.message || data.error || 'Nežinoma klaida'));
        }
      })
      .catch((error) => {
        console.error('Klaida:', error);
        alert('Nepavyko išsiųsti užsakymo');
      });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Pasirinktas produktas
  const selectedProduct = products.find(p => p.id === Number(formData.productId));
  const calculatedPrice = selectedProduct && formData.weight 
    ? (selectedProduct.price_per_kg * parseFloat(formData.weight)).toFixed(2) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-amber-100/40 to-yellow-100/40 rounded-full blur-3xl"></div>
        
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce" style={{animationDuration: '3s'}}>🎂</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>🧁</div>
        <div className="absolute bottom-40 left-20 text-4xl opacity-10 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1s'}}>🍰</div>
        <div className="absolute bottom-20 right-10 text-5xl opacity-10 animate-bounce" style={{animationDuration: '4.5s', animationDelay: '0.3s'}}>✨</div>
      </div>

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div data-aos="fade-down" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-100 mb-6">
              <span className="text-xl">🎂</span>
              <span className="text-amber-700 font-medium text-sm">{t('order.badge')}</span>
            </div>
            
            <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 bg-clip-text text-transparent">
                {t('order.title1')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                {t('order.title2')}
              </span>
            </h1>
            
            <p data-aos="fade-up" data-aos-delay="200" className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('order.subtitle')}
              <span className="text-amber-600 font-semibold"> {t('order.subtitleHighlight')} </span>
              {t('order.subtitleEnd')}
            </p>

            <div data-aos="fade-up" data-aos-delay="300" className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-stone-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-sm">{t('order.freshIngredients')}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-sm">{t('order.handmade')}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-sm">{t('order.customDesign')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            <div className="lg:col-span-2 space-y-6" data-aos="fade-right">
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-stone-200/50 border border-white/50 p-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-lg">📞</span>
                  {t('order.contacts')}
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-amber-50 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      📍
                    </div>
                    <div>
                      <p className="text-stone-500 text-sm">{t('order.address')}</p>
                      <p className="text-stone-900 font-semibold">Puodžių g. 14</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-amber-50 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      📱
                    </div>
                    <div>
                      <p className="text-stone-500 text-sm">{t('order.phone')}</p>
                      <p className="text-stone-900 font-semibold">+370 600 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-amber-50 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      ✉️
                    </div>
                    <div>
                      <p className="text-stone-500 text-sm">{t('order.email')}</p>
                      <p className="text-stone-900 font-semibold">info@kream.lt</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-amber-50 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      🕒
                    </div>
                    <div>
                      <p className="text-stone-500 text-sm">{t('order.workingHours')}</p>
                      <p className="text-stone-900 font-semibold">I-V: 8:00-18:00</p>
                      <p className="text-stone-600 text-sm">VI-VII: 9:00-16:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-xl shadow-amber-500/20 p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span> {t('order.importantInfo')}
                  </h3>
                  <ul className="space-y-3 text-amber-50">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                      <span>{t('order.info1')} <strong>{t('order.info1Bold')}</strong> {t('order.info1End')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                      <span>{t('order.info2')} <strong>{t('order.info2Bold')}</strong> {t('order.info2End')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                      <span>{t('order.info3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                      <span>{t('order.info4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3" data-aos="fade-left">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-stone-200/50 border border-white/50 p-8">
                
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                    <span className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-lg">📝</span>
                    {t('order.formTitle')}
                  </h2>
                  {calculatedPrice && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-green-500/20 animate-pulse">
                      <span className="text-sm">{t('order.price')}</span>
                      <span className="font-bold text-lg ml-1">{calculatedPrice} €</span>
                    </div>
                  )}
                </div>

                {submitted && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-5 rounded-2xl mb-6 flex items-center gap-4 shadow-lg shadow-green-500/20">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                      ✅
                    </div>
                    <div>
                      <p className="font-bold text-lg">{t('order.orderReceived')}</p>
                      <p className="text-green-100">{t('order.orderReceivedMsg')}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span className="font-semibold text-stone-700">{t('order.step1')}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-600 mb-2">
                          {t('order.name')} *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400"
                          placeholder={t('order.namePlaceholder')}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-600 mb-2">
                          {t('order.phone')} *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400"
                          placeholder={t('order.phonePlaceholder')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-2">
                        {t('order.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400"
                        placeholder={t('order.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="border-t border-stone-100"></div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span className="font-semibold text-stone-700">{t('order.step2')}</span>
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-stone-600 mb-2">
                        {t('order.date')} *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={today}
                        className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                      />
                    </div>

                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-stone-600 mb-2">
                        {t('order.category')} *
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                        disabled={loadingCategories}
                      >
                        <option value="">{t('order.selectCategory')}</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {getCategoryIcon(category.name)} {category.name}
                          </option>
                        ))}
                      </select>
                      {loadingCategories && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <span className="animate-spin">⏳</span> {t('order.loadingCategories')}
                        </p>
                      )}
                    </div>

                    {formData.categoryId && (
                      <div className="animate-fadeIn">
                        <label htmlFor="productId" className="block text-sm font-medium text-stone-600 mb-2">
                          {t('order.product')} *
                        </label>
                        <select
                          id="productId"
                          name="productId"
                          value={formData.productId}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                          disabled={loadingProducts}
                        >
                          <option value="">{t('order.selectProduct')}</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.price_per_kg} €/kg)
                            </option>
                          ))}
                        </select>
                        {loadingProducts && (
                          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                            <span className="animate-spin">⏳</span> {t('order.loadingProducts')}
                          </p>
                        )}
                        {!loadingProducts && products.length === 0 && (
                          <p className="text-xs text-rose-500 mt-1">{t('order.noProducts')}</p>
                        )}
                      </div>
                    )}

                    {formData.productId && (
                      <div className="animate-fadeIn">
                        <label htmlFor="weight" className="block text-sm font-medium text-stone-600 mb-2">
                          {t('order.weight')} *
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {['0.5', '1', '1.5', '2', '2.5', '3', '4', '5', '6', '8', '10'].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setFormData({...formData, weight: w})}
                              className={`py-3 px-2 rounded-xl font-semibold transition-all ${
                                formData.weight === w
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              }`}
                            >
                              {w} kg
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-stone-100"></div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span className="font-semibold text-stone-700">{t('order.step3')}</span>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-stone-600 mb-2">
                        {t('order.message')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none placeholder:text-stone-400"
                        placeholder={t('order.messagePlaceholder')}
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span>{t('order.submit')}</span>
                    <span className="text-xl">🎂</span>
                  </button>
                  
                  <p className="text-center text-stone-500 text-sm">
                    {t('order.consent')}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
