const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // wrap plain fetch('/api/...') in getApiUrl
            content = content.replace(/fetch\((['"`])\/api\/([^'"`]+)\1\)/g, "fetch(getApiUrl('/api/$2'))");
            
            // wrap fetch('/contact') or other root fetches if any
            content = content.replace(/fetch\((['"`])\/orders([^'"`]*)\1\)/g, "fetch(getApiUrl('/$2'))");

            if (content !== original) {
                // Ensure import { getApiUrl } is present
                if (!content.includes('getApiUrl')) {
                    const depth = fullPath.split(/[\/\\]/).length - fullPath.indexOf('src') - 2;
                    const importPath = depth === 0 ? './config.js' : '../'.repeat(depth) + 'config.js';
                    content = `import { getApiUrl } from '${importPath}';\n` + content;
                }
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}
processDir('src');
