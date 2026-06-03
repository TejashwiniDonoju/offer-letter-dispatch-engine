const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // 📁 This explicitly forces Render to build and keep Chrome directly inside your project folder!
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};