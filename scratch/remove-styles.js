const fs = require('fs');
const path = require('path');

const dirs = [
  'app/(admin)',
  'app/(landlord)',
  'app/(tenant)'
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;
      
      if (content.includes('font-serif')) {
          content = content.replace(/font-serif/g, 'font-sans');
          modified = true;
      }
      
      if (content.includes('uppercase tracking-widest')) {
          content = content.replace(/uppercase tracking-widest/g, '');
          modified = true;
      }
      
      if (content.includes('uppercase tracking-wider')) {
          content = content.replace(/uppercase tracking-wider/g, '');
          modified = true;
      }
      
      if (modified) {
          // Fix double spaces that might occur
          content = content.replace(/  +/g, ' ');
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Modified:', fullPath);
      }
    }
  }
}

dirs.forEach(processDir);
