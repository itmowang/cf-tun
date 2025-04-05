// store/configStore.js
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

function getConfig() {
  if (!fs.existsSync(configPath)) return {};
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function saveConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
  return true;
}

module.exports = {
  getConfig,
  saveConfig,
};
