const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorFile(filePath) {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Kill bouncy scales and translates
  content = content.replace(/hover:scale-\[.*?\]/g, '');
  content = content.replace(/active:scale-\d+/g, '');
  content = content.replace(/group-hover:scale-\[.*?\]/g, '');
  content = content.replace(/hover:scale-\d+/g, '');
  content = content.replace(/group-hover:scale-\d+/g, '');
  content = content.replace(/hover:-translate-[xy]-\d+/g, '');

  // Kill loud hover shadows
  content = content.replace(/hover:shadow-lg/g, '');
  content = content.replace(/hover:shadow-2xl/g, '');
  content = content.replace(/hover:shadow-[a-z]+-\d+\/\d+/g, ''); // hover:shadow-blue-500/20

  // Kill entry animations
  content = content.replace(/animate-fade-in/g, '');
  content = content.replace(/animate-slide-up/g, '');
  content = content.replace(/animate-scale-up/g, '');

  // Change generic transition-all to more specific subtle ones where appropriate
  // Actually, Apple relies heavily on `transition-colors` and `transition-opacity`.
  // Replacing transition-all blindly might break structural transitions (like modals expanding).
  // I will just leave transition-colors/opacity/all, but since the scales/translates are gone, 
  // 'transition-all' will mostly just apply to colors/opacities now anyway.

  // Clean empty class spaces
  content = content.replace(/  +/g, ' ');
  content = content.replace(/ "/g, '"');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Stripped physics: ${filePath}`);
  }
}

walkDir(path.join(__dirname, 'client/src'), refactorFile);
console.log("Done.");
