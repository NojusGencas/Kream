import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import { Home } from './pages/home';
import { Produktai } from './pages/produktai';
import { ProduktoDetal } from './pages/produkto-detales';
import { Galerija } from './pages/galerija';
import { ApieMus } from './pages/apie-mus';
import { Uzsakymas } from './pages/uzsakymas';
import { Kategorijos } from './pages/kategorijos';
import { Susisiekti } from './pages/susisiekti';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Komponentas AOS atnaujinimui navigacijos metu
function AOSRefresh() {
  const location = useLocation();
  
  useEffect(() => {
    AOS.refresh();
  }, [location]);
  
  return null;
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <Router>
      <AOSRefresh />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/produktai' element={<Produktai/>}/>
            <Route path='/produkto-detales/:id' element={<ProduktoDetal/>}/>
            <Route path='/products/:id' element={<ProduktoDetal/>}/>
            <Route path='/galerija' element={<Galerija/>}/>
            <Route path='/apie-mus' element={<ApieMus/>}/>
            <Route path='/uzsakymas' element={<Uzsakymas/>}/>
            <Route path='/kategorijos' element={<Kategorijos/>}/>
            <Route path='/susisiekti' element={<Susisiekti/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    
  )
}

export default App;
