const fs = require('fs');
const path = require('path');
const os = require('os');

function copyFileToSandbox(filePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath); // 🔧 normalize the absolute path

    if (!fs.existsSync(fullPath)) {
      return reject(new Error(`File not found: ${fullPath}`));
    }

    const sandboxDir = path.join(os.tmpdir(), 'guardian-sandbox');
    if (!fs.existsSync(sandboxDir)) {
      fs.mkdirSync(sandboxDir, { recursive: true });
    }

    const fileName = path.basename(fullPath);
    const dest = path.join(sandboxDir, fileName);
    fs.copyFileSync(fullPath, dest);
    resolve(dest);
  });
}

module.exports = { copyFileToSandbox };
