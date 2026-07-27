const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirs = [
  'app/(admin)',
  'app/(landlord)',
  'app/(tenant)'
];

dirs.forEach(dir => {
  walkDir(path.join(__dirname, '..', dir), (filePath) => {
    if (filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // We only want to replace tailwind padding classes
      // Regex uses word boundaries so we don't accidentally replace parts of words
      content = content.replace(/\bp-12\b/g, 'p-6');
      content = content.replace(/\bp-8\b/g, 'p-5');
      content = content.replace(/\bpy-12\b/g, 'py-6');
      content = content.replace(/\bpy-8\b/g, 'py-5');
      content = content.replace(/\bpx-12\b/g, 'px-6');
      content = content.replace(/\bpx-8\b/g, 'px-5');
      // For p-6 -> p-4 to tighten smaller cards
      content = content.replace(/\bp-6\b/g, 'p-4');
      content = content.replace(/\bpy-6\b/g, 'py-4');
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
});
console.log('Padding reduced successfully in all three dashboards.');
