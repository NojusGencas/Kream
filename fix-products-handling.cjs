const fs = require('fs');
const path = require('path');

const target = 'front/src/pages/uzsakymas.jsx';
let content = fs.readFileSync(target, 'utf8');

/* Replace 
        setProducts(data);
With
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
*/
content = content.replace(/setProducts\(data\);/g, `if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }`);

fs.writeFileSync(target, content);
console.log('Fixed uzsakymas.jsx array parsing');
