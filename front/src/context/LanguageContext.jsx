import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  lt: {
    // Navigation
    nav: {
      home: 'Pradžia',
      products: 'Produktai',
      gallery: 'Galerija',
      about: 'Apie mus',
      order: 'Užsakyti',
      orderCake: '🎂 Užsakyti'
    },
    // Gallery page
    gallery: {
      badge: 'Mūsų darbai',
      title: 'Galerija',
      description: 'Peržiūrėkite mūsų sukurtus tortus ir kepinius. Kiekvienas kūrinys - unikalus ir pagamintas su meile.',
      viewLarger: 'Padidinti',
      noImages: 'Nuotraukų nerasta',
      ctaTitle: 'Norite tokio paties torto?',
      ctaDescription: 'Susisiekite su mumis ir sukursime jūsų svajonių tortą pagal individualų užsakymą!',
      ctaButton: 'Užsakyti tortą'
    },
    // Home page
    home: {
      heroTitle: 'Saldūs kepiniai — ',
      heroHighlight: 'visiems',
      heroDescription: 'Tradiciškai paruošti tortai ir kepiniai iš aukščiausios kokybės ingredientų. Užsakykite savo svajonių tortą jau šiandien!',
      newOffers: 'Yra naujų pasiūlymų!',
      viewProducts: 'Peržiūrėti produktus',
      orderNow: 'Užsakyti dabar',
      badge1: '100% Natūralu',
      badge2: '5+ metų patirtis',
      badge3: 'Su meile',
      from: 'Nuo',
      new: 'NAUJI!',
      feature1Title: 'Natūralūs',
      feature1Desc: 'Tik švieži ingredientai',
      feature2Title: 'Rankų darbas',
      feature2Desc: 'Kiekvienas unikalus',
      feature3Title: 'Individualūs',
      feature3Desc: 'Pagal jūsų norus',
      feature4Title: 'Laiku',
      feature4Desc: 'Visada paruošta',
      whatWeOffer: 'Ką siūlome',
      ourCategories: 'Mūsų kategorijos',
      categoriesDescription: 'Atraskite mūsų rankomis kurtus skanėstus – nuo prabangių tortų iki traškių sausainių',
      viewAllProducts: 'Peržiūrėti visus produktus',
      ctaTitle: 'Pasiruošę užsisakyti svajonių tortą?',
      ctaDescription: 'Susisiekite su mumis ir kartu sukursime tobulą kepinį jūsų šventei!'
    },
    // Products page
    products: {
      title: 'Mūsų produktai',
      description: 'Atraskite mūsų rankų darbo tortus, pyragus ir kitus skanėstus. Kiekvienas kepinys gaminamas su meile ir tik iš šviežių ingredientų.',
      orderNow: 'Užsakyti dabar',
      allCategories: 'Visi',
      sortBy: 'Rūšiuoti:',
      newest: 'Naujausi',
      oldest: 'Seniausi',
      priceAsc: 'Kaina ↑',
      priceDesc: 'Kaina ↓',
      nameAsc: 'Pavadinimas A-Z',
      loading: 'Kraunama...',
      noProducts: 'Produktų nerasta',
      new: '✨ NAUJA',
      perKg: '€/kg',
      moreInfo: 'Plačiau',
      found: 'Rasta produktų',
      all: 'Visi',
      unavailable: 'Nepasiekiamas'
    },
    // Category names
    categories: {
      tortai: 'Tortai',
      pyragai: 'Pyragai',
      sausainiai: 'Sausainiai',
      keksai: 'Keksai',
      desertai: 'Desertai'
    },
    // Product details
    productDetails: {
      backToProducts: 'Grįžti į produktus',
      new: '✨ NAUJA',
      price: 'Kaina',
      pricePerKg: 'Kaina už kg',
      description: 'Aprašymas',
      added: 'Pridėta',
      status: 'Statusas',
      available: 'Galima užsakyti',
      unavailable: 'Nepasiekiamas',
      orderThis: 'Užsakyti šį kepinį',
      usefulInfo: '💡 Naudinga informacija',
      info1: 'Galite užsakyti individualų dizainą pagal jūsų pageidavimus',
      info2: 'Kaina gali keistis priklausomai nuo dekoracijų sudėtingumo',
      info3: 'Užsakymus priimame min. 3 dienos prieš datą',
      loading: 'Kraunama...',
      notFound: 'Produktas nerastas',
      error: 'Nepavyko gauti produkto informacijos'
    },
    // Order page
    order: {
      badge: 'Individualūs užsakymai',
      title1: 'Užsakykite savo',
      title2: 'svajonių tortą',
      subtitle: 'Užpildykite formą ir mes susisieksime su jumis, kad sukurtume',
      subtitleHighlight: 'tobulą kepinį',
      subtitleEnd: 'jūsų ypatingai progai ✨',
      freshIngredients: 'Šviežios žaliavos',
      handmade: 'Rankų darbas',
      customDesign: 'Individualus dizainas',
      contacts: 'Kontaktai',
      address: 'Adresas',
      phone: 'Telefonas',
      email: 'El. paštas',
      workingHours: 'Darbo laikas',
      importantInfo: '💡 Svarbu žinoti',
      info1: 'Užsakymus priimame min.',
      info1Bold: '3 dienas',
      info1End: 'prieš datą',
      info2: 'Vestuvių tortams - min.',
      info2Bold: '2 savaitės',
      info2End: 'iš anksto',
      info3: 'Pritaikome pagal jūsų pageidavimus',
      info4: 'Atsiėmimas vietoje Puodžių g. 14',
      formTitle: 'Užsakymo forma',
      price: 'Kaina:',
      orderReceived: 'Užsakymas gautas!',
      orderReceivedMsg: 'Netrukus susisieksime su jumis dėl detalių',
      step1: 'Jūsų kontaktai',
      name: 'Vardas',
      namePlaceholder: 'Jūsų vardas',
      phonePlaceholder: '+370 600 00000',
      emailPlaceholder: 'jusu@email.lt',
      step2: 'Pasirinkite kepinį',
      date: '📅 Pageidaujama data',
      category: '📁 Kategorija',
      selectCategory: '-- Pasirinkite kategoriją --',
      product: '🍰 Produktas',
      selectProduct: '-- Pasirinkite produktą --',
      loadingCategories: 'Kraunamos kategorijos...',
      loadingProducts: 'Kraunami produktai...',
      noProducts: 'Šioje kategorijoje produktų nėra',
      weight: 'Svoris (kg)',
      step3: 'Papildoma informacija',
      message: '💬 Jūsų pageidavimai',
      messagePlaceholder: 'Aprašykite savo pageidavimus: skonį, dekoracijas, spalvas, tematiką...',
      submit: 'Siųsti užsakymą',
      consent: 'Paspaudę mygtuką sutinkate, kad susisieksime su jumis nurodytu telefonu ar el. paštu'
    },
    // About page
    about: {
      since: 'Nuo 2020 metų',
      heroDescription: 'Kuriame saldžias akimirkas jūsų šventėms su meile ir aistra konditerijos menui',
      stat1: 'Metų patirtis',
      stat2: 'Patenkintų klientų',
      stat3: 'Unikalių receptų',
      stat4: 'Natūralūs produktai',
      ourStory: 'Mūsų istorija',
      howItStarted: 'Kaip viskas prasidėjo',
      storyPart1: 'gimė iš meilės tradiciniams receptams ir noro dalintis šiluma bei skoniu su jumis. Pradėjome kaip maža šeimos kepyklėlė, o dabar esame žinomi visame mieste.',
      storyPart2: 'Kiekvienas mūsų kepinys yra pagamintas iš',
      storyHighlight: 'šviežių, natūralių ingredientų',
      storyPart3: 'be konservantų ar dirbtinių priedų. Tikime, kad geri kepiniai gali padaryti dieną geresnę.',
      storyPart4: 'Mūsų komanda – tai patyrę konditeriai, kurie kiekvieną dieną tobulina savo įgūdžius, kad galėtų pasiūlyti jums tik geriausią.',
      premiumQuality: 'Premium kokybė',
      bestIngredients: 'Geriausi ingredientai',
      whatWeOffer: 'Ką siūlome',
      ourSpecialties: 'Mūsų specializacija',
      specialtiesDescription: 'Gaminame įvairius tortus ir kepinius visoms progoms – nuo gimtadienių iki vestuvių',
      specialty1Title: 'Gimtadienių tortai',
      specialty1Desc: 'Individualiai sukurti tortai su personalizuotais užrašais ir jūsų pasirinktu skoniu.',
      specialty2Title: 'Vestuvių tortai',
      specialty2Desc: 'Elegantiški daugiasluoksniai tortai su cukrinėmis gėlėmis ir rafinuotomis dekoracijomis.',
      specialty3Title: 'Kiti kepiniai',
      specialty3Desc: 'Kiti kepiniai šventėms ar renginiams.',
      specialty4Title: 'Darbo renginiai',
      specialty4Desc: 'Firminiai tortai su logotipais, desertų stalai konferencijoms ar darbo šventėms.',
      ourAdvantages: 'Mūsų privalumai',
      whyChooseUs: 'Kodėl rinktis mus?',
      advantage1Title: 'Švieži ingredientai',
      advantage1Desc: 'Natūralus sviestas, švieži kiaušiniai, tikras šokoladas',
      advantage2Title: 'Individualus požiūris',
      advantage2Desc: 'Kiekvienas užsakymas aptariamas asmeniškai',
      advantage3Title: 'Atsiėmimas vietoje',
      advantage3Desc: 'Patogu atsiimti užsakymą mūsų kepykloje darbo metu',
      advantage4Title: '5+ metų patirtis',
      advantage4Desc: 'Ilgametė patirtis ir nuolatinis tobulėjimas',
      ourPeople: 'Mūsų žmonės',
      team: 'Komanda',
      teamMember1Name: 'Mama',
      teamMember1Role: 'Konditerė',
      teamMember1Desc: 'Kepinių meistrė ir receptų kūrėja',
      teamMember2Role: 'Svetainės kūrėjas',
      teamMember2Desc: 'Web dizainas ir programavimas',
      ctaTitle: 'Pasiruošę užsisakyti?',
      ctaDescription: 'Sukurkime jūsų svajonių tortą kartu! Užpildykite užsakymo formą arba peržiūrėkite mūsų produktus.'
    },
    // Footer
    footer: {
      tagline: 'Tortai su meile ❤️',
      description: 'Gaminame skanius tortus ir kepinius jūsų ypatingoms progoms. Kiekvienas kepinys - rankų darbas su meile ir tik šviežiais ingredientais.',
      navigation: 'Navigacija',
      contacts: 'Kontaktai',
      address: 'Adresas',
      phone: 'Telefonas',
      email: 'El. paštas',
      copyright: '© 2026 Kream. Visos teisės saugomos.',
      madeWith: 'Sukurta su'
    },
    // Common
    common: {
      loading: 'Kraunama...',
      error: 'Klaida',
      back: 'Grįžti'
    }
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      gallery: 'Gallery',
      about: 'About us',
      order: 'Order',
      orderCake: '🎂 Order'
    },
    // Gallery page
    gallery: {
      badge: 'Our work',
      title: 'Gallery',
      description: 'Browse our custom cakes and pastries. Each creation is unique and made with love.',
      viewLarger: 'View larger',
      noImages: 'No images found',
      ctaTitle: 'Want a cake like this?',
      ctaDescription: 'Contact us and we will create your dream cake with a custom order!',
      ctaButton: 'Order a cake'
    },
    // Home page
    home: {
      heroTitle: 'Sweet cakes — ',
      heroHighlight: 'for all',
      heroDescription: 'Traditionally made cakes and pastries from the highest quality ingredients. Order your dream cake today!',
      newOffers: 'New offers available!',
      viewProducts: 'View products',
      orderNow: 'Order now',
      badge1: '100% Natural',
      badge2: '5+ years experience',
      badge3: 'Made with love',
      from: 'From',
      new: 'NEW!',
      feature1Title: 'Natural',
      feature1Desc: 'Only fresh ingredients',
      feature2Title: 'Handmade',
      feature2Desc: 'Each one unique',
      feature3Title: 'Custom',
      feature3Desc: 'By your wishes',
      feature4Title: 'On time',
      feature4Desc: 'Always ready',
      whatWeOffer: 'What we offer',
      ourCategories: 'Our categories',
      categoriesDescription: 'Discover our handcrafted treats – from luxurious cakes to crispy cookies',
      viewAllProducts: 'View all products',
      ctaTitle: 'Ready to order your dream cake?',
      ctaDescription: 'Contact us and together we will create the perfect pastry for your celebration!'
    },
    // Products page
    products: {
      title: 'Our products',
      description: 'Discover our handmade cakes, pies and other treats. Every pastry is made with love and only from fresh ingredients.',
      orderNow: 'Order now',
      allCategories: 'All',
      sortBy: 'Sort by:',
      newest: 'Newest',
      oldest: 'Oldest',
      priceAsc: 'Price ↑',
      priceDesc: 'Price ↓',
      nameAsc: 'Name A-Z',
      loading: 'Loading...',
      noProducts: 'No products found',
      new: '✨ NEW',
      perKg: '€/kg',
      moreInfo: 'More info',
      found: 'Products found',
      all: 'All',
      unavailable: 'Unavailable'
    },
    // Category names
    categories: {
      tortai: 'Cakes',
      pyragai: 'Pies',
      sausainiai: 'Cookies',
      keksai: 'Cupcakes',
      desertai: 'Desserts'
    },
    // Product details
    productDetails: {
      backToProducts: 'Back to products',
      new: '✨ NEW',
      price: 'Price',
      pricePerKg: 'Price per kg',
      description: '📝 Description',
      added: 'Added',
      status: 'Status',
      available: 'Available to order',
      unavailable: 'Unavailable',
      orderThis: 'Order this pastry',
      usefulInfo: '💡 Useful information',
      info1: 'You can order a custom design according to your preferences',
      info2: 'Price may vary depending on decoration complexity',
      info3: 'We accept orders min. 3 days in advance',
      loading: 'Loading...',
      notFound: 'Product not found',
      error: 'Failed to get product information'
    },
    // Order page
    order: {
      badge: 'Custom orders',
      title1: 'Order your',
      title2: 'dream cake',
      subtitle: 'Fill out the form and we will contact you to create',
      subtitleHighlight: 'the perfect pastry',
      subtitleEnd: 'for your special occasion ✨',
      freshIngredients: 'Fresh ingredients',
      handmade: 'Handmade',
      customDesign: 'Custom design',
      contacts: 'Contacts',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      workingHours: 'Working hours',
      importantInfo: '💡 Important to know',
      info1: 'We accept orders min.',
      info1Bold: '3 days',
      info1End: 'in advance',
      info2: 'For wedding cakes - min.',
      info2Bold: '2 weeks',
      info2End: 'in advance',
      info3: 'We customize to your preferences',
      info4: 'Pickup at Puodžių st. 14',
      formTitle: 'Order form',
      price: 'Price:',
      orderReceived: 'Order received!',
      orderReceivedMsg: 'We will contact you shortly about the details',
      step1: 'Your contacts',
      name: 'Name',
      namePlaceholder: 'Your name',
      phonePlaceholder: '+370 600 00000',
      emailPlaceholder: 'your@email.com',
      step2: 'Choose pastry',
      date: '📅 Preferred date',
      category: '📁 Category',
      selectCategory: '-- Select category --',
      product: '🍰 Product',
      selectProduct: '-- Select product --',
      loadingCategories: 'Loading categories...',
      loadingProducts: 'Loading products...',
      noProducts: '⚠️ No products in this category',
      weight: '⚖️ Weight (kg)',
      step3: 'Additional information',
      message: '💬 Your preferences',
      messagePlaceholder: 'Describe your preferences: flavor, decorations, colors, theme...',
      submit: 'Submit order',
      consent: 'By clicking the button you agree that we will contact you by the provided phone or email'
    },
    // About page
    about: {
      since: 'Since 2020',
      tagline: 'Creating sweet moments for your celebrations with love and passion for confectionery art',
      statsYears: 'years of experience',
      statsClients: 'satisfied clients',
      statsCakes: 'cakes made',
      statsRating: 'rating',
      storyLabel: 'Our story',
      storyTitle: 'How it all started',
      storyText1: 'was born from the love of traditional recipes and the desire to share warmth and taste with you. We started as a small family bakery, and now we are known throughout the city.',
      storyText2Part1: 'Every pastry we make is made from',
      storyText2Highlight: 'fresh, natural ingredients',
      storyText2Part2: ', without preservatives or artificial additives. We believe that good pastries can make the day better.',
      storyText3: 'Our team consists of experienced confectioners who improve their skills every day to offer you only the best.',
      specialtiesTitle: 'Our specialties',
      specialty1: 'Wedding cakes',
      specialty1Desc: 'Elegant multi-tiered cakes for your most important day.',
      specialty2: 'Birthday cakes',
      specialty2Desc: 'Colorful and fun cakes for children and adults.',
      specialty3: 'Corporate events',
      specialty3Desc: 'Custom cakes with logos, dessert tables for conferences and celebrations.',
      specialty4: 'Seasonal treats',
      specialty4Desc: 'Special pastries for Christmas, Easter and other holidays.',
      whyUsTitle: 'Why choose us?',
      why1: 'Natural ingredients',
      why2: 'Handmade',
      why3: 'Individual approach',
      why4: 'Local pickup',
      teamTitle: 'Our team',
      teamRole1: '👩‍🍳 Confectioner',
      teamRole2: '👨‍💻 Web Developer',
      ctaTitle: 'Ready to order?',
      ctaSubtitle: 'Contact us and we will create the perfect pastry for your celebration',
      ctaButton: 'Order now',
      // New translations
      since: 'Since 2020',
      heroDescription: 'Creating sweet moments for your celebrations with love and passion for confectionery art',
      stat1: 'Years experience',
      stat2: 'Satisfied clients',
      stat3: 'Unique recipes',
      stat4: 'Natural products',
      ourStory: 'Our story',
      howItStarted: 'How it all started',
      storyPart1: 'was born from the love of traditional recipes and the desire to share warmth and taste with you. We started as a small family bakery, and now we are known throughout the city.',
      storyPart2: 'Every pastry we make is made from',
      storyHighlight: 'fresh, natural ingredients',
      storyPart3: 'without preservatives or artificial additives. We believe that good pastries can make the day better.',
      storyPart4: 'Our team consists of experienced confectioners who improve their skills every day to offer you only the best.',
      premiumQuality: 'Premium quality',
      bestIngredients: 'Best ingredients',
      whatWeOffer: 'What we offer',
      ourSpecialties: 'Our specialties',
      specialtiesDescription: 'We make various cakes and pastries for all occasions – from birthdays to weddings',
      specialty1Title: 'Birthday cakes',
      specialty1Desc: 'Individually created cakes with personalized inscriptions and your chosen flavor.',
      specialty2Title: 'Wedding cakes',
      specialty2Desc: 'Elegant multi-layered cakes with sugar flowers and refined decorations.',
      specialty3Title: 'Cupcakes and desserts',
      specialty3Desc: 'Mini desserts, cupcakes with various creams and other sweets for events.',
      specialty4Title: 'Business events',
      specialty4Desc: 'Corporate cakes with logos, dessert tables for conferences and celebrations.',
      ourAdvantages: 'Our advantages',
      whyChooseUs: 'Why choose us?',
      advantage1Title: 'Fresh ingredients',
      advantage1Desc: 'Natural butter, fresh eggs, real chocolate',
      advantage2Title: 'Individual approach',
      advantage2Desc: 'Each order is discussed personally',
      advantage3Title: 'Local pickup',
      advantage3Desc: 'Convenient pickup at our bakery during working hours',
      advantage4Title: '5+ years experience',
      advantage4Desc: 'Long-term experience and continuous improvement',
      ourPeople: 'Our people',
      team: 'Team',
      teamMember1Name: 'Mom',
      teamMember1Role: 'Confectioner',
      teamMember1Desc: 'Pastry master and recipe creator',
      teamMember2Role: 'Website creator',
      teamMember2Desc: 'Web design and programming',
      ctaTitle: 'Ready to order?',
      ctaDescription: 'Let\'s create your dream cake together! Fill out the order form or view our products.'
    },
    // Footer
    footer: {
      tagline: 'Cakes with love ❤️',
      description: 'We make delicious cakes and pastries for your special occasions. Every pastry is handmade with love and only from fresh ingredients.',
      navigation: 'Navigation',
      contacts: 'Contacts',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      copyright: '© 2026 Kream. All rights reserved.',
      madeWith: 'Made with'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      back: 'Back'
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Pabandyti gauti kalbą iš localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return saved || 'lt';
    }
    return 'lt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'lt' ? 'en' : 'lt');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
