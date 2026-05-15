import { useState, useEffect } from 'react';
import { translations } from './translations.js';
import { LanguageContext } from './context.js';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('language');
      return saved === 'en' || saved === 'lt' ? saved : 'lt';
    } catch {
      return 'lt';
    }
  });

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