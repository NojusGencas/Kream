const fs = require('fs');

const files = [
    'front/src/components/ProductCatalog.jsx',
    'front/src/components/Products.jsx',
    'front/src/pages/kategorijos.jsx'
];

for (const target of files) {
    if (fs.existsSync(target)) {
        let content = fs.readFileSync(target, 'utf8');
        
        // Match the old replacement and fix it
        const oldStr = "src={product.main_image ? getApiUrl(product.main_image) : getApiUrl(`/img/products/${product.slug}.jpg`)}";
        const newStr = "src={getApiUrl(product.main_image ? (product.main_image.startsWith('/') ? product.main_image : `/img/products/${product.main_image}`) : `/img/products/${product.slug}.jpg`)}";
        
        if (content.includes(oldStr)) {
            content = content.replace(oldStr, newStr);
            fs.writeFileSync(target, content);
            console.log(`Fixed product images in ${target}`);
        } else {
            console.log(`Could not find string in ${target}`);
        }
    }
}
