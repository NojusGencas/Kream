import { useState, useEffect } from 'react';
import { translations } from './translations.js';
import { LanguageContext } from './context.js';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('lt');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return key.split('.').reduce((obj, k) => obj?.[k], translations[language]) || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'lt' ? 'en' : 'lt'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}