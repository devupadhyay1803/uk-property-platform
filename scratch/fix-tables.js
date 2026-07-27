const fs = require('fs');
const files = [
  'app/(tenant)/portal/requests/page.tsx',
  'app/(landlord)/dashboard/maintenance/page.tsx',
  'app/(admin)/admin/maintenance/page.tsx'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const newContent = content.replace(/className="overflow-hidden border border-slate-200 bg-white"/g, 'className="overflow-x-auto border border-slate-200 bg-white"');
  fs.writeFileSync(f, newContent);
});
console.log('Fixed tables');
