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

    // Add import if we need to modify
    const needsImport = content.includes('fetch(') || content.includes('src={`http://localhost:3000') || content.includes('src={"http://localhost:3000');
    
    if (needsImport && !content.includes("getApiUrl")) {
        // Calculate relative path to src/config.js
        const depth = file.split(path.sep).length - 2; // src/ is depth 0
        const prefix = depth === 0 ? './' : '../'.repeat(depth);
        const importPath = `${prefix}config.js`;
        
        // Add import after other imports
        content = `import { getApiUrl } from '${importPath}';\n` + content;
        changed = true;
    }

    // Replace fetches
    if (content.includes("fetch('http://localhost:3000")) {
        content = content.replace(/fetch\('http:\/\/localhost:3000([^']+)'\)/g, "fetch(getApiUrl('$1'))");
        changed = true;
    }
    if (content.includes("fetch('/api/")) {
        content = content.replace(/fetch\('\/api\/([^']+)'\)/g, "fetch(getApiUrl('/api/$1'))");
        changed = true;
    }
    if (content.includes("fetch(`/api/")) {
        content = content.replace(/fetch\(`\/api\/([^`]+)`\)/g, "fetch(getApiUrl(`/api/$1`))");
        changed = true;
    }

    // Replace images
    if (content.includes("src={`http://localhost:3000/img")) {
        content = content.replace(/src=\{\`http:\/\/localhost:3000\/img([^`]+)\`\}/g, "src={getApiUrl(`/img$1`)}");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
