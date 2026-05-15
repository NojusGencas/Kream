const fs = require('fs');

const files = [
    'front/src/components/ProductCatalog.jsx',
    'front/src/components/Products.jsx',
    'front/src/pages/kategorijos.jsx'
];

for (const target of files) {
    if (fs.existsSync(target)) {
        let content = fs.readFileSync(target, 'utf8');
        
        content = content.replace(/src=\{getApiUrl\(`\/img\/products\/\$\{product\.slug\}\.jpg`\)\}/g, 
        "src={product.main_image ? getApiUrl(product.main_image) : getApiUrl(`/img/products/${product.slug}.jpg`)}");

        fs.writeFileSync(target, content);
        console.log(`Fixed product images in ${target}`);
    }
}
