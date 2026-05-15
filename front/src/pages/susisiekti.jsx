import { getApiUrl } from '../config.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Susisiekti() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send to backend
    fetch(getApiUrl('/api/contact'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSubmitted(true);
          setFormData({ name: '', email: '', message: '' });
        } else {
          alert('Klaida: ' + data.error);
        }
      })
      .catch((error) => {
        console.error('Klaida:', error);
        alert('Nepavyko išsiųsti žinutės');
      });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-16 bg-gradient-to-br from-stone-100 to-stone-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight mb-4" data-aos="fade-down">
            Susisiekite su mumis
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Turite klausimų apie mūsų kepinius arba norite užsakyti? Susisiekite su mumis – mielai padėsime!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold text-stone-900 mb-8">Kontaktinė informacija</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="100">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-1">Adresas</h3>
                    <p className="text-stone-600">Puodžių g. 14</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="200">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-1">Telefonas</h3>
                    <p className="text-stone-600">+370 600 12345</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="300">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-1">El. paštas</h3>
                    <p className="text-stone-600">nojusgencas@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="400">
                  <div className="text-3xl">🕒</div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-1">Darbo laikas</h3>
                    <p className="text-stone-600">I-V: 8:00 - 18:00<br />VI-VII: 9:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold text-stone-900 mb-8">Parašykite mums</h2>
              {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <p>Dėkojame už žinutę! Netrukus susisieksime su jumis.</p>
                </div>
              ) : null}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                    Vardas
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="Jūsų vardas"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                    El. paštas
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="jusu@email.lt"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    Žinutė
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="Jūsų žinutė..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
                >
                  Siųsti žinutę
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-down">Apsilankykite mūsų kepykloje</h2>
          <p className="text-stone-300 text-lg mb-6" data-aos="fade-up" data-aos-delay="100">
            Užsukite į mūsų kepyklą ir išsirinkite skaniausius kepinius!
          </p>
          <div className="flex gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
            <Link to="/kategorijos" className="inline-block bg-white text-stone-900 px-6 py-3 rounded-lg font-semibold hover:bg-stone-100 transition">
              Peržiūrėti kategorijas
            </Link>
            <Link to="/produktai" className="inline-block border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-stone-900 transition">
              Visi produktai
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}