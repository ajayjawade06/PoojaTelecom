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

  // 1. Accents
  content = content.replace(/emerald/g, 'blue');
  content = content.replace(/bg-teal-500\/10/g, 'bg-blue-500/5'); // stray glows

  // 2. Reduce bouncy transitions
  content = content.replace(/hover:-translate-y-1/g, ' '); 
  content = content.replace(/hover:-translate-y-0\.5/g, ' '); 
  content = content.replace(/hover:-translate-y-2/g, ' '); 
  
  // 3. Optimize duration for snappier Apple feel
  content = content.replace(/duration-500/g, 'duration-200');
  content = content.replace(/duration-300/g, 'duration-200');

  // 4. Reduce extreme scaling to micro-interactions
  content = content.replace(/hover:scale-110/g, 'hover:scale-[1.02]');
  content = content.replace(/hover:scale-105/g, 'hover:scale-[1.02]');
  content = content.replace(/group-hover:scale-110/g, 'group-hover:scale-[1.02]');
  content = content.replace(/group-hover:scale-105/g, 'group-hover:scale-[1.02]');
  content = content.replace(/active:scale-90/g, 'active:scale-95');

  // Clean empty class spaces
  content = content.replace(/  +/g, ' ');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored: ${filePath}`);
  }
}

walkDir(path.join(__dirname, 'client/src'), refactorFile);
console.log("Done.");
