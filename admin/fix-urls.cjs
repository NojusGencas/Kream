const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
};

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    const needsImport = content.includes('fetch(') || content.includes('http://localhost:3000');
    
    if (needsImport && !content.includes("buildApiUrl")) {
        const depth = file.split(path.sep).length - 2; // src/ is depth 0
        const prefix = depth === 0 ? './' : '../'.repeat(depth);
        const importPath = `${prefix}utils/api.js`;
        
        content = `import { buildApiUrl } from '${importPath}';\n` + content;
        changed = true;
    }

    if (content.includes("fetch('http://localhost:3000")) {
        content = content.replace(/fetch\('http:\/\/localhost:3000([^']+)'/g, "fetch(buildApiUrl('$1')");
        changed = true;
    }
    if (content.includes('fetch("http://localhost:3000')) {
        content = content.replace(/fetch\("http:\/\/localhost:3000([^"]+)"/g, "fetch(buildApiUrl('$1')");
        changed = true;
    }
    if (content.includes("fetch(`/api/")) {
        content = content.replace(/fetch\(`\/api\/([^`]+)`/g, "fetch(buildApiUrl(`/api/$1`)");
        changed = true;
    }
    if (content.includes("fetch('/api/")) {
        content = content.replace(/fetch\('\/api\/([^']+)'/g, "fetch(buildApiUrl('/api/$1')");
        changed = true;
    }
    if (content.includes('fetch("/api/')) {
        content = content.replace(/fetch\("\/api\/([^"]+)"/g, "fetch(buildApiUrl('/api/$1')");
        changed = true;
    }
    
    // Replace URL usages
    if (content.includes("http://localhost:3000")) {
        content = content.replace(/\`http:\/\/localhost:3000([^`]+)\`/g, "buildApiUrl(`$1`)");
        changed = true;
    }

    // specific fix for products-list.jsx
    if (content.includes("url, {")) {
        // fetch(url, { -> we don't need to replace if `url` was buildApiUrl earlier, but if url is computed locally?
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
