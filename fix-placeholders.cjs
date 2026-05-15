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

            content = content.replace(/e\.target\.src = ['"`]https:\/\/placehold\.co[^'"`]+['"`]/g, "e.target.src = 'https://placehold.co/400x300/f5f5f4/a8a29e?text=Kream'");

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}
processDir('front/src');
