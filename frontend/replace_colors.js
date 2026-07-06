const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace gray and slate colors, BUT ignore ones prefixed with 'dark:'
    content = content.replace(/(?<!dark:)text-gray-300/g, 'text-gray-700');
    content = content.replace(/(?<!dark:)text-gray-400/g, 'text-gray-800');
    content = content.replace(/(?<!dark:)text-gray-500/g, 'text-gray-900');
    
    content = content.replace(/(?<!dark:)text-slate-300/g, 'text-slate-700');
    content = content.replace(/(?<!dark:)text-slate-400/g, 'text-slate-800');
    content = content.replace(/(?<!dark:)text-slate-500/g, 'text-slate-900');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated colors in ${filePath}`);
      modifiedCount++;
    }
  }
});

console.log(`Done! Modified ${modifiedCount} files.`);
