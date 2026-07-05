const fs = require('fs');
const path = require('path');

const DATA_DIR = __dirname;

function ensureFile(filename, defaultValue) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
  return filePath;
}

function readJson(filename, defaultValue) {
  const filePath = ensureFile(filename, defaultValue);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readJson, writeJson };
