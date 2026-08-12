const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const clientAssets = path.join(root, "dist", "client", "assets");
const outAssets = path.join(root, "dist", "assets");
const publicDir = path.join(root, "public");
const outRoot = path.join(root, "dist");

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

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  const stat = fs.statSync(src);
  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return true;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    copyRecursive(s, d);
  }
  return true;
}

const copied = copyDir(clientAssets, outAssets);
if (copied) console.log("postbuild: copied client assets to dist/assets");
else console.warn("postbuild: no client assets found at", clientAssets);

const favSrc = path.join(root, "dist", "client", "favicon.ico");
const favDest = path.join(root, "dist", "favicon.ico");
if (fs.existsSync(favSrc)) {
  fs.copyFileSync(favSrc, favDest);
  console.log("postbuild: copied favicon to dist/favicon.ico");
}

// Copy public files (sw.js, manifest.webmanifest, etc.) into dist root
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, outRoot);
  console.log("postbuild: copied public/ to dist/");
} else {
  console.warn("postbuild: no public directory found at", publicDir);
}

console.log("postbuild: done");
