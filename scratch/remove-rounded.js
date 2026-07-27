const fs = require('fs');
const files = [
  'app/(auth)/login/page.tsx',
  'app/(public)/privacy/page.tsx',
  'app/(public)/terms/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/rounded-xl/g, '');
  content = content.replace(/rounded-lg/g, '');
  content = content.replace(/rounded-md/g, '');
  // Normalize double spaces
  content = content.replace(/  +/g, ' ');
  fs.writeFileSync(f, content);
});
console.log('Removed rounded classes');
