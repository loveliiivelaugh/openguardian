const fs = require('fs').promises;

async function getFileContent(filePath) {
  return await fs.readFile(filePath, 'utf8');
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, 'utf8');
}

module.exports = { getFileContent, writeFile };
