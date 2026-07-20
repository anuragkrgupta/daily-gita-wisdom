const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const clientAssets = path.join(root, 'dist', 'client', 'assets');
const outAssets = path.join(root, 'dist', 'assets');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);
    fs.copyFileSync(srcPath, destPath);
  }
  return true;
}

const copied = copyDir(clientAssets, outAssets);
if (copied) console.log('postbuild: copied client assets to dist/assets');
else console.warn('postbuild: no client assets found at', clientAssets);

const favSrc = path.join(root, 'dist', 'client', 'favicon.ico');
const favDest = path.join(root, 'dist', 'favicon.ico');
if (fs.existsSync(favSrc)) {
  fs.copyFileSync(favSrc, favDest);
  console.log('postbuild: copied favicon to dist/favicon.ico');
}

console.log('postbuild: done');
