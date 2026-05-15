const fs = require('fs');

const ltHomeExtra = {
      badge1: '100% Natūralu',
      badge2: 'Šviežia kasdien',
      badge3: 'Su meile',
      from: 'Nuo',
      new: 'NAUJA',
      feature1Title: 'Natūralūs ingredientai',
      feature1Desc: 'Nenaudojame jokių dirbtinių priedų',
      feature2Title: 'Patirtis',
      feature2Desc: 'Ilgametė patirtis konditerijoje',
      feature3Title: 'Gražus dizainas',
      feature3Desc: 'Estetiški ir puošnūs kepiniai',
      feature4Title: 'Visada laiku',
      feature4Desc: 'Užsakymai paruošiami laiku',
      whatWeOffer: 'Ką mes siūlome',
      ourCategories: 'Mūsų kategorijos',
      categoriesDescription: 'Atraskite mūsų skanius kepinius pagal kategorijas.',
      viewAllProducts: 'Peržiūrėti visus produktus',
      ctaTitle: 'Pasiruošę paragauti?',
      ctaDescription: 'Susisiekite su mumis ir pateikite užsakymą jau dabar!',
};

const enHomeExtra = {
      heroTitle: 'Sweet pastries for ',
      heroHighlight: 'everyone',
      heroDescription: 'Pastries made from fresh ingredients',
      newOffers: 'New offers!',
      viewProducts: 'View products',
      orderNow: 'Order now',
      badge1: '100% Natural',
      badge2: 'Fresh daily',
      badge3: 'With love',
      from: 'From',
      new: 'NEW',
      feature1Title: 'Natural ingredients',
      feature1Desc: 'We do not use artificial additives',
      feature2Title: 'Experience',
      feature2Desc: 'Years of experience in baking',
      feature3Title: 'Beautiful design',
      feature3Desc: 'Aesthetic and gorgeous pastries',
      feature4Title: 'Always on time',
      feature4Desc: 'Orders are prepared on time',
      whatWeOffer: 'What we offer',
      ourCategories: 'Our Categories',
      categoriesDescription: 'Discover our delicious pastries by categories.',
      viewAllProducts: 'View all products',
      ctaTitle: 'Ready to taste?',
      ctaDescription: 'Contact us and place your order now!',
};

let content = fs.readFileSync('../front/src/context/translations.js', 'utf8');

// The easiest way is to modify the keys directly in the JS object since it's just a file. But replacing string is tricky. Let's just create a new one using AST or simple string manipulation.
