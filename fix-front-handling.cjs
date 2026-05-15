const fs = require('fs');

const target = 'front/src/components/Products.jsx';
let content = fs.readFileSync(target, 'utf8');

content = content.replace(/setProducts\(productsData\);/g, `if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }`);

fs.writeFileSync(target, content);
console.log('Fixed Products.jsx array parsing');
