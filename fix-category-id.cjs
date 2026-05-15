const fs = require('fs');

const files = [
    'front/src/components/Products.jsx',
    'front/src/components/ProductCatalog.jsx',
    'front/src/pages/kategorijos.jsx',
    'front/src/pages/uzsakymas.jsx'
];

for (const target of files) {
    if (fs.existsSync(target)) {
        let content = fs.readFileSync(target, 'utf8');
        let newContent = content.replace(/\.categories_id/g, '.category_id');
        if (content !== newContent) {
            fs.writeFileSync(target, newContent);
            console.log(`Fixed category_id in ${target}`);
        }
    }
}
